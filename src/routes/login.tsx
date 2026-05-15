import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(128),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/portal" });
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Left ornamental panel */}
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
          <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold">Members Only</div>
          <p className="font-serif text-4xl leading-tight">
            "Wealth, when stewarded with discretion, becomes <em className="text-gold">legacy</em>."
          </p>
          <p className="mt-6 text-sm text-muted-foreground">— Naslab, est. 2026</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:p-10">
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            ← Home
          </Link>
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
          <h1 className="font-serif text-3xl">Member Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your portfolio and private reporting.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" value={password}
                onChange={(e) => setPassword(e.target.value)} required maxLength={128} />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-sm bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Membership is by invitation. Please contact your advisor for access.
          </p>
        </div>
      </div>
    </div>
  );
}
