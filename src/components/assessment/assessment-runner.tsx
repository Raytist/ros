"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { SourceBadge } from "@/components/ui/source-badge";
import { Button } from "@/components/ui/button";
import type { AssessmentTask } from "@/types";
import { validateTaskAnswer } from "@/hooks/use-assessment";
import { TextHighlightTask } from "./tasks/text-highlight-task";
import { ArticleSearchTask } from "./tasks/article-search-task";
import { StepSortingTask } from "./tasks/step-sorting-task";
import { MissingStepTask } from "./tasks/missing-step-task";
import { FillBlanksTask } from "./tasks/fill-blanks-task";
import { NmckCalculationTask } from "./tasks/nmck-calculation-task";
import { FasCaseTask } from "./tasks/fas-case-task";
import { HighlightErrorsTask } from "./tasks/highlight-errors-task";
import { NextStepTask } from "./tasks/next-step-task";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";

interface AssessmentRunnerProps {
  task: AssessmentTask;
  progress: number;
  currentIndex: number;
  totalQuestions: number;
  difficulty: number;
  onSubmit: (value: unknown, isCorrect: boolean, hintsUsed?: number) => void;
}

export function AssessmentRunner({
  task,
  progress,
  currentIndex,
  totalQuestions,
  onSubmit,
}: AssessmentRunnerProps) {
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleAnswer = (value: unknown) => {
    const isCorrect = validateTaskAnswer(task.type, task.content, value);
    setFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      onSubmit(value, isCorrect, hintsUsed);
      setFeedback(null);
      setHintsUsed(0);
      setShowHint(false);
    }, 900);
  };

  const renderTask = () => {
    switch (task.content.type) {
      case "text-highlight":
        return <TextHighlightTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "article-search":
        return <ArticleSearchTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "step-sorting":
        return <StepSortingTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "missing-step":
        return <MissingStepTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "fill-blanks":
        return <FillBlanksTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "nmck-calculation":
        return <NmckCalculationTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "fas-case":
        return <FasCaseTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "highlight-errors":
        return <HighlightErrorsTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      case "find-violation":
        return null;
      case "next-step":
        return <NextStepTask content={task.content} onSubmit={handleAnswer} disabled={!!feedback} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Практикум · этап {currentIndex + 1} из {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm ${
            feedback === "correct"
              ? "bg-green-50 text-[var(--success)]"
              : "bg-red-50 text-[var(--danger)]"
          }`}
        >
          {feedback === "correct" ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Верно
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" /> Есть неточности — переходим дальше
            </>
          )}
        </div>
      )}

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{task.title}</h2>
        <p className="text-sm text-[var(--muted)]">{task.instruction}</p>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-white p-5">
        {renderTask()}

        {task.hints && task.hints.length > 0 && (
          <div className="mt-5 border-t border-[var(--border)] pt-4">
            {!showHint ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowHint(true);
                  setHintsUsed((h) => h + 1);
                }}
                disabled={!!feedback}
              >
                <Lightbulb className="h-4 w-4" />
                Подсказка
              </Button>
            ) : (
              <p className="rounded-lg bg-[var(--primary-light)] p-3 text-sm text-[var(--primary)]">
                {task.hints[0]}
              </p>
            )}
          </div>
        )}
      </div>

      <SourceBadge source={task.source} />
    </div>
  );
}
