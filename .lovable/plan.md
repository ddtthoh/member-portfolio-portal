## 修复：把 box header 字体换回 Cormorant Garamond

### 根因
Git 显示 `4e1b311` 这次改动把 `src/styles.css` 第 11 行的 `--font-serif` 从 `Cormorant Garamond` 改成了 `Fraunces`。所有 `font-serif` 的元素（box title、page header、tier 名 "Diamond" 等）都跟着换了字。和我上一轮的 light mode 颜色调整无关 — 是更早的一次改动。

### 改动（只一行）
**`src/styles.css` 第 11 行**

改回：
```css
--font-serif: "Cormorant Garamond", "Playfair Display", ui-serif, Georgia, serif;
```

### 顺带可选清理（不做也行）
`src/routes/__root.tsx` 第 48 行的 Google Fonts URL 现在还在加载 Fraunces。如果确认不再用，可以从 URL 里删 `family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&` 这一段，省一点字体下载。
- **不删也没问题**：Fraunces 只是被加载但未使用，不会再出现在页面上。
- **建议先只改 styles.css 一行**，确认视觉对了再决定要不要清理 fonts URL。

### 不改的东西
- `portal-ui.tsx`、`page-header.tsx` — 一行不动
- 上一轮的 light mode 颜色 token — 保留（你之前要求的"light mode 文字看得清"）
- `.dark` block — 完全不动

### 验证
改完截图 /portal 一张，确认 box header 字看起来回到圆润的 Cormorant Garamond 而不是更厚实的 Fraunces。