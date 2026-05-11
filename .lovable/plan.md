# NASLAB 满分升级计划 — "Cinematic Web3 Couture"

目标：把站点从 6.5 推到 9.5+。方向：Apple Vision Pro × Igloo Inc × Active Theory × Bloomberg Terminal 的混合体。所有"看起来像模板"的部分推倒重做。

---

## 1. 基础工程层（让所有动效有"导演"）

- 安装 `lenis`（平滑滚动）、`gsap` + `ScrollTrigger` + `ScrollSmoother`、`@react-three/drei` 的 `Environment`/`MeshTransmissionMaterial`、`maath`（粒子工具）、`three-stdlib`。
- 新增 `src/lib/scroll.ts`：全局 Lenis 实例 + GSAP ticker 接管，所有滚动动画走同一时间线。
- 新增 `src/components/marketing/scene-director.tsx`：每个 section 注册 `pin + scrub` 时间线，串成"镜头推进"。
- 修复当前 hydration 报错：`LGCard` 里 `ref` 在 SSR 阶段渲染差异，改成 `useId` + `mounted` 守卫。

---

## 2. 排版系统（一眼"高级"的关键）

- 引入 **PP Neue Montreal**（Display）+ **Söhne Mono**（数据/标签）+ **Fraunces**（衬线辅助），通过本地 woff2 自托管。
- 新建 `src/styles/typography.css`：
  - `--font-display`、`--font-mono`、`--font-serif`
  - 标题尺度：`clamp(56px, 11vw, 220px)`，`letter-spacing: -0.04em`，`font-weight: 450`
  - 副标题：`clamp(20px, 1.6vw, 28px)`，行高 1.15
  - 数据数字：mono + tabular-nums + 左侧细标签（如 `IDX-001 / LIVE`）
- 引入"行进场"组件 `<SplitLines>`：用 GSAP SplitText 风格按行 mask + stagger 0.06s 上推。
- 标题加 `text-balance` + 负字距 + 混排（衬线词组嵌入无衬线句子，做"编辑杂志感"）。

---

## 3. Hero 重做（signature moment #1）

- **3D N**：换 `MeshPhysicalMaterial`（metalness 1.0 / roughness 0.18 / clearcoat 1 / iridescence 0.4）；加 `<Environment preset="studio" />` HDR 反射；加 `<EffectComposer>` 里的 `Bloom + ChromaticAberration + Vignette + DepthOfField`。
- 背景换成 **shader 渐变 mesh**（不是粒子）：自定义 GLSL，金/红/深蓝在低频噪声下慢慢流动；上面叠极少量（<80）景深粒子。
- Scroll 接管：滚动 0–40% 时相机从远拉近 + N 旋转 90°，到 40% 时 N **散开成 ~3000 粒子**，重组为下一屏的 NCT 币 / 数据网格（signature moment）。
- Tagline 改为 `<SplitLines>` 行进场 + 渐变扫光，下方加一行 mono 小字 `EST. 2024 — INDEX 001 / NASLAB CAPITAL`。

---

## 4. 全新图表系统（替换现有所有"低端"图表）

新建 `src/components/marketing/charts-pro/`，全部基于 SVG + GSAP + Canvas（重的用 WebGL）。共同语言：mono 标签、tabular 数字、刻度线、坐标十字、滚动数字、tooltip 浮窗、电影级进场。

| 旧图表 | 替换为 | 升级要点 |
|---|---|---|
| `mempool-flow` | **Mempool Tape**（Bloomberg 风横向滚动条） | 实时 tx 块 + gas 颜色映射 + 选中区段放大 + 声波形 |
| `sandwich-timeline` | **Sandwich Orderflow**（横向时间轴 + K 线叠加） | 上下两层 K 线，front-run/back-run 用光弧连接，hover 显示 PnL |
| `hex-radar` | **Capability Web**（多层放射 + 数字滚动） | 3 层环、12 轴、极坐标网格、动画延迟 stagger，hover 高亮单维 |
| `arbitrage-graph` | **Arb Constellation**（force-directed + Canvas） | 节点引力布局、电流沿边流动、找到套利路径时整条路径闪光 + 数字弹出 |
| `token-charts (donut)` | **Allocation Orbit**（同心圆 + 标注线） | 不是 pie 是 ring stack，每段用刻度线引出标签，整体慢慢自转 |
| `burn-curve` | **Burn Decay**（带阴影渐变面积 + 里程碑标记 + 滚动进度） | 顶部里程碑 pin 卡片，曲线随滚动 draw |
| `stacked-area` | **Liquidity Strata**（多层 area + 时间刷选器） | 底部 brush 选区，主图 morph，hover 十字线 + tooltip |
| 新增 | **Live Ticker Tape** | 顶部细条横向跑马灯（BTC / ETH / SOL / NCT），mono + 涨跌色 |
| 新增 | **Block Lattice 3D** | WebGL 区块体素墙作为某 section 背景 |
| 新增 | **Heatmap Grid**（24×7 活动热力图） | 暗背景 + 金色阶 + hover 数字 |

