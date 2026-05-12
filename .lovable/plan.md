## Light mode 排查报告

我查了 `portal/landing-page`、`MobilePoster`、全局 theme tokens、公开 invite 页，以及控制台警告。结论：现在不是某一两个文字颜色的问题，而是 light mode 的设计系统和 poster 内部样式混在一起，导致整体偏金、对比不稳定、部分字体在白/浅金背景上容易看不清。

## 主要问题

1. **全局 light mode 颜色本身就偏金，不是中性 light mode**
   - `src/styles.css` 里 light mode 的 `--foreground`、`--card-foreground`、`--primary` 都是偏金棕色。
   - 这会让整个 portal 在 light mode 下文字、标题、按钮都自动带金色/棕色，不是正常黑灰色。
   - 所以你看到的“整个 light mode 都怪”，根源之一是全局 token 不是 neutral light palette。

2. **Landing poster 里大量颜色是 hardcoded gold，不跟 theme 走**
   - `MobilePoster` 里面还有很多固定色：`#f0cf7a`、`#e6c473`、`#d4aa50`、`rgba(212,170,80,...)`。
   - 这些在 dark mode 看起来像高级金色，但在 light mode 会变成脏黄、发灰、或者直接影响内容可读性。
   - 比如 QR 区、分隔线、装饰角、CTA、glow、logo ring、chip 等都还在用固定金色。

3. **Light mode 的背景仍然残留金色/奶油色，不是“正常背景”**
   - 虽然之前改淡了，但 `ctaBg` 还是 `#fffdf5/#fbf5e3/#f4ead0`，preview wrapper 也是 `#efe7d6`。
   - 公开 invite 页 light 背景也是 `#fdf6e6/#f6efe1/#efe7d6`。
   - 这就是为什么内容还会被 gold/cream 背景影响。

4. **渐变文字方案在 light mode 不稳定**
   - `gold()` 用 `background` + `backgroundClip: text` + `color: transparent` 做渐变文字。
   - 控制台已经出现 React 警告：不要混用 `background` shorthand 和 `backgroundClip`，这会在 rerender 时造成样式 bug。
   - 结果就是某些文字可能看起来发虚、断层、甚至某些状态下“透明看不到”。

5. **Light mode 下文字层级不统一**
   - 有的文字用 poster palette：`t.text/t.body/t.muted`。
   - 有的用 Tailwind semantic：`text-foreground/text-gold`。
   - 有的直接写 hex/rgba。
   - 三套颜色系统同时存在，导致不是统一的 light mode，而是“深色设计强行套白底”。

6. **Portal side panel 也会受影响**
   - `Share & Download`、`Your Invite Link` 这些面板仍大量使用 `text-gold`、`border-gold`、`bg-gradient-to-r from-gold to-amber-400`。
   - 如果全局 light token 继续偏金，右边控制区也会看起来不清爽、不正常。

7. **SSR/default dark 会造成主题切换闪烁**
   - `__root.tsx` 里 `<html className="dark">` 固定默认 dark。
   - `useTheme()` 初始也是 dark，再从 localStorage 切 light。
   - 所以 light mode 会有一次 dark → light 的切换过程，样式更容易出现闪烁和 rerender 警告。

8. **有一些未使用的视觉组件残留**
   - `FloatingShapes`、`BarChartFlourish`、`Sparkline`、`TickerTape` 都定义了但没有使用。
   - 这不是直接 bug，但说明这个 poster 的设计经历过多轮堆叠，样式没有系统性收口。

## 建议修复方向

1. **先重建 light mode 的全局 tokens**
   - 背景改成纯白/浅灰。
   - 正文改成 charcoal/dark neutral。
   - gold 只作为 accent，不再作为默认 foreground。

2. **给 `MobilePoster` 建一套真正的 light palette**
   - `pageBg/surface/cardBg/ctaBg` 全部改成白、浅灰、非常淡的 warm gray。
   - 正文、标题、muted、border 全部明确区分。
   - 金色只用于 logo、重点数字、小装饰，不再铺满背景。

3. **替换 hardcoded gold 装饰色**
   - 把固定 `#f0cf7a/#d4aa50/rgba(212,170,80...)` 改成 theme-aware token。
   - light mode 用更深、更少、更克制的 accent。

4. **修复渐变文字样式警告**
   - 不再在同一个 inline style 混用 `background` shorthand 和 `backgroundClip`。
   - 改用 `backgroundImage` / `WebkitBackgroundClip` / `color`，或者 light mode 直接用 solid text color。

5. **单独处理 portal landing page 外壳**
   - `FitPoster` 外围 light background 从 `#efe7d6` 改成 neutral。
   - 右侧下载/分享面板按钮和提示文字也改成 light-safe contrast。

6. **做一次可读性 QA**
   - 检查 hero、stat strip、Company Introduction、Core Focus、Estimated Returns、CTA/QR、Footer。
   - 检查 desktop preview 和手机尺寸。
   - 检查 PDF/PNG capture 不再出现透明/丢字。

## 总结

问题的根源是：light mode 没有被当成独立设计来做，而是 dark-gold 视觉直接反转/淡化，所以背景、文字、装饰、按钮全部互相污染。下一步应该系统性重做 light palette，而不是继续单点改某几个字。