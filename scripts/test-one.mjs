#!/usr/bin/env node
// Single-file test of AI refactor pipeline.
import fs from "node:fs/promises";

const API_KEY = process.env.LOVABLE_API_KEY;
const MODEL = "google/gemini-3.1-pro-preview";

const SYSTEM = `You are refactoring a React + TypeScript file to use i18next translations.
Replace every user-visible English string with t("KEY"). Add useTranslation if missing.
Do NOT translate: import paths, classnames, route paths, type names, code tokens like "USDT"/"BEP20".
Do NOT translate: numbers, currency, IDs, hashes, dates, URLs.
Preserve the file otherwise byte-for-byte (no formatting changes).
Return STRICT JSON only: { "code": "<full rewritten file>", "newKeys": { "key.path": "English value" } }`;

const file = "src/components/mobile-fab.tsx";
const ns = "fab";
const source = await fs.readFile(file, "utf8");

const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Lovable-API-Key": API_KEY,
    "X-Lovable-AIG-SDK": "vercel-ai-sdk",
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: `File: ${file}\nNamespace: "${ns}"\n\nSource:\n\`\`\`tsx\n${source}\n\`\`\`\n\nReturn JSON only.` },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  }),
});

console.log("status", res.status);
const data = await res.json();
const content = data.choices?.[0]?.message?.content ?? "";
console.log("---raw content---");
console.log(content);
console.log("---parsed---");
try {
  const parsed = JSON.parse(content);
  console.log("newKeys:", parsed.newKeys);
  console.log("code:");
  console.log(parsed.code);
} catch (e) {
  console.log("parse failed:", e.message);
}
