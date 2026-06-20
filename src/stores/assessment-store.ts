import { create } from "zustand";
import type {
  AssessmentMode,
  AssessmentResult,
  AssessmentSession,
  AssessmentTask,
  Difficulty,
  TaskAnswer,
  TopicId,
} from "@/types";
import { ADAPTIVE_CONFIG } from "@/lib/constants";
import {
  adjustDifficulty,
  appendNextTaskIfNeeded,
  buildTaskPool,
  isSessionComplete,
  startAdaptiveSession,
} from "@/lib/assessment-engine";
import { mockTasks } from "@/data/mock/tasks";
import { generateAiSummary } from "@/data/mock/results";
import { mockTopics } from "@/data/mock/topics";
import { COMPETENCY_LEVEL_LABELS, GLOBAL_GRADE_LABELS } from "@/lib/constants";

interface AssessmentState {
  session: AssessmentSession | null;
  result: AssessmentResult | null;
  isLoading: boolean;
  startSession: (userId: string, mode: AssessmentMode, topicId?: TopicId) => void;
  submitAnswer: (answer: TaskAnswer) => void;
  useHint: () => void;
  completeSession: () => AssessmentResult | null;
  resetSession: () => void;
}

function calculateCompetencyMap(answers: TaskAnswer[], tasks: AssessmentTask[]) {
  const topicScores: Record<string, { correct: number; total: number }> = {};

  answers.forEach((answer, i) => {
    const task = tasks[i];
    if (!task) return;
    if (!topicScores[task.topicId]) {
      topicScores[task.topicId] = { correct: 0, total: 0 };
    }
    topicScores[task.topicId].total++;
    if (answer.isCorrect) topicScores[task.topicId].correct++;
  });

  return Object.entries(topicScores).map(([topicId, { correct, total }]) => {
    const score = Math.round((correct / total) * 100);
    let level: "novice" | "basic" | "advanced" | "expert" = "novice";
    if (score >= 90) level = "expert";
    else if (score >= 70) level = "advanced";
    else if (score >= 50) level = "basic";

    let medal: "bronze" | "silver" | "gold" | "platinum" | undefined;
    if (score >= 95) medal = "platinum";
    else if (score >= 85) medal = "gold";
    else if (score >= 70) medal = "silver";
    else if (score >= 50) medal = "bronze";

    return { topicId: topicId as TopicId, score, level, medal };
  });
}

function determineGlobalGrade(accuracy: number): "intern" | "basic" | "expert" {
  if (accuracy >= 85) return "expert";
  if (accuracy >= 60) return "basic";
  return "intern";
}

function determineCompetencyLevel(accuracy: number): "novice" | "basic" | "advanced" | "expert" {
  if (accuracy >= 90) return "expert";
  if (accuracy >= 75) return "advanced";
  if (accuracy >= 50) return "basic";
  return "novice";
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  session: null,
  result: null,
  isLoading: false,

  startSession: (userId, mode, topicId) => {
    const pool = buildTaskPool(mockTasks, mode, topicId);
    const initialTasks = startAdaptiveSession(pool, ADAPTIVE_CONFIG.initialDifficulty);

    set({
      session: {
        id: `session-${Date.now()}`,
        userId,
        mode,
        topicId,
        startedAt: new Date().toISOString(),
        tasks: initialTasks,
        answers: [],
        currentIndex: 0,
        difficulty: ADAPTIVE_CONFIG.initialDifficulty as Difficulty,
        status: initialTasks.length > 0 ? "in_progress" : "abandoned",
      },
      result: null,
    });
  },

  submitAnswer: (answer) => {
    const { session } = get();
    if (!session) return;

    const pool = buildTaskPool(mockTasks, session.mode, session.topicId);
    const newDifficulty = adjustDifficulty(session.difficulty, answer.isCorrect);
    const newAnswers = [...session.answers, answer];
    const nextIndex = session.currentIndex + 1;

    let tasks = [...session.tasks];
    const nextTask = appendNextTaskIfNeeded(pool, tasks, newDifficulty);
    const canPickMore = Boolean(nextTask);

    if (nextTask && !isSessionComplete(session.mode, newAnswers.length, canPickMore)) {
      if (!tasks[nextIndex]) {
        tasks = [...tasks, nextTask];
      }
    }

    const complete = isSessionComplete(session.mode, newAnswers.length, canPickMore);

    set({
      session: {
        ...session,
        tasks,
        answers: newAnswers,
        currentIndex: complete ? session.currentIndex : nextIndex,
        difficulty: newDifficulty,
        status: complete ? "completed" : "in_progress",
        completedAt: complete ? new Date().toISOString() : undefined,
      },
    });
  },

  useHint: () => {
    /* tracked per answer in task components */
  },

  completeSession: () => {
    const { session } = get();
    if (!session) return null;

    const answeredTasks = session.tasks.slice(0, session.answers.length);
    const correct = session.answers.filter((a) => a.isCorrect).length;
    const total = session.answers.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const avgResponseTime =
      total > 0
        ? Math.round(session.answers.reduce((s, a) => s + a.timeSpent, 0) / total)
        : 0;
    const errorCount = total - correct;
    const hintsUsed = session.answers.reduce((s, a) => s + a.hintsUsed, 0);
    const competencyMap = calculateCompetencyMap(session.answers, answeredTasks);

    const sorted = [...competencyMap].sort((a, b) => b.score - a.score);
    const strengths = sorted.slice(0, 3).map((c) => {
      const topic = mockTopics.find((t) => t.id === c.topicId);
      return topic?.title ?? c.topicId;
    });
    const weaknesses = sorted
      .slice(-2)
      .filter((c) => c.score < 70)
      .map((c) => {
        const topic = mockTopics.find((t) => t.id === c.topicId);
        return topic?.title ?? c.topicId;
      });

    const globalGrade = determineGlobalGrade(accuracy);
    const competencyLevel = determineCompetencyLevel(accuracy);

    const result: AssessmentResult = {
      sessionId: session.id,
      userId: session.userId,
      mode: session.mode,
      topicId: session.topicId,
      globalGrade: session.mode === "global" ? globalGrade : undefined,
      competencyLevel: session.mode !== "global" ? competencyLevel : undefined,
      skillScore: accuracy,
      accuracy,
      avgResponseTime,
      errorCount,
      hintsUsed,
      confidenceLevel: Math.max(0, accuracy - hintsUsed * 5),
      competencyMap,
      strengths,
      weaknesses,
      recommendations: weaknesses.length
        ? [
            `Для достижения уровня ${session.mode === "global" ? GLOBAL_GRADE_LABELS.expert : COMPETENCY_LEVEL_LABELS.expert} рекомендуется пройти темы: ${weaknesses.join(", ")}`,
          ]
        : ["Отличный результат! Продолжайте развивать компетенции"],
      aiSummary: generateAiSummary(strengths, weaknesses, globalGrade),
      completedAt: new Date().toISOString(),
    };

    set({ result, session: { ...session, status: "completed" } });
    return result;
  },

  resetSession: () => set({ session: null, result: null }),
}));
