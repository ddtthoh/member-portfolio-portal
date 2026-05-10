## 目标
让 Asset Analysis 页面里"半圆 Total Assets 卡"和"Rewards Breakdown 卡"看起来是同一套设计语言，不再有违和感。

## 现在违和的地方
| 元素 | Total Assets 卡 | Rewards Breakdown 卡 |
|---|---|---|
| 标题区 | ❌ 没有 eyebrow + 标题 | ✅ "REWARDS / 奖励来源对比" |
| 主图 | 半圆 gauge，居中 | 横向 bar chart，左对齐 |
| 图例 | 横分隔线（divide-y），每行：色点 + 名字 + 金额 + 百分比 | 底部一排小色点 chips |
| 总计 | 写在 gauge 中央 | 写在卡底部 "累计奖励 $xxx" |

## 统一方案（推荐）
两张卡都套同一个"框架模板"：

```text
┌─────────────────────────────────────┐
│  EYEBROW (10px 金色 uppercase)      │
│  Title (serif 金色 lg)              │  ← 统一标题区
│                                     │
│        [主图区域]                    │  ← gauge 或 bar chart
│                                     │
│  ─────────────────────────────────  │
│  ● Staking      $50,000   75.49%    │  ← 统一 legend 行
│  ● Referral     $3,200    15.46%    │
│  ● Team         $2,800    13.53%    │
│  ...                                │
└─────────────────────────────────────┘
```

### 具体改动
1. **Total Assets 卡** (`total-assets-gauge.tsx` 外层 + `portal.asset-analysis.tsx`)
   - 顶部加 eyebrow `ASSETS` + 标题 `总资产构成 / Total Assets`，字体颜色和 Rewards Breakdown 一致（`text-gold/80` + `font-serif text-gold`）
   - 中间保留半圆 gauge + 中间的总额文字
   - 底部 3 行 legend 保持现状（已经是 divide-y + 色点 + 金额 + 百分比）

2. **Rewards Breakdown 卡** (`rewards-breakdown-chart.tsx`)
   - 标题区不变（已经是统一样式）
   - 把底部那一排小 chips 图例 **删掉**，改成和 Total Assets 一模一样的 `divide-y` 行式 legend：
     - 每行：色点（带柔光）+ 名字（金色 uppercase）+ 金额（对应彩色）+ 百分比（灰色 14 宽对齐）
   - 把"累计奖励 $xxx"那一行作为 legend 的 **顶部分隔线之上的一行**，和 Total Assets 卡完全对齐

3. **卡片外壳** 已经一致（`SpotlightCard liquid-glass rounded-2xl p-6`），不动

### 加分项（可选，告诉我要不要）
- 给两张卡加同样的高度对齐（在 Asset Analysis 里用 grid `md:grid-cols-2` 把两张卡并排放，桌面端左右排，移动端上下排）
- 半圆 gauge 中央的 `Total Assets` 文字也换成和卡顶部 eyebrow 一样的字号/字重，呼应感更强

## 需要你确认
1. legend 风格统一到 **Total Assets 那种 divide-y 行式**（推荐），还是反过来都用 chips？
2. 两张卡要不要在桌面端 **并排显示**（grid-cols-2）？
3. 半圆 gauge 顶部要不要加 eyebrow + 标题（让两张卡头部对齐）？
