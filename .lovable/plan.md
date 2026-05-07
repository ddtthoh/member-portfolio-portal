## 改动

把 PROMO 按钮从"金光呼吸 + 渐变填充"改成更克制、更专业的风格，吸引力靠**微动画**而不是**亮度**：

### 新设计
- 中性玻璃底（`bg-background/40` + `backdrop-blur`）+ 细描边
- 文字默认柔和灰色，hover 才变金色
- Gift 图标轻微 tilt 动画（左右摆 ±6°，3.2s 一个循环），像礼物在打招呼
- 右上角小金点 + ping 扩散环（通知红点的金色版），让眼睛自然被吸引但不刺眼
- hover 时图标继续 rotate -10°（强化交互反馈）

### 替换 keyframes
`src/styles.css`：把 `promo-pulse` 换成更专业的 `promo-tilt`：
```css
@keyframes promo-tilt {
  0%, 100% { transform: rotate(-6deg); }
  50%      { transform: rotate(6deg); }
}
```

## 改动文件
- `src/components/portal-shell.tsx`（按钮重写）
- `src/styles.css`（替换 keyframes）
