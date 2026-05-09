import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/portal/change-password")({
  component: ChangePasswordPage,
});

const schema = z
  .object({
    current: z.string().min(1, "Current password is required"),
    next: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password too long"),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  })
  .refine((d) => d.next !== d.current, {
    path: ["next"],
    message: "New password must differ from current password",
  });

function ChangePasswordPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const checks = passwordChecks(form.next);
  const score = checks.filter((c) => c.ok).length;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);
    // Verify current password by re-authenticating
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.current,
    });
    if (signInErr) {
      setSubmitting(false);
      toast.error(t("pages.changePassword.toast.wrongCurrent", "Current password is incorrect"));
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: form.next });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("pages.changePassword.toast.success", "Password updated successfully"));
    setForm({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <PageHeader
        eyebrow={t("account.label")}
        title={t("pages.changePassword.title", "Change Password")}
        description={t(
          "pages.changePassword.description",
          "Update the login password used to access your portal account.",
        )}
        actions={
          <div className="hidden items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />{" "}
            {t("pages.changePassword.secured", "Encrypted Channel")}
          </div>
        }
      />

      {/* Mobile-only secured badge */}
      <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-gold md:hidden">
        <ShieldCheck className="h-3 w-3 shrink-0" />
        <span className="truncate">
          {t("pages.changePassword.secured", "Encrypted Channel")}
        </span>
      </div>

      <div className="mt-4 grid w-full min-w-0 max-w-full gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        {/* === Form card === */}
        <SpotlightCard className="liquid-glass w-full min-w-0 max-w-full overflow-hidden rounded-2xl">
          <div className="border-b border-gold/10 px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-gold" />
              <h3 className="font-serif text-[15px] font-semibold text-gold">
                {t("pages.changePassword.title", "Change Password")}
              </h3>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 px-4 py-5 sm:px-5">
            <PasswordField
              label={t("pages.changePassword.current", "Current Password")}
              required
              value={form.current}
              onChange={set("current")}
              show={show.current}
              onToggle={() => setShow((s) => ({ ...s, current: !s.current }))}
              autoComplete="current-password"
              placeholder={t("pages.changePassword.currentPlaceholder", "Enter current password")}
            />

            <PasswordField
              label={t("pages.changePassword.next", "New Login Password")}
              required
              value={form.next}
              onChange={set("next")}
              show={show.next}
              onToggle={() => setShow((s) => ({ ...s, next: !s.next }))}
              autoComplete="new-password"
              placeholder={t("pages.changePassword.nextPlaceholder", "Enter new password")}
            />

            {/* Strength meter */}
            {form.next && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="-mt-2"
              >
                <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-background/40">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 rounded-full transition-all ${
                        i < score
                          ? score <= 1
                            ? "bg-destructive"
                            : score === 2
                              ? "bg-amber-400"
                              : score === 3
                                ? "bg-gold"
                                : "bg-emerald-400"
                          : "bg-border/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-gold/70">
                  {strengthLabel(score, t)}
                </div>
              </motion.div>
            )}

            <PasswordField
              label={t("pages.changePassword.confirm", "Confirm New Login Password")}
              required
              value={form.confirm}
              onChange={set("confirm")}
              show={show.confirm}
              onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              autoComplete="new-password"
              placeholder={t("pages.changePassword.confirmPlaceholder", "Re-enter new password")}
              error={
                form.confirm.length > 0 && form.confirm !== form.next
                  ? t("pages.changePassword.mismatch", "Passwords do not match")
                  : undefined
              }
            />

            <div className="flex flex-col-reverse items-stretch gap-3 border-t border-gold/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold/55">
                {t(
                  "pages.changePassword.notice",
                  "You will remain signed in on this device.",
                )}
              </p>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90 sm:w-auto"
              >
                {submitting
                  ? t("pages.changePassword.submitting", "Updating…")
                  : t("pages.changePassword.proceed", "Proceed")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </SpotlightCard>

        {/* === Side: Requirements / Tips === */}
        <div className="w-full min-w-0 max-w-full space-y-4">
          <SpotlightCard className="liquid-glass w-full min-w-0 max-w-full overflow-hidden rounded-2xl">
            <div className="border-b border-gold/10 px-4 py-3 sm:px-5 sm:py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">
                {t("pages.changePassword.requirements.title", "Password Requirements")}
              </h3>
            </div>
            <ul className="space-y-2.5 px-4 py-4 text-sm text-foreground/85 sm:px-5 sm:py-5">
              {checks.map((c, i) => (
                <li key={i} className="flex min-w-0 items-start gap-2.5">
                  {c.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold/40" />
                  )}
                  <span
                    className={`min-w-0 flex-1 break-words leading-relaxed ${
                      c.ok ? "text-foreground/90" : "text-foreground/65"
                    }`}
                  >
                    {t(c.key, c.fallback)}
                  </span>
                </li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard className="liquid-glass w-full min-w-0 max-w-full overflow-hidden rounded-2xl">
            <div className="border-b border-gold/10 px-4 py-3 sm:px-5 sm:py-3.5">
              <h3 className="font-serif text-[15px] font-semibold text-gold">
                {t("pages.changePassword.tips.title", "Security Tips")}
              </h3>
            </div>
            <ol className="space-y-3 px-4 py-4 text-sm text-foreground/85 sm:px-5 sm:py-5">
              {[
                t(
                  "pages.changePassword.tips.1",
                  "Never reuse a password from another site.",
                ),
                t(
                  "pages.changePassword.tips.2",
                  "Avoid personal info such as birthdays or names.",
                ),
                t(
                  "pages.changePassword.tips.3",
                  "Store your password securely in a trusted password manager.",
                ),
              ].map((line, i) => (
                <li key={i} className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-[11px] font-semibold text-gold">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 break-words leading-relaxed">
                    {line}
                  </span>
                </li>
              ))}
            </ol>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  required,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="min-w-0">
      <Label className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold/80">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </Label>
      <div className="relative mt-1.5">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`pl-9 pr-10 ${error ? "border-destructive/60" : ""}`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gold/70 transition-colors hover:bg-gold/10 hover:text-gold"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-[11px] text-destructive">{error}</p>
      )}
    </div>
  );
}

function passwordChecks(pw: string) {
  return [
    {
      ok: pw.length >= 8,
      key: "pages.changePassword.requirements.length",
      fallback: "At least 8 characters",
    },
    {
      ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw),
      key: "pages.changePassword.requirements.case",
      fallback: "Mix of uppercase and lowercase letters",
    },
    {
      ok: /\d/.test(pw),
      key: "pages.changePassword.requirements.number",
      fallback: "At least one number",
    },
    {
      ok: /[^A-Za-z0-9]/.test(pw),
      key: "pages.changePassword.requirements.symbol",
      fallback: "At least one symbol (e.g. ! @ # $)",
    },
  ];
}

function strengthLabel(score: number, t: (k: string, f: string) => string) {
  if (score <= 1) return t("pages.changePassword.strength.weak", "Weak password");
  if (score === 2) return t("pages.changePassword.strength.fair", "Fair password");
  if (score === 3) return t("pages.changePassword.strength.good", "Good password");
  return t("pages.changePassword.strength.strong", "Strong password");
}
