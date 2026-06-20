import type { AssessmentTask, TaskAnswer, TopicId } from "../types.js";
import tasksData from "../data/tasks.json" with { type: "json" };

const ADAPTIVE = {
  minQuestions: 15,
  maxQuestions: 20,
  initialDifficulty: 2,
  minDifficulty: 1,
  maxDifficulty: 4,
} as const;

const TOPIC_LABELS: Record<string, string> = {
  "44-fz": "44-ФЗ",
  methodology: "Методичка Росэлторг",
  "procurement-abc": "Азбука закупок",
  eetp: "Руководство пользователя ЕЭТП",
  "civil-code": "Гражданский кодекс",
  koap: "КоАП",
  "criminal-code": "УК РФ",
  "court-practice": "Судебная практика",
  fas: "Практика ФАС",
};

const GLOBAL_GRADE_LABELS: Record<string, string> = {
  intern: "Стажёр",
  basic: "Базовый специалист",
  expert: "Эксперт",
};

const COMPETENCY_LEVEL_LABELS: Record<string, string> = {
  novice: "Новичок",
  basic: "Базовый",
  advanced: "Продвинутый",
  expert: "Эксперт",
};

export function getTasksForAssessment(mode: string, topicId?: string, count = 15): AssessmentTask[] {
  let filtered = [...(tasksData as AssessmentTask[])];
  if (topicId) {
    filtered = filtered.filter((t) => t.topicId === topicId);
  }
  if (filtered.length < count) {
    filtered = [...(tasksData as AssessmentTask[])];
  }

  const interactiveFirst = [...filtered].sort((a, b) => {
    const score = (t: AssessmentTask) =>
      (t.type === "highlight-errors" ? 3 : 0) +
      (t.type === "step-sorting" || t.type === "missing-step" ? 2 : 0) +
      (t.type === "fill-blanks" || t.type === "fas-case" ? 1 : 0);
    return score(b) - score(a);
  });

  const taskCount =
    mode === "global" ? ADAPTIVE.minQuestions : mode === "competency" ? 12 : 10;

  return interactiveFirst.slice(0, count || taskCount);
}

function adjustDifficulty(current: number, isCorrect: boolean) {
  if (isCorrect) return Math.min(current + 1, ADAPTIVE.maxDifficulty);
  return Math.max(current - 1, ADAPTIVE.minDifficulty);
}

function calculateCompetencyMap(answers: TaskAnswer[], tasks: AssessmentTask[]) {
  const topicScores: Record<string, { correct: number; total: number }> = {};

  answers.forEach((answer, i) => {
    const task = tasks[i];
    if (!task) return;
    if (!topicScores[task.topicId]) topicScores[task.topicId] = { correct: 0, total: 0 };
    topicScores[task.topicId].total++;
    if (answer.isCorrect) topicScores[task.topicId].correct++;
  });

  return Object.entries(topicScores).map(([topicId, { correct, total }]) => {
    const score = Math.round((correct / total) * 100);
    let level = "novice";
    if (score >= 90) level = "expert";
    else if (score >= 70) level = "advanced";
    else if (score >= 50) level = "basic";

    let medal: string | undefined;
    if (score >= 95) medal = "platinum";
    else if (score >= 85) medal = "gold";
    else if (score >= 70) medal = "silver";
    else if (score >= 50) medal = "bronze";

    return { topicId, score, level, medal };
  });
}

function generateAiSummary(strengths: string[], weaknesses: string[], grade: string) {
  const strengthText =
    strengths.length > 0
      ? `высокий уровень владения ${strengths.slice(0, 2).join(" и ")}`
      : "базовые знания в области закупок";

  const weaknessText =
    weaknesses.length > 0
      ? `Требуется развитие компетенций в области ${weaknesses.slice(0, 2).join(" и ")}.`
      : "Рекомендуется поддерживать текущий уровень знаний.";

  const capability =
    grade === "expert"
      ? "Способен самостоятельно проводить закупочные процедуры."
      : grade === "basic"
        ? "Может выполнять типовые задачи под контролем руководителя."
        : "Рекомендуется дополнительное обучение и наставничество.";

  return `Кандидат демонстрирует ${strengthText}. ${capability} ${weaknessText}`;
}

export function buildSessionResponse(session: {
  id: string;
  userId: string;
  mode: string;
  topicId: string | null;
  startedAt: Date;
  completedAt: Date | null;
  tasks: unknown;
  answers: unknown;
  currentIndex: number;
  difficulty: number;
  status: string;
}) {
  return {
    id: session.id,
    userId: session.userId,
    mode: session.mode,
    topicId: session.topicId ?? undefined,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt?.toISOString(),
    tasks: session.tasks as AssessmentTask[],
    answers: session.answers as TaskAnswer[],
    currentIndex: session.currentIndex,
    difficulty: session.difficulty,
    status: session.status as "in_progress" | "completed" | "abandoned",
  };
}

export function computeResult(
  session: {
    id: string;
    userId: string;
    mode: string;
    topicId: string | null;
  },
  answers: TaskAnswer[],
  tasks: AssessmentTask[]
) {
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avgResponseTime =
    total > 0 ? Math.round(answers.reduce((s, a) => s + a.timeSpent, 0) / total) : 0;
  const errorCount = total - correct;
  const hintsUsed = answers.reduce((s, a) => s + a.hintsUsed, 0);
  const competencyMap = calculateCompetencyMap(answers, tasks);

  const sorted = [...competencyMap].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3).map((c) => TOPIC_LABELS[c.topicId] ?? c.topicId);
  const weaknesses = sorted
    .slice(-2)
    .filter((c) => c.score < 70)
    .map((c) => TOPIC_LABELS[c.topicId] ?? c.topicId);

  const globalGrade =
    accuracy >= 85 ? "expert" : accuracy >= 60 ? "basic" : "intern";
  const competencyLevel =
    accuracy >= 90 ? "expert" : accuracy >= 75 ? "advanced" : accuracy >= 50 ? "basic" : "novice";

  const gradeLabel =
    session.mode === "global" ? GLOBAL_GRADE_LABELS[globalGrade] : COMPETENCY_LEVEL_LABELS[competencyLevel];

  return {
    sessionId: session.id,
    userId: session.userId,
    mode: session.mode,
    topicId: session.topicId ?? undefined,
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
          `Для достижения уровня ${gradeLabel} рекомендуется пройти темы: ${weaknesses.join(", ")}`,
        ]
      : ["Отличный результат! Продолжайте развивать компетенции"],
    aiSummary: generateAiSummary(strengths, weaknesses, globalGrade),
    completedAt: new Date().toISOString(),
  };
}

export { adjustDifficulty, ADAPTIVE };
