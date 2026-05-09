import { createFileRoute } from "@tanstack/react-router";
import { QuizTest } from "@/components/quiz-test";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/qna/marketing")({
  component: () => {
    const { t } = useTranslation();
    return <QuizTest category="marketing" title={t("nav.qnaMarketing")} />;
  },
});
