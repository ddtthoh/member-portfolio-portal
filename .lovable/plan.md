排查结果：scrolling effect 不是“加不到”，也不是太 heavy，主要是当前实现的目标选择器不对，导致效果几乎看不见。

原因：
1. `/portal/holdings` 页面最外层是：`<div className="space-y-6">...整页内容...</div>`。
2. 当前 hook 的选择器包含 `.portal-page > div`，所以它只把这个“整页大容器”加上 `reveal-on-scroll`。
3. 这个大容器高度超过一屏，IntersectionObserver 会认为它一直在视口里，因此 `is-revealed` 基本不会在每个卡片滚动进/出时切换。
4. 页面里的真正视觉区块，比如 Total Assets、Rewards Breakdown、Asset Growth、table card，并没有各自成为 reveal target，所以滚动到它们时没有单独渐入/渐出。
5. holdings 第一张卡片还有自己的 `motion.div initial/animate`，它只在页面加载时播放一次，和滚动重复动画不是同一个机制。

计划修复：
1. 修改 `usePortalReveal` 的扫描逻辑：不要把 `.portal-page > div` 这种整页 wrapper 当作唯一动画目标。
2. 让 hook 自动选择页面 wrapper 的直接子元素作为 reveal targets，例如 `.portal-page > div > *`，这样每个卡片/图表/表格块都会独立触发。
3. 保留无 blur 的 CSS，避免任何页面再出现“蒙”的感觉。
4. 让进入视口时加 `is-revealed`、离开视口时移除 `is-revealed`，从而上下滚动都能重复看到淡入/淡出。
5. 处理 framer-motion 冲突：避免 holdings 首屏 `motion.div` 的一次性动画吞掉/覆盖滚动 reveal，必要时给其外层或子区块明确 data-reveal。
6. 验证 `/portal/holdings`：确认 reveal target 数量不再是 1 个整页容器，而是多个独立区块；滚动下去、再滚动上来时 class 会重复切换。

涉及文件：
- `src/hooks/use-portal-reveal.ts`
- 如有必要，小幅调整 `src/routes/portal.holdings.tsx` 的 reveal 标记
- `src/styles.css` 只在需要增强明显度时微调，不恢复 blur