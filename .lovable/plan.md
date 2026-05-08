## 为什么看起来偏右

Team Rewards 的表头其实 6 栏宽度是相等的（每栏 1/6），"division roi" 用 `text-center` 已经在第 4 栏的几何正中间。但旁边的表头 **Level / Percentage 都是左对齐**：
- "Level" 文字贴在第 3 栏的最左边 → 离 "division roi" 看起来很远
- "Percentage" 文字贴在第 5 栏的最左边 → 紧挨着 "division roi"

所以视觉上 "division roi" 就显得"靠右、贴着 Percentage"。这跟 phone / tablet / desktop 哪个视口无关，是同一个根因，所有视口都会一样。

## 解决方案（推荐）

把 "division roi" 改回 **左对齐**，跟其他表头保持一致，这样 6 栏的表头都从各自栏位最左边开始 —— 在所有视口下，"division roi" 都会自然落在 Level 与 Percentage 文字的中间位置（因为列宽相等）。

```diff
- <Th align="center">division roi</Th>
+ <Th>division roi</Th>
```

只改 `src/routes/portal.reports.team-rewards.tsx` 第 25 行那一格。其他 report、其他 page、其他 subpage 不动。

## 不影响的地方

- Staking / Referral Rewards / Leader Rewards / Par Rank Rewards 的 report 都不动
- 没有 i18n、没有共享组件改动
- 列宽 / 表格 minWidth 都不动 → 三个视口表现一致