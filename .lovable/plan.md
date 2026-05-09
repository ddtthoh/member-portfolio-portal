# 方案 A · Vault Ledger（金库账本）

把 holdings 页顶部"Staking Amount"和"Staking Days"两张卡合成一张，并清理重复元素。

## 视觉结构

```text
┌───────────────────────────────────────────────────────────┐
│  TOTAL STAKING                                       👁    │
│                                                            │
│  $50,000.00          ───────●───────          54 days     │
│                                                            │
│  since Mar 16, 2026     ·     accruing · Premium tier     │
└───────────────────────────────────────────────────────────┘
```

- 单张 `SpotlightCard`，liquid-glass 圆角 2xl，p-6
- 顶部一行：左 eyebrow `TOTAL STAKING`（10px / uppercase / tracking 0.2em / gold），右 eye toggle 图标
- 主行：grid 三列 `1fr auto 1fr`
  - 左：`MetricValue size="xl"` 金额（隐藏时 `******`）
  - 中：连接器 = 细金线 `via-gold/40` + 中点小金圆点（h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px] shadow-gold/40）
  - 右：`MetricValue size="lg" unit="days"` 天数，右对齐
- 底部副行：`text-[11px] text-muted-foreground`，左 `since {startDate}`，右 `accruing · {tier} tier`（tier 用 gold/70 强调）

移动端（<640px）：金线连接器隐藏，三列变两行（金额一行、天数+副信息一行），保证不挤。

## 改动清单

1. **新建** `src/components/staking-summary-card.tsx`
   - props: `amount`, `days`, `startDate`, `tier`
   - 内部管理 `showAmount` 状态 + eye toggle
2. **编辑** `src/routes/portal.holdings.tsx`
   - 删除现有两张并排的 Amount / Days 卡（约 60-95 行）
   - 替换为 `<StakingSummaryCard amount={50000} days={54} startDate="2026-03-16" tier="Premium" />`
   - 删除下方重复的 `<TotalAssetsGauge />` block（asset-analysis 已有同款，holdings 不再重复）
   - 移除不再使用的 imports：`Eye`, `EyeOff`, `useWallet`, `TotalAssetsGauge`, `motion`, `MetricValue` 等按需清理
3. **i18n** `src/i18n/locales/en.json` + `zh.json`
   - 新增 `pages.holdings.totalStaking` = "TOTAL STAKING" / "总质押"
   - 新增 `pages.holdings.since` = "since {{date}}" / "起始于 {{date}}"
   - 新增 `pages.holdings.accruing` = "accruing · {{tier}} tier" / "累计中 · {{tier}} 等级"
   - 旧 key `totalStakingAmount` / `stakingDays` 暂保留（表头还在用）

## 设计意图

- 一张卡讲完"本金 + 时间"一个故事，去掉两个孤立小卡的零碎感
- 中间金线 + 金点 = 唯一焦点装饰，不抢主数字；与 social-links 的 CONNECT 金线呼应但更细更短
- 与 asset-analysis 的半圆 gauge 完全不同的语言（这里是横向账本线，不是径向仪表）
- 移除重复 gauge 后，holdings 专注"我的持仓清单"，asset-analysis 专注"资产构成分析"，页面分工更清晰

## 不做

- 不引入 SVG 弧线（那是方案 B）
- 不计算累计收益（那是方案 C）
- 不改 staking 表格、refund 按钮、其它页面
