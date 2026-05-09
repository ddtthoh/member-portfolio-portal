## 目标

让两个 TrackCard（Track 01 Participant / Track 02 Referrer）成为页面**最显眼的视觉焦点**，客户一眼知道"这才是我自己的进度"，下方那两张大表只是参考。

## 视觉层级（修改后）

```text
[PageHeader]            ← 标题
[Event meta]            ← 普通卡 (低强度)
[TrackCard] [TrackCard] ← ★ 主角，强金色光晕 + 微微提升
[Tier ladder]           ← 普通卡 (低强度)
[Tier ladder]           ← 普通卡 (低强度)
[Fine print]            ← 弱化文字
```

## 改动方案

### 1. TrackCard 容器升级（核心）

在 `src/routes/portal.promotion.$promoId.tsx` 的 `TrackCard` 组件外层加：

- **金色描边强化**：从默认 liquid-glass 加 `border-gold/30` → `border-gold/50`
- **背景金色辉光**：加一层 radial-gradient 金色背景（左上 + 右下两个光斑），与首页 Diamond 卡同款手法
- **外发光阴影**：`box-shadow: 0 0 30px -8px gold/40%`，让卡片"浮"出来
- **顶部 Eyebrow ribbon**：在卡片最顶端加一条 1px 金色渐变线（左→右淡入淡出），像高级品牌卡片
- **轻微 hover lift**：`hover:-translate-y-0.5 transition-transform`

### 2. 下方两张 Tier Ladder 弱化

为了拉开层级，让主角更突出，把 Tier ladder 容器调"安静"：

- 容器边框从默认 → `border-foreground/8`（更淡）
- 移除 SpotlightCard 的高亮特效（如果开启了）→ 改用普通容器
- 表格已 Achieved 行的高亮金色降一档：`bg-gold/[0.05]` → `bg-gold/[0.035]`
- 标题字号略减、颜色弱化为 `text-gold/80`

### 3. Event meta 卡也稍微弱化

顶部那张事件信息卡（地点 / 时间 / 窗口）也从主调降级，让两张 TrackCard 在中间形成"C 位"。

### 4. 配合上一个 plan 的 gold glow

TrackCard 内部的：
- Qualified / Apex chip 的打勾 → `gold-glow-sm` 慢呼吸
- 进度条已填充段 → `gold-glow-bar`
- 进度条末端光点 → `gold-glow-md` 慢呼吸

三者叠加后，TrackCard 整张卡会成为页面唯一"会呼吸"的元素，视觉焦点自然落在客户自己的进度上。

### 5. 响应式

- 桌面：两张卡并排（`lg:grid-cols-2`），金色辉光边缘可见
- 平板（当前 888 视口）：单列堆叠，每张卡占满宽度，更突出
- 手机：单列堆叠，金色辉光不变（box-shadow 是 px 单位，三端一致）

## 不会做的事

- ❌ 不加边框流光动画（避免喧闹）
- ❌ 不放大字号（保持信息密度）
- ❌ 不用纯金底色填满（会变成促销 banner，反而廉价）

## 给非技术用户的话

简单说：**两张"我自己的 Tracking"卡片会被升级成页面的主角**——加金色描边、柔和金色光晕、淡淡的浮起感，像 Apple Card 那种"被托起来"的质感。下方两张大表会同时被"压低"一档（边框更淡、颜色更素），让客户一眼就锁定自己的进度，表格只是参考资料。配合上一个方案的呼吸金光，整页只有这两张卡在"呼吸"。