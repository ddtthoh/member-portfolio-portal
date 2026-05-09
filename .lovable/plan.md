## 目标

让 `/portal/staking-plans` 顶部的 **Start Staking** 按钮：
1. **加深底色** — 不再被背景光透过去，金字看得清清楚楚
2. **保持高级感** — 黑金质感，不要俗气
3. **加 breathing glow** — 金色光晕周期性呼吸，抢眼但不闪烁刺眼

---

## 视觉方向

```text
       ╭──────────────────────────────────────╮
  · ✦ ·│   ✦   START   STAKING   ✦           │· ✦ ·
       ╰──────────────────────────────────────╯
       ↑ 深黑底 + 金色描边 + 呼吸金光 ↑
```

- **底色**：深黑 / 近乎纯黑的 surface（`bg-background` 之上叠一层 `bg-black/60`），加一点点金色微渐变让它不死板
- **描边**：金色 1px ring，hover 时变粗到 1.5px
- **文字**：保持 gold，但因为底色变深，对比度立刻拉满
- **呼吸光晕**：按钮外圈 `box-shadow` 在 2.8s 周期内从弱到强再回弱，循环。强度上限不超过现在 hover 状态，避免刺眼
- **Sparkles 图标**：保留两侧，呼吸时图标轻微 opacity 起伏（0.7 → 1）增加仪式感
- Hover：呼吸暂停定格在最亮，按钮微微上浮（保留现有 `-translate-y-0.5`）

---

## 技术实现

### 1. 在 `src/styles.css` 加一个 keyframes

```css
@keyframes gold-breathe {
  0%, 100% {
    box-shadow:
      0 0 18px -6px color-mix(in oklab, var(--gold) 35%, transparent),
      inset 0 0 12px color-mix(in oklab, var(--gold) 8%, transparent);
  }
  50% {
    box-shadow:
      0 0 38px -4px color-mix(in oklab, var(--gold) 70%, transparent),
      0 0 80px -10px color-mix(in oklab, var(--gold) 35%, transparent),
      inset 0 0 22px color-mix(in oklab, var(--gold) 18%, transparent);
  }
}

.animate-gold-breathe {
  animation: gold-breathe 2.8s ease-in-out infinite;
}
.animate-gold-breathe:hover {
  animation-play-state: paused;
}
```

### 2. `src/routes/portal.staking-plans.tsx` 里改按钮 className

把现在的 `bg-gradient-to-r from-gold/15 via-gold/25 to-gold/15` 替换为深黑底 + 极弱金色叠加：

```tsx
className="
  group relative overflow-hidden rounded-full
  border border-gold/50
  bg-[linear-gradient(135deg,#0a0a0a_0%,#141414_50%,#0a0a0a_100%)]
  px-10 py-6 text-base font-medium uppercase tracking-[0.25em] text-gold
  backdrop-blur transition-all
  hover:-translate-y-0.5 hover:border-gold/80
  animate-gold-breathe
"
```

去掉原本写死的 `style={{ boxShadow: ... }}`（因为 keyframe 接管了 box-shadow），保留 Sparkles 图标。

### 3. 可选小细节
- 按钮内部加一层 `::before` 或额外 `<span>` 做金色高光斜扫（hover 时 translate-x），不强制，先看呼吸效果是否够。

---

## 不动的部分
- 按钮位置（plans 上方）不变
- 文案 "Start Staking" 不变
- Dialog 内容不变

准备好就点 **Implement plan** 让我开做。
