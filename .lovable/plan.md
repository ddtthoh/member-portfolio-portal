我查到问题点了：`Join Naslab Today` 这个标题现在用的是全局 `.font-serif`，变量写的是 `Fraunces/Cormorant Garamond`，但项目里没有实际加载这些字体，所以浏览器会 fallback 到系统 serif。这个 fallback 字体的大写 J 在当前 `font-black + 84px + 金色 background-clip` 下笔画很怪，尤其在 portal 预览被缩放后更明显。之前改的是 padding/overflow，没有解决根因。

计划：
1. 只改 `src/components/marketing/mobile-poster.tsx` 里这个 CTA 标题，不影响其他标题。
2. 把 `font-serif font-black` 换成项目已有的 `--font-display` 视觉风格，并用 `fontWeight: 700/800`、正常 letter spacing、稳定 line-height，避免 J 的 serif fallback 变形。
3. 保留金色渐变和原 CTA 结构，只让标题更干净、更像品牌字标。
4. 同步确保 `/portal/landing-page` 的缩放预览和 `/invite/:memberId` full page 都使用同一个修复后的标题。