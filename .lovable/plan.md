## 改动

### 1. 顶栏移除 email 显示
`src/components/portal-shell.tsx` 第 170 行：删掉 `<span ... sm:inline>{user.email}</span>`，所有屏幕都不显示 email（侧边栏顶部已经显示了）。

### 2. 在 ThemeToggle 左边新增"促销"按钮
醒目设计：
- pill 胶囊形状，金色渐变填充 + 金色描边
- 持续呼吸光晕（`animation: promo-pulse 1.8s infinite`，模糊 radial gradient 在按钮周围扩散）
- hover 时缩放 1.04 + 描边/光晕加强
- 内置 sweep shine：hover 时一道白光从左扫到右
- 图标用 `Gift`（lucide），带金色 drop-shadow 发光
- ≥ sm 显示文字 "PROMO"，移动端只显示图标
- 点击跳转到 `/portal/promotion`

### 3. 新增 keyframes
`src/styles.css` 加入：
```css
@keyframes promo-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 0.95; transform: scale(1.08); }
}
```

## 改动文件
- `src/components/portal-shell.tsx`
- `src/styles.css`

效果：在 dark/light toggle 左边一个会持续金光呼吸 + hover 扫光的 PROMO 胶囊按钮，远比普通 icon button 更吸引眼球。
