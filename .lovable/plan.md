## NASLAB 官网世界级重做（挂在 `/main` 下）

按你的指令：现有 `/` 保持不动，新 NASLAB 官网整体放在 `/main`，所有子页都是 `/main/xxx`。其他选择全部沿用上一轮。

---

### 一、路由结构

```text
src/routes/
  index.tsx                    保持不动（现 Ivory & Vale landing）
  main.tsx                     layout：marketing shell（nav + footer + cursor glow + Outlet）
  main.index.tsx               /main          → NASLAB Home
  main.about.tsx               /main/about
  main.strategy.tsx            /main/strategy
  main.roadmap.tsx             /main/roadmap
  main.careers.tsx             /main/careers
  main.collaboration.tsx       /main/collaboration
  main.contact.tsx             /main/contact
  main.ncore.tsx               layout：产品 sub-nav + Outlet
  main.ncore.index.tsx         /main/ncore           → Ncore overview
  main.ncore.basic.tsx         /main/ncore/basic
  main.ncore.trading.tsx       /main/ncore/trading
  main.ncore.features.tsx      /main/ncore/features
  main.ncore.trends.tsx        /main/ncore/trends
  main.ncore.x.tsx             /main/ncore/x
  main.ncore.token.tsx         /main/ncore/token
  invite.$memberId.tsx         不动
  portal.*                     不动
  login.tsx                    不动
```

`main.tsx` 用 `<Outlet />` 渲染子路由，统一注入 marketing nav / footer / theme toggle / 3D 背景容器。

每个路由各自 `head()` meta（title / description / og:title / og:description），SEO 独立。

### 二、视觉方向（Direction Lock）

- 基调：portal 的 Luxe Gold + Cyan Tech + 深空 `#06070b`
- Light 模式：象牙白 `#f7f4ec` + 暖金 + 深石墨字
- 字体：Cormorant Garamond（display）+ Inter（body）+ JetBrains Mono（数据点缀）
- 装饰语言：conic-gradient 光圈边框 / 流体玻璃面板 / gold-shine 文字 / cyan glow 数据 / 网格背景 + 噪点 / 浮动粒子轨道
- 交互：cursor glow、magnetic CTA、hover tilt、scroll-driven count、parallax、section reveal、route transition fade
- 默认 dark mode，nav 右侧 toggle 切换 light（复用 `theme-provider.tsx`）

### 三、3D / WebGL 处理（Maximalist + 性能护栏）

每个 3D 场景：可见才渲染 + DPR ≤ 1.5 + 移动端降级为 SVG/CSS。

- **Hero (`/main`)**：Three.js 旋转 NASLAB 立体 N logo（金色金属材质 + 反射）+ 粒子轨道 + 鼠标视差
- **Strategy / Roadmap 背景**：WebGL shader 网格扭曲（金 + cyan 流动）
- **Ncore 系列**：粒子网络流动（mempool 隐喻）+ 节点连线
- **Token 页**：3D NCT 硬币旋转 + 光晕
- **Collaboration / About**：3D 节点 constellation（复用 `network-constellation.tsx`）

### 四、Marketing 共享框架

新建 `src/components/marketing/`：

- `marketing-shell.tsx` — `main.tsx` 用，包 nav + Outlet + footer + cursor glow + 路由淡入
- `marketing-nav.tsx` — Logo + 菜单（Home / About / Strategy / Roadmap / Products↓ / Careers / Collaboration / Contact）+ ThemeToggle + Login CTA（→ `/login`，magnetic）
- `marketing-footer.tsx` — 4 列：Brand / Products / Company / Connect（telegram / X / instagram / website / contact@naslabtec.com）+ copyright
- 复用：`theme-toggle.tsx`、`cursor-glow.tsx`、`magnetic-button.tsx`、`count-up.tsx`、`network-constellation.tsx`

### 五、各页面 Section 蓝图

**Home `/main`** — long-scroll
1. Hero：3D N logo + "A New Era of Digital Wealth"（gold-shine）+ 双 CTA
2. Stats Bar：24/7 · 99.9% · <50ms · Global（count-up + cyan glow）
3. What We Do：parallax 大图 + 文案 + magnetic CTA
4. Strategic Direction：玻璃卡 + conic 边框
5. Ncore 2.0 Showcase：3D 粒子背景 + 4 feature 卡 horizontal scroll
6. Ncore X：split layout，左 3D 节点，右文案
7. NCT Token：3D 硬币 + tokenomics 数据点
8. Roadmap timeline preview（4 节点 hover 展开）
9. Careers + Collaboration 双卡 CTA
10. Final CTA：contact@naslabtec.com + 大金 magnetic button
11. Footer

**About** — Hero + Mission/Vision/Values 三卡 + Team grid（占位）+ stats
**Strategy** — Hero + 多层 vertical timeline + WebGL shader 背景
**Roadmap** — 大型交互 timeline（2024 / 2025 / 2025 Q1-Q4 / 2026 Q1-Q4），节点点击展开，scroll progress 金色描边
**Ncore Layout** — 顶部产品 sub-nav（Basic / Trading / Features / Trends / X / Token），共享 hero
**Ncore.basic / trading / features / trends** — 文章式长页 + 图示卡 + 数据视觉
**Ncore.x** — 双向箭头动画展示 DEX↔DEX / CEX↔CEX / DEX↔CEX
**Ncore.token** — 3D 硬币 + tokenomics donut（recharts）+ utility 卡
**Careers** — Hero + 5 职位卡 + apply CTA
**Collaboration** — Hero + 3 类合作模式卡 + form 占位
**Contact** — 联系大字 + email 卡 + social 卡 + contact form（写入 Lovable Cloud）

### 六、技术栈与新依赖

- 已有：framer-motion、lucide-react、recharts、tanstack/react-router
- 新增：`three`、`@react-three/fiber`、`@react-three/drei`
- 新 token（`src/styles.css`）：`--marketing-bg`、`--gradient-aurora`、`--shadow-marketing`，含 light mode 对应值
- 颜色全部走 semantic token，保证 light/dark 都不破

### 七、后端（Lovable Cloud）

- 新表 `contact_messages`（id / name / email / subject / message / created_at），RLS：anon insert，admin select
- 新表 `career_applications`（id / position / name / email / phone / resume_url / message / created_at），RLS 同上
- Storage bucket `career-resumes`（私有）
- 不动 auth / portal 现有表

### 八、分阶段实施

1. **Phase 1（本轮执行）**：marketing 框架（`main.tsx` shell / nav / footer / theme tokens / 3D Hero）+ **Home `/main`** + **About** + **Contact** + **Roadmap**
2. **Phase 2**：Strategy + Ncore layout + 6 个 Ncore 子页
3. **Phase 3**：Careers + Collaboration + 后端表 + 表单提交

### 九、不在本次范围

- 多语言（i18n）翻译 — 先英文
- 文案重写 — 沿用现有 naslabtec.com 文案
- Portal / `/` 现有 landing / auth 流程 — 不动
- 自定义域名 / DNS 切换
- Logo 重新设计 — 用现有 NASLAB N（你之后给 SVG/PNG，否则文字 logo 占位）

### 验收标准

- 默认进入 dark；右上 toggle 切 light，不破布局/颜色
- `/main` 首屏 3D logo desktop ~60fps，移动端自动降级
- 所有按钮 magnetic + cursor glow（仅 desktop fine pointer）
- 所有 section 进视口有 reveal
- 所有路由独立 SEO meta
- 移动端无横向滚动，触摸友好

---

确认后开始 Phase 1。如果 Phase 1 想再缩小（例如只做框架 + Home），告诉我即可。
