我查到目前不是你操作问题：代码里确实加了滚动 reveal，但现在实现太依赖 `.liquid-glass`，而且会把已经在首屏的元素立刻 reveal 掉；所以你肉眼几乎看不到“往下滑像读书一样渐变出来”。另外预览日志里还有一次 `Invalid hook call`，需要一起排掉，不能再继续靠猜。

计划：

1. 让动画作用范围变明确
   - 不只扫 `.liquid-glass`，改成 portal 主内容里的主要 section/card/list/table/chart 都能被识别。
   - 对 holdings 页面和其他 portal 子页面统一生效，不需要每个页面手动加 class。

2. 做成明显的“读书式 scroll reveal”
   - 元素进入视窗前：透明、下移、轻微模糊。
   - 滑到时：渐亮、上浮归位、模糊清掉。
   - 同一屏多个卡片按顺序 stagger，而不是同时出现。
   - 首屏保留轻微入场延迟，避免一加载就瞬间结束。

3. 修正现在可能看不见的关键原因
   - `PortalShell` 现在外层还有 route transition，可能盖过子元素 scroll reveal 的视觉差异；我会让 page transition 和 scroll reveal 不互相抵消。
   - 检查并消除 `Invalid hook call` 的真实来源，确保 hook 没有在错误位置/重复 React 环境下触发。

4. 加一个临时诊断确认，完成后移除
   - 确认页面上实际有多少个元素被标记为 reveal。
   - 确认滚动时 class 从 hidden 状态变成 revealed 状态。
   - 确认不是浏览器开启了 reduced motion 导致动画被关闭。

5. 验证
   - 用当前 `/portal/holdings` 视口测试。
   - 再测试 `/portal` 和 `/portal/staking-plans`。
   - 只在确认滚动时肉眼可见后再回复你。

说明：这类前端改动在 Lovable 预览里会马上看到；如果要正式 live 给外部用户，还需要点 Publish/Update。现在你看到没变化，核心是实现没有真正产生可见效果，不是你不会看。