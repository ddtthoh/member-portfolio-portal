## 问题诊断

现在 light mode 里只有 button (CTA) 是金色，标题、数字、品牌名 NASLAB 看起来都是深咖啡色。
原因在 `src/components/marketing/mobile-poster.tsx`：

- `gold()` 函数在 `theme === "light"` 分支被改成了纯深棕实色（`#5a3f0d / #3d2b06 / #2a1d04`），完全没有金色渐变。
- `palette()` light 分支的 `eyebrow / goldStrong` 也是深棕 `#7a5818`，所以 eyebrow 小字、装饰边框看起来偏咖啡，而不是金。
- 当时这样写是为了避免 html2canvas 在导出 PNG/PDF 时渲染不出 `background-clip:text` 渐变 —— 但页面预览不需要这个限制。

## 方案：屏幕预览用真金色渐变，导出仍走稳定实色

只动 `mobile-poster.tsx` 一个文件，分两层处理：

### 1. `gold()` light 分支改成真正的金色渐变（仅用于屏幕预览）

```text
default → linear-gradient(180deg, #d9ad55 0%, #a8771f 55%, #6d4a10 100%)
strong  → linear-gradient(180deg, #e6c473 0%, #b88a2a 45%, #6d4a10 100%)
dark    → linear-gradient(180deg, #b88a2a 0%, #6d4a10 100%)
```

用 `background-clip:text + color:transparent` 做出与 dark mode 一致的金属渐变质感，但锚点更深，确保在 ivory 白底上仍然清晰可读。

`exportMode` 分支保持现在的实色金（`#7a5818 / #5a3f0d / #3d2b06`），这样 PNG/PDF 导出依旧稳定，不会出现大金块 bug。

### 2. `palette()` light 分支微调，让金色"散落"在更多元素上

- `eyebrow`: `#7a5818` → `#a8771f`（更亮的金，HERO 等小标签更出挑）
- `goldStrong`: `#7a5818` → `#a8771f`
- `goldBorderStrong`: `rgba(122,88,24,0.45)` → `rgba(168,119,31,0.65)`（CTA / Tier 卡片金边更明显）
- `goldFaint`: `rgba(122,88,24,0.55)` → `rgba(168,119,31,0.55)`

背景 `pageBg` 维持白底，`text / body / muted` 维持深色 —— 正文段落保持高对比度，不动可读性。

### 3. 已经在用 `gold(...)` 的位置自动获益

文件里这些位置已经在调用 `gold()`，因此一改 `gold()`，下面这些元素在 light mode 就会自动变成金色渐变，不需要再改 JSX：

- HERO `NASLAB` 标题 (line 119)
- Hero 大金额 / 强调数字 (lines 150, 196, 262)
- "From 4.5% to 13.5% a month" 高亮百分比 (line 290)
- Tier section 标题与数字 (lines 326, 353, 438)
- 末尾 invite member id 大字号 (line 971)

### 4. 不在范围内

- 不动 dark mode（视觉保持不变）
- 不动文案、布局、字体、动效
- 不动正文段落颜色（保留 ivory 白底 + 深色 body 的高对比度）
- 不动 button / CTA 金色（已经是金色）
- 不动 portal 其它页面

### 5. 验收

切到 light mode 打开 `/portal/landing-page` 预览：
- NASLAB 品牌名、HERO 大数字、Tier "0.15 – 0.25%" 等关键数字呈金色渐变
- "From 4.5% to 13.5% a month" 中的百分比变金色
- eyebrow 小标签（HERO / TIER / FOCUS 之类）颜色更亮、更"金"
- 正文段落仍是深色，可读性不变
- 下载 PNG / PDF：导出文件里这些位置呈现实色金，没有大金块 / 透明字 bug

## 改动文件

- `src/components/marketing/mobile-poster.tsx` （仅 `gold()` 与 `palette()` 的 light 分支）
