import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Search = { ref?: string };

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create Your NASLAB Account" },
      { name: "description", content: "Activate your invitation and join NASLAB." },
    ],
  }),
  component: SignupPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name").max(120),
    email: z.string().trim().email("Invalid email").max(255),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
    referralCode: z.string().trim().min(1, "Invitation code required").max(64),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignupPage() {
  const { ref } = Route.useSearch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(ref ?? "");
  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [refValidating, setRefValidating] = useState(false);
  const [refValid, setRefValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Live-validate referral code (debounced)
  useEffect(() => {
    const code = referralCode.trim();
    if (!code) {
      setRefValid(null);
      setSponsorName(null);
      return;
    }
    setRefValidating(true);
    const t = setTimeout(async () => {
      const { data, error } = await supabase.rpc("validate_referral_code", { _code: code });
      setRefValidating(false);
      if (error) {
        setRefValid(false);
        setSponsorName(null);
        return;
      }
      const result = data as { valid: boolean; sponsor_name?: string };
      setRefValid(result.valid);
      setSponsorName(result.valid ? result.sponsor_name ?? null : null);
    }, 400);
    return () => clearTimeout(t);
  }, [referralCode]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email, password, confirmPassword, referralCode });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (refValid !== true) {
      toast.error("Please enter a valid invitation code");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: {
          full_name: parsed.data.fullName,
          sponsor_member_id: parsed.data.referralCode.trim(),
        },
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. Check your email to confirm, then sign in.");
    navigate({ to: "/login" });
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-card p-10 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 30% 20%, color-mix(in oklab, var(--gold) 18%, transparent), transparent 70%)",
          }}
        />
        <Logo />
        <div className="relative">
          <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold">Activate Invitation</div>
          <p className="font-serif text-4xl leading-tight">
            "Every legacy begins with a single <em className="text-gold">decision</em>."
          </p>
          <p className="mt-6 text-sm text-muted-foreground">— Naslab, est. 2026</p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:p-10">
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            ← Home
          </Link>
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
          <h1 className="font-serif text-3xl">Create Your Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Membership is by invitation. Enter your sponsor's code to begin.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="referral">Invitation Code</Label>
              <Input
                id="referral"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="IV-XXXXXXXX"
                required
                maxLength={64}
                readOnly={!!ref}
                className={ref ? "opacity-80" : ""}
              />
              <p className="text-xs text-muted-foreground min-h-[1rem]">
                {refValidating && "Checking…"}
                {!refValidating && refValid === true && sponsorName && (
                  <span className="text-gold">Invited by {sponsorName}</span>
                )}
                {!refValidating && refValid === false && referralCode && (
                  <span className="text-destructive">Invalid invitation code</span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={120} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)} required maxLength={128} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} required maxLength={128} />
            </div>

            <Button
              type="submit"
              disabled={loading || refValid !== true}
              className="h-11 w-full rounded-sm bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
