## Wave 3 — Cinematic Couture Final Pass

目标：从现在的 ~7.5 推到 9.5+，让整站像 Active Theory / Resend / Igloo Inc 级别的"电影感作品"。

---

### 1. Lenis + GSAP ScrollTrigger 真接入（引擎层）

- `src/lib/scroll.tsx` 已有 SmoothScrollProvider 但没真正驱动 ScrollTrigger，重写为：
  - Lenis 实例 → 每帧调 `ScrollTrigger.update()`
  - `gsap.ticker` 接管 Lenis raf
  - 暴露 `useLenis()` hook 供组件用
- `__root.tsx` 包裹整站，确保 SSR 安全（dynamic import）
- 新增 `src/lib/scene-director.tsx`：注册全局 ScrollTrigger，统一管理 pin / scrub timeline

### 2. 章节 pin + scrub 电影分镜

每个 SectionShell 升级成"导演场景"：
- **Hero → Signature**：把 Hero 改成 sticky，scroll 0–100vh 内 N 字旋转 + zoom，100–280vh 切到粒子 morph，作为"一个连续镜头"（合并 Hero3DPro 和 SignatureDissolve 的相机）
- **CH.02 Live Pulse**：4 张 metric 卡 stagger 进场 + sparkline draw-on
- **CH.05 Ncore 2.0**：左标题 pin，右侧 4 张 feature 卡逐张滑入
- **CH.06 Arb Constellation**：全屏 pin，constellation 按 scroll 进度 draw 节点和路径
- **CH.07 NCT Token**：3D 币 pin 在中央，AllocationOrbit 和 BurnDecay 顺序切入
- 用 `SplitLines` + `gsap.from` 让所有标题逐字/逐行进场（带 mask）

### 3. Page Transition 金幕

- `src/components/marketing/page-transition.tsx`：
  - 监听 `useRouter().state.location.pathname` 变化
  - 0.6s 金色斜幕从右下扫入 → 路由切换 → 从左上扫出
  - 用 framer-motion `<AnimatePresence mode="wait">`
- 接入 `__root.tsx`

### 4. Magnetic CTA + Cursor 升级

- `MagneticButton` 加：hover 时 cursor 变环 + 显示文字（如 "EXPLORE →"）
- 升级 `CursorPro`：增加 `data-cursor="label:Explore"` 通信协议，组件标记后 cursor 自动显示对应标签
- 所有主 CTA 加 `data-cursor` 属性

### 5. Liquid Glass 2.0（真折射）

- `src/components/marketing/liquid-glass.css` 加 SVG filter：
  - `feTurbulence` baseFrequency 0.012 + `feDisplacementMap` scale 8
  - `feGaussianBlur` 微模糊柔化
- `LGCard` 加 `filter: url(#lg-displace)` 类变体 `lg-card-pro`
- 在 `__root.tsx` 或单独 `<svg>` 文件挂载 filter defs（一次）

### 6. Ncore 6 子页 Editorial Hero 重做

每个子页（basic / trading / features / trends / token / x）改造结构：
- 顶部 100vh 全屏 hero：左 30% 是大标题（clamp 64–160px Editorial New 风格 Space Grotesk）+ 章节号 mono；右 70% 是该页对应的 chart-pro（带 pin scrub 进入动画）
- 下方才是文字内容段落
- 各页对应的 hero chart：
  - basic → CapabilityWeb
  - trading → SandwichOrderflow
  - features → MempoolTape + HeatmapGrid 拼合
  - trends → LiquidityStrata
  - token → AllocationOrbit + BurnDecay
  - x → ArbConstellation 全屏版

### 7. 细节工艺包

- **404 彩蛋**（`src/routes/$.tsx` 或 root notFoundComponent）：N 字粒子散开后再聚合，加"LOST IN THE MEMPOOL — RETURN TO BASE"
- **Loading 动画**（`__root.tsx` 初次挂载）：金色 N 字 SVG draw 0.8s
- **Sound design（可选开关）**：右下 ◯ 按钮，开启后 hover/click 有微金属音；默认关
- **Footer CTA 加 magnetic + glow**

---

### 技术要点（给开发者看）

- 文件新建：
  - `src/lib/scene-director.tsx`
  - `src/components/marketing/page-transition.tsx`
  - `src/components/marketing/lg-defs.tsx`（SVG filter defs 一次挂载）
  - `src/components/marketing/loading-veil.tsx`
  - `src/components/marketing/sound-toggle.tsx`
  - `src/routes/$.tsx`（404）
- 文件改造：`scroll.tsx`、`__root.tsx`、`hero-3d-pro.tsx`、`signature-dissolve.tsx`、`main.index.tsx`、`main.ncore.*.tsx`（6 个）、`magnetic-button.tsx`、`cursor-pro.tsx`、`lg-card.tsx`、`liquid-glass.css`
- ScrollTrigger 必须 `gsap.registerPlugin(ScrollTrigger)` 且只在 client 注册
- 所有 ScrollTrigger 实例在组件 unmount 时 `kill()`，防 HMR 泄漏
- Lenis 与 sticky/Canvas 的兼容：用 `data-lenis-prevent` 标记 3D Canvas 容器
- Hero + Signature 合并镜头：用一个 `<Canvas>` 在外层 fixed，内部场景用 scroll progress 切换状态（避免两个 Canvas 抢 GPU）

### 不在范围内

- 后端 / auth / 数据接入（保持 mock）
- portal 子站
- i18n
- 真实 sound 资源（用 WebAudio 合成短 ping）
- 移动端深度优化（保证不崩，但 wow 体验以桌面为主）

### 验收标准

- 滚动从顶到底像看一段 30s 短片，章节之间有"镜头切换"感
- 路由跳转有金幕过渡，cursor 在 CTA 上变标签
- Ncore 6 子页每页都有自己的 hero 大场面，不再是普通标题段
- 404 进得去出得来，有惊喜
- 桌面 60fps，FCP < 2s