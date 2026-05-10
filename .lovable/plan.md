目标：保留现有 fade 效果，但把第一次滚动时触发的重计算/重绘降下来。

计划：
1. 关闭滚动期间的 hover spotlight 更新
   - `SpotlightCard` 和 `SectionCard` 的鼠标跟随高亮在滚动时暂停，不再每帧改 radial-gradient / CSS 变量。
   - 滚动结束后再恢复 hover 效果。

2. 让图表不要在第一次滚到时才“重启动画”
   - `AssetGrowthChart`、`RewardsBreakdownChart` 保持图表预渲染。
   - 进入视口时只做轻量 opacity/transform fade，不再用 `requestAnimationFrame` 每帧 setState 更新图表数据。

3. 降低玻璃卡片阴影重绘成本
   - 滚动期间把 `.liquid-glass` 的重阴影/hover transform 暂时压低或禁用。
   - 避免当前 session replay 里看到的 box-shadow 连续更新。

4. 验证
   - 在 `/portal/holdings` 重新滚动采样，确认第一次滚动不再由 spotlight、box-shadow 或图表 RAF 抢主线程。
   - 确认 fade 仍然存在。