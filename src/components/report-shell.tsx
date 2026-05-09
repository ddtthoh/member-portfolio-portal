import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CollapsibleFilter, FieldLabel } from "@/components/portal-ui";

/**
 * Standard date + free-text filter used by every Report page.
 */
export function ReportFilter({
  textLabel = "Member ID",
  onApply,
  onReset,
}: {
  textLabel?: string;
  onApply?: (v: { date?: Date; text: string }) => void;
  onReset?: () => void;
}) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [text, setText] = useState("");

  return (
    <CollapsibleFilter title={t("components.reportShell.filter")}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
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
        <div>
          <FieldLabel>{textLabel === "Member ID" ? t("components.reportShell.memberId") : textLabel}</FieldLabel>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            className="bg-background/40"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button
          onClick={() => onApply?.({ date, text })}
          className="bg-gold text-background hover:bg-gold/90"
        >
          {t("components.reportShell.filterAction")}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setDate(undefined);
            setText("");
            onReset?.();
          }}
        >
          {t("components.reportShell.resetAction")}
        </Button>
      </div>
    </CollapsibleFilter>
  );
}

export function ReportShell({
  title,
  exportLabel = "EXPORT",
  onExport,
  children,
}: {
  title: string;
  exportLabel?: string;
  onExport?: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <>
      <ReportFilter />
      <section className="mt-4">
        <div className="liquid-glass overflow-hidden rounded-2xl">
          <div className="flex flex-col items-start justify-between gap-3 border-b border-gold/10 px-5 py-4 sm:flex-row sm:items-center">
            <h3 className="font-serif text-base font-semibold text-gold md:text-lg">
              {title}
            </h3>
            <Button
              onClick={onExport}
              className="bg-gold text-background hover:bg-gold/90"
            >
              {exportLabel === "EXPORT" ? t("components.reportShell.exportAction") : exportLabel}
            </Button>
          </div>
          {children}
        </div>
      </section>
    </>
  );
}
