
# Naslab 真实奖金引擎 — 实施方案

完全可以在 Lovable 上跑起来。你的整套制度（Staking + Referral + 15 层 Team + Rank + Leader + Par Rank + Global + Termination + Withdrawal）本质就是：**数据库 + 定时任务 + 服务端函数 + 后台审批**。Lovable Cloud（Postgres + pg_cron + 服务端函数）足够支撑。

下面是分 4 期落地的方案，每期都可单独验收。

---

## 阶段 1：基础设施 + Staking Plan（真实订阅 + 每日收益）

### 数据库（新建/调整）
- `staking_plans`：9 个固定计划（Standard/Advance/Premium × Lite/Plus/Pro），含 `tier`、`variant`、`stake_amount`、`base_daily_rate`（0.20% / 0.30% / 0.40%）、`team_level_cap`（3~15）、`referral_rate`（6/8/10%）
- `subscriptions`：`user_id`, `plan_id`, `stake_amount`, `started_at`, `terminated_at`, `status`（active/terminated/upgraded）
- `daily_rates`：每日由管理员录入实际 `rate`（允许 ±波动）
- `usdt_wallet` / `reward_wallet`：每个用户两个余额（对应 PDF "USDT Assets" / "Reward Assets"）
- `daily_profits`：每天每个订阅一行 `{subscription_id, date, profit_amount}`

### 定时任务（pg_cron，每日 00:05 UTC）
- 读取当日 `daily_rates`，对每个 active `subscription` 计算 `stake × rate`，写入 `daily_profits`，并把 profit 加到该用户的 `reward_wallet`

### 服务端函数
- `subscribeToPlan({ planId })`：从 USDT wallet 扣款 → 写 subscription
- `getMyDashboard()`：返回 wallets、active subscriptions、累计收益、当日收益

### 前端
- Portal 现有的 dummy "Total AUM / Total Members" → 改用真实 `SUM(stake_amount)` 与 `COUNT(active subscriptions)`
- "我的订阅"页：列出当前订阅 + 当日/累计利润

---

## 阶段 2：推荐网络 + Referral Reward + 15 层 Team Reward

### 数据库
- `profiles.sponsor_id`（uuid, 直接推荐人）+ `referral_code` (unique)
- `referral_rewards`：每次被推荐人新订阅时记录 `{from_subscription, to_user, plan_tier, percent, amount}`
- `team_rewards`：每日 cron 产出 `{user_id, date, level, source_subscription, profit, percent, amount}`
- 上线树查询：递归 CTE `get_upline(user_id, max_levels)`

### 触发器/函数
- 用户注册时若带 `?ref=CODE` → 写入 `sponsor_id`（终身绑定，不可改）
- `subscribeToPlan` 内：直接推荐人按其当前最高计划 tier 拿 6/8/10% → 进 `reward_wallet`
- 每日 cron 在算完 `daily_profits` 后：对每条 profit，沿 upline 走最多 15 层；每层用户根据其 **当前订阅的 plan.team_level_cap** 决定能不能拿这层；按 `{15,10,5,5,5,5,5,5,5,3,3,3,3,3,3}%` 计算

### 前端
- 推荐链接 + 二维码
- "我的网络"：层级树视图 + 每层人数 / 业绩 / 当日 team reward
- "我的奖金"：分类显示 Referral / Team / Rank / Leader / Global

---

## 阶段 3：Rank + Leader + Par Rank + Global Reward

### 数据库
- `ranks` 枚举：`bronze / silver / gold / platinum / diamond / partners`
- `user_ranks`：`{user_id, rank, achieved_at}`（历史），加一张 `user_current_rank` 视图
- `monthly_team_sales`：物化每月每用户新业绩（订阅金额 − 当月取消金额）
- `leader_rewards`：月结，按等级差 + compression upline 计算
- `par_rank_rewards`：每日，同级配对（Bronze↔Bronze 等）拿团队 trading profit 的 1%
- `global_reward_pool`：管理员每月录入公司净利润 → 10% 进池子 → 按 Platinum:1 / Diamond:3 / Partners:10 份额分配
- `global_rewards`：每月 5 号发放记录

### Rank 自动判定（每日重算）
- 满足 `min_staking` 计划 + 团队条件（3×下一级 / 3×10k 业绩）→ 升级
- 一旦达成永不降级（或按你的规则；待你确认）

### 定时任务
- 每日：rank 重算 → par rank reward 派发
- 每月 1 号 00:00：结算上月 `monthly_team_sales`
- 每月 5 号 09:00：发放上月 Leader Reward + Global Reward 到 `reward_wallet`

### 前端
- "等级"页：当前 rank、距离下一级差多少（业绩缺口 / 团队缺口）
- "Leader / Global 历史"明细

---

## 阶段 4：Termination + Withdrawal + 管理后台

### Termination
- `terminate_subscription({ id })`：按月数算手续费（你贴的 PDF 里说"12 个月后免手续费"，1–12 个月的费率待你提供具体百分比）
- 状态 → `terminated`，从下一日 cron 停止派息；upgrade 时重置 0 月计数

### Withdrawal
- `withdrawal_requests`：用户从 `reward_wallet` 申请到 USDT 地址；min 10 USDT，手续费 `max(3 USDT, 3%)`
- pg_cron 每月 **1 号 & 16 号** 把状态 `pending` 的批量转 `processing`，72h 内管理员人工/自动确认链上转账后置 `paid`

### 管理后台 `/portal/admin`（需 `admin` 角色，走 `has_role`）
- 录入每日 `daily_rates`
- 录入每月净利润（驱动 Global Reward）
- 审批/打款 withdrawals、KYC、deposits（现有表已具备）
- 看板：总 AUM、总会员、本月新业绩、奖金支出

---

## 需要你确认的关键点（影响金额，不能猜）

1. **Termination 1–12 个月手续费表**（PDF 只说"beyond 12 months no charge"，缺前 12 个月的具体百分比）
2. **Daily rate 来源**：是管理员每天手动录入，还是固定 0.20/0.30/0.40%？±波动是怎么决定的？
3. **Rank 是否会降级**（团队人数变少时）
4. **Sponsor 终身绑定** vs 可改 — 一般 MLM 终身绑定
5. **Withdrawal 起始日**：PDF 写 "1st of each month starting September 1, 2026"，现阶段先按 1 号 + 16 号双周制？
6. **货币**：全部 USDT 链上（哪条链？TRC20 / BEP20 / ERC20？影响地址校验）

---

## 工期与可见进度

| 阶段 | 内容 | 预计交付 |
|---|---|---|
| 1 | Staking + daily profit cron + wallet | 真实订阅可跑、每日自动入账 |
| 2 | 推荐树 + Referral + 15 层 Team Reward | 推荐链接可用、多层奖金可见 |
| 3 | Rank + Leader + Par + Global | 完整 6 项奖金 |
| 4 | Termination + Withdrawal + Admin | 端到端闭环，可上线运营 |

建议**先批准阶段 1**，跑通 staking + daily profit + wallet 这条主干，之后再叠加上层奖金，每一层都可以独立验证不影响线上。

请回答上面 6 个确认点（特别是 Termination 费率表），我就开始执行阶段 1。
