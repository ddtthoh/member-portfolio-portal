## 目标

在已有的"单色 icon + 圆形金色 hover + 一次性流光"基础上，让四个社交 logo（Telegram / Instagram / X / Website）在**静止状态**就更出众、更有"被设计过"的板块感，同时不破坏私行克制美学。

---

## 方案：三层叠加升级

### 层 1：永久细金边框（默认态可见度）
每个 icon 的圆形容器从"完全透明"改为：
- 默认：`border-gold/20` + `bg-card/40` + 极轻 inner shadow
- Hover：升级到 `border-gold/60` + `bg-[gold/10%]` + 外发光（沿用现有效果）

效果：四个 icon 静止时就像四枚嵌在侧栏的小金色勋章，远看一眼能识别。

### 层 2：上方 eyebrow 标题 + 金色细线
在 icon 行上方加：
- 一条 `h-px` 渐变线：`from-transparent via-gold/30 to-transparent`
- 一行 micro 标题：`CONNECT`（10px、letter-spacing 0.3em、`text-muted-foreground/60`）
- Sidebar 折叠态：标题隐藏，只保留细线

效果：把四个 icon 从"孤儿按钮"升格为一个**有名字的板块**，瞬间有杂志/品牌官网气质。

### 层 3：错位呼吸光晕（Idle pulse）
四个 icon 在 idle 状态下，金色边框透明度做 4 秒一次的极轻微呼吸（`gold/20 → gold/35 → gold/20`），**每个 icon 延迟 0.4s 依次呼吸**，形成左→右的金色波浪。
- 用 framer-motion `animate` + `repeat: Infinity`
- 加 `prefers-reduced-motion` 守护，关闭动画时回到静态

效果：余光会被吸引但完全不打扰阅读，是顶级品牌网站常见的"活着的细节"。

---

## 技术实现

**只改一个文件**：`src/components/social-links.tsx`

1. 把每个 `<a>` 内的"圆形容器 span"默认样式从 transparent 改为 `border-gold/20 bg-card/40 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--gold)_8%,transparent)]`，hover 态保留现有金色加强。
2. 在 `row` / `stack` 变体的 `<div>` 外层包一个新容器：
   - 上方 `<div>` 渲染细线 + `CONNECT` eyebrow（折叠时只渲染细线）
   - 通过新增 prop `showEyebrow?: boolean`（默认 true）控制，landing footer 可关掉只保留 icons
3. 把每个圆形容器 span 换成 `motion.span`，加 `animate={{ boxShadow: [...3 帧...] }}` + `transition={{ duration: 4, repeat: Infinity, delay: index * 0.4 }}`
4. 用 `useReducedMotion()` 守护，开启 reduce-motion 时跳过呼吸动画
5. `labeled` 变体（support 页）保持现状不动，那里已经是卡片样式

**不改的文件**：portal-shell / index / portal.support — 它们只调用组件，自动继承新效果。

---

## 视觉草图

```text
展开 sidebar：
─────── CONNECT ───────
  (TG)  (IG)  (X)  (WEB)   ← 四枚带细金边的圆形勋章
   ↑↑↑↑ 错位呼吸 ↑↑↑↑

折叠 sidebar：
   ───
  (TG)
  (IG)
  (X)
  (WEB)

Landing footer（关 eyebrow）：
© 2026 ... Private Wealth      (TG) (IG) (X) (WEB)
```

---

## 范围之外

- 不加品牌色小点（已讨论过，会拉低质感）
- 不加 magnetic / tilt 交互（与克制美学冲突，留作以后 landing 重做时再考虑）
- 不动 support 页的 labeled 卡片（已经是另一种好设计）
- 不加 i18n 新 key，"CONNECT" 直接英文写死（属于品牌排版，不翻译）
