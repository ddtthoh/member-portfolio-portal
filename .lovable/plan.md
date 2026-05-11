我找到原因了：现在 glow 还是用卡片自己的 IntersectionObserver 触发，而数字用 CountUp 内部自己的 IntersectionObserver 触发；两个 observer 不是同一个元素，触发时机仍然可能不一致。所以看起来 glow 已经跑完，数字才开始跳。

计划：

1. 让 CountUp 支持一个 `onStart` 回调
   - CountUp 真正从 `$0.00` 开始 requestAnimationFrame 的同一刻，通知外层。
   - 这样 glow 不再猜测数字什么时候开始，而是由数字动画真实开始时触发。

2. 让 MetricValue 透传 `duration` 和 `onStart`
   - 只影响这张 staking position card 的数字。
   - 不改变其他页面的 CountUp 默认行为。

3. 修改 staking position card 的 glow 逻辑
   - 移除卡片自己的 IntersectionObserver。
   - 当 staking 数字第一次开始跳转时，立即开始第 1 次 glow。
   - 第 1 次 glow 的时长 = 数字从 0 到实际数字的时长。
   - 第 2 次 glow 紧接着开始，无间隔，速度一样。
   - 两次结束后移除 glow，不循环。

4. 延长单次 glow
   - 把单次时长设成你要的更慢节奏，例如 2500ms。
   - 数字 count-up 也使用同样 2500ms，确保第 1 次 glow 结束时数字刚好到实际金额。

5. 保持初始状态无 glow
   - 页面刚加载时不显示扫光。
   - 只有数字真正开始跳转时才出现左上到右下的 glow。