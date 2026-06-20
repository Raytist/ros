"use client";

import { useAssessment } from "@/hooks/use-assessment";
import { AssessmentRunner } from "@/components/assessment/assessment-runner";
import { ResultsSummary } from "@/components/assessment/results-summary";
import type { AssessmentMode, TopicId } from "@/types";
import { Loader2 } from "lucide-react";

interface AssessmentPageProps {
  mode: AssessmentMode;
  topicId?: TopicId;
  title: string;
}

export function AssessmentPageClient({ mode, topicId, title }: AssessmentPageProps) {
  const {
    currentTask,
    progress,
    currentIndex,
    totalQuestions,
    difficulty,
    handleSubmit,
    result,
    isComplete,
    sessionKey,
  } = useAssessment(mode, topicId);

  if (isComplete && result) {
    return <ResultsSummary result={result} />;
  }

  if (!currentTask) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-[var(--muted)]">
          Интерактивная сессия — сложность {difficulty} из 4, задания подбираются адаптивно
        </p>
      </div>
      <AssessmentRunner
        key={`${sessionKey}-${currentIndex}-${currentTask.id}`}
        task={currentTask}
        progress={progress}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        difficulty={difficulty}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
