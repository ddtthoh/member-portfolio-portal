import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

export const Route = createFileRoute("/portal/statement/credit-conversion")({
  component: CreditConversionPage,
});

type ConversionRow = {
  date: string;
  source: string;
  destination: string;
  amount: string;
  status: string;
};

const rows: ConversionRow[] = [];

const columns: { key: keyof ConversionRow; label: string }[] = [
  { key: "date", label: "pages.creditConversionStatement.tableHeaders.date" },
  { key: "source", label: "pages.creditConversionStatement.tableHeaders.source" },
  { key: "destination", label: "pages.creditConversionStatement.tableHeaders.destination" },
  { key: "amount", label: "pages.creditConversionStatement.tableHeaders.amount" },
  { key: "status", label: "pages.creditConversionStatement.tableHeaders.status" },
];

function CreditConversionPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={t("pages.creditConversionStatement.eyebrow")} title={t("pages.creditConversionStatement.title")} description={t("pages.creditConversionStatement.description")} />

      <SpotlightCard className="liquid-glass rounded-2xl p-px">
        <div className="overflow-x-auto px-5 py-4">
          <div className="min-w-max">
          <div className="grid grid-cols-[auto_auto_auto_auto_auto] gap-x-8 divide-x divide-gold/40">
            {columns.map((col) => (
              <div key={col.key} className="px-2 first:pl-0 last:pr-0">
                <div className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  {t(col.label)}
                </div>
              </div>
            ))}
          </div>

          {rows.length > 0 ? (
            <div className="mt-3 space-y-2">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[auto_auto_auto_auto_auto] gap-x-8 divide-x divide-gold/20 border-t border-gold/20 pt-2"
                >
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="px-2 first:pl-0 last:pr-0 whitespace-nowrap font-light text-sm tabular-nums tracking-[-0.02em] text-gold"
                    >
                      {row[col.key]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 border-t border-gold/20 pt-3 text-center text-xs text-gold/60">
              ​
            </div>
          )}
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
