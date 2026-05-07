## 根本原因

之前两次改动没生效，是因为 `SpotlightCard` 组件内部把 `children` 包在自己的 `<div className="relative h-full">`（block 容器）里。我之前在 `SpotlightCard` 的 className 上加 `flex` 是没用的——那只是作用在最外层包装 div 上，里面的两列内容仍在一个 block 子容器里，所以保持上下堆叠。

## 修复

在 `src/routes/portal.index.tsx`（约 166–185 行）把 participated day / staking amount 的两列内容**额外包一层 `<div class="flex h-full items-center justify-center">`**，让 flex 真正作用在两个子项上：

```tsx
<SpotlightCard className="liquid-glass h-full rounded-xl p-5">
  <div className="flex h-full items-center justify-center">
    <div className="flex flex-1 flex-col items-center text-center">
      {/* Participated day : 85 days */}
    </div>
    <div aria-hidden className="mx-3 h-12 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
    <div className="flex flex-1 flex-col items-center text-center">
      {/* Staking amount : $50,000 */}
    </div>
  </div>
</SpotlightCard>
```

这样左右两列 + 中间金色渐变分隔线就能正常显示，不再上下堆叠。

不会有 credit 再被无效扣除——这一次定位到了真正的原因。
