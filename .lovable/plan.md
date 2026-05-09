
# Holdings · Portfolio Hero 重新设计

## 一句话定位

把 Holdings 页头部改成"**一张 portfolio 凭证**"：**Total Assets** 是唯一的英雄数字，Staking 退成左下副信息，三资产拆分排在底部一行作脚注，右上角一个眼睛图标统一遮蔽全部金额。

## 为什么这样排

- **逻辑顺序**：这是 portfolio 页 → 用户第一眼想看"我总共有多少钱"。Total Assets 当主角才符合 holdings 页定位（Staking 主角属于 staking 详情页）。
- **专业感来源**：单一英雄数字 + 极端字号对比（~6:1）+ 大量留白 + 全部金色字号统一 hairline weight。这是 private banking 的视觉语言（瑞银、JP Morgan Wealth、Mercury），不是 retail trading dashboard。
- **去对称 = 去廉价**：当前版本两个大数字并排互抢，删掉中间金线 + 删掉右侧大数字 + 删掉底部三色进度条。专业排版靠**对齐和留白**，不靠装饰线。
- **遮蔽金额**：右上角一个眼睛图标 → 切换后**所有**金额（Total Assets / Staking / USD / Rewards / Staking 拆分）同步变 `••••••`，不是只遮一个。

## 视觉结构（ASCII 草图）

```text
┌──────────────────────────────────────────────────────────────┐
│  PORTFOLIO · TOTAL ASSETS                              👁    │
│                                                              │
│  $ 73,420.00                                                 │
│  ─────────────────────                                       │
│  Premium Tier  ·  updated just now                           │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                       │    │
│  │  STAKING            USD            REWARDS           │    │
│  │  $50,000.00         $12,300.00     $11,120.00        │    │
│  │  68.1%              16.8%          15.1%             │    │
│  │  54 days · since Mar 16    —             —           │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

要点：
- **顶部小标签** `PORTFOLIO · TOTAL ASSETS`：10px、tracking 0.2em、uppercase、gold。建立"凭证抬头"语感。
- **主数字** `$73,420.00`：text-6xl/7xl、font-light、tabular-nums、tracking-[-0.04em]、gold。下方一根 ~64px 的金色 hairline（h-px、不是分隔线、是装饰线），呼应支票/凭证。
- **副标签**：`Premium Tier · updated just now`，11px、muted。
- **底部三栏脚注**：横排 3 列对齐排版，每列：标签（10px uppercase muted）→ 金额（text-xl light gold）→ 占比（10px tabular muted）→ 可选的辅助行（Staking 列显示 `54 days · since Mar 16`，其它两列 `—` 或留空）。**不要色块、不要色点、不要进度条**。
- **去掉**：当前的左右两栏布局、中间金线+小金点、底部三色 segmented bar。

## 响应式

- 桌面（≥640px）：底部三栏 grid-cols-3。
- 移动（<640px）：底部三栏改成 grid-cols-1，每行左对齐 label / 右对齐金额，垂直堆叠。主数字降一档到 text-5xl。

## 眼睛遮蔽行为

- 单一 state `showAmount`，控制：主 Total Assets、底部 Staking/USD/Rewards 三个金额。
- 隐藏态展示 `••••••`（U+2022 圆点 6 个），保持 tabular-nums 字符宽度，避免布局抖动。
- 占比百分比和 `54 days · since Mar 16` 这类**非金额信息**不遮蔽。
- 图标位置：卡片右上角 absolute、gold 颜色、hover 透明度变化。

## 颜色与字重纪律

- 所有金额一律 `text-gold` + `font-light` + `tabular-nums` + `tracking-[-0.04em]`（小字号用 -0.02em）。
- 标签一律 `text-muted-foreground` + `uppercase` + `tracking-[0.18em]` + 10-11px。
- **不再使用**资产三色（cash/earnings/participation）作为高亮色 —— 那是 asset-analysis 页 gauge 的语言。Holdings 页保持纯金色 + muted 二色系，专业克制。

## 改动文件

1. **`src/components/staking-overview-card.tsx`** —— 重写。改名为 `PortfolioHeroCard` 或保留文件名但内部彻底替换。
2. **`src/routes/portal.holdings.tsx`** —— props 重命名以匹配新组件（主从对换：`totalAssets` 当主，`stakingAmount/days/since` 当副）。
3. **`src/i18n/locales/en.json`** —— 新增/调整 keys：
   - `pages.holdings.portfolioLabel` = "Portfolio · Total Assets"
   - `pages.holdings.tierSuffix` = "{{tier}} Tier · updated just now"
   - 复用已有的 `totalStaking` / `daysUnit` / `since` / `assetBreakdown` 标签。
   - 删除 `accruing` key（已不再使用）。

## 不改动的部分

- `useWallet()` hook 和数据流不变。
- 下方 staking plans 表格、Refund dialog 不变。
- asset-analysis 页 `TotalAssetsGauge` 不动（那是另一种语言，分工清楚）。

## 实现细节

- 主数字行使用 `<MetricValue size="xl">`，移动端通过 className 覆盖到 text-5xl。
- 装饰金线：`<div className="mt-4 h-px w-16 bg-gold/40" />`，仅装饰，无语义。
- 底部三栏分隔：用 `border-t border-border/40 pt-5 mt-6` 与上方主区分隔，**不用** SpotlightCard 嵌套。
- 三栏内部不用 flex gap，用 `grid grid-cols-3 gap-x-8` 保证字段顶对齐。
- 眼睛 toggle 用 `useState` 本地态，不持久化（刷新恢复显示）；如要持久化可后续接 localStorage。

## 验收标准

1. 一眼锁定 Total Assets，Staking 不抢戏。
2. 卡片整体只有金色 + muted 两个色温，无色块/色条/色点装饰。
3. 眼睛点击：4 个金额位同步切换 `••••••`，布局零抖动。
4. 888px 视口下底部三栏整齐对齐，主数字不换行。
5. 移动端 <640px 三栏改竖排，主数字降一档不溢出。
