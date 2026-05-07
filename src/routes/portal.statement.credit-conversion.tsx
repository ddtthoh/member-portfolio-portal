import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

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
  { key: "date", label: "Date" },
  { key: "source", label: "Source Credit" },
  { key: "destination", label: "Destination Credit" },
  { key: "amount", label: "Converted Amount" },
  { key: "status", label: "Status" },
];

function CreditConversionPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Statement"
        title="Credit Conversion"
        description="Review your credit conversion history and balances."
      />

      <div className="liquid-glass rounded-xl p-px">
        <div className="overflow-x-auto px-5 py-4">
          <div className="min-w-max">
          <div className="grid grid-cols-[auto_auto_auto_auto_auto] gap-x-8 divide-x divide-gold/40">
            {columns.map((col) => (
              <div key={col.key} className="px-2 first:pl-0 last:pr-0">
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
                  className="grid grid-cols-[auto_auto_auto_auto_auto] gap-x-8 divide-x divide-gold/20 border-t border-gold/20 pt-2"
                >
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="px-2 first:pl-0 last:pr-0 whitespace-nowrap font-sans text-sm tabular-nums text-gold"
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
  );
}
