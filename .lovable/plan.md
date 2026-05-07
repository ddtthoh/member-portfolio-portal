## 目标
在不破坏现有 serif gold + liquid-glass + 极简的设计语言的前提下，为整个 portal 加一层"高端 + 未来感"的 motion / effect 系统。所有效果默认尊重 `prefers-reduced-motion`，并通过共享 utility class 应用，零页面级改动。

---

## 一、全局新增 CSS 工具类（src/styles.css）

在 `@layer utilities` 中新增以下可复用 class，所有 portal 页通过 `portal-ui.tsx` 自动获益：

### 1. `aurora-bg` — 极光流光背景
替换/叠加在 `.portal-backdrop` 上，4 个 conic-gradient 色块以 40s 缓慢漂移（gold / cyan-gold / deep-violet 微光），dark 模式下营造"星舰内舱"氛围。

### 2. `glass-shimmer` — 卡片掠光
给 `.liquid-glass` 加一个 `::after` 斜向 `linear-gradient(110deg, transparent 40%, gold 50%, transparent 60%)`，hover 时 1.2s 一次扫光（类似 Apple Vision / Stripe 卡片）。

### 3. `glass-spotlight` — 鼠标跟随光斑
通过 CSS 变量 `--mx / --my`（JS 在 portal-ui 的 SectionCard 里 onMouseMove 写入），radial-gradient 在指针位置渲染柔光圈。性能极低（仅一个 background-image）。

### 4. `text-gold-shine` — 标题金色流光
serif 标题使用 `background: linear-gradient(110deg, gold 30%, white 50%, gold 70%); background-clip: text; animation: text-shine 6s infinite linear;`。仅应用于 `SectionHeader` 主标题，不影响正文。

### 5. `grid-floor` — 网格地板（仅 dark）
portal 根容器底部 `radial-gradient + linear-gradient` 网格，透视感弱、低对比，30% 不透明，营造未来终端氛围。

### 6. `num-tick` — 数字翻动
KPI 数字（Holdings、Cash、Earnings 等）出现时用 0.6s 由模糊→清晰 + 微上移（`filter: blur(8px) → 0`），tabular-nums 锁宽避免抖动。

### 7. `divider-scan` — 行分隔扫描线
`DataTable` 的 `<tr>` hover 时左侧出现 2px 金色 ::before 线，宽度从 0 → 100% 扫过（200ms ease-out）。配合现有 hover 行高亮。

### 8. `ring-pulse` — 焦点 / 状态徽章脉冲
status badge（Active / Pending）外圈 1 个金色 box-shadow 脉冲呼吸（2s loop, 仅 Active）。

### 9. `page-enter` — 路由进入
`<Outlet />` 容器加 `animation: page-enter 0.5s cubic-bezier(.2,.8,.2,1)`：opacity 0→1 + translateY(12px) + scale(0.985)。

### 10. `cursor-glow`（可选，仅 desktop）
固定位置的极淡金色光点跟随鼠标（pointer-events: none, 全局 1 个 div），mix-blend-mode: screen。可通过 prop 关掉。

---

## 二、组件层最小改动（src/components/portal-ui.tsx）

- `SectionCard`：包一层 `glass-shimmer glass-spotlight`，内置 `onMouseMove` 写 `--mx/--my`。
- `SectionHeader`：标题 className 追加 `text-gold-shine`。
- `DataTable` `<tr>`：追加 `divider-scan`。
- 新增 `<KpiNumber value={...} />` 包装：tabular-nums + `num-tick`，替换现有 KPI 数字（dashboard / holdings / cash 顶部 cube 数字）。
- 新增 `<StatusDot active />`：替换现有圆点，含 `ring-pulse`。

---

## 三、根布局（src/routes/portal.tsx）

- 在 `<Outlet />` 外层加 `aurora-bg grid-floor`。
- `<Outlet />` 包一层 `key={location.pathname}` + `page-enter` div，实现路由切换淡入。
- 注入一次性 `<CursorGlow />`（仅 `matchMedia('(pointer:fine)')` 命中时挂载）。

---

## 四、Reduced motion 与性能

- 所有 keyframe 在 `@media (prefers-reduced-motion: reduce)` 中禁用（仅保留 page-enter 的 opacity）。
- 所有动画用 `transform / opacity / filter`，避免 layout 抖动。
- `aurora-bg` 用 `will-change: transform` 限定单一层。
- `cursor-glow` 在移动端禁用。

---

## 文件改动清单

- 编辑 `src/styles.css`（新增 ~120 行 utilities + keyframes）
- 编辑 `src/components/portal-ui.tsx`（SectionCard/Header/DataTable 升级 + 新增 KpiNumber、StatusDot）
- 新增 `src/components/cursor-glow.tsx`
- 编辑 `src/routes/portal.tsx`（根背景 + Outlet 过渡 + CursorGlow）
- 替换 dashboard / holdings / cash 顶部主要数字为 `<KpiNumber />`（约 4–6 处）

不会改任何业务逻辑、路由、数据层。