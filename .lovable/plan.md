## Box header 字体的真相 — 我到底改了什么

### 直接结论
我**没有**改任何 portal box header 的 `font-family`、`font-weight`、`font-size`，也**没有**碰 dark mode tokens。Box header 依然是这一行：

```
<h3 className="font-serif text-base font-semibold text-gold text-gold-shine md:text-lg">
```
(`src/components/portal-ui.tsx:64`)

`font-serif` 仍指向 `--font-serif: "Fraunces", "Cormorant Garamond", ui-serif, Georgia, serif`，没动过。

### 我上一轮真正改的清单
1. `src/styles.css` 的 **`:root`**（=只 light mode）颜色 token：
   - `--foreground` 金棕 → charcoal
   - `--primary` 金 → 深色
   - `--gold` `oklch(0.6 0.12 80)` → `oklch(0.55 0.12 80)`（轻微变深）
   - 其余 muted/border 改成 neutral
   - **`.dark` block 一行没动**
2. `src/components/marketing/mobile-poster.tsx` — 只是邀请海报组件，portal index 不显示它
3. `src/routes/portal.landing-page.tsx` — 只动了海报外层 wrapper 背景色
4. `src/routes/invite.$memberId.tsx` — 只动了公开邀请页背景色

`portal-ui.tsx`、`page-header.tsx`、`spotlight-card.tsx`、`__root.tsx`、字体 tokens、Google Fonts link **全部没动**。

### 那为什么"看起来变了"？
Box header 用的是 `text-gold` + `text-gold-shine`。`text-gold-shine` 是用 `var(--gold)` 做的金色渐变文字（CSS 在 `styles.css:358`）。我把 light mode 的 `--gold` 调深了 `oklch(0.6 → 0.55)`，所以**在 light mode 下** box header 的金色看起来会比之前深一些、闪光感弱一些 — 字形没变，颜色深浅变了。

**Dark mode 不该有任何变化**。如果你在 dark mode 下也觉得 header 不一样，可能是：
- (a) Fraunces 字体没加载完，回退到了 Cormorant Garamond / Georgia（和我的改动无关，是网络/字体加载问题，刷新可能就好了）
- (b) 你记忆中的对比，但实际像素是一样的
- (c) 你说的 "header" 不是 SectionHeader，而是 PageHeader 或别的组件 — 那我需要你截图确认

### 我建议的下一步（请选一个再让我执行）
我现在**不改任何代码**。请告诉我哪个最符合你想要的：

**Option A：把 light mode 的 `--gold` 改回原来的 `oklch(0.6 0.12 80)`**
- Light mode header 的金色就和之前完全一样
- 全局 light mode 文字仍然是新的 charcoal（更易读）
- 这是最小改动

**Option B：完全 revert 我上一轮所有 light mode token 的改动**
- 整个 light mode 回到 "金棕 foreground" 的旧样子
- 等于推翻你之前 "light mode 字体看不到" 那条要求
- 你之前改 light mode 的 credit 也等于白花

**Option C：你给我一张"之前 vs 现在"的截图**
- 我对比像素，定位到底哪里变了再精准修
- 不再瞎猜

如果是 dark mode 真的也不一样，请告诉我是哪一个 box（截图最好），不然我无法不靠猜测就修复。