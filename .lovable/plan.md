The five report pages show `components.reportShell...` because the shared `ReportShell` now calls new translation keys, but those keys were not added to the locale JSON files. When i18n cannot find a key, it displays the key name directly.

Plan:
1. Add the missing `components.reportShell` translation block to every locale file used by the app.
   - Keys: `filter`, `date`, `pickADate`, `memberId`, `resetAction`, `filterAction`, `exportAction`.
   - English values will be: `Filter`, `Date`, `Pick a date`, `Member ID`, `Reset`, `Filter`, `Export`.
2. Preserve the existing i18n structure and avoid touching generated/backend files.
3. Verify the leader rewards page no longer renders raw `components...` labels, and the same shared fix applies to all five pages:
   - Team Rewards
   - Leader Rewards
   - PAR Rank Rewards
   - Referral Rewards
   - Staking