export type ParsedQuestion = {
  category: "company" | "marketing";
  question: string;
  options: string[];
  correct_index: number;
};

/**
 * Parse plain text extracted from a .docx into questions.
 * Supported format (flexible):
 *
 *   [Company]              <- category header (or [Marketing] / [Marketing plan])
 *   1. What is ... ?
 *   A) Option one
 *   B) Option two
 *   C) Option three
 *   D) Option four
 *   Answer: B
 *
 * The category header applies to all subsequent questions until a new
 * header appears. If no header is given, defaults to "company".
 */
export function parseQuizText(text: string): ParsedQuestion[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: ParsedQuestion[] = [];
  let category: "company" | "marketing" = "company";

  let q: string | null = null;
  let options: string[] = [];
  let answerLetter: string | null = null;

  const flush = () => {
    if (q && options.length >= 2 && answerLetter) {
      const idx = "ABCDEFGH".indexOf(answerLetter.toUpperCase());
      if (idx >= 0 && idx < options.length) {
        out.push({ category, question: q, options: [...options], correct_index: idx });
      }
    }
    q = null;
    options = [];
    answerLetter = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+/g, " ").trim();

    // Category header [Company] / [Marketing] / [Marketing plan]
    const cat = line.match(/^\[?\s*(company|marketing(?:\s*plan)?)\s*\]?\s*[:：]?\s*$/i);
    if (cat) {
      flush();
      category = cat[1].toLowerCase().startsWith("market") ? "marketing" : "company";
      continue;
    }

    // Answer line
    const ans = line.match(/^(?:answer|ans|correct)\s*[:：\-]\s*([A-Ha-h])\b/i);
    if (ans) {
      answerLetter = ans[1];
      flush();
      continue;
    }

    // Option line: A) / A. / A、 / A:
    const opt = line.match(/^([A-Ha-h])\s*[\).．、:：\-]\s*(.+)$/);
    if (opt && q) {
      options.push(opt[2].trim());
      continue;
    }

    // Question line: starts with number "1." / "1)" / "Q1." etc
    const qm = line.match(/^(?:Q\s*)?\d+\s*[\).．、:：\-]\s*(.+)$/i);
    if (qm) {
      flush();
      q = qm[1].trim();
      continue;
    }

    // Continuation of current question if no options yet
    if (q && options.length === 0) {
      q += " " + line;
    }
  }
  flush();
  return out;
}
