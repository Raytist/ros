export type UserRole = "candidate" | "recruiter";

export type GlobalGrade = "intern" | "basic" | "expert";

export type CompetencyLevel = "novice" | "basic" | "advanced" | "expert";

export type MedalTier = "bronze" | "silver" | "gold" | "platinum";

export type TopicId =
  | "44-fz"
  | "methodology"
  | "procurement-abc"
  | "eetp"
  | "civil-code"
  | "koap"
  | "criminal-code"
  | "court-practice"
  | "fas";

export type TaskType =
  | "text-highlight"
  | "article-search"
  | "step-sorting"
  | "missing-step"
  | "fill-blanks"
  | "nmck-calculation"
  | "fas-case"
  | "find-violation"
  | "highlight-errors"
  | "next-step";

export type AssessmentMode =
  | "global"
  | "competency"
  | "basic"
  | "medium"
  | "hard";

export type Difficulty = 1 | 2 | 3 | 4;

export interface KnowledgeSource {
  law: string;
  article?: string;
  chapter?: string;
  label: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
  createdAt: string;
}

export interface Topic {
  id: TopicId;
  title: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  estimatedMinutes: number;
}

export interface TopicCompetency {
  topicId: TopicId;
  score: number;
  level: CompetencyLevel;
  medal?: MedalTier;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface AssessmentTask {
  id: string;
  type: TaskType;
  topicId: TopicId;
  difficulty: Difficulty;
  title: string;
  instruction: string;
  content: TaskContent;
  source: KnowledgeSource;
  timeLimit?: number;
  hints?: string[];
}

export type TaskContent =
  | TextHighlightContent
  | ArticleSearchContent
  | StepSortingContent
  | MissingStepContent
  | FillBlanksContent
  | NmckCalculationContent
  | FasCaseContent
  | FindViolationContent
  | HighlightErrorsContent
  | NextStepContent;

export interface TextHighlightContent {
  type: "text-highlight";
  text: string;
  correctSentenceIndex: number;
  sentences: string[];
}

export interface ArticleSearchContent {
  type: "article-search";
  question: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
}

export interface StepSortingContent {
  type: "step-sorting";
  steps: { id: string; label: string }[];
  correctOrder: string[];
}

export interface MissingStepContent {
  type: "missing-step";
  process: { id: string; label: string; isMissing?: boolean }[];
  options: { id: string; label: string }[];
  correctOptionId: string;
}

export interface FillBlanksContent {
  type: "fill-blanks";
  template: string;
  blanks: { id: string; correctAnswer: string; options: string[] }[];
}

export interface NmckCalculationContent {
  type: "nmck-calculation";
  caseDescription: string;
  items: { name: string; price: number; quantity: number }[];
  correctAnswer: number;
  tolerance: number;
}

export interface FasCaseContent {
  type: "fas-case";
  scenario: string;
  question: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
}

export interface FindViolationContent {
  type: "find-violation";
  document: string;
  violations: { id: string; text: string; description: string }[];
  correctViolationId: string;
}

export interface HighlightErrorsContent {
  type: "highlight-errors";
  intro?: string;
  paragraphs: {
    segments: { id: string; text: string }[];
  }[];
  correctSegmentIds: string[];
}

export interface NextStepContent {
  type: "next-step";
  currentStep: string;
  completedSteps: string[];
  options: { id: string; label: string }[];
  correctOptionId: string;
}

export interface TaskAnswer {
  taskId: string;
  value: unknown;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

export interface AssessmentSession {
  id: string;
  userId: string;
  mode: AssessmentMode;
  topicId?: TopicId;
  startedAt: string;
  completedAt?: string;
  tasks: AssessmentTask[];
  answers: TaskAnswer[];
  currentIndex: number;
  difficulty: Difficulty;
  status: "in_progress" | "completed" | "abandoned";
}

export interface AssessmentResult {
  sessionId: string;
  userId: string;
  mode: AssessmentMode;
  topicId?: TopicId;
  globalGrade?: GlobalGrade;
  competencyLevel?: CompetencyLevel;
  skillScore: number;
  accuracy: number;
  avgResponseTime: number;
  errorCount: number;
  hintsUsed: number;
  confidenceLevel: number;
  competencyMap: TopicCompetency[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  aiSummary: string;
  completedAt: string;
}

export interface CandidateProfile extends User {
  globalGrade: GlobalGrade;
  skillScore: number;
  rating: number;
  medalCount: number;
  competencies: TopicCompetency[];
  achievements: Achievement[];
  assessmentHistory: AssessmentResult[];
  analytics: CandidateAnalytics;
}

export interface CandidateAnalytics {
  skillScore: number;
  accuracy: number;
  avgResponseTime: number;
  errorCount: number;
  hintsUsed: number;
  confidenceLevel: number;
  percentileRank: number;
  comparisonData: { metric: string; candidate: number; average: number }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  skillScore: number;
  globalGrade: GlobalGrade;
  medalCount: number;
  streak: number;
}

export interface RecruiterFilters {
  grade?: GlobalGrade;
  topicId?: TopicId;
  medal?: MedalTier;
  minRating?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CandidateListItem {
  id: string;
  name: string;
  globalGrade: GlobalGrade;
  skillScore: number;
  medalCount: number;
  lastAssessmentDate: string;
  competencies: TopicCompetency[];
}
