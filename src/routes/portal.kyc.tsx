import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, Upload, FileImage, CheckCircle2, AlertTriangle, Lock, Camera, IdCard, BookUser } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { SectionCard, SectionHeader, SectionBody } from "@/components/portal-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/kyc")({
  component: KycPage,
});

type KycStatus = "submitted" | "pending" | "approved" | "rejected";
type DocType = "identity_card" | "passport";
type KycRow = {
  id: string;
  status: KycStatus;
  doc_type: DocType;
  passport_url: string;
  back_url: string | null;
  selfie_url: string;
  reviewer_note: string | null;
  submitted_at: string;
  updated_at: string;
};

const REQUIRED_FIELDS: { key: string; label: string }[] = [
  { key: "full_name", label: "Full name" },
  { key: "phone", label: "Mobile number" },
  { key: "national_id", label: "National ID / Passport no." },
  { key: "dob", label: "Date of birth" },
  { key: "country", label: "Country" },
  { key: "region", label: "Region / State" },
  { key: "city", label: "City" },
  { key: "address", label: "Address" },
];

const STEPS: { key: Exclude<KycStatus, "rejected">; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "pending", label: "Under Review" },
  { key: "approved", label: "Approved" },
];

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_BYTES = 2 * 1024 * 1024;

function statusToStep(s: KycStatus): number {
  if (s === "approved") return 3;
  if (s === "pending") return 2;
  return 1;
}

function KycPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState<string[]>([]);
  const [submission, setSubmission] = useState<KycRow | null>(null);

  const [docType, setDocType] = useState<DocType>("passport");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [{ data: profile }, { data: kyc }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, national_id, dob, country, region, city, address")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("kyc_submissions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);
      if (cancelled) return;

      const m: string[] = [];
      const p = (profile ?? {}) as Record<string, unknown>;
      for (const f of REQUIRED_FIELDS) {
        const v = p[f.key];
        if (v === null || v === undefined || String(v).trim() === "") m.push(f.label);
      }
      setMissing(m);
      setSubmission((kyc as KycRow | null) ?? null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Reset files when switching doc type
  useEffect(() => {
    setFrontFile(null);
    setBackFile(null);
    setSelfieFile(null);
  }, [docType]);

  const profileComplete = missing.length === 0;
  const locked = !!submission && (submission.status === "submitted" || submission.status === "pending" || submission.status === "approved");

  const filesReady =
    docType === "passport"
      ? !!frontFile && !!selfieFile
      : !!frontFile && !!backFile && !!selfieFile;

  async function onSubmit() {
    if (!user || !filesReady) return;
    setSubmitting(true);
    try {
      const stamp = Date.now();
      const uploadOne = async (file: File, label: string) => {
        const path = `${user.id}/${label}-${stamp}-${safeExt(file.name)}`;
        const { error } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: false });
        if (error) throw error;
        return path;
      };

      const frontPath = await uploadOne(frontFile!, docType === "passport" ? "passport" : "id-front");
      const backPath = docType === "identity_card" ? await uploadOne(backFile!, "id-back") : null;
      const selfiePath = await uploadOne(selfieFile!, "selfie");

      const { data, error } = await supabase
        .from("kyc_submissions")
        .insert({
          user_id: user.id,
          doc_type: docType,
          passport_url: frontPath,
          back_url: backPath,
          selfie_url: selfiePath,
          status: "submitted",
        })
        .select()
        .maybeSingle();
      if (error) throw error;

      setSubmission(data as KycRow);
      setFrontFile(null);
      setBackFile(null);
      setSelfieFile(null);
      toast.success("KYC submitted for review");
    } catch (e: any) {
      toast.error(e?.message ?? "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Compliance"
        title="Identity Verification"
        description="Verify your identity by uploading your government-issued document and a selfie holding it. Required for withdrawals and full account access."
      />

      {loading ? (
        <SectionCard>
          <SectionBody>
            <div className="h-32 animate-pulse rounded-lg bg-muted/20" />
          </SectionBody>
        </SectionCard>
      ) : !profileComplete ? (
        <ProfileGate missing={missing} onGo={() => navigate({ to: "/portal/profile" })} />
      ) : (
        <>
          {submission && <StatusBar status={submission.status} note={submission.reviewer_note} />}

          {!locked && (
            <SectionCard>
              <SectionHeader
                title={submission?.status === "rejected" ? "Resubmit Documents" : "Upload Documents"}
                subtitle="Choose your document type · JPG / JPEG / PNG / GIF · Max 2 MB each"
              />
              <SectionBody>
                {/* Doc-type toggle */}
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  <DocTypeOption
                    icon={<BookUser className="h-5 w-5" />}
                    label="Passport"
                    hint="Bio page + selfie"
                    active={docType === "passport"}
                    onClick={() => setDocType("passport")}
                  />
                  <DocTypeOption
                    icon={<IdCard className="h-5 w-5" />}
                    label="Identity Card"
                    hint="Front, back + selfie"
                    active={docType === "identity_card"}
                    onClick={() => setDocType("identity_card")}
                  />
                </div>

                {docType === "passport" ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <UploadTile
                      icon={<BookUser className="h-5 w-5" />}
                      title="Passport"
                      hint="Bio page · clear, no glare"
                      file={frontFile}
                      onFile={setFrontFile}
                    />
                    <UploadTile
                      icon={<Camera className="h-5 w-5" />}
                      title="Selfie with Passport"
                      hint="Hold passport next to your face"
                      file={selfieFile}
                      onFile={setSelfieFile}
                    />
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-3">
                    <UploadTile
                      icon={<IdCard className="h-5 w-5" />}
                      title="ID Card — Front"
                      hint="Front side · all details visible"
                      file={frontFile}
                      onFile={setFrontFile}
                    />
                    <UploadTile
                      icon={<IdCard className="h-5 w-5" />}
                      title="ID Card — Back"
                      hint="Back side · clear, no glare"
                      file={backFile}
                      onFile={setBackFile}
                    />
                    <UploadTile
                      icon={<Camera className="h-5 w-5" />}
                      title="Selfie with ID Card"
                      hint="Hold card next to your face"
                      file={selfieFile}
                      onFile={setSelfieFile}
                    />
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 border-t border-gold/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gold/55">
                    By submitting, you confirm these documents are authentic and depict you.
                  </p>
                  <Button
                    onClick={onSubmit}
                    disabled={!filesReady || submitting}
                    className="bg-gradient-to-r from-gold to-gold/70 text-background hover:from-gold hover:to-gold disabled:opacity-50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {submitting ? "Submitting…" : "Submit for Review"}
                  </Button>
                </div>
              </SectionBody>
            </SectionCard>
          )}

          {locked && submission && submission.status !== "approved" && (
            <SectionCard>
              <SectionBody>
                <p className="text-sm text-gold/70">
                  Your submission is locked while it is being reviewed. You will be notified once a decision is made.
                </p>
              </SectionBody>
            </SectionCard>
          )}

          {submission?.status === "approved" && (
            <SectionCard>
              <SectionBody>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-serif text-base text-gold">Identity verified</p>
                    <p className="text-xs text-gold/55">All account features are now unlocked.</p>
                  </div>
                </div>
              </SectionBody>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}

function safeExt(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "jpg";
  return `file.${ext.replace(/[^a-z0-9]/g, "") || "jpg"}`;
}

/* ---------- Doc type option ---------- */
function DocTypeOption({
  icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
        active
          ? "border-gold/60 bg-gold/10 ring-1 ring-gold/40"
          : "border-gold/15 bg-background/40 hover:border-gold/30 hover:bg-background/60",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border",
          active ? "border-gold bg-gold text-background" : "border-gold/30 text-gold",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className={cn("block font-serif text-base font-semibold", active ? "text-gold" : "text-foreground/90")}>
          {label}
        </span>
        <span className="block text-[11px] uppercase tracking-[0.16em] text-gold/55">{hint}</span>
      </span>
      {active && <CheckCircle2 className="h-4 w-4 text-gold" />}
    </button>
  );
}

/* ---------- Status bar ---------- */
function StatusBar({ status, note }: { status: KycStatus; note: string | null }) {
  const step = statusToStep(status);
  const rejected = status === "rejected";

  return (
    <SectionCard>
      <SectionHeader title="Verification Status" subtitle={rejected ? "Action required" : "Tracking your application"} />
      <SectionBody>
        <div className="relative mx-auto max-w-2xl px-2 pb-2 pt-1">
          <div className="absolute left-[8%] right-[8%] top-[14px] h-[2px] rounded-full bg-border/40" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((step - 1) / 2) * 84}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-[8%] top-[14px] h-[2px] rounded-full bg-gradient-to-r from-gold to-gold/40"
          />

          <div className="relative flex items-start justify-between">
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const active = idx <= step && !rejected;
              const current = idx === step && !rejected;
              return (
                <div key={s.key} className="flex w-1/3 flex-col items-center text-center">
                  <span
                    className={cn(
                      "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all",
                      active
                        ? "border-gold bg-gold text-background"
                        : "border-border/60 bg-background text-muted-foreground",
                      current && "ring-pulse",
                    )}
                  >
                    {active ? <CheckCircle2 className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span
                    className={cn(
                      "mt-2 text-[10px] font-medium uppercase tracking-[0.18em]",
                      active ? "text-gold" : "text-muted-foreground/70",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {rejected && (
          <div className="mt-5 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Submission rejected</p>
              {note && <p className="mt-1 text-destructive/80">{note}</p>}
              <p className="mt-1 text-xs text-muted-foreground">Please re-upload corrected documents below.</p>
            </div>
          </div>
        )}
      </SectionBody>
    </SectionCard>
  );
}

/* ---------- Profile gate ---------- */
function ProfileGate({ missing, onGo }: { missing: string[]; onGo: () => void }) {
  return (
    <SectionCard>
      <SectionHeader title="Complete Your Profile First" subtitle="Required before identity verification" />
      <SectionBody>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <Lock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-gold/80">
              Please complete the following fields in <span className="font-semibold text-gold">My Profile</span> before
              uploading your KYC documents:
            </p>
            <ul className="mt-3 grid gap-1.5 text-sm text-foreground/90 sm:grid-cols-2">
              {missing.map((m) => (
                <li key={m} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
                  {m}
                </li>
              ))}
            </ul>
            <Button
              onClick={onGo}
              className="mt-5 bg-gradient-to-r from-gold to-gold/70 text-background hover:from-gold hover:to-gold"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Complete Profile
            </Button>
          </div>
        </div>
      </SectionBody>
    </SectionCard>
  );
}

/* ---------- Upload tile ---------- */
function UploadTile({
  icon,
  title,
  hint,
  file,
  onFile,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleSelect(f: File | undefined | null) {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Only JPG, JPEG, PNG, or GIF allowed");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("File is too large (max 2 MB)");
      return;
    }
    onFile(f);
  }

  return (
    <div className="rounded-xl border border-gold/15 bg-background/40 p-4 transition-colors hover:border-gold/30">
      <div className="mb-3 flex items-center gap-2 text-gold">
        {icon}
        <span className="font-serif text-base font-semibold">{title}</span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleSelect(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          file ? "border-gold/40 bg-background" : "border-gold/20 bg-background/30 hover:border-gold/40 hover:bg-background/50",
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gold/55">
            <FileImage className="h-7 w-7" />
            <span className="text-xs">Click or drag image to upload</span>
          </div>
        )}
      </button>

      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-gold/45">{hint}</p>
      {file && (
        <button
          type="button"
          onClick={() => onFile(null)}
          className="mt-1 text-[11px] text-gold/60 underline-offset-2 hover:text-gold hover:underline"
        >
          Replace
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
        onChange={(e) => handleSelect(e.target.files?.[0])}
      />
    </div>
  );
}
