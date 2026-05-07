import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import {
  SectionCard,
  SectionHeader,
  DataTable,
  Thead,
  Th,
  Td,
  EmptyRow,
} from "@/components/portal-ui";

export const Route = createFileRoute("/portal/transactions")({
  component: TransactionsPage,
});

type Tx = {
  id: string;
  type: string;
  asset: string | null;
  amount: number;
  quantity: number | null;
  price: number | null;
  status: string;
  occurred_at: string;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function TransactionsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rows, setRows] = useState<Tx[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("occurred_at", { ascending: false })
      .then(({ data }) => setRows((data ?? []) as Tx[]));
  }, [user]);

  return (
    <div>
      <PageHeader
        eyebrow={t("pages.transactions.eyebrow")}
        title={t("pages.transactions.title")}
        description={t("pages.transactions.description")}
      />

      <SectionCard>
        <SectionHeader title="Transactions History" />
        <DataTable minWidth={760}>
          <Thead>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Asset</Th>
            <Th align="right">Quantity</Th>
            <Th align="right">Price</Th>
            <Th align="right">Amount</Th>
            <Th align="right">Status</Th>
          </Thead>
          <tbody>
            {rows.length === 0 ? (
              <EmptyRow colSpan={7}>No transactions yet.</EmptyRow>
            ) : (
              rows.map((tx) => (
                <tr key={tx.id} className="border-b border-border/40 last:border-0">
                  <Td className="text-muted-foreground">
                    {new Date(tx.occurred_at).toLocaleDateString()}
                  </Td>
                  <Td className="capitalize">{tx.type}</Td>
                  <Td>{tx.asset ?? "—"}</Td>
                  <Td align="right">{tx.quantity ?? "—"}</Td>
                  <Td align="right">
                    {tx.price != null ? fmt(Number(tx.price)) : "—"}
                  </Td>
                  <Td align="right" className="font-medium">
                    {fmt(Number(tx.amount))}
                  </Td>
                  <Td align="right">
                    <span className="inline-flex rounded-full border border-gold/30 bg-gold/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-gold/80">
                      {tx.status}
                    </span>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </DataTable>
      </SectionCard>
    </div>
  );
}
