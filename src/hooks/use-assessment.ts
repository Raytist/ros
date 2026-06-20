"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAssessmentStore } from "@/stores/assessment-store";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/services/api/client";
import { isApiEnabled } from "@/services/api/fetch-client";
import type { AssessmentMode, TaskAnswer, TaskContent, TopicId } from "@/types";
import { ADAPTIVE_CONFIG } from "@/lib/constants";

export function useAssessment(mode: AssessmentMode, topicId?: TopicId) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { session, result, startSession, submitAnswer, completeSession, resetSession } =
    useAssessmentStore();
  const [taskStartTime, setTaskStartTime] = useState(Date.now());
  const initialized = useRef(false);
  const backendSessionId = useRef<string | null>(null);

  useEffect(() => {
    if (!initialized.current && user) {
      initialized.current = true;

      if (isApiEnabled()) {
        api.assessment.start(user.id, mode, topicId).then(({ session: s }) => {
          backendSessionId.current = s.id;
          useAssessmentStore.setState({
            session: s,
            result: null,
          });
          setTaskStartTime(Date.now());
        });
      } else {
        startSession(user.id, mode, topicId);
        setTaskStartTime(Date.now());
      }
    }

    return () => {
      initialized.current = false;
      backendSessionId.current = null;
    };
  }, [user, mode, topicId, startSession]);

  const currentTask = session?.tasks[session.currentIndex];
  const progress = session
    ? Math.round((session.currentIndex / (session.tasks.length || 1)) * 100)
    : 0;
  const totalQuestions =
    mode === "global" ? ADAPTIVE_CONFIG.maxQuestions : session?.tasks.length ?? 0;

  const handleSubmit = useCallback(
    async (value: unknown, isCorrect: boolean, hintsUsed = 0) => {
      if (!currentTask || !session) return;

      const answer: TaskAnswer = {
        taskId: currentTask.id,
        value,
        isCorrect,
        timeSpent: Math.round((Date.now() - taskStartTime) / 1000),
        hintsUsed,
      };

      if (isApiEnabled() && backendSessionId.current) {
        const { session: updated, isComplete } = await api.assessment.submitAnswer(
          backendSessionId.current,
          answer
        );
        useAssessmentStore.setState({ session: updated });

        if (isComplete) {
          const { result: apiResult } = await api.assessment.complete(backendSessionId.current);
          useAssessmentStore.setState({ result: apiResult, session: updated });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["results"] });
          queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        }
      } else {
        submitAnswer(answer);
        const nextIndex = session.currentIndex + 1;
        const isComplete =
          nextIndex >= totalQuestions || nextIndex >= session.tasks.length;

        if (isComplete) {
          setTimeout(() => completeSession(), 100);
        }
      }

      setTaskStartTime(Date.now());
    },
    [
      currentTask,
      session,
      submitAnswer,
      completeSession,
      taskStartTime,
      totalQuestions,
      queryClient,
    ]
  );

  return {
    session,
    result,
    currentTask,
    progress,
    totalQuestions,
    currentIndex: session?.currentIndex ?? 0,
    difficulty: session?.difficulty ?? 2,
    handleSubmit,
    resetSession,
    isComplete: session?.status === "completed" || Boolean(result),
  };
}

export function validateTaskAnswer(
  _taskType: string,
  content: TaskContent,
  value: unknown
): boolean {
  switch (content.type) {
    case "text-highlight":
      return value === content.correctSentenceIndex;
    case "article-search":
    case "fas-case":
    case "missing-step":
    case "next-step":
      return value === content.correctOptionId;
    case "step-sorting":
      return JSON.stringify(value) === JSON.stringify(content.correctOrder);
    case "find-violation":
      return value === content.correctViolationId;
    case "highlight-errors": {
      const selected = [...(value as string[])].sort();
      const correct = [...(content.correctSegmentIds as string[])].sort();
      return JSON.stringify(selected) === JSON.stringify(correct);
    }
    case "fill-blanks": {
      const blanks = content.blanks as { id: string; correctAnswer: string }[];
      const answers = value as Record<string, string>;
      return blanks.every((b) => answers[b.id] === b.correctAnswer);
    }
    case "nmck-calculation": {
      const num = Number(value);
      const correct = content.correctAnswer as number;
      const tolerance = (content.tolerance as number) ?? 0;
      return Math.abs(num - correct) <= tolerance;
    }
    default:
      return false;
  }
}
