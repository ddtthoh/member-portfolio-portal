## 目标
修复 `/portal/landing-page` 下载的 PNG / PDF：内容只占左侧 ~33%、gold 渐变文字渲染成实心金块、字体/QR 偶发错位。一次性把已知 3 个根因全部解决。

## 改动范围（仅前端，不动业务逻辑）
只修改 `src/routes/portal.landing-page.tsx` 的 `captureCanvas` 函数，必要时给 `MobilePoster` 加一个"导出模式"的 className 钩子。**不改 `MobilePoster` 的视觉设计**。

## 三个根因 → 对应修复

### 1. 内容只占 ~33% 宽
**因**：`FitPoster` 用 `transform: scale(0.33)` 缩小预览，`previewRef` 指向被 transform 包住的 1080px 元素。html2canvas 读取的 bounding rect 是缩放后的尺寸。
**修**：在 `captureCanvas` 里临时把 `previewRef.current.style.transform = "none"`，捕获后再还原。配合已有的 `width: 1080 / windowWidth: 1080`，输出就是真正的 1080×完整高度。

### 2. Gold 渐变文字变成实心金块
**因**：`MobilePoster` 用 `background-clip: text + color: transparent` 实现金色渐变，html2canvas-pro 对此支持仍不稳定。
**修**：捕获前给 `.poster-root` 加 `data-exporting="true"`，在 `marketing-theme.css` 加一段：
```
[data-exporting="true"] .text-gold-shine,
[data-exporting="true"] .gold-gradient-text {
  background: none !important;
  -webkit-background-clip: initial !important;
  -webkit-text-fill-color: currentColor !important;
  color: var(--gold) !important;
}
```
导出后移除属性，预览不受影响。

### 3. 字体/QR 偶发错位
**修**：捕获前 `await document.fonts.ready`，并对 `target` 内所有 `<img>` 的 `decode()` 全部 await（已部分实现，补全）。

## 验证方式（不再让你来回试）
我会在改完后自己运行一次：
- 在 sandbox 里 import `html2canvas-pro` 不可行，所以改为：在 dev preview 里点击 Download PNG，把生成的 blob 通过 console 打到 base64，下载到 `/mnt/documents/qa.png`，用 PIL 检查（a）画布宽度 = 2160（scale:2 × 1080），（b）非空像素水平占比 > 90%，（c）随机采样 gold 文字区域不是纯色矩形。

如果任意一项不达标，我当轮继续修，不交还给你。

## 风险声明
仍可能出错的少数情况：自定义 webfont CDN 拉取失败 / 浏览器版本差异。如果发生，会在同一轮里降级为 `<canvas>` + 手绘文字方案，但基于你当前的代码结构，预期不会触发。
