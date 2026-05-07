import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/portal/reports/team-rewards")({
  component: TeamRewardsPage,
});

function TeamRewardsPage() {
  const [open, setOpen] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div>
      <PageHeader title="Team Rewards" />

      {/* Filter card */}
      <SpotlightCard className="liquid-glass mt-4 rounded-2xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="font-serif text-base font-semibold text-gold md:text-lg">Filter</span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {open && (
          <div className="px-5 pb-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</label>
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
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
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
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Member Id
                </label>
                <Input type="text" className="bg-background/40" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button className="bg-gold text-background hover:bg-gold/90">FILTER</Button>
              <Button variant="outline">RESET</Button>
            </div>
          </div>
        )}
      </SpotlightCard>

      {/* Goldmine Breakdown Report */}
      <SpotlightCard className="liquid-glass mt-4 rounded-2xl">
        <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
          <h3 className="font-serif text-base font-semibold text-gold md:text-lg">
            Team Rewards Report
          </h3>
          <Button className="bg-gold text-background hover:bg-gold/90">EXPORT</Button>
        </div>

        <div className="overflow-x-auto px-2 pb-4 sm:px-5">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
            </colgroup>
            <thead>
              <tr className="border-y border-border/40 text-[11px] uppercase tracking-[0.18em] text-gold">
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-3 py-3 font-semibold">Member ID</th>
                <th className="px-3 py-3 font-semibold">Level</th>
                <th className="px-3 py-3 font-semibold">Amount</th>
                <th className="px-3 py-3 font-semibold">Percentage</th>
                <th className="px-3 py-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  No transactions yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SpotlightCard>
    </div>
  );
}
