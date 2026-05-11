/**
 * Derive an 8-digit member ID from a Supabase user UUID.
 * Stable, deterministic, kept in sync with portal.qr-code.tsx.
 */
export function deriveMemberId(userId: string | null | undefined): string {
  const raw = (userId ?? "").replace(/-/g, "");
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  return String(h % 99999999).padStart(8, "0");
}
