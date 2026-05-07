## 改动

`src/components/portal-shell.tsx` 第 88–105 行：把背景层从"`h-screen` + 70% 后透明"改成"`h-full`（铺满整页）+ 渐变 mask"，让背景：

- 0% – 55%：完全保留原状（覆盖到 Diamond 格子上方）
- 55% – 80%：开始柔和淡出（Diamond 格子区域）
- 80% – 100%：保留 12–18% 的微弱可见度，让底部不再视觉上空旷

具体 mask 渐变：
```
portal-backdrop:  black 0%, black 60%, rgba 0.35 85%, rgba 0.18 100%
ThreeBackground:  black 0%, black 55%, rgba 0.25 80%, rgba 0.12 100%
```

3D 节点比纯渐变层淡出得更明显，避免底部金色亮点干扰 footer/列表内容。

同时移除原来 `top-[100vh]` 的硬切 hairline（不再需要，因为没有硬边了）。

## 改动文件

- `src/components/portal-shell.tsx`（仅背景层定位 + mask 渐变；不动其他任何东西）
