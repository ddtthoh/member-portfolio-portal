目标：把 `/portal/qr-code` 在电话屏幕（390px / 375px / 320px）重新排版，确保没有横向溢出、文字不顶出屏幕、按钮和卡片都能正确缩放。

实施计划：

1. 修复外层 Portal 手机布局
- 给主内容动画容器加 `min-w-0` / `w-full`，避免子页面撑破 viewport。
- 手机端 header 右侧图标组压缩间距，防止顶部工具栏造成横向溢出。
- 必要时给主内容区域加 `overflow-x-hidden`，但优先修正实际宽度来源。

2. 重排 QR Code 页面本身
- 页面根节点改成 `w-full min-w-0 overflow-x-hidden`。
- `PageHeader` 在手机端缩小 padding，并让标题、描述、eyebrow 支持换行/截断，不再撑宽。
- “Verified Referral” badge 手机端改成 `max-w-full`、较小 tracking、可换行或截断，避免 uppercase letter-spacing 超宽。
- QR 卡片使用 `max-w-full` + `clamp()` 式尺寸，320px 也不会超出。
- referral link 区域改成安全的单列结构：链接文本永远 truncate，按钮全宽堆叠。
- “How it works” 每一步文字加 `min-w-0` / `break-words`，避免长翻译撑宽。

3. 验证
- 用浏览器在 390px、375px、320px 三个电话宽度检查页面截图。
- 同时检查 `document.documentElement.scrollWidth <= window.innerWidth`，确认没有横向滚动。
- 如果还有溢出，继续定位具体元素并修到无横向滚动为止。