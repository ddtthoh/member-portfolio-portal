## 目标

1. **更明显**：把进入幅度、模糊、缩放都加大，再加一点点横向"翻页"感，让"读书式"揭开效果一眼可见。
2. **双向、可重复**：往下滚出现，往上滚回去会重新隐藏，再滚下来再次出现 —— 不是只触发一次。

## 当前问题

- 现在的实现一旦元素被标记 `is-revealed`，IntersectionObserver 就 `unobserve` 了，所以**往上滚再下来不会再播**。
- 原生 `animation-timeline: view()` 本来天然就是"双向的"（你滚回去它会反向播放），但 Safari / 部分浏览器不支持，会回落到一次性 JS 版本 —— 这就是你看到的"只往下有，往上没有"。
- 强度上：当前 translateY 82px / blur 18px / scale 0.965 —— 在大屏 + 内容已经很大很深色的卡片上确实偏含蓄。

## 实施计划

### 1. CSS（`src/styles.css`）—— 加大效果 + 让原生方案双向化

- **加大关键帧强度**（`portal-scroll-read`）：
  - `translateY`: 92px → **140px**
  - `blur`: 20px → **28px**
  - `scale`: 0.96 → **0.92**
  - 加一点点 `rotateX(6deg)` 让它有"页面翻起来"的微透视感（perspective 在父级 `.portal-page` 上设 1200px）
- **改 `animation-range`**：从 `entry 0% cover 48%`（只在进入时播）改为 `entry 10% cover 55%`，配合 `animation-direction` 默认行为 —— scroll-driven animation 本身就跟随滚动位置双向变化，所以**自动获得"上滚反向、下滚正向"**。
- 同样的 `is-revealed` 类样式调强一致。

### 2. JS Fallback Hook（`src/hooks/use-portal-reveal.ts`）—— 双向触发

把 IntersectionObserver 从"出现就 unobserve"改成**持续观察**：

- 元素进入视口（`isIntersecting === true` 且 `intersectionRatio > 0.12`）→ 加 `is-revealed`
- 元素离开视口（往上滚出去）→ 移除 `is-revealed`，回到隐藏态
- 不再调用 `unobserve`，所以可无限次往返

加一个 `rootMargin: "-10% 0px -10% 0px"`，让重新隐藏的临界点离屏幕边缘留点距离，避免在 viewport 边缘抖动。

### 3. 验证

在浏览器里打开 `/portal` 和 `/portal/holdings`：
- 慢速滚下 → 卡片明显从下方 + 模糊 + 略小，渐入到位
- 滚回顶部 → 卡片重新模糊、下沉、淡出
- 再滚下 → 再次出现
- 检查不同浏览器（原生 scroll-timeline 走 CSS 路径，Safari 走 JS 路径），两条路径都要双向

### 涉及文件

- `src/styles.css`（关键帧 + range + reveal-on-scroll 类）
- `src/hooks/use-portal-reveal.ts`（IntersectionObserver 双向逻辑）

不动业务代码、不动数据层。