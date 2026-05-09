
# Holdings 页"全资产 + Staking 时间"融合方案

目标：用一张卡同时讲清楚 5 个数字 —— **Total Staking、Staking Days、Total Assets、USD、Rewards Asset**，且不和 asset-analysis 页的半圆图重复。

下面给你 3 个方向，全部用大白话说清楚长什么样、为什么这么排。

---

## 方案 A · 金库总览（Vault Overview）—— 主推

一张大卡，分上下两层：

**上层（左右结构）**：左边是主角 —— Total Staking 金额（最大字号）+ 下方一行小字 `54 days · since Mar 16`。右边是配角 —— 一个小小的 Total Assets 数字（中等字号）+ 下方写 `total assets`。中间用一根**细金线 + 小金点**做分隔，呼应你之前喜欢的"connect 线"。

**下层（三列横排）**：USD · Rewards Asset · Staking 三个小数字横着平铺，每个前面一个**对应颜色的小圆点**（沿用 asset-analysis 的 `--asset-cash`、`--asset-earnings`、`--asset-participation` 三色）。下面再压一根极细的**三段式色条**（USD 多宽、Rewards 多宽、Staking 多宽，按比例），相当于把那个半圆图"压扁成一条线"。

```text
 TOTAL STAKING                          │   TOTAL ASSETS
 $50,000.00                             │   $73,420.00
 54 days · since Mar 16                 │   accruing · Premium
 ─────────────────────●─────────────────┴────────────────
 ● USD  $12,300    ● REWARDS  $11,120    ● STAKING  $50,000
 ▰▰▰▰▰▱▱▱▱▱▱▱▱▱▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
```

**好处**：
- 一张卡讲完所有事，主次分明（Staking 是主角，days 是它的注脚，total assets 是参考，三类资产是构成）
- 那条横向色条是 asset-analysis 半圆图的"扁平兄弟版"，同信息不同表达，不重复
- 极简、克制、私行感强

**坏处**：信息密度高，需要严格的字号层级把控。

---

## 方案 B · 时间轴金库（Timeline Vault）

把"时间"作为主线索：一根**水平的细金色时间轴**横穿整张卡。

- 时间轴左端是 `since Mar 16`，右端是 `today`，轴上一个金色游标停在 54 天的位置
- 时间轴**上方**正中浮出 Total Staking 大数字（主角）
- 时间轴**下方**左侧放 Total Assets，右侧把 USD / Rewards / Staking 三个小数字竖向堆叠（每个带色点）

```text
       $50,000.00     ← 54 days
 ●━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━○
 since Mar 16                              today

 TOTAL ASSETS              ● USD       $12,300
 $73,420.00                ● REWARDS   $11,120
                           ● STAKING   $50,000
```

**好处**：时间轴是 holdings 页独有的视觉符号，asset-analysis 没有，记忆点强。
**坏处**：需要 SVG，工程量比 A 大；时间轴在窄屏上需要折叠处理。

---

## 方案 C · 三环嵌套（Concentric Rings）

一张方卡，左侧一个**三环嵌套的小图**（外环 = 总资产构成的三色比例，中环 = stake 时间进度，圆心 = Total Staking 金额）；右侧文字列表列出 5 个数字。

**坏处**：和 asset-analysis 的半圆图视觉相似度太高，**容易撞**，不推荐。列出来只是让你知道我考虑过。

---

## 我的推荐

**方案 A**。原因：
1. 信息层级最清晰（主-辅-构成三层）
2. 横向色条 ≠ 半圆图，明确区分两个页面的角色
3. 改动可控：一个新组件 `staking-overview-card.tsx`，holdings 页删掉原来三块（两张小卡 + TotalAssetsGauge）
4. 移动端折叠简单：上层左右改上下，下层三列改两行

如果要"更有故事感"选 B；C 不建议。

---

## 实现细节（技术）

- 新组件：`src/components/staking-overview-card.tsx`
- holdings 页改动：删除当前两张 amount/days 小卡 + 删除 `<TotalAssetsGauge>` 块；插入新组件
- 数据来源：`useWallet()` 提供 staking/usd/rewards/total，staking amount/days 沿用现有写死的 50000 / 54（或后续接真实数据）
- 颜色复用：`--asset-cash`、`--asset-earnings`、`--asset-participation`、`--gold`
- 眼睛图标（隐藏金额）放在右上角，控制 Total Staking 显示
- i18n keys 新增：`pages.holdings.totalStaking`、`totalAssets`、`since`、`accruing`、`assetBreakdown`

请告诉我选 A / B（或者要我把 A 再调整某个细节），我就出最终方案给你 approve。
