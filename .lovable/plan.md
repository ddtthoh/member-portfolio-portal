## 为什么 /main 还是 lag

我把渲染重的部分都过了一遍，确认有三个**持续吃 GPU/CPU**的源头还在跑（即使你已经离开它们的视口）：

### 1. Hero3DPro（最重）
`src/components/marketing/hero-3d-pro.tsx`
- 同时挂了 4 个 postprocessing：`Bloom (kernel=LARGE, mipmapBlur)` + `DepthOfField` + `ChromaticAberration` + `Vignette`
- `Environment preset="studio"` + `ContactShadows`（每帧重算阴影）
- `dpr={[1, 1.7]}` → Retina 上等于 3.4× 像素
- Canvas 默认 `frameloop="always"`，**滚出视口仍在每秒 60 帧渲染**
- 这是首屏感觉"卡"的主要原因

### 2. SignatureDissolve
`src/components/marketing/signature-dissolve.tsx`
- 1400 个粒子，每帧 JS 循环里算 morph + swirl + sin（CPU 重）
- sticky 在 180vh，**整个滚动期间都在跑**
- 也没有 frameloop 控制

### 3. Lenis + GSAP ScrollTrigger 全站常驻
`src/lib/scroll.tsx` + `scene-director.tsx`
- Lenis 每帧 raf + ScrollTrigger.update + scroll 事件
- 在中端设备上，配合上面两个 Canvas 就会持续掉帧
- `signature-dissolve` 自己又加了一个 `window.scroll` listener（重复监听）

### 次要
- 多个 chart 用 SVG `<animate>` SMIL 动画，离屏也在跑
- `cursor-glow` 监听 mousemove 写 CSS 变量（影响小，可保留）

---

## 修复 plan（不动设计/排版，只动性能）

**A. Hero3DPro 减负**（最大收益）
1. 去掉 `DepthOfField` 和 `ChromaticAberration`（视觉差异极小，GPU 成本最高）
2. `Bloom` 改 `kernelSize=MEDIUM`，`intensity=0.65`
3. 移除 `Environment preset="studio"`，改用现有 lights（保留金色光感）
4. `ContactShadows` 删除或换成静态径向渐变（你已经有 radial overlay）
5. `dpr={[1, 1.25]}`
6. `Canvas frameloop` 加上 IntersectionObserver：进入视口 `"always"`，离开 `"never"`
7. 桌面 + `prefers-reduced-motion` + 移动端再降级（移动端直接用海报图）

**B. SignatureDissolve 减负**
1. 粒子数 1400 → 600
2. Canvas `frameloop="demand"`，只在滚动 progress 变化时 `invalidate()`，scroll 节流到 rAF
3. 把组件外层用 `MountInView` 严格按需挂载 + 离开后**卸载**（新写一个 `MountWhileInView`，离开时 `setMounted(false)`）

**C. Lenis 智能开关**
1. 仅在 `(pointer: fine)` **且** `navigator.hardwareConcurrency >= 8` 且 `devicePixelRatio <= 2` 时启用
2. 其它设备走原生滚动（你已经有 `prefers-reduced-motion` 守护，再加一道硬件门槛）

**D. signature-dissolve 的 scroll listener** 改成 GSAP ScrollTrigger 复用现有 ticker（去掉重复 listener）

**E. SVG SMIL 动画**给最重的几个图（`sandwich-timeline`、`mempool-flow` 等）外层用 `MountInView`，离开视口后停止。

---

## 改动文件
- `src/components/marketing/hero-3d-pro.tsx` — 减 postFX、frameloop 智能切换
- `src/components/marketing/signature-dissolve.tsx` — 粒子数、frameloop demand、合并 scroll
- `src/components/marketing/mount-in-view.tsx` — 增加 `unmountWhenOut` 选项
- `src/lib/scroll.tsx` — 硬件门槛守护
- `src/routes/main.index.tsx` — 用新的 unmount 行为包住 Hero / Dissolve / 重 chart

预计感受：首屏 GPU 占用 ~–60%，滚动 fps 在中端机器从 ~25 → ~55。

如果你确认这个方向，我就按 A→E 顺序实施；要不要顺便把移动端 hero 直接换成静态金色海报（GPU 占用降到 0，外观差异肉眼几乎看不出）？