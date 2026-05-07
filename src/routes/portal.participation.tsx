import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/participation")({
  head: () => ({
    meta: [
      { title: "Participation — Portal" },
      { name: "description", content: "Your participation in firm programs and initiatives." },
    ],
  }),
  component: ParticipationPage,
});

type Row = {
  date: string;
  package: string;
  roiStart: string;
  amount: number;
  roiMin: number;
  roiMax: number;
  status: "Active" | "Pending" | "Completed";
};

const rows: Row[] = [
  { date: "2026-04-12", package: "Founders I", roiStart: "2026-05-01", amount: 50000, roiMin: 6.5, roiMax: 9.0, status: "Active" },
  { date: "2026-03-04", package: "Growth II", roiStart: "2026-04-01", amount: 25000, roiMin: 4.2, roiMax: 7.5, status: "Active" },
  { date: "2026-01-22", package: "Reserve",   roiStart: "2026-02-15", amount: 100000, roiMin: 5.0, roiMax: 8.2, status: "Completed" },
];

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function ParticipationPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader eyebrow={t("pages.participation.eyebrow")} title={t("pages.participation.title")} description={t("pages.participation.description")} />

      <div className="liquid-glass rounded-xl p-6">
        <div className="mb-4 flex items-center gap-2 text-gold">
          <Users className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">Active Programs</span>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You currently have no active participations. New opportunities will appear here when available.
          </p>
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.18em] text-gold">
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Package</th>
                  <th className="px-4 py-3 text-left font-medium">ROI Start Date</th>
                  <th className="px-4 py-3 text-right font-medium">Participation Amount</th>
                  <th className="px-4 py-3 text-right font-medium">ROI % Min</th>
                  <th className="px-4 py-3 text-right font-medium">ROI % Max</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border/40">
                    <td className="px-4 py-3.5 font-sans text-xs text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3.5 font-medium">{r.package}</td>
                    <td className="px-4 py-3.5 font-sans text-xs text-muted-foreground">{r.roiStart}</td>
                    <td className="px-4 py-3.5 text-right font-sans">{fmtUSD(r.amount)}</td>
                    <td className="px-4 py-3.5 text-right font-sans">{r.roiMin.toFixed(1)}%</td>
                    <td className="px-4 py-3.5 text-right font-sans text-gold">{r.roiMax.toFixed(1)}%</td>
                    <td className="px-4 py-3.5 text-right">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Row["status"] }) {
  const tone =
    status === "Active"
      ? "border-success/40 bg-success/10 text-success"
      : status === "Pending"
        ? "border-gold/40 bg-gold/10 text-gold"
        : "border-border bg-muted/30 text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] ${tone}`}>
      {status}
    </span>
  );
}
