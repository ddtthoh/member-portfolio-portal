## 排查结论

你上传的导出文件确认仍然是坏的：

- PNG 只有 `417 × 1920`，这是被浏览器/预览缩放后的下载结果，不是稳定的 1080px 海报级导出。
- PDF 页面是 `2880 × 13256`，说明 PDF 是从一个错误/不稳定的 canvas 再塞进 PDF 的。
- 大块金色矩形不是普通图片问题，而是 `MobilePoster` 里大量 `background-clip: text + color: transparent` 的 inline style 被 html2canvas 渲染失败造成的。
- 上一次只给 CSS class 加了导出 override，但核心金色文字实际来自 `style={gold(...)}` inline style，所以 CSS override 根本覆盖不到这些 inline gradient text。
- 字体风险也存在：海报依赖远程 Google fonts，导出时 html2canvas 等字体就绪并不等于字体已经稳定用于克隆节点。

## 彻底解决方案

### 1. 不再捕获缩放预览节点

把导出改成“专用离屏导出节点”：

- 点击 Download PNG/PDF 时，临时在 `document.body` 里挂载一个固定 `1080px` 宽、未缩放、不可见但可渲染的导出容器。
- 在这个容器里重新渲染 `<MobilePoster />`。
- html2canvas 只捕获这个离屏节点，不再捕获右侧预览里被 `transform: scale(...)` 包住的节点。

这样可以彻底绕开预览缩放、容器裁切、当前 viewport 尺寸对导出的影响。

### 2. 给 MobilePoster 做真正的 export mode

给 `MobilePoster` 增加一个 `exportMode` prop，导出专用节点传 `exportMode`：

- `gold(...)` 在 exportMode 下不再返回 `backgroundImage/backgroundClip/color: transparent`。
- 改为 html2canvas 稳定支持的纯色金色 `color`。
- 只影响 PNG/PDF 导出，不改变页面预览的正常视觉。

这是这次金色大块的关键修复点。

### 3. 固定导出字体，避免远程字体等待失败

在 exportMode 下使用系统内置稳定字体组合，避免远程字体加载/克隆时失效：

- serif 标题用 `Georgia, Times New Roman, serif`
- body 用 `Arial / Helvetica / system-ui`

导出版本会保持高级 serif/sans 风格，但不依赖网络字体，防止再次出现字体变粗、错位、替换字体导致的 layout 改变。

### 4. 等待导出节点完全稳定后再截图

导出流程会：

- 等待 React 离屏节点 mount 完成
- 等待 `document.fonts.ready`
- 等待 QR 和 logo 图片 `decode()` 完成
- 再等 2 个 `requestAnimationFrame`，确保 layout/paint 完成
- 然后调用 html2canvas

### 5. PNG/PDF 输出尺寸统一

- PNG 输出：固定 `2160px` 宽，也就是 `1080 × scale 2`。
- PDF 输出：直接使用同一个 canvas 尺寸，不再使用任何预览尺寸。

### 6. 验证方式

实现后我会用自动检查确认：

- 导出 canvas 宽度为 `2160px`
- 页面内容横向占比正常，不再只是一小块/被缩放
- 上传图中那几段大金色矩形不会再出现
- PDF 页面由同一张正确 canvas 生成

## 改动文件

- `src/components/marketing/mobile-poster.tsx`
- `src/routes/portal.landing-page.tsx`

不动数据库，不动登录逻辑，不改其它页面。