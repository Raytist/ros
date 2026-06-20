import type { AssessmentTask } from "../types.js";

const ADAPTIVE = {
  minQuestions: 15,
  maxQuestions: 20,
  initialDifficulty: 2,
  minDifficulty: 1,
  maxDifficulty: 4,
} as const;

export function getMinQuestions(mode: string): number {
  if (mode === "global") return ADAPTIVE.minQuestions;
  if (mode === "competency") return 10;
  return 8;
}

export function getMaxQuestions(mode: string): number {
  if (mode === "global") return ADAPTIVE.maxQuestions;
  if (mode === "competency") return 12;
  return 10;
}

function getDifficultyBand(mode: string) {
  switch (mode) {
    case "basic":
      return { min: 1, max: 2 };
    case "medium":
      return { min: 2, max: 3 };
    case "hard":
      return { min: 3, max: 4 };
    default:
      return { min: ADAPTIVE.minDifficulty, max: ADAPTIVE.maxDifficulty };
  }
}

export function buildTaskPool(
  allTasks: AssessmentTask[],
  mode: string,
  topicId?: string
): AssessmentTask[] {
  const { min, max } = getDifficultyBand(mode);
  let pool = allTasks.filter((t) => t.difficulty >= min && t.difficulty <= max);
  if (topicId) pool = pool.filter((t) => t.topicId === topicId);
  return pool;
}

export function pickNextTask(
  pool: AssessmentTask[],
  usedTaskIds: Set<string>,
  targetDifficulty: number,
  recentTypes: string[]
): AssessmentTask | null {
  const available = pool.filter((t) => !usedTaskIds.has(t.id));
  if (available.length === 0) return null;

  const scored = available.map((task) => {
    let score = 0;
    score += (4 - Math.abs(task.difficulty - targetDifficulty)) * 10;
    if (!recentTypes.includes(task.type)) score += 20;
    if (recentTypes.length > 0 && task.type === recentTypes[recentTypes.length - 1]) score -= 25;
    score += Math.random() * 4;
    return { task, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(4, scored.length));
  return top[Math.floor(Math.random() * top.length)]!.task;
}

export function startAdaptiveSession(pool: AssessmentTask[], initialDifficulty: number): AssessmentTask[] {
  const first = pickNextTask(pool, new Set(), initialDifficulty, []);
  return first ? [first] : [];
}

export function appendNextTaskIfNeeded(
  pool: AssessmentTask[],
  sessionTasks: AssessmentTask[],
  targetDifficulty: number
): AssessmentTask | null {
  const usedIds = new Set(sessionTasks.map((t) => t.id));
  const recentTypes = sessionTasks.slice(-2).map((t) => t.type);
  return pickNextTask(pool, usedIds, targetDifficulty, recentTypes);
}

export function isSessionComplete(mode: string, answerCount: number, canPickMore: boolean): boolean {
  if (answerCount >= getMaxQuestions(mode)) return true;
  if (!canPickMore && answerCount >= getMinQuestions(mode)) return true;
  return false;
}

export function adjustDifficulty(current: number, isCorrect: boolean) {
  if (isCorrect) return Math.min(current + 1, ADAPTIVE.maxDifficulty);
  return Math.max(current - 1, ADAPTIVE.minDifficulty);
}

export { ADAPTIVE };
