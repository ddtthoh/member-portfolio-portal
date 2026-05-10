我已经定位到两个问题的来源：

1. **页面下面发蒙**：现在的 scroll reveal 同时用了 `filter: blur(...)` 和原生 `animation-timeline: view()`，元素还没进入触发范围时会保持模糊/透明，所以页面下方看起来像被蒙住了。
2. **不能上下重复渐出/渐入**：JS fallback 里元素一旦出现就 `unobserve`，所以只能执行一次；同时原生 CSS scroll animation 和 JS fallback 行为不一致，导致有些浏览器看不到重复效果。

修复计划：

1. **彻底去掉“蒙/糊”的视觉原因**
   - 移除 scroll reveal 里的 `filter: blur(...)`。
   - 不再让未进入视口的内容处于模糊状态。
   - 所有页面下方内容保持清晰，只允许透明度和轻微位移动画。

2. **禁用当前原生 `animation-timeline: view()` 方案**
   - 它在不同浏览器表现不稳定，也容易造成下方内容一直处于半透明/模糊状态。
   - 改为统一使用 JS 控制，保证 preview、Safari/Chrome、live 后行为一致。

3. **改成真正双向重复 scroll effect**
   - 元素进入视口：添加 `is-revealed`，淡入 + 上移。
   - 元素离开视口：移除 `is-revealed`，回到淡出 + 下移状态。
   - 不再 `unobserve`，所以可以无限次上下滚动重复。

4. **把效果调明显但不 heavy**
   - 不用 blur，不会发蒙，也更省性能。
   - 使用 `opacity + translateY + scale`，这是相对轻量且专业的做法。
   - 动画强度建议：`opacity 0.18 → 1`、`translateY 56px → 0`、`scale 0.985 → 1`，明显但不会像页面坏掉。

5. **保护首屏可读性**
   - 首屏已经在视口内的内容直接显示或只做很短延迟，避免打开页面时一片空/蒙。
   - 只有滚动进入/离开视口的块反复做动画。

6. **验证**
   - 在 `/portal/holdings` 慢慢向下、向上、再向下滚动，确认卡片和表格会重复淡入/淡出。
   - 检查页面下方没有任何 blur、蒙层、灰雾感。
   - 检查其他 portal 页面也不会发蒙。