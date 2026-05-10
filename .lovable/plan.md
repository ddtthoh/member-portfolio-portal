我这次复查的是你当前所在的 `/portal`，不是只看 `/portal/holdings`。性能采样显示：现在首滚卡顿的主要原因已经不是之前 holdings 的图表动画，而是全局 PortalShell 和 `/portal` 首页在第一次滚动附近还在做这些重工作：

1. 开发预览里仍在加载/执行大量路由脚本，这是 preview 环境会放大的问题，但我们仍然可以降低首屏压力。
2. `PortalShell` 每次进入 portal 都挂载 `ThreeBackground`、`CommandPalette`、`TickerTape`、Framer Motion 路由动画、Tooltip/Dropdown 结构。
3. `/portal` 首页还有大量 glow/shadow/hover transition、`animate-ping`、ticker marquee、social links 的 Framer Motion pulse。
4. 两个 logo PNG 各 659KB，对一个 36–48px 小图标来说太大，会抢首屏资源。

## 彻底处理方案

### 1. 建立“首滚保护模式”
- 在全局 portal shell 增加一个轻量状态：页面刚加载到用户第一次滚动结束前，进入 `initial-scroll-safe` 模式。
- 这个模式下禁用所有非必要动画、hover glow、box-shadow transition、marquee、ping、shimmer、route enter motion。
- 第一次滚动完成后再恢复部分轻量交互效果。

### 2. 拆掉首屏全局重负载
- `ThreeBackground` 默认不在首屏立即挂载，改为用户空闲后或首滚结束后再加载。
- `CommandPalette` 不在页面初始化时渲染完整命令列表，只保留快捷键监听；按 Cmd/Ctrl+K 时再懒加载弹窗内容。
- `TickerTape` 不在首屏立即请求 DexScreener 和渲染滚动 ticker，改为首滚后/空闲后加载；加载前显示静态细条。

### 3. 移除 portal shell 的 Framer Motion 路由包裹
- 把 `AnimatePresence` + `motion.div` 路由进入/退出动画改成普通 `<div>`。
- `NavGroup` 展开动画改成 CSS 或直接显示，避免 Framer Motion 在首滚附近参与 React 更新。

### 4. 清理 `/portal` 首页首屏动画
- 移除 `animate-ping`、过重 shadow、hover translate、实时 glow transition。
- 保留视觉层次，但改成静态或低成本 CSS。
- `Sparkline` 保持纯 SVG，不加动画。

### 5. 压缩/替换 logo 资源
- 把 `logo-mark.png` 和 `participant-portal-logo.png` 从 659KB 压到适合小图标的尺寸，或生成 webp/png 小版本。
- 更新引用，避免首屏下载超大图片。

### 6. 验证标准
- 在 `/portal` 重新做第一次滚动 CPU profile。
- 目标：首滚 profile 不再出现 Three/Recharts/Framer Motion/ticker/social motion 作为热点。
- 检查 `/portal` 和 `/portal/holdings` 都能正常显示，视觉不破、不空白。

## 预期结果

这会牺牲一部分“刚进页面立刻动态炫酷”的效果，但换来真正稳定的第一次滚动。之前的修复是在局部减轻图表和 WebGL；这次会从全局入口、首屏资源、懒加载和动画策略一起处理。