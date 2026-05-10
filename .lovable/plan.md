## 现状

我上一次确实写了 reveal 程式（`src/hooks/use-portal-reveal.ts` + `src/styles.css` 加了 `.reveal-on-scroll` / `.is-revealed` CSS），并在 `PortalShell` 内呼叫 `usePortalReveal(location.pathname)`。

但视觉上没有任何变化，原因是 **时序错位**：

1. `PortalShell` 用 `<AnimatePresence mode="wait">` 包住 `<Outlet />`，配 `key={location.pathname}` 做页面过渡。
2. `mode="wait"` 会**先等旧页面 exit 动画跑完，再 mount 新页面**。
3. 我的 hook 跟着 `location.pathname` 重跑：cleanup → 立刻执行 effect → `requestAnimationFrame` 一帧后查 `.liquid-glass`。
4. 但这一刻，新页面的 DOM 根本还没 mount（旧页面还在 exit）。`querySelectorAll` 找到的是**旧页面的卡片**，给旧卡加 class、然后旧卡又被卸载了。
5. 新页面 mount 时，hook 不会再触发（依赖没变），新卡永远不会拿到 `reveal-on-scroll` class，所以**完全没有动画**。

另外我的 cleanup 只删 `dataset.revealInit` 标记，没有把已经加上的 class 清掉，所以即使时序对了，第二次访问同一页也会因为 `data-reveal-init` 已存在而被跳过。

## 修复方案

改成「**用 MutationObserver 监听 `<main>` 内子节点变动**，一旦看到没初始化过的 `.liquid-glass` / `[data-reveal]` 就立刻挂上 reveal」。这样跟 AnimatePresence 时序完全脱钩，不管什么时候 mount 都会被抓到。

### 改 `src/hooks/use-portal-reveal.ts`

逻辑改成：

```text
mount:
  找到 <main>
  建立 IntersectionObserver（threshold 0.12, rootMargin "0px 0px -40px 0px"）
    -> 元素进入 viewport 时 add .is-revealed
  
  function processNewElements():
    main 里所有 .liquid-glass, [data-reveal]
    过滤掉已经标记 data-reveal-init 的
    每个新元素：
      标记 data-reveal-init
      add .reveal-on-scroll
      若已经在 viewport 内（首屏卡片）→ 算 stagger delay (index * 80ms) → 下一帧 add .is-revealed
      否则 → io.observe(el)
  
  processNewElements()  // 处理首次 mount
  
  MutationObserver(main, { childList: true, subtree: true })
    -> 任何子节点变动时 processNewElements()

unmount (整个 portal 卸载时才会发生):
  断开两个 observer
```

不再依赖 `location.pathname`；hook 改成无参数版本。

### 改 `src/components/portal-shell.tsx`

把 `usePortalReveal(location.pathname)` 改成 `usePortalReveal()`。

### CSS 不用改

`src/styles.css` 里的 `.reveal-on-scroll` / `.is-revealed` / `prefers-reduced-motion` 已经写好，可以原样保留。

## 验证方式

修完后在 `/portal/staking-plans`：
- 首屏 plan 卡片会从下往上 24px 淡入，每张错开 80ms 像翻书一样。
- 往下 scroll 时，画面下方还没出现的 plan 卡片在进入 viewport 那一刻才淡入。
- 切到 `/portal`、`/portal/holdings` 等页面也一样有效。
- 系统偏好 reduce motion 时全部直接显示，不会卡。
