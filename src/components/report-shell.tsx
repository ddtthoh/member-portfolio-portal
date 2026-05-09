import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarIcon, Filter, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CollapsibleFilter, FieldLabel } from "@/components/portal-ui";

export type ReportFilterValue = { date?: Date; text: string };

/**
 * Standard date + free-text filter used by every Report page.
 */
export function ReportFilter({
  textLabel,
  defaultOpen = true,
  onApply,
  onReset,
}: {
  textLabel?: string;
  defaultOpen?: boolean;
  onApply?: (v: ReportFilterValue) => void;
  onReset?: () => void;
}) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [text, setText] = useState("");

  const label = textLabel ?? t("components.reportShell.memberId");

  return (
    <CollapsibleFilter title={t("components.reportShell.filter")} defaultOpen={defaultOpen}>
      <div className="grid grid-cols-1 gap-4">
        <div className="min-w-0">
          <FieldLabel>{t("components.reportShell.date")}</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start bg-background/40 text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                {date ? format(date, "PPP") : <span>{t("components.reportShell.pickADate")}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                captionLayout="dropdown"
                fromYear={2000}
                toYear={new Date().getFullYear() + 5}
                initialFocus
                className="pointer-events-auto p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setDate(undefined);
            setText("");
            onReset?.();
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("components.reportShell.resetAction")}
        </Button>
        <Button
          onClick={() => onApply?.({ date, text })}
          className="bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
        >
          <Filter className="mr-2 h-4 w-4" />
          {t("components.reportShell.filterAction")}
        </Button>
      </div>
    </CollapsibleFilter>
  );
}

export type ExportData = { headers: string[]; rows: (string | number)[][]; filename?: string };

function downloadCsv({ headers, rows, filename = "report" }: ExportData) {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.href = url;
  a.download = `${filename}-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ReportShell({
  title,
  filterTextLabel,
  onApply,
  onReset,
  getExportRows,
  children,
}: {
  title: string;
  filterTextLabel?: string;
  onApply?: (v: ReportFilterValue) => void;
  onReset?: () => void;
  /** Returns the data for CSV export. Return null/undefined or empty rows to trigger the empty toast. */
  getExportRows?: () => ExportData | null | undefined;
  children: ReactNode;
}) {
  const { t } = useTranslation();

  const handleExport = () => {
    const data = getExportRows?.();
    if (!data || !data.rows.length) {
      toast.error(t("pages.transactions.empty.noRecordsExport", "No records to export"));
      return;
    }
    downloadCsv(data);
    toast.success(t("pages.transactions.empty.excelExported", "Exported"));
  };

  return (
    <>
      <ReportFilter textLabel={filterTextLabel} onApply={onApply} onReset={onReset} />
      <section className="mt-4">
        <div className="liquid-glass overflow-hidden rounded-2xl">
          <div className="flex flex-col items-stretch justify-between gap-3 border-b border-gold/10 px-5 py-4 sm:flex-row sm:items-center">
            <h3 className="font-serif text-base font-semibold text-gold md:text-lg">
              {title}
            </h3>
            <Button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90 sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("components.reportShell.exportAction")}
            </Button>
          </div>
          {children}
        </div>
      </section>
    </>
  );
}
