## 问题诊断

`<Bar>` 在 vertical layout + `<Cell>` 子元素 + 自定义 `<LabelList>` 内容的组合下,Recharts 的 `isAnimationActive` 经常不真正动画化 rect 的 `width`,而是直接渲染最终宽度。所以你只看到数字 slide(因为 `renderValueLabel` 用我们自己的 `progress * width` 计算位置),但 bar 本身一上来就是满宽。

## 修复方案

不再依赖 Recharts 内置 Bar 动画,改用我们已有的 `progress`(0→1,1.5s)同时驱动 bar 的宽度,保证 bar 一定从左→右生长。

### `src/components/charts/rewards-breakdown-chart.tsx`

1. 在 `<Bar>` 上加 `shape={...}` prop,自定义 rect 渲染:
   - 接收 Recharts 提供的 `x, y, width, height, fill`
   - 渲染 `<rect>`,`width={width * progress}`,其余位置/高度/圆角/filter 保持现状
   - 圆角用 `rx={2} ry={2}`(替代原来的 `radius={[0, 4, 4, 0]}`,因为 shape 接管后 radius prop 不生效)
2. `isAnimationActive={false}`,`animationDuration` 移除(由 progress 接管)。
3. `<Cell>` 仍然保留(Recharts 会把每个 cell 的 `fill` 传给 shape 函数),drop-shadow filter 移到 shape rect 上。
4. `LabelList` 的 `renderValueLabel` 已经在用 `progress`,不变。

### 不动的部分
- `useInViewOnce` 触发 / progress ramp / 1.5s 时长
- `asset-growth-chart`(用户已确认 line/area 动画工作正常)
- 其他动画 / 数据 / 样式

### 预期效果
滚动到卡片 → ResponsiveContainer mount → progress 从 0 ramp 到 1 共 1.5s → 6 条 bar 同步从左边 0 宽度长到实际宽度,数字也同步从 0 跳到实际值。
