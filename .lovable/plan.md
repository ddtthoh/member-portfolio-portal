## 目标

在 `/portal/staking-plans` 页面 plans grid 下方加一个 **"Start Staking"** 按钮，点击弹出一个高级感的 Dialog，让客户选择 plan + 输入金额，提交后显示 toast。

---

## UI 设计

### 1. 触发按钮（plans grid 下方）

居中、金色描边的大号 CTA：

```text
                  ┌─────────────────────────────┐
                  │   ✦  Start Staking  ✦       │
                  └─────────────────────────────┘
```

- 用 `liquid-glass` + 金色渐变 ring，hover 微微上浮
- 文案: "Start Staking"

### 2. Dialog 内容

```text
┌─────────────────────────────────────────────┐
│  Start Staking                              │
│  Choose your plan and enter staking amount  │
├─────────────────────────────────────────────┤
│  PLAN                                       │
│  [ Standard Lite ▾ ]  ← Select 下拉         │
│  Min $100  •  ROI 0.15% – 0.25% / month    │
│                                             │
│  AMOUNT (USD)                               │
│  ┌─────────────────────────────┐  Wallet:  │
│  │ $ 1,000.00                  │  $5,000   │
│  └─────────────────────────────┘  [Max]    │
│  Must be a multiple of $100, min $100       │
│                                             │
│  [ Min ] [ +$500 ] [ +$1,000 ] [ Max ]     │
│                                             │
│  ─────────────────────────────────────────  │
│  Est. monthly reward                        │
│  $1.50 – $2.50                              │
│                                             │
│  [ Cancel ]              [ Confirm Stake ] │
└─────────────────────────────────────────────┘
```

**字段细节:**
- **Plan 选择**: shadcn `Select`，默认选当前页第一个 plan；用户也可以从外部点击某张 plan card 直接预选（card 也变成可点击）
- **Wallet 余额**: 从 `useWallet().wallet.usd` 读取，右上角显示 `Wallet: $X.XX`
- **Max 按钮**: 把余额取整到 $100 倍数填入
- **快捷键**: Min（=plan.minAmount）、+$500、+$1000、Max
- **预估月收益**: 实时计算 `amount × ROI 下限` 到 `amount × ROI 上限`
- **Confirm**: 显示 `toast.success("Staking submitted", { description: "..." })`，关闭 Dialog

### 3. 校验规则

提交按钮 disabled 当：
- 金额 < plan.minAmount
- 金额 % 100 !== 0
- 金额为空 / NaN

错误时输入框下方显示红色 hint，例如 "Amount must be a multiple of $100" 或 "Minimum for this plan is $1,000"。

---

## 技术实现（开发参考）

### 文件改动
- **修改** `src/routes/portal.staking-plans.tsx`：
  - 把 `plans` 数组里的 `roi` 字符串拆成结构化 `roiMin: 0.0015, roiMax: 0.0025`，方便计算预估收益（保留原 `roi` 字符串用于卡片展示）
  - 给每张 plan card 加 `onClick` 触发打开 Dialog 并预选该 plan
  - 在 grid 下方加 `<Button>` 触发 Dialog
- **新建** `src/components/start-staking-dialog.tsx`：
  - Props: `open, onOpenChange, plans, defaultPlanIndex`
  - 使用 `Dialog`, `Select`, `Input`, `Button` from shadcn
  - `useWallet()` 拿 USD 余额
  - `toast` from `sonner`

### 关键交互
- 输入框用 `inputMode="numeric"`，过滤非数字
- 显示金额用 `toLocaleString("en-US", { minimumFractionDigits: 2 })`
- Wallet < min plan 时禁用 Max，提示 "Insufficient balance"

### 暂不做
- 不写入数据库（提交后只 `toast.success`）
- 不扣减钱包余额
- 不创建 holdings 记录

---

准备好就点 **Implement plan** 让我开做。
