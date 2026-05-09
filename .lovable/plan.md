## 方案：三张 Tracking 卡统一加进度条

文件：`src/routes/portal.promotion.$promoId.tsx`

### Track 1 · RCB（线性里程碑）

- **进度条逻辑**：找到下一个里程碑（1 / 5 / 10 / 20 / 50 / 100），显示从上一个里程碑到下一个里程碑的进度百分比
- **示例**：当前 8 单 → 下一档 10 单 → 进度 = (8-5)/(10-5) = 60%
- **底部文案**：`Next milestone · 10 referrals · $50` + `2 more to unlock $50`
- 已填充段加 `gold-glow-bar`，末端金色光点呼吸（与 Naslab 卡完全一致）

### Track 2 · TCB（双门槛合并）

- **进度条逻辑**：取 RCB 完成度 与 AUM 完成度 的**最小值**作为单条进度（哪个慢算哪个，符合"两个都要满足"的语义）
- **示例**：当前 8 RCB / 8,500 USDT，目标 10 RCB / 5,000 USDT → RCB 进度 80%、AUM 已达 100% → 取 80%
- **底部文案**：`Next tier · 2.5% AUM` + 双行小字 `Need 2 more RCB · AUM ✓`（已达成的那个打钩，未达成的显示还差多少）
- 这样保留了"双门槛"语义，不丢信息

### Track 3 · Ranking（待后端"还差 X"指标）

- **数据扩展**：`RankingPromo` 增加 `nextRankProgress?: { current: number; target: number; unit: string; metricLabel: string }`
- **进度条逻辑**：用 `current / target` 算百分比，目前先 mock（例如：`current: 38, target: 50, unit: "leaders", metricLabel: "Qualified Leaders"`），后端接入时替换数值即可
- **底部文案**：`Next rank · Platinum · Rolex Daytona` + `12 more qualified leaders to unlock`
- 在 `currentRankIndex === lastIndex` 时不显示进度条，改为"Apex rank achieved"

### 共用进度条组件

抽出一个内联的 `<TrackProgress>` 子组件，放在 `RankingTrackCard` 内部，三张卡公用同一套样式：

```text
Next: <name>                              <pct>%
████████████░░░░░░░░░ • ← 末端光点呼吸
<X> more to unlock <reward/threshold>
```

样式与 Naslab 的 `TrackCard` 进度条完全一致：
- 背景 `bg-gold/10`，已填充段 `bg-gradient-to-r from-gold/70 to-gold` + `gold-glow-bar`
- 末端 `gold-glow-md` 光点
- 顶部小字两端对齐：左边写"下一目标"，右边写百分比
- 底部小字："还差 X 才到下一档"

### 不动的部分

- 不改下面三张 Ladder 表格（RCB Payout Ladder / TCB Tier / Ranking 表格）
- 不改顶部 meta 卡 / 底部 fine print
- TrackCard 的 `gold-aura` 边框 + 角落柔光保留

### 后端集成预留

为 Ranking 进度预留接口形状，后端只需补 4 个字段：

```ts
nextRankProgress: {
  current: number;       // 例如已合格 leader 数
  target: number;        // 下一段位门槛
  unit: string;          // "leaders" / "USDT" / "RCB"
  metricLabel: string;   // "Qualified Leaders"
}
```

---

## 给非技术用户的话

简单说：**三张 Tracking 卡都会加上和 Naslab 那张一模一样的金色进度条**。RCB 显示离下一个里程碑还差几单；TCB 显示两个条件里慢的那个的进度（哪个拖后腿就算哪个）；Ranking 卡先 mock 出"还差多少 qualified leader 到下一段位"，等后端把真实指标接上就能直接显示。