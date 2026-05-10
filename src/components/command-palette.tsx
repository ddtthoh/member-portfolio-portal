import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useDeviceCapability } from "@/hooks/use-device-capability";
import {
  LayoutDashboard, Wallet, FileBarChart, ArrowLeftRight, Users, GraduationCap,
  LifeBuoy, ArrowDownToLine, ArrowUpFromLine, Layers, DollarSign, Gift,
  ArrowRightLeft, Send, UserCircle2, KeyRound, ShieldCheck, QrCode, Repeat,
} from "lucide-react";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; group: string };

export function CommandPalette() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const cap = useDeviceCapability();

  const ITEMS: Item[] = useMemo(() => [
    { to: "/portal", label: t("palette.items.dashboard"), icon: LayoutDashboard, group: t("nav.overview") },
    { to: "/portal/portfolio", label: t("palette.items.holdings"), icon: Wallet, group: t("palette.groups.wallet") },
    { to: "/portal/transactions", label: t("nav.transactions"), icon: ArrowLeftRight, group: t("palette.groups.wallet") },
    { to: "/portal/asset-analysis", label: t("nav.assetAnalysis"), icon: FileBarChart, group: t("palette.groups.wallet") },
    { to: "/portal/staking", label: t("nav.reportsParticipation"), icon: Layers, group: t("palette.groups.wallet") },
    { to: "/portal/staking-plans", label: t("palette.items.stakingPlans"), icon: Layers, group: t("palette.groups.wallet") },
    { to: "/portal/deposit", label: t("nav.deposit"), icon: ArrowDownToLine, group: t("palette.groups.funds") },
    { to: "/portal/withdrawal", label: t("nav.withdrawal"), icon: ArrowUpFromLine, group: t("palette.groups.funds") },
    { to: "/portal/statement/usd", label: t("nav.usdStatement"), icon: DollarSign, group: t("nav.statement") },
    { to: "/portal/statement/transfer-usd", label: t("nav.transferUsd"), icon: Send, group: t("nav.statement") },
    { to: "/portal/statement/rewards", label: t("palette.items.rewards"), icon: Gift, group: t("nav.statement") },
    { to: "/portal/statement/convert-credits", label: t("nav.convertCredits"), icon: Repeat, group: t("nav.statement") },
    { to: "/portal/statement/credit-conversion", label: t("palette.items.creditConversion"), icon: ArrowRightLeft, group: t("nav.statement") },
    { to: "/portal/network", label: t("nav.network"), icon: Users, group: t("nav.network") },
    { to: "/portal/referral", label: t("palette.items.referral"), icon: Users, group: t("nav.network") },
    { to: "/portal/promotion", label: t("palette.items.promotion"), icon: Gift, group: t("nav.network") },
    { to: "/portal/reports", label: t("nav.reports"), icon: FileBarChart, group: t("nav.reports") },
    { to: "/portal/reports/staking", label: t("palette.items.stakingRewards"), icon: FileBarChart, group: t("nav.reports") },
    { to: "/portal/reports/team-rewards", label: t("nav.reportsTeam"), icon: FileBarChart, group: t("nav.reports") },
    { to: "/portal/reports/leader-rewards", label: t("nav.reportsLeader"), icon: FileBarChart, group: t("nav.reports") },
    { to: "/portal/qna", label: t("palette.items.quiz"), icon: GraduationCap, group: t("palette.groups.learn") },
    { to: "/portal/documents", label: t("nav.documents"), icon: FileBarChart, group: t("palette.groups.learn") },
    { to: "/portal/support", label: t("nav.support"), icon: LifeBuoy, group: t("account.label") },
    { to: "/portal/profile", label: t("account.profile"), icon: UserCircle2, group: t("account.label") },
    { to: "/portal/qr-code", label: t("palette.items.qrCode"), icon: QrCode, group: t("account.label") },
  ], [t]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = Array.from(new Set(ITEMS.map((i) => i.group)));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={cap.coarse ? t("palette.searchPortal") : t("palette.typeToNavigate")}
        autoFocus={!cap.coarse}
      />
      <CommandList className={cap.coarse ? "max-h-[70vh]" : ""}>
        <CommandEmpty>{t("palette.empty.noResults")}</CommandEmpty>
        {groups.map((g) => (
          <CommandGroup key={g} heading={g}>
            {ITEMS.filter((i) => i.group === g).map((i) => {
              const Icon = i.icon;
              return (
                <CommandItem
                  key={i.to}
                  value={`${g} ${i.label}`}
                  className={cap.coarse ? "min-h-[44px] py-3 text-[15px]" : ""}
                  onSelect={() => {
                    setOpen(false);
                    navigate({ to: i.to });
                  }}
                >
                  <Icon className="mr-2 h-4 w-4 text-gold/80" />
                  <span>{i.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
