我确认卡顿不只是 reveal fade：性能采样里滚动时排在前面的还有 ThreeBackground 每帧渲染、Framer Motion 的样式渲染、滚动恢复监听，以及页面里多个图表/数字动画在首次进入视口时一起启动。接下来建议做一版“性能优先”的修复：

1. **滚动时暂停重负载背景**
   - 在 `ThreeBackground` 里监听 scroll，用户滚动期间临时降低或暂停 WebGL 帧循环，停止 3D 背景和页面滚动抢主线程/GPU。
   - 滚动停止后再恢复动画，视觉上仍保留背景，但滚动会明显更顺。

2. **简化 reveal 逻辑**
   - 去掉现在较复杂的 prewarm observer / 批量 stagger / 多次 setTimeout will-change。
   - 改成更轻的方案：元素首次初始化后只使用 CSS transition；IntersectionObserver 只负责切 class，不在滚动过程中反复写 inline style。

3. **图表进入视口前预挂载，动画延后**
   - Holdings 页的 Recharts 现在是 `inView` 后才 mount，首次滚到图表位置会同时创建 SVG、计算布局、启动动画。
   - 改成图表先低成本挂载，真正进入视口后只播放轻量动画，避免“第一次滚到那里卡一下”。

4. **减少滚动期间昂贵视觉效果**
   - 给滚动状态加全局 class，例如 `is-scrolling`。
   - 滚动中临时关闭 `box-shadow/filter/drop-shadow` 的过渡和部分 glow 动画；停止滚动后恢复。

5. **验证**
   - 用浏览器性能工具重新采样 `/portal/holdings` 的滚动，确认 top functions 不再集中在 ThreeBackground / Framer render / 图表首次 mount 上，并检查 fade 仍然存在。