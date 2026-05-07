import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Question = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
};

const TOTAL = 10;
const PASS = 7;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizTest({ category, title }: { category: "company" | "marketing"; title: string }) {
  const [pool, setPool] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("id, question, options, correct_index")
      .eq("category", category);
    setLoading(false);
    if (error) return toast.error(error.message);
    const parsed = (data ?? []).map((r) => ({
      id: r.id,
      question: r.question,
      options: r.options as unknown as string[],
      correct_index: r.correct_index,
    }));
    setPool(parsed);
    pickQuestions(parsed);
  };

  const pickQuestions = (src: Question[]) => {
    setAnswers({});
    setSubmitted(false);
    setQuestions(shuffle(src).slice(0, TOTAL));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const score = useMemo(
    () => questions.reduce((s, q) => (answers[q.id] === q.correct_index ? s + 1 : s), 0),
    [answers, questions]
  );
  const passed = score >= PASS;

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (pool.length < TOTAL) {
    return (
      <div className="liquid-glass rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Not enough questions yet for {title}. Need at least {TOTAL} questions in the bank
          (currently {pool.length}). Upload a .docx file at{" "}
          <span className="text-gold">/portal/wallet-edit</span> to add more.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="liquid-glass flex items-center justify-between rounded-xl px-5 py-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{title}</div>
          <div className="text-xs text-muted-foreground">
            Answer {PASS} of {TOTAL} correctly to pass. You can retake at any time.
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => pickQuestions(pool)}>
          New 10 Questions
        </Button>
      </div>

      {questions.map((q, i) => (
        <div key={q.id} className="liquid-glass rounded-xl p-5">
          <p className="mb-3 font-serif text-base">
            <span className="mr-2 text-gold">{i + 1}.</span>
            {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const selected = answers[q.id] === idx;
              const isCorrect = idx === q.correct_index;
              const showResult = submitted;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                  className={[
                    "w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                    selected ? "border-gold bg-gold/10" : "border-border hover:bg-accent",
                    showResult && isCorrect ? "border-emerald-500 bg-emerald-500/10" : "",
                    showResult && selected && !isCorrect ? "border-destructive bg-destructive/10" : "",
                  ].join(" ")}
                >
                  <span className="mr-2 font-semibold text-gold/80">{"ABCDEFGH"[idx]}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="liquid-glass flex items-center justify-between rounded-xl px-5 py-4">
        {submitted ? (
          <>
            <div>
              <div className={`text-lg font-semibold ${passed ? "text-emerald-500" : "text-destructive"}`}>
                {passed ? "Passed" : "Failed"} — {score}/{TOTAL}
              </div>
              <div className="text-xs text-muted-foreground">
                {passed ? "Great job!" : `You need ${PASS} correct to pass.`}
              </div>
            </div>
            <Button onClick={() => pickQuestions(pool)} className="bg-gold text-gold-foreground hover:bg-gold/90">
              Retake Test
            </Button>
          </>
        ) : (
          <>
            <div className="text-xs text-muted-foreground">
              Answered {Object.keys(answers).length}/{questions.length}
            </div>
            <Button
              disabled={Object.keys(answers).length < questions.length}
              onClick={() => setSubmitted(true)}
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              Submit Answers
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
