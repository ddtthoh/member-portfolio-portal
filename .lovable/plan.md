## 目标

以"背景只停留在顶部一屏、scroll 时跟着走"为前提，叠加之前提议的高级感升级套件。

## 改动总览

### 1. 背景改为顶部锚定（核心需求）
`src/components/portal-shell.tsx` 第 87–96 行：
- `portal-backdrop` 和 `ThreeBackground` 从 `fixed inset-0` → `absolute inset-x-0 top-0 h-screen`
- 这样 scroll 时背景跟内容一起向上离开视口，底部变纯净

### 2. 顶/底极细金色 hairline（杂志感框线）
在背景层后再加两条 `absolute` 定位的 1px 渐变金线：
- 顶部：跨整宽，金色由两侧透明 → 中央 30% 不透明
- 底部一屏处（即背景结束处）：同样一条，作为视觉过渡，避免背景突然消失

### 3. 全局细颗粒 grain overlay（电影感、消除色带）
在 `src/styles.css` 加一个 `.grain-overlay` 类，复用 `SpotlightCard` 已有的 SVG turbulence noise，作为 PortalShell 的 fixed 全局层（`fixed inset-0 -z-5 mix-blend-overlay opacity-[0.04]`）

### 4. 移动端禁用 3D 背景（性能 + 视觉）
PortalShell 用 `hidden lg:block` 让 ThreeBackground 仅在 ≥ lg 显示，移动端只保留渐变 backdrop + grain

### 5. 修 action tile 文字被背景挡住的 bug
`src/routes/portal.index.tsx` action tile 的 `<span>` label：
- 加 `rounded-md bg-background/50 px-2 py-0.5 backdrop-blur-sm`
- 文字下方有半透明毛玻璃保护层，金色亮点不再吃掉文字

### 6. 顶部背景下淡出（避免硬切边）
背景层加一个 `[mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]`，使背景在底部 30% 平滑淡出到透明，scroll 时不会有明显边界

## 改动文件

- `src/components/portal-shell.tsx`：背景定位 + hairline + grain 容器 + 移动端响应
- `src/styles.css`：`.grain-overlay`、`.portal-backdrop` 增加 mask
- `src/routes/portal.index.tsx`：action tile label 加保护层

不动任何排版、内容、文案。
