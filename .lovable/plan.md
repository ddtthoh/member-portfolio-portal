## 目标

整个 `/portal/*` 所有动画统一规则：
- **数字**：永远从 `0` 开始计数，`0 → 目标值`
- **所有动画时长**：统一为 **1800ms (1.8s)**
- 缓动保持 ease-out 平滑

## 改动

### 1. `src/components/count-up.tsx`（核心数字组件）
- 默认 `duration = 1800`（原 1500）
- 删除 `fromRef`：每次进入视口都从 `0` 开始计数（不是从上次的值继续）
- 删除"value === 0 跳过"短路逻辑
- 元素离开视口时重置 `display = 0` 并重置内部进度，下次进入时再次从 0 → value
- 保留 `prefers-reduced-motion` 直接显示终值

### 2. `src/components/count-value.tsx`（react-countup 包装）
- 默认 `duration = 1.8`（秒）
- `start={0}`，移除 `preserveValue`，确保每次都从 0 起跳

### 3. `src/hooks/use-in-view-once.ts` → 改为双向触发支持（仅供 CountUp 使用）
- 在 CountUp 内部不依赖 "Once"，改用普通 IntersectionObserver：进入 → armed=true 触发 0→value；离开 → armed=false 重置为 0
- 不破坏其它使用 `useInViewOnce` 的组件（保持原 hook 不变，CountUp 自带新 observer）

### 4. `src/styles.css` — 统一动画 duration
所有 portal 入场/揭示类动画 duration 改为 1.8s：
- `.reveal-on-scroll` transition：`0.75s` → `1.8s`
- `@keyframes page-enter` 对应 `.page-enter` animation：`0.5s` → `1.8s`
- `@keyframes num-tick` `.num-tick`：`0.6s` → `1.8s`
- 保持 hover/shimmer/breathe/ticker 等"持续型/交互型"动画不变（它们不是入场动画）

### 5. framer-motion 入场动画统一
扫描所有 portal 内 `motion.*` 的 `initial → animate` 入场，将 `transition.duration` 统一为 `1.8`：
- `src/components/rewards-overview-panel.tsx`：`0.5` → `1.8`
- `src/components/portal-shell.tsx` 入场区块同理
- 其它命中页面：grep `transition={{ duration:` 限定在 `src/components/` 与 `src/routes/portal*` 内逐个调整入场动画（不动 hover/exit 等交互动画）

## 不改动

- 颜色 token、布局、业务逻辑
- 持续循环动画（ticker、breathe、shimmer、cursor-glow、aurora）
- hover / active 微交互时长

## 验证

打开 `/portal`、`/portal/holdings`、`/portal/reports/staking`：
1. 所有金额/百分比/天数都从 `0` 开始，1.8s 内滚动到目标值
2. 所有区块淡入/上移耗时一致，约 1.8s
3. 上下来回滚动，数字每次进入视口都重新从 0 计数
