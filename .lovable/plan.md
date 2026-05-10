## 总览：要改 3 个页面 + 1 个新组件

| # | 文件 / 位置 | 改动类型 | 验收点 |
|---|---|---|---|
| 1 | `src/routes/portal.asset-analysis.tsx` | 新增 2 张图卡 | 页面多出"资产增长曲线"+"奖励来源对比" |
| 2 | `src/routes/portal.reports.staking.tsx`（+其他5个 reports 子页面顶部）| 新增共享"奖励总览"模块 | 6 个 subtab 顶部都看到月度柱图+日历热力图 |
| 3 | `src/components/portfolio-donut-card.tsx` | Staking 行加"已赚收益" | Holdings 页 Staking 那行多一句 `已赚 +$xxx` |
| 4 | 新建 hooks + chart 组件 | 数据层 | 见技术细节 |

**Dashboard 完全不动。** ✅

---

## 1. Asset Analysis 页面 `/portal/asset-analysis`

**现状**：只有"总资产仪表盘 (TotalAssetsGauge)" + "P/L 日历 (PLCalendar)"两张卡。

**改动**：在 P/L 日历**下方**新增 2 张独立卡片，顺序如下：

```text
┌─ 总资产仪表盘 (不动) ────────────┐
└──────────────────────────────────┘
┌─ P/L 日历 (不动) ────────────────┐
└──────────────────────────────────┘
┌─ 【新】资产增长曲线 ─────────────┐  ← 新卡 A
│ 标题：资产增长趋势               │
│ 右上：[7D] [30D] [90D] toggle    │
│ 图：金色渐变面积折线图           │
│ 底部：当前总资产 + 涨跌百分比    │
└──────────────────────────────────┘
┌─ 【新】奖励来源对比 ─────────────┐  ← 新卡 B
│ 标题：奖励来源对比               │
│ 图：5 条横向柱状图               │
│   Referral / Team / Leader /     │
│   Global / Par Rank              │
│ 底部：累计奖励金额               │
└──────────────────────────────────┘
```

**验收**：
- ✅ Asset Analysis 页面从 2 张卡变成 4 张卡
- ✅ 资产卡和奖励卡**完全分开**（你强调过）
- ✅ 7D/30D/90D 切换能改曲线
- ✅ 没数据时显示 empty state，不是假数据
- ✅ 颜色只用现有 token（金色 / asset-* token），不引入新色

---

## 2. Reports 页面顶部 `/portal/reports/*`

**现状**：6 个子标签都是纯表格。

**改动**：在 6 个 reports 子页面**最顶部 PageHeader 下方**插入一个共享组件 `<RewardsOverviewPanel />`，包含 2 张图：

```text
┌─ PageHeader (各 subtab 自己的标题) ──┐
└──────────────────────────────────────┘
┌─ 【新】奖励总览面板 (6个 subtab 共享) ┐
│ ┌─ 月度奖励堆叠柱图 (近6个月) ─────┐ │
│ │ ▆▆ ▆▆ ▆▆ ▆▆ ▆▆ ▆▆               │ │
│ │ Dec Jan Feb Mar Apr May          │ │
│ │ 5色堆叠：5 类奖励来源            │ │
│ └──────────────────────────────────┘ │
│ ┌─ 日历热力图 (近90天每日奖励) ────┐ │
│ │ □□■□■■□□■…                      │ │
│ │ 颜色越深=当天奖励越多            │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
┌─ ReportShell (现有表格，不动) ───────┐
└──────────────────────────────────────┘
```

**为什么这样放**：你问"每日/月度奖励放哪"——这是最自然的位置，6 个 subtab 共享一个总览，不破坏现有导航。

**验收**：
- ✅ 进入任意一个 reports 子页面（Staking/Referral/Team/Leader/Global/ParRank）都看到这个面板
- ✅ 现有的 6 个 subtab 表格内容**完全不动**
- ✅ 月度柱图能看出每月哪类奖励占比最多
- ✅ 热力图能看出近 90 天哪天赚得多
- ✅ 没数据显示 empty state

---

## 3. Holdings 页 Staking 行加"已赚收益"

**文件**：`src/components/portfolio-donut-card.tsx`

**现状**（Breakdown 列表里 Staking 那行）：
```text
● Staking   $30,000   60%
            54 days · since Mar 16
```

**改成**：
```text
● Staking   $30,000   60%
            54 days · since Mar 16
            已赚 +$648.20  (ROI 2.16%)   ← 新增这行，金色
```

**验收**：
- ✅ 只 Staking 那行多一行，USD/Rewards 行不变
- ✅ 数字金色 `text-gold`，正数带 `+`
- ✅ 没数据时显示 `已赚 +$0.00 (0.00%)`，不报错
- ✅ Holdings 页其他卡片不动

---

## 4. 技术细节（开发参考，非验收点）

**新增文件**：
- `src/components/charts/asset-growth-chart.tsx` — 折线图（recharts AreaChart）
- `src/components/charts/rewards-breakdown-chart.tsx` — 横向柱图
- `src/components/charts/monthly-rewards-chart.tsx` — 堆叠柱图
- `src/components/charts/rewards-heatmap.tsx` — 90天日历热力图
- `src/components/rewards-overview-panel.tsx` — 包住上面 2 个 reports 图
- `src/hooks/use-asset-growth.ts` — 从 `transactions` 表按天聚合
- `src/hooks/use-rewards-breakdown.ts` — 按 reward type 求和
- `src/hooks/use-monthly-rewards.ts` — 近 6 个月堆叠数据
- `src/hooks/use-daily-rewards.ts` — 近 90 天每日金额

**修改文件**：
- `src/routes/portal.asset-analysis.tsx` — 加 2 张卡
- `src/routes/portal.reports.staking.tsx` — 顶部加 panel
- `src/routes/portal.reports.referral-rewards.tsx` — 同上
- `src/routes/portal.reports.team-rewards.tsx` — 同上
- `src/routes/portal.reports.leader-rewards.tsx` — 同上
- `src/routes/portal.reports.global-rewards.tsx` — 同上
- `src/routes/portal.reports.par-rank-rewards.tsx` — 同上
- `src/components/portfolio-donut-card.tsx` — Staking 行加一行
- `src/i18n/locales/en.json` + `zh.json` — 新增 keys

**不动**：
- Dashboard (`portal.index.tsx`)
- Donut 卡其他部分
- 6 个 reports 子页面表格
- 总资产仪表盘、P/L 日历
- 现有路由结构

**所有图统一**：recharts + `liquid-glass` 卡 + framer-motion fade-in + 现有色 token + empty state。

---

## 在我开工前请确认

1. **Reports 顶部 panel 的位置**：放在 6 个 subtab 的**外层共享**（每个 subtab 顶部都显示），对吗？
2. **Asset Analysis 两张新图顺序**：增长曲线在上、奖励来源在下，OK 吗？
3. **额外建议**（资产构成趋势 / ROI 对比 / Network 增长 / 存提款柱图）这次**不做**对吗？要的话告诉我加哪几个。
