
## Goal

Build a world-class, high-end customer-unique referral landing page at `invite.naslabtec.com/{memberId}`, plus a portal page "My Landing Page" where customers can preview, share, and download their personal version (PDF / PNG). Video upload + content editing live in an admin-only page (你之后传 video 进去就行).

This plan covers **landing page design + page wiring only**. Subdomain DNS、video MP4 都之后再处理。

---

## Visual Direction

**混合风格**：以 portal 的 luxury gold/black 为基底，叠加 futuristic / crypto-tech 元素：

- **底色**：深黑 `#0A0A0B` + 渐变 noise 纹理
- **主色**：现有 `--gold` (portal 同款) 作为奢华锚点
- **加分**：青色科技辉光 `oklch(0.78 0.14 200)` 作为 secondary accent（限量使用，不抢金色）
- **质感层**：
  - Liquid glass panels（已有 `liquid-glass` class，复用）
  - 半透明玻璃卡片带 backdrop-blur
  - Conic gradient 边框（gold → cyan → gold）扫光动画
  - Subtle grid background（CSS）+ 浮动光点
  - Gold particles / orbits 在 hero 区
- **Typography**：保留 portal 的 serif（标题）+ sans（正文）；标题加 `text-gold-shine` 渐变
- **Motion**：framer-motion hero 入场（fade + lift），数字 count-up，scroll-reveal（复用 `usePortalReveal`），CTA magnetic hover

整体感觉：**Apple keynote × 加密交易所 × 私人银行**。

---

## Landing Page Sections (基于你的 PDF)

```
/invite/{memberId}
────────────────────────────────
1. NAV (透明、sticky)
   logo  |  Why NASLAB · Packages · How it works · Contact  |  [Join Now] CTA

2. HERO (full viewport)
   - Eyebrow: "INVITED BY {referrerName} · ID {memberId}"
   - H1: "Earn While the Market Sleeps"
        sub: "Institutional-grade MEV trading, now open to you."
   - Sub: 1-2 行卖点
   - CTA primary: "Start Earning →"  (跳 /signup?ref={memberId})
   - CTA secondary: "Watch 2-min Video" (scroll to video section)
   - 右侧/背景：金色 orbit + 数字流 + glass card 显示 "Live ROI: 8.4% / mo"（demo 数字）

3. TRUST BAR
   - 横排 logos / metrics: "$XXM AUM · 12,000+ members · 36 months track record"

4. WHY NASLAB (3-column glass cards)
   - Ncore 2.0 AI Engine
   - MEV Strategy
   - Transparent On-chain
   每个 card 带 icon (lucide) + gold/cyan glow

5. HOW IT WORKS (numbered steps, horizontal on desktop / vertical mobile)
   01 Sign Up → 02 Choose Package → 03 Stake → 04 Earn Daily

6. PACKAGES (3 tiers, center one highlighted)
   ┌─────────────┬──────────────┬─────────────┐
   │  STANDARD   │   ADVANCE    │  PREMIUM    │
   │  4.5–7.5%   │  7.5–10.5%   │ 10.5–13.5%  │
   │  / month    │  / month *   │  / month    │
   │             │ MOST POPULAR │             │
   │  features   │  features    │  features   │
   │  [Choose]   │  [Choose]    │  [Choose]   │
   └─────────────┴──────────────┴─────────────┘
   底下小字: "Reference ROI range based on market conditions. Past performance does not guarantee future returns."

7. PROOF / NUMBERS (animated counters)
   - Total Rewards Distributed
   - Active Members
   - Avg Monthly ROI
   (placeholder 数字, 你之后能在 admin 改)

8. TESTIMONIAL / FOUNDER NOTE (一段引用，placeholder)

9. FAQ (accordion, 5–6 questions from PDF)

10. FINAL CTA (大字 + 按钮)
    "Start Your NASLAB Journey"
    "Invited by {referrerName}"
    [Join with this Invite →] (跳 /signup?ref={memberId})

11. FOOTER
    左: logo + tagline + © 2026 NASLAB Technologies
    中: links (Why · Packages · FAQ · Contact)
    右: socials (Telegram / X / Instagram / Website 4 个 icon)
    最底: "Invite ID: {memberId}" 小字
```

