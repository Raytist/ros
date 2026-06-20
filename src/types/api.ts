import type {
  AssessmentMode,
  AssessmentResult,
  AssessmentSession,
  CandidateListItem,
  CandidateProfile,
  LeaderboardEntry,
  RecruiterFilters,
  TaskAnswer,
  Topic,
  TopicId,
  User,
} from "./index";

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: "candidate" | "recruiter";
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface StartAssessmentRequest {
  mode: AssessmentMode;
  topicId?: TopicId;
}

export interface StartAssessmentResponse {
  session: AssessmentSession;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  answer: TaskAnswer;
}

export interface SubmitAnswerResponse {
  session: AssessmentSession;
  nextTask?: AssessmentSession["tasks"][0];
  isComplete: boolean;
}

export interface CompleteAssessmentResponse {
  result: AssessmentResult;
}

export interface GetTopicsResponse {
  topics: Topic[];
}

export interface GetProfileResponse {
  profile: CandidateProfile;
}

export interface GetCandidatesRequest extends RecruiterFilters {
  page?: number;
  pageSize?: number;
}

export interface GetCandidatesResponse {
  candidates: CandidateListItem[];
  total: number;
}

export interface GetCandidateResponse {
  candidate: CandidateProfile;
}

export interface GetLeaderboardResponse {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

export interface GetResultsResponse {
  results: AssessmentResult[];
}
