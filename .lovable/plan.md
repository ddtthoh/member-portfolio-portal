## Goal

把 `RewardsBreakdownChart` 升级到"Bloomberg / Stripe 后台"级别的精致感，同时保持当前细 bar（10px、圆角、间距 45%）的方向。

## Changes (single file: `src/components/charts/rewards-breakdown-chart.tsx`)

### 1. 淡淡的竖向 grid line（背景刻度）
- 加入 recharts `<CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeOpacity={0.08} strokeDasharray="2 4" />`
- 让眼睛能快速对齐数值，但几乎不抢视觉

### 2. Inline value label（金额贴在 bar 末尾）
- 给 `<Bar>` 加 `<LabelList dataKey="value" position="right" />`
- 自定义 formatter：`$X,XXX`，字号 10px，颜色用对应 segment 的 color，font-weight light，tabular-nums
- 同时把下方 list 里重复的"金额数字"保留（因为 list 是图例 + 占比表，bar 是视觉），但 list 字号略缩，让 bar 成为主角

### 3. 自定义 Tooltip
- 用 recharts 的 `content` prop 替换默认 tooltip
- 弹出小卡片显示：
  - 类别名（小字 uppercase tracking）
  - 金额（金色大字）
  - 占总奖励的百分比
  - 排名标记（如 "Highest" / "#2 of 6"）— 通过对 sorted data 求 index 得出
- 样式：`liquid-glass` 风格，圆角 8，padding 适中，subtle shadow

### 4. 渐变填充 bar
- 在 `<defs>` 里为每个 reward type 生成一个 linearGradient（左→右：深色 80% → 亮色 100%）
- `<Cell fill={`url(#grad-${entry.key})`} />`
- 比纯色更高级，与 portal 的 liquid-glass 美学一致

### 5. 类别 label 排版微调
- YAxis tick：字号从 11 → 10，加 `letterSpacing: '0.08em'`，`textTransform: 'uppercase'`（recharts 不支持 CSS uppercase，所以在 chartData 里把 name 转成大写后传入）
- 颜色用 `text-gold/70`（通过 fill 的 oklch 模拟）让 bar 本身成为主角

### 6. 进入动画
- recharts `<Bar isAnimationActive animationDuration={1100} animationEasing="ease-out" />`
- 与 PortfolioDonutCard 的 1200ms ease-out 节奏对齐

### 7. 顺序优化（可选小细节）
- 默认按金额从大到小排序 chartData，让最长的 bar 在最上方，视觉重心稳定
- 下方 list 保持原顺序（REWARD_TYPES 的固定顺序），让用户依然能按类别快速查找

## Out of scope

- 不动 `useRewardsBreakdown` hook、不动 i18n key、不动 `REWARD_COLORS`
- 不动 SpotlightCard 容器和 header
- 不动其他 chart 组件

## Risk

- LabelList 在窄屏（<400px）下可能与 bar 末端重叠 → formatter 里加判断：value < maxValue * 0.15 时把 label 放到 bar 右侧外部（position="right" 已自动处理 overflow）
- 渐变 ID 必须在同一个 SVG 内唯一 → 用 `grad-rewards-${key}` 前缀避免与其他 chart 冲突
