import { createFileRoute } from "@tanstack/react-router";
import { QuizTest } from "@/components/quiz-test";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/qna/company")({
  component: () => {
    const { t } = useTranslation();
    return <QuizTest category="company" title={t("nav.qnaCompany")} />;
  },
});
