## 为什么现在没有效果

我把选择器收得太窄了。代码里其实没有任何元素带 `[data-reveal]` 或 `.portal-reveal-target`；而 `.liquid-glass` 都嵌在 `<PageHeader>` / `<PortfolioDonutCard>` 等组件**内部**，不是 `.portal-page` 的直接子元素。

所以 `.portal-page > .liquid-glass` 一个都没匹配上 → 整个 portal 没有任何元素被加 reveal → 看起来"完全没效果"。

## 修复方案（保持上一轮的安全前提：无模糊、无 3D）

### `src/styles.css`
把 CSS 选择器改成 **`.portal-page` 的直接子元素**（页面顶层内容块）：
```
.portal-page > * 
```
- **只匹配直接子**（`>`），不会递归进卡片内部 → 不会出现"下半页一片蒙"或滚动卡死
- 涵盖 portal 每个 page 的顶层 section / div，每个页面都会有效果
- 保持上一轮的干净参数：translateY 40px → 0、opacity 0 → 1、无 blur、无 rotateX
- `animation-range: entry 0% cover 25%`

### `src/hooks/use-portal-reveal.ts`（JS 回退路径，给 Safari 等不支持 `animation-timeline` 的浏览器）
把 `revealSelector` 改成：
```
.portal-page > *
```
同样只取直接子。双向 IntersectionObserver 逻辑保留。

### 例外保护
排除一些不该动的直接子：sticky 头部、绝对定位元素、`<style>` / `<script>`。用 `:not([data-no-reveal])` + 在 hook 里跳过 `position: sticky/fixed` 的元素。

## 验证
- `/portal`、`/portal/holdings`、`/portal/staking-plans` 每页顶层卡片/区块在进入视口时淡入+轻微上移
- 离开视口（往上滚出去）→ 复位；再进入再播
- 不再有模糊、不影响滚动

## 涉及文件
- `src/styles.css`
- `src/hooks/use-portal-reveal.ts`