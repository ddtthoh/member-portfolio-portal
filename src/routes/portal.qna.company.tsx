import { createFileRoute } from "@tanstack/react-router";
import { QuizTest } from "@/components/quiz-test";

export const Route = createFileRoute("/portal/qna/company")({
  component: () => <QuizTest category="company" title="Company" />,
});
