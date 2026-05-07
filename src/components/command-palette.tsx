import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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

const ITEMS: Item[] = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { to: "/portal/holdings", label: "Holdings", icon: Wallet, group: "Wallet" },
  { to: "/portal/transactions", label: "Transactions", icon: ArrowLeftRight, group: "Wallet" },
  { to: "/portal/asset-analysis", label: "Asset Analysis", icon: FileBarChart, group: "Wallet" },
  { to: "/portal/staking", label: "Staking", icon: Layers, group: "Wallet" },
  { to: "/portal/staking-plans", label: "Staking Plans", icon: Layers, group: "Wallet" },
  { to: "/portal/deposit", label: "Deposit", icon: ArrowDownToLine, group: "Funds" },
  { to: "/portal/withdrawal", label: "Withdrawal", icon: ArrowUpFromLine, group: "Funds" },
  { to: "/portal/statement/usd", label: "USD Statement", icon: DollarSign, group: "Statement" },
  { to: "/portal/statement/transfer-usd", label: "Transfer USD", icon: Send, group: "Statement" },
  { to: "/portal/statement/rewards", label: "Rewards", icon: Gift, group: "Statement" },
  { to: "/portal/statement/convert-credits", label: "Convert Credits", icon: Repeat, group: "Statement" },
  { to: "/portal/statement/credit-conversion", label: "Credit Conversion", icon: ArrowRightLeft, group: "Statement" },
  { to: "/portal/network", label: "Network", icon: Users, group: "Network" },
  { to: "/portal/referral", label: "Referral", icon: Users, group: "Network" },
  { to: "/portal/promotion", label: "Promotion", icon: Gift, group: "Network" },
  { to: "/portal/reports", label: "Reports", icon: FileBarChart, group: "Reports" },
  { to: "/portal/reports/staking", label: "Staking Rewards", icon: FileBarChart, group: "Reports" },
  { to: "/portal/reports/team-rewards", label: "Team Rewards", icon: FileBarChart, group: "Reports" },
  { to: "/portal/reports/leader-rewards", label: "Leader Rewards", icon: FileBarChart, group: "Reports" },
  { to: "/portal/qna", label: "Quiz", icon: GraduationCap, group: "Learn" },
  { to: "/portal/documents", label: "Documents", icon: FileBarChart, group: "Learn" },
  { to: "/portal/support", label: "Support", icon: LifeBuoy, group: "Account" },
  { to: "/portal/profile", label: "Profile", icon: UserCircle2, group: "Account" },
  { to: "/portal/qr-code", label: "QR Code", icon: QrCode, group: "Account" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const cap = useDeviceCapability();

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
        placeholder={cap.coarse ? "Search the portal…" : "Type to navigate… (⌘K)"}
        autoFocus={!cap.coarse}
      />
      <CommandList className={cap.coarse ? "max-h-[70vh]" : ""}>
        <CommandEmpty>No results.</CommandEmpty>
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