> 注：video section 这次先不放（你之后传 MP4 再加一个 section 8.5「See It In Action」嵌入 video player）。`?print=1` 模式下永远隐藏 video（PDF/PNG 不要 video）。

---

## Pages to Create

### 1. `src/routes/invite.$memberId.tsx` (PUBLIC)
- 完整 landing page
- Loader: fetch referrer info (name + member id) by member_id from `profiles` table
- 404 if member id invalid
- `?print=1` query: 隐藏 nav / 把 CTA 换成 QR code + URL 文字（适合 PDF/PNG 截图）
- Head meta: og:title / og:description / og:image (后续可加)

### 2. `src/routes/portal.landing-page.tsx` (CUSTOMER)
"My Landing Page" — 客户管理自己的邀请页：
- 显示自己的 invite URL: `invite.naslabtec.com/{myMemberId}`
- Copy URL 按钮
- QR code (复用现有 qr-code 逻辑)
- iframe preview of own landing page (缩小显示)
- 4 个下载按钮：
  - 📄 Download PDF (html2canvas + jsPDF, 抓 `?print=1` iframe)
  - 🖼 Download PNG (html2canvas)
  - 📱 Share to WhatsApp (wa.me link)
  - 🔗 Copy Link
- "Open Full Page" 按钮 → 新窗口打开自己的 landing page

加到 portal sidebar nav: "My Landing Page" (带 icon)。

### 3. `src/routes/portal.admin.landing-content.tsx` (ADMIN ONLY)
- Role-gated（用现有 user_roles + has_role 模式）
- Form 编辑 `landing_page_settings` 单行表：
  - Hero headline / subheadline
  - 3 个 package 的 features（JSON array）
  - Trust bar 数字
  - Stats 数字
  - Founder note text
  - FAQ items (JSON)
  - Promo video URL（之后传 MP4 用）
- 上传 MP4 到 `marketing-assets` bucket

> ⚠️ 注：admin page + DB schema 这次只搭骨架，content 全部先用 hardcoded defaults 写在 landing page 里（避免你还没填就空白）。表 + admin UI 后续 iteration 再连。

---

## Technical Details

**新组件**（都放 `src/components/landing/`）：
- `landing-nav.tsx`
- `hero-section.tsx`（含 framer-motion + orbit canvas）
- `why-section.tsx`
- `how-it-works.tsx`
- `packages-section.tsx`
- `stats-section.tsx`
- `founder-note.tsx`
- `faq-section.tsx`
- `final-cta.tsx`
- `landing-footer.tsx`

**新 CSS tokens**（加到 `src/styles.css`）：
- `--cyan-glow`
- `--landing-bg`
- `--gradient-hero`
- `--shadow-luxe`
- 新 keyframes: `orbit-rotate`, `glow-pulse-cyan`

**Dependencies 已有**: framer-motion ✅, lucide-react ✅, html2canvas + jsPDF（如果没有就 `bun add`）。

**Subdomain**：landing page 路由是 `/invite/{memberId}`。`invite.naslabtec.com` 做 CNAME 到主站后，需要做一个 subdomain → path rewrite（可以用 Cloudflare Worker 一行 redirect，或先用 `naslabtec.com/invite/xxx`，subdomain 之后再配）。**这次先把 path 版本做出来**。

---

## Out of Scope (这次不做)

- ❌ Video MP4 上传 / video section（你之后传）
- ❌ Subdomain DNS 配置
- ❌ Admin landing-content 表 + 编辑 UI（先 hardcoded，之后 iteration）
- ❌ Real PDF download（先放按钮 + 基础 html2canvas，PDF 排版后续优化）

## Deliverable After This Build

- 你访问 `/invite/{任何客户的 memberId}` 能看到一个完整、抢眼、世界级的 landing page
- 你访问 `/portal/landing-page` 能看到自己那一份 + share/download 工具
- 内容全是 hardcoded 高质量 placeholder，跟你 PDF 对得上
- 设计上能让你立刻判断「OK 这个我可以拿出去给客户」