通用工艺：所有图表 `IntersectionObserver` 触发 GSAP draw-on，数字 `CountUp`，hover 用 `MeshTransmissionMaterial` 风的玻璃 tooltip。

---

## 5. Liquid Glass 2.0

- 卡片加：`backdrop-filter` 的 `displacement`（用 SVG `feTurbulence + feDisplacementMap`）做"真折射"，不是单纯 blur。
- 加 **specular highlight**：根据鼠标位置算反射高光条（一道斜光带）。
- 加 **磁吸**：所有 CTA / 卡片用 `magnetic-button` 风格，鼠标靠近向光标位移 ±8px。
- 卡片 hover 时背后 **god-ray** 微微亮起（已有 `.lg-godray`，加 scrub）。

---

## 6. 页面节奏重构（"一屏一件事"）

`/main` 主页改为 9 幕电影结构，每幕一个 `pin + scrub` 镜头：

1. **Hero** — 3D N + tagline
2. **Manifesto** — 一句巨大标题（180px），背景缓推视差
3. **Live Pulse** — Ticker Tape + 4 个 Live Metric 卡（数字滚动 + sparkline pro）
4. **What We Do** — 三栏卡片，滚动横向滑入
5. **Ncore Stack** — 3D Block Lattice 背景 + 6 产品卡片轨道排列
6. **Signature Moment #2** — Arb Constellation 全屏，路径找到时全屏闪一下
7. **NCT Token** — 3D 金币 PBR + Allocation Orbit + Burn Decay
8. **Roadmap** — 横向时间轴，scrub 拖动
9. **Footer CTA** — 巨型 tagline 衬线 + 邮箱输入磁吸按钮

每幕之间用 `lg-divider` + 1 行 mono 章节号过渡（`CH.03 / LIVE PULSE`）。

---

## 7. 细节工艺包（这些是 9→10 的差距）

- **自定义 cursor**：默认小金点，hover 链接时变成环 + 文字标签（"OPEN" / "DRAG"）
- **Page transition**：路由切换时金色帘幕从下扫上，0.6s
- **Magnetic CTA**：所有按钮
- **Sound design**（可选开关）：hover/click 极轻金属 tick
- **404 页彩蛋**：3D N 碎片飘散
- **Loading**：首次进入用 NASLAB lockup 的 SVG path draw + 数字 0→100 mono 跑

---

## 8. Ncore 6 子页同样升级

每页用对应的 chart-pro 当 hero（占首屏 70%），下面才是文字。
- `/basic`：Mempool Tape 全屏
- `/trading`：Sandwich Orderflow
- `/features`：Capability Web + 数据卡
- `/trends`：Liquidity Strata + Heatmap Grid
- `/x`：Arb Constellation
- `/token`：3D 金币 + Allocation Orbit + Burn Decay

---

## 9. 性能与降级

- WebGL 场景全部 `Suspense + lazy`，未进视口不挂载
- 移动端：禁用 ScrollSmoother、粒子降到 600、关闭后处理
- `prefers-reduced-motion`：所有 GSAP timeline `progress(1)` 直接到终态
- 字体 `font-display: swap` + preload display 字体一档

---

## 技术清单（开发参考，用户可跳过）

**新增依赖**：`lenis`、`gsap`、`@gsap/react`、`maath`（已有 three/drei/postprocessing）

**新增文件**：
- `src/lib/scroll.ts`、`src/components/marketing/scene-director.tsx`
- `src/styles/typography.css`、`src/components/marketing/split-lines.tsx`
- `src/components/marketing/cursor-pro.tsx`、`src/components/marketing/page-transition.tsx`
- `src/components/marketing/charts-pro/` 下 9 个图表组件
- `src/components/marketing/hero-3d-pro.tsx`（替换现有）
- `src/components/marketing/nct-coin-pro.tsx`（PBR 替换）
- `src/components/marketing/ticker-tape.tsx`、`block-lattice.tsx`

**修改**：`src/routes/main.index.tsx`、所有 `main.ncore.*.tsx`、`marketing-theme.css`、`liquid-glass.css`、`__root.tsx`（注入 Lenis + cursor + page transition）

**字体**：本地 woff2 放 `src/assets/fonts/`，通过 `@font-face` 注册

---

## 不在范围

- 后端、auth、portal/*、表单逻辑、数据真实接入（所有图表用 mock 高仿真数据）
- 文案重写（沿用现有英文文案）
- i18n 改动

---

预计交付后视觉等级：**9.0–9.5**。剩 0.5 留给真实数据接入 + 真人摄影/动画素材（这部分需要素材授权，无法纯代码生成）。
