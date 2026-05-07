import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/qna")({
  component: QnALayout,
});

function QnALayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.pathname === "/portal/qna") {
      navigate({ to: "/portal/qna/company", replace: true });
    }
  }, [location.pathname, navigate]);

  const tabs = [
    { to: "/portal/qna/company", label: "Company" },
    { to: "/portal/qna/marketing", label: "Marketing plan" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={t("pages.qna.eyebrow", "Knowledge Test")}
        title={t("pages.qna.title", "Education")}
        description={t("pages.qna.description", "Answer 7 out of 10 questions correctly to pass. You can retake the test as many times as you want.")}
      />

      <div className="mb-5 flex gap-2 border-b border-border">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={[
                "relative px-4 py-2 text-sm font-medium transition-colors",
                active ? "text-gold" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />
              )}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
