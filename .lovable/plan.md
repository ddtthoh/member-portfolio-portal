## Sidebar 优化设计方案

当前 sidebar (`src/components/portal-shell.tsx`) 功能完整，但在视觉与交互上还有不少高级感可以升级。下面是建议的优化方向，分为「视觉精修」「交互升级」「结构优化」三类，可以全部采纳，也可挑选部分。

### 1. 视觉精修（高优先级 / 改动小）

- **品牌头部**：顶部把 `user.email` 截断展示替换为「头像 + 用户名（fallback email 前缀）+ 小金色徽章（KYC/Tier）」两行布局，显得更专业。
- **金色 active 指示**：左侧 `border-l-2 border-gold` 改成贴左的发光胶囊条 `before:` 伪元素（圆角、轻 glow），active 项背景用 `bg-gradient-to-r from-gold/10 to-transparent`，配合 icon 转金色。
- **图标精度**：active 时图标加 `text-gold drop-shadow-[0_0_6px_color-mix(in_oklab,var(--gold)_60%,transparent)]`，hover 时图标轻微右移 (`group-hover:translate-x-0.5`)。
- **分组分隔**：在「Statement / Account / Support」之间加入极细的 `via-border/40` 渐变 hairline + 11px uppercase tracking-widest 的 section label（如 `OPERATIONS`, `INSIGHTS`, `ACCOUNT`），呼应 PageHeader 的 eyebrow 风格。
- **滚动条美化**：内容区加 `scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold/20`，内部统一 `overflow-y-auto`。
- **底部 Sign out**：从纯文字按钮升级为「头像缩略 + 用户名 + 小图标」的卡片式 footer，sign out 移到 Account 下拉里（已经存在）；或保留，但加 `hover:text-destructive` 红色提示。

### 2. 交互升级

- **可折叠 rail（桌面端）**：新增 `collapsed` 状态（持久化到 `localStorage`），收起后宽度从 `w-64` → `w-[68px]`，只显示图标 + tooltip。顶部 header 加一个 `PanelLeft` 按钮切换。主区 margin/padding 同步过渡 (`transition-all duration-300`)。
- **Tooltip**：折叠态下每个图标 hover 显示 shadcn `Tooltip` 标签，避免歧义。
- **手风琴行为**：当前点开一个 NavGroup 不会关其他组，可选「单展开模式」让 sidebar 更整洁；active branch 永远展开。
- **键盘可达性**：NavGroup 按钮加 `aria-expanded`、`aria-controls`，子菜单加 `role="group"`；Cmd/Ctrl+B 快捷键切换 sidebar。
- **mobile drawer 增强**：打开时加半透明 backdrop（点击关闭），目前缺这个，移动端误触概率高。

### 3. 结构优化

- **统一用 shadcn `Sidebar` 组件**：项目里已经有 `src/components/ui/sidebar.tsx`，可以把 portal-shell 的自制 sidebar 迁移过去，免费拿到折叠/移动 drawer/状态持久化等能力，同时保留现有金色主题。
- **导航数据外提**：把 `nav` 数组拆到 `src/config/nav.ts`，方便后续做权限过滤、徽章计数（例如 Q&A 未读数）。
- **active branch 路径修复**：第 35 行 `basePath: "/portal/statement/"` 末尾多了 `/`，第 44 行又是无 `/`，建议统一去掉末斜线，避免日后判断 active 出错。
- **Type 收紧**：`navigate({ to: "/portal/profile" as any })` 这类 `as any` 来自路由文件未生成，建议补上对应 route file 后去掉断言。

### 推荐落地顺序

1. 视觉精修（金色 active 指示、section label、底部用户卡） — 立即提升质感。
2. 桌面端可折叠 rail + Tooltip — 提升空间利用率，专业感最强。
3. 迁移到 shadcn `Sidebar` + 导航外提 — 长期可维护性。

### 技术备注

- 持久化：`useEffect` 读写 `localStorage.getItem('sidebar:collapsed')`，初始值用函数式 `useState(() => ...)` 避免 SSR 闪烁。
- 折叠态主区偏移：把 `aside` 宽度类与外层 `<div>` 的 `lg:pl-64` / `lg:pl-[68px]` 联动；或改用 CSS variable `--sidebar-w` 动态切换，避免 Tailwind 4 任意值类的 var 解析坑（参考 sidebar width fix）。
- 颜色 token：所有金色仍走现有 `--gold` / `bg-accent`，不引入新变量，保持设计系统一致。

如果你认可这套方向，告诉我想先做哪一阶段（或全做），我就开工。