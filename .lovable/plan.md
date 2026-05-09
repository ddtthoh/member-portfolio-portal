
# 在 Portfolio Hero 加回比例 bar（不破坏现有设计）

## 思路

之前砍掉的是**粗厚的 segmented progress bar**（retail dashboard 味）。现在要加回的是**一根 1px 高的三色 hairline 比例条**，作为 hero 数字下方装饰金线的"信息化升级版"——既保留私行编辑式语感，又把三资产占比一眼可视。

关键纪律：
- **极薄**：`h-px`（1px），最多 `h-0.5`（2px）。绝不回到 `h-1.5`/`h-2` 那种粗条。
- **窄宽**：跟现有金色装饰线对齐宽度（`w-40` 左右，约 160px），不是横跨整卡。这样它读起来是"凭证封蜡线"，不是进度条。
- **去圆角**：`rounded-none`，避免胶囊感（胶囊=retail）。
- **柔和透明度**：三段颜色用 `/70` 透明度，避免色块刺眼。
- **替换而非新增**：直接**替换**现有那根纯金 `h-px w-16 bg-gold/40` 装饰线。位置不变、视觉权重不变，只是把"装饰"升级成"信息"。

## 视觉结构

```text
PORTFOLIO · TOTAL ASSETS                              👁

$ 73,420.00
████████████░░░░░░░░░░░░░░░░░░░░░    ← 1px 三色 hairline，宽 ~160px
Premium Tier  ·  updated just now

──────────────────────────────────────
STAKING            USD         REWARDS
$50,000.00         $12,300.00  $11,120.00
68.1%              16.8%       15.1%
54 days · since…   —           —
```

三段比例严格按 `staking / usd / rewards` 占比分配宽度，颜色：
- Staking 段：`bg-gold/80`
- USD 段：`bg-gold/40`
- Rewards 段：`bg-gold/20`

**全部金色不同透明度**，不引入新色相。这样保持 holdings 页"纯金 + muted"二色纪律不破。资产三色（cash/earnings/participation）依然只属于 asset-analysis 页 gauge。

## 手机端如何呈现

桌面和手机**用同一根 bar**，无需特例：
- bar 本身宽度 `w-40 sm:w-48`，1px 高度，在 320px+ 屏宽都能完整显示。
- 位置：紧贴在 hero 数字下方 `mt-5`，跟现有金线位置一致。
- 手机端因为底部三栏改成竖排堆叠（label-金额左右对齐），三栏不再有"水平比例视觉"，**这根 bar 反而成为手机端唯一的占比可视化入口**，价值更大。

## 遮蔽行为

`showAmount=false` 时：
- 三段比例 bar **保持显示**（占比是结构信息，不是金额隐私，跟百分比文字一致逻辑）。
- 如果用户希望连 bar 也遮蔽，可以折中改成：隐藏态把 bar 替换成纯 `bg-muted/30` 的 1px 线（保留装饰、抹去信息）。**默认推荐前者**（保持显示），跟现在百分比文字不被遮蔽的策略一致。

## 隐藏态可选项（请选一个）

- **A** 隐藏态 bar 仍按比例显示（与百分比文字策略一致，推荐）
- **B** 隐藏态 bar 退化为单色 muted hairline（更彻底的隐私）

## 改动文件

仅 `src/components/staking-overview-card.tsx`：
1. 删除现在的 `<div className="mt-5 h-px w-16 bg-gold/40" />`。
2. 替换为一个 flex 容器，内含三个 `h-px` 段，宽度按 `staking/total`、`usd/total`、`rewards/total` 百分比设置（用内联 `style={{ width: '68.1%' }}`），容器整体宽度 `w-40 sm:w-48`。
3. 容器 `rounded-none overflow-hidden`，加 `bg-border/30` 兜底。
4. 隐藏态分支按所选选项 A/B 处理。

**不改动**：
- props、i18n、底部三栏排版、眼睛 toggle 行为、staking 表格、`useWallet`、asset-analysis 页。

## 验收

1. 卡片整体仍只见金色 + muted，无新色相引入。
2. bar 1px 高、≤200px 宽，绝不读起来像"进度条"，而是"封蜡线"。
3. 888px 视口和 375px 视口都正常显示，不溢出、不换行。
4. 三段宽度精确反映 `staking/usd/rewards` 占比，刷新数据后宽度跟随变化。
5. 眼睛切换：金额遮蔽，bar 行为按选定的 A 或 B 表现。
