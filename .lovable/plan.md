## 调整资产增长图表

### 改动范围
仅修改 `src/components/charts/asset-growth-chart.tsx`，不涉及数据 hook、业务逻辑或其他组件。

### 1. 6 种 rewards 改为独立折线（非堆叠）
- 移除 `<Area stackId="1">` 的堆叠模式
- 把 6 种 reward 从堆叠 Area 改为独立的 `<Line>`（或非堆叠的半透明 Area），每条线显示该 reward 类型的累计金额本身，而不是堆叠后的高度
- Total Sum 线保持金色发光样式，因为是各项之和，自然会处于最高位置，不再与其他线重叠
- 右端金额标签逻辑保留（每条线末端显示自己的 $ 金额 + ROI%）
- Tooltip 保留每行 amount + ROI%，Total ROI 行保留

### 2. 移除底部 "当前累计 vs $50,000 staking 本金" 区块
- 删除 chart 下方的 CountUp 大金额数字 + 金色 ROI 徽章 + "vs $XX,XXX staking 本金" 副标题整块
- 图表卡片只保留标题、图表本体和图例

### 技术细节
- `REWARD_TYPES.map()` 渲染时从 `Area stackId="1"` 改为 `Line`（保持 `REWARD_COLORS` 颜色，`strokeWidth={1.5}`，无 fill 或极淡 fill）
- Total 线维持现有 `strokeWidth={2.5}` + drop-shadow + 末端 pulsing dot + pill 标签
- Y 轴 domain 自动适配最大值（即 total）
- 删除 `<div>` 包含 `当前累计` / `CountUp` / `vs ... staking 本金` 的整块 JSX
