## 问题

`src/routes/index.tsx` 顶部装饰背景：

```tsx
<div className="... opacity-60" style={{
  background:
    "radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--gold) 20%, transparent), transparent 70%), \
     radial-gradient(50% 40% at 0% 100%, color-mix(in oklab, var(--gold) 12%, transparent), transparent 70%)"
}} />
```

在 phone (≤640px) 上几乎看不到，原因有三：
1. 渐变尺寸用 `%`，在 430px 宽屏幕里两团光一共才 ~250px 直径，被 hero 内容完全遮住
2. gold 浓度只有 12–20%，又叠了 `opacity-60`，到手机上几乎透明
3. 位置在右上 / 左下角，phone 视口窄，光晕中心几乎被裁掉

## 方案

只针对 phone 做一次"略增浓 + 重新定位 + 放大半径"的覆盖，桌面端保持现状不变，做到"看得见但不抢眼"。

### 改动 1 — `src/routes/index.tsx`

把内联 style 抽成一个带 class 的层（保留桌面表现），新增 `landing-aura` class 用于 CSS 覆盖：

```tsx
<div aria-hidden className="landing-aura pointer-events-none absolute inset-0 opacity-60" />
```

（删除原 inline `background` 与 `style`）

### 改动 2 — `src/styles.css`（在 `@layer utilities` 内追加）

桌面默认（与现状视觉一致）：

```css
.landing-aura {
  background:
    radial-gradient(60% 50% at 80% 0%,  color-mix(in oklab, var(--gold) 20%, transparent), transparent 70%),
    radial-gradient(50% 40% at 0% 100%, color-mix(in oklab, var(--gold) 12%, transparent), transparent 70%);
}
```

Phone 端覆盖（≤640px）：让光晕变大、稍浓、位置上移到 hero 上方，叠加一束底部柔光。仍保持低饱和、不抢标题：

```css
@media (max-width: 640px) {
  .landing-aura {
    opacity: 0.85;
    background:
      radial-gradient(120% 70% at 75% -10%, color-mix(in oklab, var(--gold) 28%, transparent), transparent 70%),
      radial-gradient(100% 60% at 10% 110%, color-mix(in oklab, var(--gold) 18%, transparent), transparent 72%);
  }
}
```

要点：
- 用更大的 `%` + 负偏移让光晕中心稍微"探出屏幕"，phone 上能看到柔和的边缘衰减而不是一坨高光
- gold 浓度 20→28、12→18，仍远低于按钮的纯金色，不会与 CTA 抢视线
- `opacity` 提到 0.85，确保在 light mode 也能感知

### 改动 3 — light mode 二次保险（可选）

light mode 背景近白，gold 与白对比天然弱。在 phone 媒体查询内追加：

```css
:root:not(.dark) .landing-aura {
  /* phone + light mode 再稍提一档对比 */
  filter: saturate(115%);
}
```

只在 `@media (max-width: 640px)` 内启用，桌面/dark mode 不受影响。

## 不动

- 颜色 token、hero 文案、CTA、其它 portal 页面背景
- 入场动画时长（保持现有 1.8s 规则）
- aurora-bg / grid-fade 等其它装饰层

## 验收

- iPhone 14 (390/430) 视口：右上 + 左下能感受到一层金色暖光，但标题与按钮仍是视觉焦点
- 桌面 ≥1024：与改动前像素级一致
- light & dark mode 都能看到光晕，dark mode 不过曝
