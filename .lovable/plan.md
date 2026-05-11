## 总体方向

风格：**Apple Vision Pro × Web3** — 半透明磨砂玻璃、柔和金红渐变、景深模糊、克制但精致的动效。冷静、高端、未来感。

范围：**首页 + Ncore 6 个子页**全面升级；其他页（About/Strategy/Roadmap/Careers/Collaboration/Contact）只统一玻璃卡片样式，不动结构。

---

## 1. Hero 区（首页顶部，全屏）

按你的要求改成**极简单焦点**布局：

```text
┌─────────────────────────────────────┐
│        [ 3D NASLAB Logo ]           │  ← 整页只有它在动
│         （旋转 + 漂浮）              │
│                                     │
│   Where Luxury Meets                │  ← 底部 tagline
│   Decentralized Innovation          │
└─────────────────────────────────────┘
```

- **3D Logo**：用代码把 N 字形状（路径）**真正 3D 挤压**出来，做成有厚度、有倒角、有金属反光的实体。
  - 颜色：左侧金黄 → 右侧火红渐变（匹配你上传的 logo）
  - 材质：金属度 1.0、低粗糙度、环境反射
  - 动画：缓慢自转 + 上下浮动 + 光晕呼吸
  - 鼠标移上去：跟随鼠标轻微倾斜
- **光晕 + 上帝之光（God-rays）**：postprocessing bloom + 从 logo 中心向外辐射的体积光，呼吸式明灭
- **背景**：纯黑 → 深紫的径向渐变 + 极少的星尘粒子（不抢戏），不再有满天乱飞的粒子
- **Tagline**：底部居中，金色衬线大字 + 字母逐个淡入

整个 hero 没有 CTA 按钮、没有副文案 — 纯视觉冲击。CTA 按钮放到下一屏。

---

## 2. 真 3D Logo 实现方式

- 用 SVG 路径数据（左侧 N + 右侧 N 的双 N 设计）→ Three.js `ExtrudeGeometry` 挤压
- 加 `bevelEnabled` 倒角让边缘有金属高光
- 用自定义 shader 做**金 → 红垂直渐变**（不是单色金）
- 加一个透明玻璃六边形外壳包裹（可选层），增加 Vision Pro 那种"玻璃里有东西"的感觉
- 旋转一圈约 12 秒，匀速无重力感

---

## 3. 液态玻璃设计系统（全站统一）

新建 `liquid-glass.css`，提供这些可复用 class：

| 组件 | 描述 |
|---|---|
| `.lg-card` | 主玻璃卡：背景模糊 24px、内边高光、边缘 1px 渐变描边、悬浮时高光流动 |
| `.lg-pill` | 玻璃胶囊（用于标签、按钮） |
| `.lg-panel` | 大面积玻璃面板（用于 section 容器） |
| `.lg-divider` | 渐隐金线分隔 |
| `.lg-spotlight` | 鼠标跟随的高光（卡片内部） |
| `.lg-noise` | 极轻微的噪点纹理（避免纯色塑料感） |

替换首页和 Ncore 子页所有现存 `m-glass` / `m-luxe-border` 用法。

---

## 4. 首页其他区块（hero 之后）

按 Apple 官网那种"一屏一个故事"节奏：

1. **What We Do** — 左文 + 右玻璃 4 宫格（图标 + 标题 + 描述），悬浮时卡片内有光斑跟鼠标
2. **Live Metrics** — 4 个液态玻璃卡，每张里有一个**动画数字 + 微型 sparkline**（24/7、99.9%、<50ms、Global）
3. **Strategic Direction** — 3 卡 Phase I/II/III，卡片背面用**渐变 mesh 玻璃**
4. **Ncore 2.0 展示** — 左文 + 右 2×2 玻璃卡，每卡带一个**微型动画图标**（CPU 脉冲、网络节点闪烁等）
5. **Ncore X 套利** — 全屏液态玻璃面板内嵌**动态套利路径图**（节点 + SVG 流光路径，金币粒子沿路径跑）
6. **NCT Token** — 左：3D 旋转金币（替换现在那个 CSS 假币）+ **环形发行进度图** + **燃烧曲线动画**；右：文案 + 3 个属性玻璃卡
7. **Roadmap 预览** — 水平时间轴，玻璃节点，当前节点呼吸金光
8. **Careers + Collaboration** — 2 大玻璃卡
9. **Footer CTA** — 大玻璃面板 "Where Luxury Meets Decentralized Innovation" + 按钮

---

## 5. Ncore 6 个子页 — 自定义数据可视化

每页加一个标志性的 WebGL/SVG 可视化：

| 页面 | 加什么 |
|---|---|
| `/main/ncore/basic` | **链上交易流动图**：方块从顶部落入 mempool → 排序 → 出块，循环动画 |
| `/main/ncore/trading` | **三明治交易时序图**：3 笔交易在时间轴上前后插入目标交易，金色高亮 |
| `/main/ncore/features` | **6 个特性的环形雷达图**（实时执行/Gas 优化/风控/...），数据从中心扩散 |
| `/main/ncore/trends` | **DeFi 增长面积图**（多层渐变堆叠） + 趋势小卡 |
| `/main/ncore/x` | **跨平台套利节点图**：DEX/CEX 节点用力导向布局，金币粒子沿最优路径流动 |
| `/main/ncore/token` | **NCT 通缩曲线**（指数衰减面积图） + **环形分配饼图**（玻璃质感、悬停展开） |

所有图表：自定义 SVG/Canvas（不用 recharts 的默认样式），玻璃质感 + 金红主色 + 入场动画。

---

## 6. 全站动效系统

- **滚动驱动**：所有 section 用现有 `MReveal`，但加 stagger（子元素错开 80ms）
- **鼠标跟随高光**：液态玻璃卡片内有跟随鼠标的径向光斑
- **数字滚动**：所有数字（统计、价格）用 `CountUp` 入场
- **磁性按钮**：保留现有 `MagneticButton`
- **页面切换**：route 切换时 fade + 微 scale
- **Reduce motion**：尊重用户的 prefers-reduced-motion 设置

---

## 7. 文件改动清单

新建：
- `src/components/marketing/hero-3d-logo.tsx` — 真 3D 挤压 N + 光晕 + 上帝之光
- `src/components/marketing/liquid-glass.css` — 液态玻璃设计系统
- `src/components/marketing/lg-card.tsx` — 液态玻璃卡片基础组件（带鼠标跟随高光）
- `src/components/marketing/charts/` — 6 个自定义图表组件
- `src/components/marketing/nct-coin-3d.tsx` — 3D 金币（替换 CSS 假币）
- `src/components/marketing/arbitrage-flow.tsx` — 套利路径动画图

替换重写：
- `src/components/marketing/hero-3d.tsx` → 删旧、用新 hero-3d-logo
- `src/routes/main.index.tsx` → 按上面 9 个 section 重写
- `src/routes/main.ncore.{basic,trading,features,trends,x,token}.tsx` → 各加自己的可视化

样式扩展：
- `src/components/marketing/marketing-theme.css` → 加 god-ray、glass-spotlight 工具类

---

## 8. 性能预算

- Hero 3D：单 mesh + bevel + bloom，移动端自动降到无 bloom
- 粒子：减到 < 200（之前 2500 太多）
- WebGL 图表：用 `IntersectionObserver` 懒加载，离屏不渲染
- 总 hero 组件 < 80KB gzipped

---

## 不在范围内（保持原状）

- About / Strategy / Roadmap / Careers / Collaboration / Contact 的内容结构
- 所有 portal/* 路由
- 后端表、auth、表单提交逻辑
- 文案（用现有的）

确认后开干。