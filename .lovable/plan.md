## 问题
我上次给 Total Assets 卡加标题时，i18n key (`charts.totalAssets.title` 等) 还没在语言文件里，所以用了**中文 fallback** 字符串。结果英文模式下也显示中文。

## 修复
1. **`rewards-breakdown-chart.tsx`** + **`portal.asset-analysis.tsx`** — 把所有新加的 `t(key, "中文 fallback")` 改成英文 fallback：
   - `charts.totalAssets.eyebrow` → `"Assets"`
   - `charts.totalAssets.title` → `"Total Assets"`
   - `charts.rewardsBreakdown.title` → `"Rewards Breakdown"`
   - `charts.rewardsBreakdown.total` → `"Total Rewards"`

2. **`src/i18n/locales/en.json`** — 加入对应英文 key
3. **`src/i18n/locales/zh.json`** — 加入对应中文 key（中文模式下显示「总资产构成」「奖励来源对比」「累计奖励」）

这样英文 / 中文都正确，其他 12 个语言文件会有 fallback 兜底（显示英文）。

要我直接执行吗？
