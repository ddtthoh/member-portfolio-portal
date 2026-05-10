import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  UserCircle2,
  ShieldCheck,
  Mail,
  IdCard,
  Phone,
  MapPin,
  Globe2,
  CalendarDays,
  Users,
  Save,
  CheckCircle2,
  Lock as LockIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/profile")({
  component: ProfilePage,
});

// Aligned with app language options
const COUNTRIES = [
  { name: "United States", flag: "🇺🇸", dial: "+1" },
  { name: "China", flag: "🇨🇳", dial: "+86" },
  { name: "Indonesia", flag: "🇮🇩", dial: "+62" },
  { name: "Iran", flag: "🇮🇷", dial: "+98" },
  { name: "Saudi Arabia", flag: "🇸🇦", dial: "+966" },
  { name: "Spain", flag: "🇪🇸", dial: "+34" },
  { name: "Germany", flag: "🇩🇪", dial: "+49" },
  { name: "Turkey", flag: "🇹🇷", dial: "+90" },
];

function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const memberId = useMemo(() => {
    const raw = (user?.id ?? "").replace(/-/g, "");
    let h = 0;
    for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
    return String(h % 99999999).padStart(8, "0");
  }, [user?.id]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    national_id: "",
    dob: "",
    mobile_prefix: "+65",
    sponsor_id: "33095917",
    province: "",
    city: "",
    region: "",
    address: "",
    country: "",
    mobile_number: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone, national_id, dob, country, region, city, address")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm((f) => ({
            ...f,
            full_name: data.full_name ?? "",
            mobile_number: data.phone ?? "",
            national_id: (data as any).national_id ?? "",
            dob: (data as any).dob ?? "",
            country: (data as any).country ?? "",
            region: (data as any).region ?? "",
            city: (data as any).city ?? "",
            address: (data as any).address ?? "",
          }));
        }
        setLoading(false);
      });
  }, [user]);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.mobile_number,
        national_id: form.national_id || null,
        dob: form.dob || null,
        country: form.country || null,
        region: form.region || null,
        city: form.city || null,
        address: form.address || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(t("pages.profile.toast.error"));
    else toast.success(t("pages.profile.toast.success"));
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("account.label")}
        title={t("pages.profile.title")}
        description={t("pages.profile.description")}
        actions={
          <div className="hidden items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" /> {t("pages.profile.verifiedMember")}
          </div>
        }
      />

      {/* Identity hero */}
      <SpotlightCard className="liquid-glass mt-4 overflow-hidden rounded-2xl">
        <div className="relative px-5 py-5 sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_0%_0%,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_50%)]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-gold/5 ring-1 ring-gold/40"
              >
                <UserCircle2 className="h-9 w-9 text-gold" />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background ring-1 ring-gold/50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                </span>
              </motion.div>
              <div>
                <div className="font-serif text-xl font-semibold text-gold">
                  {form.full_name || user?.email?.split("@")[0] || t("pages.profile.memberFallback")}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-gold/70">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {user?.email ?? "—"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <StatPill label={t("pages.profile.status")} value={t("pages.profile.active")} className="sm:w-28" />
              <StatPill label={t("pages.profile.tier")} value={t("pages.referral.tiers.gold")} className="sm:w-28" />
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Form */}
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <SectionCard title={t("pages.profile.accountIdentity.title")} subtitle={t("pages.profile.accountIdentity.subtitle")}>
          <Grid>
            <ReadField icon={IdCard} label={t("pages.profile.memberId")} value={memberId} />
            <ReadField icon={ShieldCheck} label={t("pages.profile.status")} value={t("pages.profile.active")} badge />
            <ReadField icon={Mail} label={t("pages.profile.emailAddress")} value={user?.email ?? "—"} className="sm:col-span-2" />
          </Grid>
        </SectionCard>

        <SectionCard title={t("pages.profile.personalDetails.title")} subtitle={t("pages.profile.personalDetails.subtitle")}>
          <Grid>
            <Field label={t("pages.profile.name")} required>
              <Input
                value={form.full_name}
                onChange={(e) => set("full_name")(e.target.value)}
                placeholder={t("pages.profile.namePlaceholder")}
                disabled={loading}
              />
            </Field>
            <Field label={t("pages.profile.nationalId")}>
              <Input
                value={form.national_id}
                onChange={(e) => set("national_id")(e.target.value)}
                placeholder={t("pages.profile.nationalIdPlaceholder")}
              />
            </Field>
            <Field label={t("pages.profile.dob")}>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => set("dob")(e.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label={t("pages.profile.sponsorId")}>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
                <Input
                  value={form.sponsor_id}
                  readOnly
                  disabled
                  tabIndex={-1}
                  aria-readonly
                  className="pl-9 pr-9 bg-muted/30 cursor-not-allowed select-none"
                />
                <LockIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold/60" />
              </div>
            </Field>
          </Grid>
        </SectionCard>

        <SectionCard title={t("pages.profile.contact.title")} subtitle={t("pages.profile.contact.subtitle")}>
          <Grid>
            <Field label={t("pages.profile.mobilePrefix")}>
              <Select value={form.mobile_prefix} onValueChange={set("mobile_prefix")}>
                <SelectTrigger><SelectValue placeholder="--" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.dial} value={c.dial}>
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{t(`pages.profile.countries.${c.name.replace(/\s+/g, '')}`)}</span>
                        </span>
                        <span className="font-mono text-xs text-gold/80">{c.dial}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("pages.profile.mobileNumber")}>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
                <Input
                  value={form.mobile_number}
                  onChange={(e) => set("mobile_number")(e.target.value)}
                  placeholder={t("pages.profile.mobileNumberPlaceholder")}
                  className="pl-9"
                />
              </div>
            </Field>
          </Grid>
        </SectionCard>

        <SectionCard title={t("pages.profile.address.title")} subtitle={t("pages.profile.address.subtitle")}>
          <Grid>
            <Field label={t("pages.profile.country")}>
              <Select value={form.country} onValueChange={set("country")}>
                <SelectTrigger><SelectValue placeholder="--" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      <span className="flex items-center gap-2"><span>{c.flag}</span><span>{t(`pages.profile.countries.${c.name.replace(/\s+/g, '')}`)}</span></span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("pages.profile.region")}>
              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
                <Input value={form.region} onChange={(e) => set("region")(e.target.value)} placeholder={t("pages.profile.region")} className="pl-9" />
              </div>
            </Field>
            <Field label={t("pages.profile.province")}>
              <Input value={form.province} onChange={(e) => set("province")(e.target.value)} placeholder={t("pages.profile.provincePlaceholder")} />
            </Field>
            <Field label={t("pages.profile.city")}>
              <Input value={form.city} onChange={(e) => set("city")(e.target.value)} placeholder={t("pages.profile.city")} />
            </Field>
            <Field label={t("pages.profile.address.title")} className="sm:col-span-2">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gold/60" />
                <Input
                  value={form.address}
                  onChange={(e) => set("address")(e.target.value)}
                  placeholder={t("pages.profile.addressPlaceholder")}
                  className="pl-9"
                />
              </div>
            </Field>
          </Grid>
        </SectionCard>

        <div className="flex items-center justify-end gap-3 pt-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold/50">
            {t("pages.profile.auditNotice")}
          </p>
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? t("pages.profile.saving") : t("common.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}

function StatPill({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-lg border border-gold/20 bg-background/40 px-3 py-2 text-center ${className}`}>
      <div className="text-[9px] uppercase tracking-[0.22em] text-gold/60">{label}</div>
      <div className="mt-0.5 font-serif text-sm font-semibold text-gold">{value}</div>
    </div>
  );
}

function SectionCard({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <SpotlightCard className="liquid-glass rounded-2xl">
      <div className="border-b border-gold/10 px-5 py-3.5">
        <h3 className="font-serif text-[15px] font-semibold text-gold">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-gold/50">
            {subtitle}
          </p>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
    </SpotlightCard>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label, required, className = "", children,
}: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold/80">
        {label}{required && <span className="ml-1 text-gold">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ReadField({
  icon: Icon, label, value, className = "", badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; className?: string; badge?: boolean;
}) {
  return (
    <div className={className}>
      <Label className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold/80">
        {label}
      </Label>
      <div className="mt-1.5 flex items-center gap-2 rounded-md border border-gold/15 bg-background/40 px-3 py-2.5 text-sm text-foreground/90">
        <Icon className="h-4 w-4 text-gold/70" />
        {badge ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]" />
            <span className="font-medium text-emerald-400">{value}</span>
          </span>
        ) : (
          <span className="truncate">{value}</span>
        )}
      </div>
    </div>
  );
}
