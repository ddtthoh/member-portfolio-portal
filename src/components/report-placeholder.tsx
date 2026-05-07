import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

export function ReportPlaceholder({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <SpotlightCard className="liquid-glass mt-6 rounded-2xl p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-2xl text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your {title.toLowerCase()} report will appear here once available.
        </p>
      </SpotlightCard>
    </div>
  );
}
