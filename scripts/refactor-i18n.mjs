#!/usr/bin/env node
/**
 * Reads each portal-related TSX file, asks Lovable AI to replace hardcoded
 * user-visible English strings with `t('key')` calls, and accumulates a
 * complete en.json. Produces:
 *   - rewritten *.tsx files in place
 *   - src/i18n/locales/en.json (merged with existing keys)
 *   - scripts/.i18n-keys.json   (added/updated keys for downstream translation)
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const API_KEY = process.env.LOVABLE_API_KEY;
if (!API_KEY) {
  console.error("Missing LOVABLE_API_KEY");
  process.exit(1);
}

const MODEL = "google/gemini-3.1-pro-preview";

// (filePath, namespace) — namespace is the prefix where new keys go.
const TARGETS = [
  // shared chrome
  ["src/components/portal-shell.tsx",            "shell"],
  ["src/components/command-palette.tsx",         "palette"],
  ["src/components/mobile-fab.tsx",              "fab"],
  ["src/components/total-assets-gauge.tsx",      "components.totalAssets"],
  ["src/components/pl-calendar.tsx",             "components.plCalendar"],
  ["src/components/network-constellation.tsx",   "components.networkConstellation"],
  ["src/components/ticker-tape.tsx",             "components.ticker"],
  ["src/components/quiz-test.tsx",               "components.quiz"],
  ["src/components/report-shell.tsx",            "components.reportShell"],

  // portal pages
  ["src/routes/portal.index.tsx",                            "pages.overview"],
  ["src/routes/portal.deposit.tsx",                          "pages.deposit"],
  ["src/routes/portal.withdrawal.tsx",                       "pages.withdrawal"],
  ["src/routes/portal.promotion.tsx",                        "pages.promotion"],
  ["src/routes/portal.promotion.$promoId.tsx",               "pages.promotionDetail"],
  ["src/routes/portal.qna.tsx",                              "pages.qna"],
  ["src/routes/portal.qna.index.tsx",                        "pages.qnaIndex"],
  ["src/routes/portal.qna.company.tsx",                      "pages.qnaCompany"],
  ["src/routes/portal.qna.marketing.tsx",                    "pages.qnaMarketing"],
  ["src/routes/portal.staking.tsx",                          "pages.staking"],
  ["src/routes/portal.staking-plans.tsx",                    "pages.stakingPlans"],
  ["src/routes/portal.holdings.tsx",                         "pages.holdings"],
  ["src/routes/portal.asset-analysis.tsx",                   "pages.assetAnalysis"],
  ["src/routes/portal.network.tsx",                          "pages.network"],
  ["src/routes/portal.referral.tsx",                         "pages.referral"],
  ["src/routes/portal.transactions.tsx",                     "pages.transactions"],
  ["src/routes/portal.documents.tsx",                        "pages.documents"],
  ["src/routes/portal.support.tsx",                          "pages.support"],
  ["src/routes/portal.profile.tsx",                          "pages.profile"],
  ["src/routes/portal.qr-code.tsx",                          "pages.qrCode"],
  ["src/routes/portal.wallet-edit.tsx",                      "pages.walletEdit"],
  ["src/routes/portal.statement.usd.tsx",                    "pages.usdStatement"],
  ["src/routes/portal.statement.rewards.tsx",                "pages.rewardsStatement"],
  ["src/routes/portal.statement.credit-conversion.tsx",      "pages.creditConversionStatement"],
  ["src/routes/portal.statement.convert-credits.tsx",        "pages.convertCredits"],
  ["src/routes/portal.statement.transfer-usd.tsx",           "pages.transferUsd"],
  ["src/routes/portal.reports.index.tsx",                    "pages.reportsIndex"],
  ["src/routes/portal.reports.staking.tsx",                  "pages.reportsStaking"],
  ["src/routes/portal.reports.referral-rewards.tsx",         "pages.reportsReferral"],
  ["src/routes/portal.reports.team-rewards.tsx",             "pages.reportsTeam"],
  ["src/routes/portal.reports.leader-rewards.tsx",           "pages.reportsLeader"],
  ["src/routes/portal.reports.par-rank-rewards.tsx",         "pages.reportsParRank"],
];

const SYSTEM = `You are refactoring a React + TypeScript file to use i18next translations.

Strict rules:
1. Replace every user-visible English string with a call to t("KEY"). User-visible means: JSX text content, button labels, aria-label, title, placeholder, alt, toast messages, headings, table headers, empty-state copy.
2. DO NOT translate: import paths, JSX prop names, CSS classnames, route paths, type names, variable names, console.log, dev comments, format strings like "USDT" / "BEP20" / "USD" tokens that are codes (keep code tokens; but DO translate the surrounding sentence).
3. DO NOT translate: pure numbers, currency amounts, transaction IDs, hashes, hex strings, email addresses, URLs, dates, times.
4. DO NOT translate the brand "Lovable" or product brand names.
5. If the file does not already have \`useTranslation\`, ADD: \`import { useTranslation } from "react-i18next";\` and call \`const { t } = useTranslation();\` at the top of the relevant component(s). Add to every component that needs t().
6. Use existing key in the en.json provided when an exact English match already exists; otherwise create new keys under the namespace given. Pick descriptive names like "{namespace}.tableHeaders.date", "{namespace}.actions.submit", "{namespace}.empty.noResults".
7. Preserve the entire original file byte-for-byte except for the string replacements + useTranslation imports/calls. Do not change logic, types, formatting, comments, layout, JSX structure, classnames, or anything else.
8. For dynamic strings with interpolation like \`Hello \${name}\`, use \`t("key", { name })\` and store the value as "Hello {{name}}".
9. If a string is already wrapped in t("…"), leave it alone.
10. Return STRICT JSON: { "code": "<entire rewritten file>", "newKeys": { "key.path": "English value", ... } }. Do not include markdown code fences. The code must be a complete valid TSX file.`;

function buildUserPrompt(filePath, namespace, source, existingEn) {
  return `File: ${filePath}
Namespace for new keys: "${namespace}"

Existing en.json (use these keys when an exact match exists; do not create duplicates):
${JSON.stringify(existingEn, null, 2)}

Source file:
\`\`\`tsx
${source}
\`\`\`

Return JSON only.`;
}

async function callAI(messages) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": API_KEY,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.1,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway ${res.status}: ${text}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  return content;
}

function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flatten(v, key));
    else out[key] = v;
  }
  return out;
}

function unflatten(flat) {
  const out = {};
  for (const [k, v] of Object.entries(flat)) {
    const parts = k.split(".");
    let cur = out;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = v;
  }
  return out;
}

async function main() {
  const enPath = path.join(ROOT, "src/i18n/locales/en.json");
  const enRaw = JSON.parse(await fs.readFile(enPath, "utf8"));
  let enFlat = flatten(enRaw);

  const accumulated = {};
  let processed = 0;
  for (const [rel, ns] of TARGETS) {
    const abs = path.join(ROOT, rel);
    let source;
    try {
      source = await fs.readFile(abs, "utf8");
    } catch {
      console.log(`SKIP missing: ${rel}`);
      continue;
    }

    process.stdout.write(`[${++processed}/${TARGETS.length}] ${rel} ... `);
    try {
      const content = await callAI([
        { role: "system", content: SYSTEM },
        { role: "user", content: buildUserPrompt(rel, ns, source, unflatten(enFlat)) },
      ]);
      const parsed = JSON.parse(content);
      if (typeof parsed.code !== "string" || typeof parsed.newKeys !== "object") {
        throw new Error("bad shape");
      }
      await fs.writeFile(abs, parsed.code, "utf8");
      Object.assign(enFlat, parsed.newKeys);
      Object.assign(accumulated, parsed.newKeys);
      console.log(`+${Object.keys(parsed.newKeys).length} keys`);
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
    }
  }

  await fs.writeFile(enPath, JSON.stringify(unflatten(enFlat), null, 2) + "\n", "utf8");
  await fs.writeFile(
    path.join(ROOT, "scripts/.i18n-keys.json"),
    JSON.stringify(accumulated, null, 2) + "\n",
    "utf8",
  );
  console.log(`\nDone. Total keys in en.json: ${Object.keys(enFlat).length}. New this run: ${Object.keys(accumulated).length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
