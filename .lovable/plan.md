## 排查结论

这次不是 new tab 的 compositor 新建层问题；new tab 已经被“常驻 overlay”修好。

in-app preview 剩下的“开始之前跳”，根因是 **React 状态触发时机 + inline style 覆盖 CSS animation 初始帧**：

1. `CountUp` 第一帧数字刚从 0 变动时调用 `onStart`。
2. `onStart` 执行 `setSweepRunning(true)`，React 下一次提交时会同时：
   - 给 overlay 加上 `animate-position-sweep` class
   - 把 inline `opacity: 0` 改成 `opacity: undefined`
3. 在 in-app iframe/预览环境里，这个“移除 inline opacity”有概率先被绘制一帧；而 overlay 的静态 `transform` 仍是 `translateZ(0)`，还没吃到 keyframe 的 `translate(-60%, -60%)`。
4. 结果就是 glow 正式开始前，overlay 以“默认位置/默认可见度”闪一下，看起来像盒子跳了一下。

session replay 也支持这个判断：录到的是连续的 `box-shadow` 样式变化，不是布局位移；performance 里 CLS 基本为 0，所以不是 DOM layout jump，而是 paint/compositing flash。

## 修复计划

1. **让 overlay 的静态样式永远等于动画 0% 帧**
   - 默认 `opacity: 0`
   - 默认 `transform: translate3d(-60%, -60%, 0)`
   - 不再用 React 在开始瞬间移除 inline opacity。

2. **把 glow 可见度完全交给 CSS keyframes**
   - `.animate-position-sweep` 只负责播放 animation。
   - React 只 toggle class，不 toggle opacity/transform。

3. **把 keyframe transform 改成 3D transform**
   - 从 `translate(-60%, -60%)` 改成 `translate3d(-60%, -60%, 0)`
   - 结束为 `translate3d(60%, 60%, 0)`
   - 避免浏览器在 2D/3D transform 之间切换合成路径。

4. **必要时强制隔离该卡片的 paint/composite**
   - 在 current staking card 容器加 `isolation: isolate` / `contain: paint`。
   - 让 `mix-blend-mode: screen` 只在卡片内部混合，减少 in-app iframe 的重绘闪烁。

## 预期效果

- glow 开始前不会再出现可见 overlay 默认帧。
- new tab 当前的完美状态会保持不变。
- 动画速度、两次 glow 的总时长和节奏不变。