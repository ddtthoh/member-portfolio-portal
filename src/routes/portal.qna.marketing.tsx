import { createFileRoute } from "@tanstack/react-router";
import { QuizTest } from "@/components/quiz-test";

export const Route = createFileRoute("/portal/qna/marketing")({
  component: () => <QuizTest category="marketing" title="Marketing plan" />,
});
