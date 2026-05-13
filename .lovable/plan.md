# 排查报告

## 现象
`/portal/promotion/naslab-turkey` 页面（以及 `/promotion/rcb-tcb-community-ranking`）大量文本直接显示为：
```
pages.promotionDetail.officialOpening
pages.promotionDetail.intros.naslabTurkey
pages.promotionDetail.meta.location
...
```
即使切换到英文（en）也是如此。

## 根本原因
上一轮重构时分两步操作：
1. 把 `src/routes/portal.promotion.$promoId.tsx` 中所有硬编码英文替换为 `t("pages.promotionDetail.xxx")` —— **这一步成功了**（文件中已有 38 处 `t("pages.promotionDetail.…")`）。
2. 用 `node -e` 脚本把对应的英文字符串写入 `src/i18n/locales/en.json` —— **这一步在文件系统中没有持久化**。当前 `en.json` 里 `pages.promotionDetail` 只有最初的 6 个 key（`promotions / progressLabel / notFound / backToPromotions / details / progressDescription`），其它新增的 key 全部缺失。

由于 i18next 在找不到 key 时默认回退为打印 key 本身，再加上英文也没有这些 key，所以**所有语言（包括 en）都显示成原始 key 字符串**。

翻译脚本 `scripts/translate-locales.mjs` 是以 `en.json` 为源头去填充其它 13 个语言。源头缺失，所有语言都跟着缺失，所以 ko/zh/ja 等也全是裸 key。

## 受影响范围
仅限 `src/routes/portal.promotion.$promoId.tsx` 引入的新 key 命名空间 `pages.promotionDetail.*`，包括以下子组：
- `officialOpening`, `yourTracking`
- `meta.{location, event, window, payout, payoutValue}`
- `intros.{naslabTurkey, ranking}`
- `tracks.{participant, referral, rcb, tcb, ranking}`
- `titles.{personalStaking, referralStaking, participantIncentive, referralIncentive, rapidCommunityBuilder, topCommunityBuilder, communityRanking, rcbPayoutLadder, tcbTierStructure}`
- `subtitles.{participant, referral, tcb, ranking}`
- `labels.{yourVolume, currentTier, youEarned, qualifiedReferrals, rewardEarned, yourAum, reward, currentRank, rewardValue, projectedReward}`
- `progress.{nextTier, nextTierWith, topReached, remaining, maxBracket, nextMilestoneReferrals, moreToUnlock, nextTcb, moreRcb, rcb, moreUsdtAum, aum, nextRank, rankPctRemaining, rankRemaining}`
- `status.{achieved, locked, qualified, pending, apex, current, yes, included}`
- `table.{status, threshold, seats, hotel, flight, minRcb, minAum, rewardCol, rank, approxValue, pctOfAum, needRcbAum, rewardPercent}`
- `ladder.{referralsCount, rcbSubtitle, rcbFootnote, topTcbReached, apexRank, nextRankFootnote}`
- `footnotes.{eventRewards, ranking}`
- `ranks.{bronze, silver, gold, platinum, diamond, partner}`
- `rewards.{iphone17, marketingFund, rolexDaytona, carSubsidy, propertySubsidy}`

页面其它部分（`/portal/monthly-report`、staking 等）已翻译，**没受影响**。

## 顺带发现的次要问题
1. **RankingPromotion 中仍有少量英文未抽 key**：例如 `Next milestone · ${rcbNext} referrals`、`Next tier · ${nextTcb.pct}% AUM`、`Next rank · ${nextRank.name}`、`Top TCB tier reached.`、`Apex rank achieved — Partner tier.`、`Need ... RCB · ... USDT AUM`、`Attain the rank during ...`、`USD X for every referral with a minimum stake of Y USDT`、`{n} REFERRALS`、`All three tracks are calculated from ...`、`more to unlock $...`、第 1245 行还残留一个裸 `Your Tracking`。
2. **Rank/Reward 名称已改为存 i18n key**（如 `pages.promotionDetail.ranks.bronze`），但 `RankingPromotion` 里 `currentRank.name`、`nextRank.reward` 等地方直接渲染，没有再调用 `t()`，会把 key 原样显示。
3. **控制台 hydration 警告**：SSR 渲染 `<html lang="en">`，客户端检测后切到 `lang="ko"` 触发 mismatch；与本次问题无关，但同一份 i18n 设置导致。

## 修复方案

### 第 1 步（必做）—— 补全 `en.json`
在 `pages.promotionDetail` 下补齐上面列出的所有 key 与英文文案。一次性写入即可恢复英文显示。

### 第 2 步 —— 跑翻译脚本生成 13 种语言
```
node scripts/translate-locales.mjs
```
脚本会读取新的 `en.json`，对每种语言只补缺失的 key，已有翻译保留。

### 第 3 步（清理）—— 处理上面"次要问题"
- 把 RankingPromotion 中残留的硬编码英文抽成 key（progress 的 `topLeft` / `bottom`、fallbackFootnote、ladder 副标题、`{n} REFERRALS`、移动端 `Need ... RCB ... AUM`、底部脚注、第 1245 行 `Your Tracking`）。
- 在渲染 `currentRank.name` / `nextRank.reward` / `tier.name` / `tier.reward` 处包一层 `t(...)`，因为它们现在存的是 i18n key。
- 把第 1 步新增的 key（含次要问题里这一批）一并加入 `en.json`，再跑翻译脚本。

### 第 4 步（验证）
- 在 en / zh / ko 三种语言下访问 `/portal/promotion/naslab-turkey` 和 `/portal/promotion/rcb-tcb-community-ranking`，确认无任何 `pages.promotionDetail.*` 字面量出现。
- 控制台无 missing-key 警告（i18next debug 模式可临时打开确认）。

## 预期产出
- `src/i18n/locales/en.json` 新增约 70 个 key
- `src/i18n/locales/{zh,ja,ko,th,vi,id,hi,fa,ar,tr,es,it,de}.json` 各自补齐这 70 个 key
- `src/routes/portal.promotion.$promoId.tsx` 余下硬编码字符串清零
