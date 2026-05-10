## 目标

去掉所有"模糊"效果，只保留干净的「滚动渐入/渐出」—— 上滚下滚都触发，元素进入视口淡入+轻微上移，离开视口淡出复位。

## 当前问题

上一轮加了 `blur(28px)`、`rotateX(6deg)` 和 catch-all 选择器，导致：
- 下半页元素卡在 `blur(28px)` 模糊态，渗到视口里 → "下半页都是蒙的"
- `rotateX + perspective` 影响某些 page 滚动 → "滚不下去"
- `.portal-page > div` 命中所有布局容器 → 整页都被加效果

## 修复方案

### `src/styles.css`
1. **删除所有 `filter: blur(...)`**（from / to / 类样式 / transition）
2. **删除 `rotateX(...)` 和 `.portal-page { perspective }`**
3. **降幅度**：translateY 140 → **40px**，去掉 scale（保持 1）
4. **缩小 range**：`entry 0% cover 25%` —— 元素一进视口就开始，画面 1/4 处完成，确保下半页内容清晰
5. **收紧选择器**：去掉 `.portal-page > :where(div, section, article, form)` catch-all，只对 `.reveal-on-scroll`、`[data-reveal]`、`.portal-reveal-target`、`.portal-page > .liquid-glass`（仅直接子）生效
6. 删除大面积 `will-change`

### `src/hooks/use-portal-reveal.ts`
- `revealSelector` 去掉 `.portal-page > section/article/form/div`，只保留 `[data-reveal]`、`.portal-reveal-target`、`.liquid-glass`
- 双向 IntersectionObserver 逻辑保留

## 最终效果
- 元素进入视口：opacity 0→1、translateY 40px→0
- 元素离开视口：复位，再次进入再次播放
- 没有任何模糊、没有 3D 翻转、不影响布局和滚动

## 涉及文件
- `src/styles.css`
- `src/hooks/use-portal-reveal.ts`

不动业务/布局/page 组件。