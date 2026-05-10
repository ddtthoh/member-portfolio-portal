结论先说：你没有看错，现在确实很难/几乎看不到变化；代码已经写进 preview 代码里了，但还没有发布成正式 live。正式线上要点右上角 Publish / Update 才会 live。

我刚检查到两个关键点：

1. `src/hooks/use-portal-reveal.ts`、`portal-shell.tsx`、`styles.css` 里确实已经有 scroll reveal 代码。
2. 但当前 preview 检测时，portal 内容没有进入可动画状态，页面还显示 loading，并且开发服务器日志里有 `Invalid hook call`，所以效果没有稳定跑起来。

为什么你看不到：
- 目前效果做得太细，只有 24px 位移 + 透明度，第一屏内容又几乎马上 reveal，所以肉眼会像“没变”。
- 更重要的是，当前 preview 有 hook 报错/加载状态问题，需要先修正触发方式，否则 scroll observer 就算写了也可能没有稳定绑定到实际内容。

修复计划：

1. 把 `usePortalReveal` 的触发方式改得更稳
   - 不只依赖第一次 mount。
   - 页面 route 切换、内容延迟出现、AnimatePresence 动画结束后，都重新扫描一次。
   - 确保 `.liquid-glass` 卡片真的拿到 `reveal-on-scroll` 和 `is-revealed`。

2. 把效果调明显一点，但保持高级
   - 初始：opacity 0、translateY 36px、轻微 blur 6px。
   - 出现：opacity 1、translateY 0、blur 0。
   - 时间：0.85s，像读书翻到下一段内容那样慢慢浮出来。
   - 卡片之间 stagger 100ms，让你滚下去时能明显看到一层一层出现。

3. 避免第一屏“瞬间结束”导致看不见
   - 第一屏也延迟一点点出现。
   - 屏幕下面的新内容只在滚到接近它时才 reveal。

4. 修复/排查当前 hook 报错
   - 检查 `PortalShell` 和相关 hooks 的调用顺序。
   - 确保没有任何 hook 在非组件函数或条件分支里执行。

5. 验证
   - 在 `/portal` 和 `/portal/staking-plans` 手动检查：往下滑时卡片应该明显渐变浮现。
   - 检查元素数量：页面里应出现 `reveal-on-scroll`，进入视窗后出现 `is-revealed`。

说明：这次会是“真正看得出来”的版本，不是只加很轻微的动画。