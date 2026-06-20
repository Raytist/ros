import type { AssessmentResult } from "@/types";
import { mockCandidateProfile } from "./users";

export const mockAssessmentResults: AssessmentResult[] = [
  {
    sessionId: "session-1",
    userId: "user-1",
    mode: "global",
    globalGrade: "expert",
    skillScore: 87,
    accuracy: 91,
    avgResponseTime: 42,
    errorCount: 2,
    hintsUsed: 1,
    confidenceLevel: 85,
    competencyMap: mockCandidateProfile.competencies,
    strengths: ["44-ФЗ", "ЕЭТП", "Методичка Росэлторг"],
    weaknesses: ["Судебная практика", "КоАП"],
    recommendations: [
      "Для достижения уровня Эксперт рекомендуется пройти темы: Судебная практика, Практика ФАС, КоАП",
      "Углубите знания административной ответственности",
    ],
    aiSummary:
      "Кандидат демонстрирует высокий уровень владения 44-ФЗ и уверенную работу в ЕЭТП. Способен самостоятельно проводить закупочные процедуры. Требуется развитие компетенций в области судебной практики и взаимодействия с ФАС.",
    completedAt: "2026-06-15T10:45:00Z",
  },
  {
    sessionId: "session-2",
    userId: "user-1",
    mode: "competency",
    topicId: "44-fz",
    competencyLevel: "expert",
    skillScore: 95,
    accuracy: 96,
    avgResponseTime: 38,
    errorCount: 0,
    hintsUsed: 0,
    confidenceLevel: 92,
    competencyMap: [{ topicId: "44-fz", score: 95, level: "expert", medal: "platinum" }],
    strengths: ["Знание сроков", "НМЦК", "Этапы закупки"],
    weaknesses: [],
    recommendations: ["Пройдите сложный уровень для получения платиновой медали"],
    aiSummary: "Отличное знание 44-ФЗ. Кандидат уверенно ориентируется в нормах закона и практике применения.",
    completedAt: "2026-06-10T14:20:00Z",
  },
];

export function generateAiSummary(
  strengths: string[],
  weaknesses: string[],
  grade: string
): string {
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
