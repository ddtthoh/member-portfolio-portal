#!/usr/bin/env node
// Translate en.json into all locale files using Lovable AI Gateway.
// Preserves keys, ICU placeholders ({foo}), and JSON shape.
// Resumable: skips locales already at parity unless --force.

import fs from "node:fs";
import path from "node:path";

const LOCALES_DIR = "src/i18n/locales";
const EN_PATH = path.join(LOCALES_DIR, "en.json");
const API_KEY = process.env.LOVABLE_API_KEY;
const MODEL = process.env.MODEL || "google/gemini-3.1-pro-preview";

const LANGS = {
  zh: "Simplified Chinese (中文)",
  ja: "Japanese (日本語)",
  ko: "Korean (한국어)",
  th: "Thai (ไทย)",
  vi: "Vietnamese (Tiếng Việt)",
  id: "Bahasa Indonesia",
  hi: "Hindi (हिन्दी)",
  fa: "Persian/Farsi (فارسی)",
  ar: "Arabic (العربية)",
  tr: "Turkish (Türkçe)",
  es: "Spanish (Español)",
  it: "Italian (Italiano)",
  de: "German (Deutsch)",
};

const args = new Set(process.argv.slice(2));
const FORCE = args.has("--force");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));

// Collect leaf keys count for parity check
function countLeaves(obj) {
  let n = 0;
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object") n += countLeaves(v);
    else n++;
  }
  return n;
}

// Merge: keep existing translations where present; pass missing-only subtree to AI.
function diffMissing(enObj, locObj) {
  if (typeof enObj !== "object" || enObj === null) {
    return locObj === undefined ? enObj : undefined;
  }
  const out = {};
  let any = false;
  for (const [k, v] of Object.entries(enObj)) {
    if (v && typeof v === "object") {
      const sub = diffMissing(v, locObj?.[k]);
      if (sub !== undefined) {
        out[k] = sub;
        any = true;
      }
    } else {
      if (locObj?.[k] === undefined || FORCE) {
        out[k] = v;
        any = true;
      }
    }
  }
  return any ? out : undefined;
}

function deepMerge(base, add) {
  if (add === undefined) return base;
  if (typeof add !== "object" || add === null) return add;
  const out = { ...(base || {}) };
  for (const [k, v] of Object.entries(add)) {
    out[k] = v && typeof v === "object" ? deepMerge(out[k], v) : v;
  }
  return out;
}

// Reorder keys to match en.json structure
function reorderLike(template, target) {
  if (!template || typeof template !== "object") return target;
  const out = {};
  for (const k of Object.keys(template)) {
    if (k in (target || {})) {
      out[k] = template[k] && typeof template[k] === "object"
        ? reorderLike(template[k], target[k])
        : target[k];
    }
  }
  return out;
}

async function translateChunk(code, label, subtree) {
  const sys = `You are a professional human translator localizing a financial investor portal UI.
Translate the JSON values from English to ${label}.
RULES:
- Output ONLY a single JSON object with the EXACT same keys and structure. No markdown, no commentary.
- Translate VALUES only. Never translate keys.
- Preserve every placeholder exactly: {name}, {{count}}, %s, <b>, </b>, \\n, emojis, currency symbols, numbers.
- Use natural, professional, financial tone — not literal/machine translation.
- Keep brand-like terms (USDT, USD, BEP20, KYC, QR, P&L, PNL, USD) untranslated.
- For RTL languages keep punctuation natural.
- Keep length reasonable for UI buttons/labels.`;

  const user = `Translate this JSON to ${label}. Return ONLY the translated JSON object:\n\n${JSON.stringify(subtree, null, 2)}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${code}: ${res.status} ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`${code}: empty response`);
  return JSON.parse(content);
}

// Split a subtree into top-level chunks if too large
function splitIntoChunks(obj, maxKeysPerChunk = 60) {
  const entries = Object.entries(obj);
  // Always send full sub-objects atomically; group top-level entries into chunks.
  const chunks = [];
  let cur = {};
  let count = 0;
  for (const [k, v] of entries) {
    const c = v && typeof v === "object" ? countLeaves(v) : 1;
    if (count > 0 && count + c > maxKeysPerChunk) {
      chunks.push(cur);
      cur = {};
      count = 0;
    }
    cur[k] = v;
    count += c;
  }
  if (Object.keys(cur).length) chunks.push(cur);
  return chunks;
}

async function translateLocale(code) {
  const label = LANGS[code];
  const file = path.join(LOCALES_DIR, `${code}.json`);
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  const missing = diffMissing(en, existing);
  if (!missing) {
    console.log(`✓ ${code} already complete`);
    return;
  }
  const missingCount = countLeaves(missing);
  console.log(`→ ${code} (${label}): translating ${missingCount} missing keys`);
  const chunks = splitIntoChunks(missing, 80);
  let merged = existing;
  let i = 0;
  for (const chunk of chunks) {
    i++;
    process.stdout.write(`  chunk ${i}/${chunks.length}... `);
    let attempt = 0;
    while (true) {
      try {
        const translated = await translateChunk(code, label, chunk);
        merged = deepMerge(merged, translated);
        // Write incrementally so we can resume
        const ordered = reorderLike(en, merged);
        fs.writeFileSync(file, JSON.stringify(ordered, null, 2) + "\n");
        console.log("ok");
        break;
      } catch (e) {
        attempt++;
        console.log(`fail (${e.message.slice(0, 100)})`);
        if (attempt >= 3) throw e;
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        process.stdout.write(`  retry ${attempt}... `);
      }
    }
  }
  console.log(`✓ ${code} done`);
}

const targets = ONLY ? ONLY.split(",") : Object.keys(LANGS);
console.log(`Translating to: ${targets.join(", ")}`);
console.log(`en.json leaves: ${countLeaves(en)}`);

for (const code of targets) {
  try {
    await translateLocale(code);
  } catch (e) {
    console.error(`✗ ${code} failed: ${e.message}`);
  }
}
console.log("\nDone.");
