## 原因

现在没有上下滚动渐出效果，主要是因为代码走进了浏览器原生 `animation-timeline: view()` 分支后，`usePortalReveal` 直接 `return`，所以 JS fallback 不会给元素加 `.reveal-on-scroll / .is-revealed`。

而当前 CSS 的原生分支只写了：

```css
.portal-page > *:not([data-no-reveal])
```

在 `/portal/holdings` 实际页面结构里，`.portal-page` 的直接子元素只有一个 wrapper：

```text
.portal-page
  div.space-y-6
    card 1
    card 2
    card 3
    table card
    button row
```

所以动画只命中整个 `div.space-y-6`，不是里面每张卡片。这个 wrapper 一开始就在 viewport 里，滚动时不会让内部卡片分别 entry/exit，因此看起来“没有 scrolling 上下渐出 effect”。

## Fix plan

1. **保留原有 UI，不改页面内容**
   - 不动 cards、layout、data、视觉风格。
   - 只调整 reveal selector 和滚动动画逻辑。

2. **让 CSS 原生分支命中真正滚动的页面块**
   - 把 selector 从只选 `.portal-page > *` 改为同时覆盖：
     - `.portal-page > *:not([data-no-reveal])`
     - `.portal-page > * > *:not([data-no-reveal])`
   - 这样 holdings 页面里的每个 card/table/button row 都会独立淡入上移。

3. **避免父子双重动画造成整页一起动**
   - 对 `.portal-page > *` 这种 wrapper，如果它只是 layout 容器，取消 reveal。
   - 重点让实际内容块（第二层 children）承担 scroll fade。

4. **JS fallback 同步改成同样的 selector**
   - `usePortalReveal` 不再只扫描 `.portal-page > *`。
   - 改成扫描 `.portal-page > * > *:not([data-no-reveal])` 为主，同时保留必要的顶层 fallback。
   - 继续跳过 `sticky/fixed/style/script`，不影响 header/sidebar。

5. **效果参数保持你要的“渐出来”，不要模糊**
   - 只用 `opacity` + `translateY(40px -> 0)`。
   - 不加 blur、不加 3D、不加蒙层。
   - 上下滚动离开 viewport 后重置，重新进入时再淡入。

6. **验证**
   - 在 `/portal/holdings` 检查 Total Assets、Rewards、Asset Growth、Staking Plans、Refund button 是否分别随上下滚动淡入。
   - 顺手检查 `/portal` 和 `/portal/staking-plans` 不出现下半页蒙住或 scroll 卡住问题。