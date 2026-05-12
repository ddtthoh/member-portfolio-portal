## 排查总结

你看到的问题分两个不同的页面，需要分别处理。先确认你看到的是哪一个：

- **`/portal/landing-page`** — 站内预览（FitPoster + MobilePoster，缩放显示）
- **`/invite/:memberId`** — 公开分享页（带 ThreeBackground + 滚动渐显的那个版本）

截图来看是 1920 宽的全屏页面，应该是 **`/invite/:memberId`**。下面是排查到的根本原因。

---

## 根本原因

### A. "颜色变淡" — 来自滚动渐显 CSS 把 section 留在中间状态

`src/routes/invite.$memberId.tsx` 第 85–113 行的 `<style>` 块写的是：

```css
@supports (animation-timeline: view()) {
  .invite-scroll-reveal .poster-root > section { … animation-range: entry 0% cover 35%; }
  @keyframes invite-section-reveal {
    from { opacity: 0; transform: translateY(60px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}
```

问题：
1. `animation-range: entry 0% cover 35%` 在**视口很高、section 也很高**时（公开页就是这种），任何时候只要 section 没"覆盖视口 35%"，它就处在 `from` 状态（opacity 接近 0）。
2. 在 16:9 桌面上，CTA / Hero 这种几乎占满整屏的 section，滚动到一半时 opacity 仍可能停在 0.4–0.7，整页看起来就是"偏暗 / 颜色淡"。
3. fallback 分支（`opacity:0` + `transition`）在 Safari/Firefox 上同样让 section 默认全黑，需要 IntersectionObserver 加 `.in-view` 才显示——任何时序/绑定异常都会让整段保持透明。

### B. "没有 scroll effect" — 其实在生效，但被误判

如果你看的是 `/portal/landing-page`（站内预览），那里 **没有** 任何滚动渐显 CSS，也没有 ThreeBackground —— 因为预览只是把 MobilePoster 缩放进一个小框，不滚动。所以"看不到 effect"是预期内的：effect 只在公开页 `/invite/:memberId` 上跑。

### C. ThreeBackground 在公开页的可见性

`ThreeBackground` 用的是 `fixed inset-0 -z-10` + 一个 `linear-gradient` 蒙版（顶部不透明、底部完全透明）。在 `.landing-root` 这个建立了 stacking context 的父元素里，`-z-10` 会把它推到父元素背景**之后**，导致 3D 节点几乎看不到——这也让你觉得"动态背景没起作用"。

---

## 修复方案（只改 `src/routes/invite.$memberId.tsx`）

### 1. 重写滚动渐显，确保进入视口后立刻稳定到 opacity:1

把 `animation-range` 收紧到 section 一进视口就完成渐显，并且只做一次（不再跟着滚动反复变淡）：

```css
@supports (animation-timeline: view()) {
  .invite-scroll-reveal .poster-root > section,
  .invite-scroll-reveal .poster-root > footer {
    animation: invite-section-reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;   /* 进入视口 60% 之前就已经 opacity 1 */
  }
  @keyframes invite-section-reveal {
    0%   { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
}
```

fallback 分支保留 IntersectionObserver，但**一旦加上 `.in-view` 就不再移除**（避免向上滚动时再次淡出造成"颜色变淡"的错觉）。

### 2. 修复 ThreeBackground 看不见的问题

把 `<ThreeBackground fixed />` 外面包一层固定容器，或者把它的 `z-index` 改为 `0`，并把 MobilePoster 的容器设 `z-10`。具体改法：

- 给装 MobilePoster 的内层 `div` 加 `className="relative z-10 ..."`
- 给 `<ThreeBackground />` 外层用一个自己的 wrapper：`<div className="pointer-events-none fixed inset-0 z-0"><ThreeBackground /></div>`，并去掉 `fixed` prop（避免它内部再用 `-z-10`）

### 3. 验证

修改后用浏览器打开 `/invite/任意ID`，检查：
- 整页颜色饱和、不再"灰蒙蒙"
- 向下滚动每个 section 平滑出现，向上滚动不会再次淡出
- 背景能看到金色 3D 节点漂浮

---

## 不修改的内容

- `/portal/landing-page` 站内预览不动（它本来就没有滚动效果，是缩略图预览）
- MobilePoster 内部布局、字体、配色不动
- LightningNodes（SVG 的那一层）保留作为 ThreeBackground 之外的补充
