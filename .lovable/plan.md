## 改动

`src/components/portal-shell.tsx` 第 93 行：

把 ThreeBackground 容器的 `hidden ... lg:block` 改成 `block`，让 3D 背景在所有屏幕尺寸（包括手机和 in-app preview）都显示。

```diff
- <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-screen [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)] lg:block">
+ <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 block h-screen [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]">
```

效果：in-app preview（634px）和 new tab（全屏）将看到一致的金色节点网背景。
