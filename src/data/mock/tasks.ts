import type { AssessmentTask } from "@/types";
import tasksData from "./tasks.json";

export const mockTasks = tasksData as AssessmentTask[];

export function getTasksForAssessment(
  mode: string,
  topicId?: string,
  count = 15
): AssessmentTask[] {
  let filtered = [...mockTasks];
  if (topicId) {
    filtered = filtered.filter((t) => t.topicId === topicId);
  }
  if (filtered.length < count) {
    filtered = topicId
      ? mockTasks.filter((t) => t.topicId === topicId)
      : [...mockTasks];
  }

  const interactiveFirst = [...filtered].sort((a, b) => {
    const score = (t: AssessmentTask) =>
      (t.type === "highlight-errors" ? 3 : 0) +
      (t.type === "step-sorting" || t.type === "missing-step" ? 2 : 0) +
      (t.type === "fill-blanks" || t.type === "fas-case" ? 1 : 0);
    return score(b) - score(a);
  });

  const taskCount =
    mode === "global" ? Math.min(count, 20) : mode === "competency" ? 12 : 10;

  return interactiveFirst.slice(0, count || taskCount);
}
