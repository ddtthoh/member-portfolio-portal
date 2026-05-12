恢复原来的 Fraunces serif 字体，真正修掉 J 变形。

根因：`src/routes/__root.tsx` 里 Google Fonts 链接只加载了 Fraunces 的 300/400/500/600 字重，但 CTA 标题用了 `font-black`(900)，浏览器只能"合成加粗"出来，serif 的 J 弧线就被压扁/扭曲了。

修复（两处小改）：
1. `src/routes/__root.tsx`：把 Fraunces 字重补全为 `300;400;500;600;700;800;900`，这样 700/900 是真字体而不是合成。
2. `src/components/marketing/mobile-poster.tsx` 的 `Join Naslab Today` 标题：恢复 `font-serif`（Fraunces），把字重从 `font-black` 调成 `fontWeight: 700`（视觉上够重又不会再让 J 失真），保留金色渐变和正确的 padding/overflow 防止裁切。

不动其它任何文件。