问题：每页第一次滚动会卡一下，之后顺畅。
原因：浏览器在首次滚动那一刻才一次性"激活"所有还没显示的卡片图层，同时多个动画一起启动，抢了一帧。

修复方案（视觉效果完全不变）：

1. **页面加载后预热一次**：在 `usePortalReveal` 里，页面 mount 后用 `requestIdleCallback` 提前让浏览器把所有 reveal 元素的图层准备好，这样第一次滚动就不用临时准备了。

2. **只在需要时加 `will-change`**：现在所有 reveal 元素一直挂着 `will-change: opacity, transform`，等于一直占着 GPU 资源。改成只在元素接近视口时才加，离开后移除。

3. **错开同时启动的动画**：第一次滚动如果有多个元素同时进入视口，给它们加一个非常小的 stagger（比如每个 +20ms），避免同一帧启动一堆 transition。

4. **减少 MutationObserver 的工作**：图表/表格 mount 后触发的 rescan 只扫新加入的节点，不重新扫整个 main。

涉及文件：
- `src/hooks/use-portal-reveal.ts`（主要改动）
- `src/styles.css`（移除常驻 `will-change`，改用 hook 动态加）

预期结果：第一次滚动也顺，淡入淡出效果不变。