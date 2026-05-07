import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/reports/")({
  beforeLoad: () => {
    throw redirect({ to: "/portal/reports/staking" });
  },
});
