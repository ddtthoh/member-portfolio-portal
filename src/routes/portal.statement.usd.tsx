import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

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
  { key: "date", label: "Date" },
  { key: "txId", label: "Transaction ID" },
  { key: "type", label: "Transaction Type" },
  { key: "credit", label: "Credit" },
  { key: "debit", label: "Debit" },
  { key: "remarks", label: "Remarks" },
];

const rows: UsdRow[] = [];

function UsdStatementPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Statement"
        title="USD Statement"
        description="A summary of your USD account activity."
      />

      <div className="liquid-glass rounded-xl p-px">
        <div className="overflow-x-auto px-5 py-4">
          <div className="min-w-max">
            <div className="grid grid-cols-6 divide-x divide-gold/40">
              {columns.map((col) => (
                <div key={col.key} className="px-6 text-center">
                  <div className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                    {col.label}
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
                        className="px-6 text-center whitespace-nowrap font-sans text-sm tabular-nums text-gold"
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
      </div>
    </div>
  );
}
