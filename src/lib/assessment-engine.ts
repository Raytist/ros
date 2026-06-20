import type { AssessmentMode, AssessmentTask, Difficulty, TopicId } from "@/types";
import { ADAPTIVE_CONFIG } from "@/lib/constants";

export function getMinQuestions(mode: AssessmentMode): number {
  if (mode === "global") return ADAPTIVE_CONFIG.minQuestions;
  if (mode === "competency") return 10;
  return 8;
}

export function getMaxQuestions(mode: AssessmentMode): number {
  if (mode === "global") return ADAPTIVE_CONFIG.maxQuestions;
  if (mode === "competency") return 12;
  return 10;
}

export function getDifficultyBand(mode: AssessmentMode): { min: Difficulty; max: Difficulty } {
  switch (mode) {
    case "basic":
      return { min: 1, max: 2 };
    case "medium":
      return { min: 2, max: 3 };
    case "hard":
      return { min: 3, max: 4 };
    default:
      return {
        min: ADAPTIVE_CONFIG.minDifficulty as Difficulty,
        max: ADAPTIVE_CONFIG.maxDifficulty as Difficulty,
      };
  }
}

export function buildTaskPool(
  allTasks: AssessmentTask[],
  mode: AssessmentMode,
  topicId?: TopicId
): AssessmentTask[] {
  const { min, max } = getDifficultyBand(mode);
  let pool = allTasks.filter((t) => t.difficulty >= min && t.difficulty <= max);

  if (topicId) {
    pool = pool.filter((t) => t.topicId === topicId);
  }

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

export function startAdaptiveSession(
  pool: AssessmentTask[],
  initialDifficulty: number
): AssessmentTask[] {
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

export function isSessionComplete(
  mode: AssessmentMode,
  answerCount: number,
  canPickMore: boolean
): boolean {
  const maxQ = getMaxQuestions(mode);
  const minQ = getMinQuestions(mode);
  if (answerCount >= maxQ) return true;
  if (!canPickMore && answerCount >= minQ) return true;
  return false;
}

export function adjustDifficulty(current: Difficulty, isCorrect: boolean): Difficulty {
  if (isCorrect) {
    return Math.min(current + 1, ADAPTIVE_CONFIG.maxDifficulty) as Difficulty;
  }
  return Math.max(current - 1, ADAPTIVE_CONFIG.minDifficulty) as Difficulty;
}
