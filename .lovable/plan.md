## 排查结论

打开 `src/routes/portal.staking-plans.tsx` 和 `src/styles.css` 后，定位到三处"闪/跳"的来源，全部是渲染 + keyframe 写法造成的，不是逻辑 bug。

### 1. 第二次 glow 开始时整个盒子闪一下
当前实现：第一次 glow 用 `<div key={1}>`，第二次切换到 `<div key={2}>`。React 在 `setSweepKey(2)` 时**卸载旧 div、挂载新 div**，浏览器要为带 `mix-blend-mode: screen` + `-inset-[15%]` 的新合成层重新建图层，触发一次 paint/composite。在某些浏览器（尤其 inapp webview）会看到一帧闪烁，看起来像"整个盒子亮了一下"。

### 2. 第二次中段跳一下
keyframe 当前是：
```
0% opacity:0 → 8% opacity:1 → 92% opacity:1 → 100% opacity:0
```
配合 `cubic-bezier(0.33, 1, 0.68, 1)`（ease-out）作为整段动画的 timing function。ease-out 会把"前期"压缩得很快，所以 0→8% 那段 opacity 从 0 跳到 1 实际只用 ~80ms，**视觉上是 pop-in**，不是平滑淡入。中段也因为 8% 那个硬拐点，亮度突然到顶，看起来"跳了一下"。

### 3. 第二次结束时跳一下
同样道理：92%→100% 的 opacity 1→0 在 ease-out 末尾被压得很短，是 pop-out，不是淡出。第一次 glow 因为紧接着第二次 glow（新元素覆盖上去），用户感知不到这个 pop-out；第二次 glow 后面没有东西接，pop-out 就被看到了。

---

## 修复方案（仅前端表现层，不改任何业务逻辑）

### 改动 A：避免 key 切换造成的挂载闪烁
不再用 `sweepKey` 来"切换两个 div"，改成**一直挂载同一个 overlay div，让它运行 keyframe 两次**：

- 在 `portal.staking-plans.tsx` 里把 `sweepKey: 0 | 1 | 2` 改成 `sweepRunning: boolean`。
- 第一次 glow 在 `onStart` 时把 `sweepRunning` 设为 `true` 并挂载 overlay。
- overlay 的 `animation-iteration-count` 设为 `2`（两次连播），单次 2.5s，总共 5s，正好覆盖"数字跑 2.5s + 第二次 glow 2.5s"。
- 删掉 `handleCountComplete` 里 `setSweepKey(2)` 的逻辑（第二次 glow 现在由 iteration 自动接力，时机精准）。
- 第二次 glow 结束后用 `onAnimationEnd`（CSS `animationiteration` 事件计数 2 次后）把 `sweepRunning` 设回 `false`，把 overlay 卸载。

效果：整个 glow 期间 overlay 元素从不卸载/重挂，浏览器图层稳定，第二次开始那一帧不再有合成闪烁。

### 改动 B：把 keyframe 的 opacity 改成平滑曲线
`src/styles.css` 里的 `position-sweep` 改成：

```css
@keyframes position-sweep {
  0%   { transform: translate(-60%, -60%); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translate(60%, 60%); opacity: 0; }
}
```

把 8%/92% 的硬拐点放宽到 20%/80%，淡入淡出有 500ms 缓冲，不会被 ease-out 压缩成 pop。中段也因此不会出现"亮度突然到顶"的视觉跳变。

### 改动 C：opacity 用线性插值，避免被 ease-out 同时影响
单独给 opacity 用 linear，让 transform 保留 ease-out。两种做法任选其一：

- **方案 C1（推荐，简洁）**：拆成两条动画并行：
  ```css
  .animate-position-sweep {
    animation:
      position-sweep-move 2.5s cubic-bezier(0.33, 1, 0.68, 1) 2 both,
      position-sweep-fade 2.5s linear 2 both;
  }
  ```
  其中 `position-sweep-move` 只动 `transform`，`position-sweep-fade` 只动 `opacity`。

- **方案 C2（保守）**：维持单条动画，但把 timing 改成 `ease-in-out`（`cubic-bezier(0.4, 0, 0.2, 1)`），让前后段都不要被压缩。

我倾向 C1，因为 transform 的 ease-out 节奏和数字 count-up 的 ease-out 是匹配的（这是上一轮的设计），不能动；只有 opacity 需要线性。

### 改动 D（可选小优化）
给 overlay div 加 `will-change: transform, opacity;` 显式提升合成层，避免运行中触发图层升级造成的微小卡顿。

---

## 文件改动清单

- `src/styles.css`：
  - 拆分 keyframe 为 `position-sweep-move`（transform）+ `position-sweep-fade`（opacity）。
  - `.animate-position-sweep` 用两条动画，opacity 走 linear，transform 保留 ease-out。
  - opacity 关键帧拐点放宽到 20%/80%。
  - 加 `will-change`。

- `src/routes/portal.staking-plans.tsx`：
  - `sweepKey` → `sweepRunning: boolean`。
  - overlay 不再用 `key`，改用条件挂载 + `animation-iteration-count: 2`。
  - `handleCountStart` 设 `sweepRunning = true`。
  - 删除 `handleCountComplete` 对 sweep 的赋值（保留函数本体或一并删掉，反正不再需要）。
  - 在 overlay 上加 `onAnimationEnd` 回调，第二次播完后 `sweepRunning = false`（卸载 overlay）。

- `src/components/count-up.tsx`：**不改**。
- `.lovable/plan.md`：更新本次修复的根因 + 方案备忘。

---

## 预期效果

- 第二次 glow 不再有"整个盒子闪"的合成层切换瞬间。
- 中段没有 opacity pop-in，亮度均匀延续。
- 结束时是平滑淡出，不再"跳一下"。
- 时长、节奏、与 count-up 的同步关系全部保留。
