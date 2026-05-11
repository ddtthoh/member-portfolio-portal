## 排查报告

### 结论
问题没有解决的主因不是 CSS 时长，而是触发时机仍然被“组件进入视口 / 数据加载 / 初始 0 值动画”提前占用了。当前实现会在数字还显示 `$0.00` 的时候就启动 glow，所以用户看到的是：卡片出现时 glow 已经开始甚至结束，而真实金额还没开始从 0 跳。

### 我检查了什么
- `src/routes/portal.staking-plans.tsx`
- `src/components/count-up.tsx`
- `src/components/metric-value.tsx`
- `src/styles.css`
- `src/hooks/use-wallet.ts`
- 当前预览页面 `/portal/staking-plans`
- 浏览器 console / network / runtime error 快照

### 发现的问题

#### 1. `onStart` 触发得太早
当前 `CountUp` 在第一次 `requestAnimationFrame` tick 里立刻执行：

```ts
onStart?.();
```

但同一个 tick 里 `elapsed = now - start`，因为 `start` 也被设成当前 `now`，所以第一帧的 `t = 0`，数字仍然是 0。

结果：
- glow 已经开始；
- 数字仍然显示 `$0.00`；
- 用户感觉“数字还没开始跳，第一次 glow 就开始/结束了”。

#### 2. 钱包数据加载导致先跑了一次 0 → 0
`useWallet()` 初始状态是：

```ts
wallet = { staking: 0 }
loading = true
```

页面立刻渲染 `MetricValue value={wallet.staking}`，也就是 value = 0。

当前 `CountUp` 即使 value 是 0，也会启动 RAF，并触发 `onStart` / `onComplete`。

然后 `startedRef` / `completedRef` 被锁死：

```ts
startedRef.current = true
completedRef.current = true
```

等真实 `staking_balance` 从后端加载成 `$47,793.92` 时：
- 数字才真正开始从 0 跳；
- 但 glow 已经不会再触发，因为 ref 已经被第一次 0 值动画占用。

这是最关键的根因。

#### 3. 第一段和第二段 glow 的逻辑不是“第一段跟数字一起结束，再开始第二段”的可靠链路
当前第二段是由 `onComplete` 触发的，理论上对，但由于第一次 0 → 0 已经完成过，`completedRef` 已经变成 true，真实金额完成时不会再触发第二段。

#### 4. `MetricValue` 的 static 分支之前提到的改动并没有意义
`MetricValue` 只有非 static 分支才会使用 `CountUp`。当前 staking amount 是非 static，所以这里不是主因。

#### 5. CSS 时长已经是 2.5s，但视觉上会显得更快
CSS 里现在是：

```css
animation: position-sweep 2.5s cubic-bezier(...) 1 both;
```

时长确实是 2.5s。

但 keyframes 是：

```css
0% opacity: 0
15% opacity: 1
85% opacity: 1
100% opacity: 0
```

再加上 overlay 是 `-inset-[40%]`，斜向扫过可见区域的实际高亮窗口会短于 2.5s，所以用户会感觉 each glow 的单次时间还是偏快。

#### 6. 当前预览还显示 `$0.00` 的截图与根因一致
你发来的截图里 `Your Staking` 是 `$0.00`，但 `Current Tier` 已经显示 Premium Pro，这说明页面状态里存在数据不同步/渲染时序问题：staking 数字组件仍处在 0 或刚开始阶段，而其他派生 UI 已经显示了高级 tier。这个表现也支持“初始 0 状态提前触发动画”的判断。

#### 7. runtime error 不是这次动画问题的直接原因
捕获到的错误是：

```text
Failed to fetch dynamically imported module: virtual:tanstack-start-client-entry
```

这类通常是预览热更新/模块加载瞬时问题。浏览器实测页面能加载，console 里没有 CountUp 或 animation 相关错误，所以它不是 glow timing 没同步的直接根因。

## 为什么前两次修复没有生效

前两次只把 glow 从 card observer / timeout 改成了 `CountUp` 的 `onStart` / `onComplete`，但没有处理两个关键点：

1. `onStart` 仍在数字真正变化前触发；
2. 初始 `wallet.staking = 0` 时已经触发并锁住了 `startedRef` / `completedRef`。

所以真实金额加载后，glow 不会按真实数字动画重新启动。

## 建议修复方案

### 目标行为
- 页面出现时不要因为 card 出现而 glow。
- 钱包还在 loading 时不要触发 count/glow。
- value 为 0 时不要触发 glow。
- 第一段 glow 必须在数字第一次真正从 0 变大时启动。
- 第一段 glow 必须和数字 count-up 同时结束。
- 第二段 glow 必须在第一段结束后才开始。
- 每段 glow 使用用户要求的单段时长。

### 实施计划

1. 在 `StakingPlansPage` 使用 `loading`：
   - 改成 `const { wallet, loading } = useWallet();`
   - loading 时不要渲染带 `onStart/onComplete` 的 staking `CountUp`。

2. 防止 0 值动画触发 glow：
   - 如果 `wallet.staking <= 0`，只显示静态 `$0.00` 或不传 `onStart/onComplete`。
   - 只有真实 staking 金额 `> 0` 时才启动同步动画。

3. 修正 `CountUp.onStart` 的语义：
   - 不在第一帧 `t = 0` 时触发。
   - 只在 `display` 第一次大于 0 的那一帧触发。

4. 修正完成回调：
   - `onComplete` 只在真实 `value > 0` 且动画到达最终值时触发。
   - 避免 StrictMode / re-render 导致重复触发。

5. 修正 glow 顺序：
   - `onStart` 设置第一段 glow key。
   - `onComplete` 设置第二段 glow key。
   - 移除任何会提前开始的 card mount / observer / timeout 逻辑。

6. 调整 glow 的可见速度：
   - 保留或按你的 prompt 改成目标时长；
   - 如果你要“视觉上也满 2.5s”，需要扩大 keyframe 的可见移动范围或降低可见段速度，而不是只改 CSS duration。

### 预期结果
修完后，第一次 glow 不会在 card 出现时触发；它会等到金额从 `$0.00` 第一次变化时才开始，并在金额到达最终数值时结束。随后第二次 glow 才开始播放。