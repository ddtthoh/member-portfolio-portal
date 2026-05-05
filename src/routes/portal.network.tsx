import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/network")({
  component: NetworkPage,
});

type Contact = { id: string; name: string; role: string | null; firm: string | null; email: string | null; phone: string | null };

function NetworkPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Contact[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("network_contacts").select("*").eq("user_id", user.id).order("name")
      .then(({ data }) => setItems((data ?? []) as Contact[]));
  }, [user]);

  return (
    <div>
      <PageHeader eyebrow="Relationships" title="Network"
        description="Your trusted circle of advisors, custodians, and partners." />
      {items.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-card p-16 text-center">
          <Users className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Your dedicated team will be listed here shortly.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <div key={c.id} className="rounded-sm border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-serif text-lg text-gold">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{c.name}</div>
                  {c.role && <div className="text-xs text-muted-foreground">{c.role}{c.firm ? ` · ${c.firm}` : ""}</div>}
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-sm">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </a>
                )}
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
