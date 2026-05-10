## 目标
1. 修复总和线 breathing glow 不显示（CSS 选择器写错了）。
2. 所有图表 / 数字动画只在滚动到视口内才触发，避免用户滚下来时已经播放完。
3. 适当放慢动画节奏：当前 1100ms 太快、1400ms (CountUp 默认) 也偏快；改为 ~2200ms（不慢但能看清）。

---

## 1. 修 breathing glow

`src/styles.css` 里写的是：
```
.gold-line-breathe path.recharts-curve { ... }
```
Recharts 的 Line 实际渲染为 `path.recharts-line-curve`，所以选择器没命中 → 没 glow。

改为：
```
.gold-line-breathe .recharts-line-curve {
  animation: gold-line-breathe 4.5s ease-in-out infinite;
}
```
保持现有 keyframe（drop-shadow 在 4px / 45% ↔ 10px / 80% 之间呼吸），节奏 4.5s 已经是 breathing 不是闪。

---

## 2. 滚动触发：只在进入视口才播放

新增一个共享 hook：`src/hooks/use-in-view-once.ts`
```ts
// 包裹 IntersectionObserver, threshold ~0.25, 触发一次后返回 true
export function useInViewOnce<T extends Element>(opts?: { amount?: number })
  : { ref: RefObject<T>; inView: boolean }
```

应用到三个地方：

**a. `CountUp` (`src/components/count-up.tsx`)**
- 加可选 prop `triggerInView?: boolean`（默认 true，向后兼容也可设默认 false 然后逐处显式启用 — 见决策点）。
- 当启用时，组件内部用 `useInViewOnce` 拿到自己的 ref，挂在外层 `<span>` 上；只有 `inView === true` 后才启动 rAF tick。在此之前显示 `0.00`（带前后缀）。

**b. `AssetGrowthChart` (`src/components/charts/asset-growth-chart.tsx`)**
- 卡片最外层 `motion.div` 拿到 ref + inView。
- 现有 `useCountProgress(key)` 改成 `useCountProgress(key, { enabled: inView })`：未启用时 progress 保持 0，启用后才从 0 ramp 到 1。
- Recharts 的 `<Line>` / `<Area>` 加 `key={inView ? "in" : "out"}`，让它在第一次进入视口时才挂载并触发自带 0→实际 动画。
- 6 个 mini sparkline 同理：`key` 加上 `inView` 标记。

**c. `RewardsBreakdownChart` (`src/components/charts/rewards-breakdown-chart.tsx`)**
- 同样用 `useInViewOnce` 包卡片。
- 现有的 `setProgress(0) + rAF` 改为只在 `inView` 后启动。
- `<Bar>` 加 `key={inView ? "in" : "out"}`，让 Recharts 重新挂载播动画。

> 备注：底部"明细列表"里的 CountUp 也会因为 a) 的改动自动变成滚动触发。

---

## 3. 放慢动画速度

| 位置 | 现在 | 改为 |
|---|---|---|
| `count-up.tsx` 默认 `duration` | 1400 | **2200** |
| `asset-growth-chart.tsx` Line/Area `animationDuration` | 1100 | **2200** |
| `asset-growth-chart.tsx` mini sparkline `animationDuration` | 1100 | **2200** |
| `asset-growth-chart.tsx` `useCountProgress` 默认 duration | 1100 | **2200** |
| `rewards-breakdown-chart.tsx` Bar `animationDuration` | 1100 | **2200** |
| `rewards-breakdown-chart.tsx` 内部 progress rAF | 1100 | **2200** |
| `total-assets-gauge.tsx` framer `animate(...).duration` | 1.2s + 0.25/0.5 delay | **2.2s + 0.3/0.6 delay**（保持错峰感） |

> 2200ms 接近 Stripe / Linear 的 hero number 节奏，能"看到走数"但不拖沓。

---

## 决策点（请确认 1 个）

**`CountUp` 的滚动触发要默认开启还是按需开启？**
- A. **默认开启**（推荐）：所有页面所有 CountUp 都变成滚动触发，行为最一致。风险：表格、tooltip 里的 CountUp 也会等到进入视口才走数 — 通常这正是想要的。
- B. **按需开启**：默认关闭，只在 holdings 页相关组件传 `triggerInView`。更保守但需要逐处加 prop。

如果不指定，按 **A** 执行。

---

## 不改动
- `useRewardsCumulative` / `useRewardsBreakdown` 数据 hook
- 业务逻辑 / 颜色 token / 文案
- 其他页面的布局
