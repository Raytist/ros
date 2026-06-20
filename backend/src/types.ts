export type UserRole = "candidate" | "recruiter";

export interface TaskAnswer {
  taskId: string;
  value: unknown;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

export interface AssessmentTask {
  id: string;
  type: string;
  topicId: string;
  difficulty: number;
  title: string;
  instruction: string;
  content: Record<string, unknown>;
  source: Record<string, unknown>;
  timeLimit?: number;
  hints?: string[];
}

export type TopicId = string;
