## 改动
让 **Rewards Breakdown** 横向 bar chart 的柱子变细，看起来更精致高级。

### 方案
在 `src/components/charts/rewards-breakdown-chart.tsx` 的 `<Bar>` 上加 `barSize`，并把圆角调小：

- 当前：柱子默认厚度（约 28-32px），圆角 6px
- 改成：`barSize={10}`，圆角 `[0, 4, 4, 0]`（细线条 + 小圆角，类似高端金融 dashboard 的风格）
- 同时把 `BarChart` 的 `barCategoryGap` 调大（如 `"45%"`），让柱子之间留出更多呼吸感

### 可选风格（告诉我选哪个）
| 选项 | barSize | 感觉 |
|---|---|---|
| A 推荐 | 10px | 精致细线，高级感强 |
| B | 6px | 极细发丝线，极简风 |
| C | 14px | 略细，保留一点存在感 |

默认用 A，要其他的告诉我。
