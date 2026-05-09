import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

export const Route = createFileRoute("/portal/statement/usd")({
  component: UsdStatementPage,
});

type UsdRow = {
  date: string;
  txId: string;
  type: string;
  credit: string;
  debit: string;
  remarks: string;
};

const columns: { key: keyof UsdRow; label: string }[] = [
  { key: "date", label: "pages.deposit.tableHeaders.date" },
  { key: "txId", label: "pages.usdStatement.tableHeaders.txId" },
  { key: "type", label: "pages.usdStatement.tableHeaders.type" },
  { key: "credit", label: "pages.usdStatement.tableHeaders.credit" },
  { key: "debit", label: "pages.usdStatement.tableHeaders.debit" },
  { key: "remarks", label: "pages.usdStatement.tableHeaders.remarks" },
];

const rows: UsdRow[] = [];

function UsdStatementPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={t("pages.usdStatement.eyebrow")} title={t("pages.usdStatement.title")} description={t("pages.usdStatement.description")} />

      <SpotlightCard className="liquid-glass rounded-2xl p-px">
        <div className="overflow-x-auto px-5 py-4">
          <div className="min-w-max">
            <div className="grid grid-cols-6 divide-x divide-gold/40">
              {columns.map((col) => (
                <div key={col.key} className="px-6 text-center">
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
                    className="grid grid-cols-6 divide-x divide-gold/20 border-t border-gold/20 pt-2"
                  >
                    {columns.map((col) => (
                      <div
                        key={col.key}
                        className="px-6 text-center whitespace-nowrap font-light text-sm tabular-nums tracking-[-0.02em] text-gold"
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
