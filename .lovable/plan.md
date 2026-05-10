## 目标

为 `/portal/holdings` 的「奖励累计趋势」图表（`src/components/charts/asset-growth-chart.tsx`）增加：
1. 图上可读的数字标签（金额 + ROI%）
2. 一条凸显的 **Total Sum** 总额线，带发光与端点脉冲动效
3. 百分比基准 = 用户 **staking 本金**（来自 `useWallet().wallet.staking`），代表"相对投资成本的回报率 ROI"

---

## 改动范围

只改一个文件：`src/components/charts/asset-growth-chart.tsx`
（不动 hook、不动数据库、不动其他组件）

---

## 具体设计

### 1. 引入 staking 本金作为 ROI 基准
- 在组件内调用 `useWallet()` 拿到 `wallet.staking`
- 定义 `roiBase = wallet.staking || 1`（避免除 0；本金为 0 时 ROI 显示 "—"）
- 所有百分比 = `value / roiBase * 100`

### 2. Total Sum 高亮线
在现有 6 个堆叠 `<Area>` 之上叠加一条独立的 `<Line>`：

- 数据点 `dataKey="total"`（hook 已经返回）
- 颜色：`var(--gold)`，`strokeWidth={2.5}`
- `filter: drop-shadow(0 0 8px var(--gold))` 实现金色发光
- 不参与 stack（独立 Line，浮在堆叠面积顶端）
- 最右端点用自定义 `dot`：
  - 静态金色发光圆点
  - 外圈用 SVG `<animate>` 做半径 + 透明度的脉冲（2s 循环），实现"心跳光晕"
- 中间数据点 `dot={false}`，避免噪点

### 3. 图上数字标签
采用 **「端点 + Total 线」组合标注**（信息全但不拥挤）：

- **Total 线**最右端：金色 pill 标签显示 `$金额 · +X.XX% ROI`
- **每条堆叠面积最右端**：小型彩色标签显示 `$金额`（沿用对应 reward 颜色）
  - 用 Recharts `<LabelList>` + 自定义 renderer，只在 `index === data.length - 1` 时渲染
  - 标签水平排开在右边距内（margin.right 从 8 增加到 88）
- Tooltip 升级：每行显示 `$金额  (X.XX% ROI)`，并在底部加一行 Total ROI

### 4. 底部"当前累计"区块升级
- 左侧：金额（CountUp）
- 右侧新增一个金色 ROI 徽章：`+X.XX% ROI`
- 下方副标题说明基准：`vs $XX,XXX staking 本金`
- 当 `wallet.staking === 0` 时 ROI 显示 `—` 并提示"暂无 staking 本金"

### 5. 图例增强
- 每个图例项后追加该类型当前累计 ROI%（小号灰字），让图例本身也是数据看板

---

## 视觉参考（ASCII）

```text
┌───────────────────────────────────────────────┐
│ REWARDS GROWTH              [7D] [30D] [90D]  │
│ 奖励累计趋势                                    │
│                                               │
│ $   ╭─────── total (gold, glow) ──────●pulse  │
│ 8k  │   ╱─────────staking──── $3,200          │
│ 6k  │ ╱────referral────────── $2,100          │
│ 4k  ├──team────────────────── $1,400          │
│ 2k  ├leader/global/par_rank── $... $... $...  │
│  0  └───────────────────────────────────────  │
│     11-01      11-15        12-01             │
│                                               │
│ ● staking 32.0%  ● referral 21.0%  ● team ... │
│ ─────────────────────────────────────────────  │
│ 当前累计                $11,200  ╭─+112% ROI─╮│
│ vs $10,000 staking 本金                       │
└───────────────────────────────────────────────┘
```

---

## 技术细节

- **Recharts 组合**：`<ComposedChart>` 替换当前的 `<AreaChart>`，内部同时容纳 `<Area stackId="1">` × 6 和顶层 `<Line dataKey="total">`
- **脉冲端点**：自定义 `dot` 函数，返回 `<g>` 包含两个 `<circle>`，外圈用内联 `<animate attributeName="r" .../>` 和 `<animate attributeName="opacity" .../>`
- **端点标签**：`<LabelList content={...}>` 内判断 `index` 是否等于 `data.length - 1`，否则返回 `null`
- **响应式**：viewport 888px 下右边距留 88px 给标签；如果端点标签互相重叠（小金额堆叠太近），自动隐藏 ROI < 5% 的类型标签，仅保留色点
- **i18n key**：新增 `charts.assetGrowth.roi`、`charts.assetGrowth.basis`、`charts.assetGrowth.noBase`，配中英文 fallback

---

## 不做的事

- 不改 `useRewardsCumulative` 的数据形状（已经返回 `total` 字段，够用）
- 不改 `RewardsBreakdownChart`（保持下方第二张图原样）
- 不动数据库或 mock 数据生成逻辑
