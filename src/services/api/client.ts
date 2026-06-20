import type {
  CompleteAssessmentResponse,
  GetCandidateResponse,
  GetCandidatesResponse,
  GetLeaderboardResponse,
  GetProfileResponse,
  GetResultsResponse,
  GetTopicsResponse,
  LoginResponse,
  StartAssessmentResponse,
  SubmitAnswerResponse,
} from "@/types/api";
import type {
  AssessmentMode,
  RecruiterFilters,
  TaskAnswer,
  Topic,
  TopicId,
} from "@/types";
import { apiFetch, isApiEnabled } from "./fetch-client";
import { mockApi } from "./mock-client";

export const api = {
  auth: {
    login: (email: string, password: string, role?: "candidate" | "recruiter") =>
      isApiEnabled()
        ? apiFetch<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password, role }),
          })
        : mockApi.auth.login(email, role),
  },

  topics: {
    list: (): Promise<GetTopicsResponse> =>
      isApiEnabled() ? apiFetch<GetTopicsResponse>("/topics") : mockApi.topics.list(),
    get: (id: TopicId): Promise<Topic | null> =>
      isApiEnabled()
        ? apiFetch<Topic>(`/topics/${id}`).catch(() => null)
        : mockApi.topics.get(id),
  },

  assessment: {
    start: (userId: string, mode: AssessmentMode, topicId?: TopicId) =>
      isApiEnabled()
        ? apiFetch<StartAssessmentResponse>("/assessment/start", {
            method: "POST",
            body: JSON.stringify({ mode, topicId }),
          })
        : mockApi.assessment.start(userId, mode, topicId),

    submitAnswer: (sessionId: string, answer: TaskAnswer) =>
      isApiEnabled()
        ? apiFetch<SubmitAnswerResponse>(`/assessment/${sessionId}/answer`, {
            method: "POST",
            body: JSON.stringify({ answer }),
          })
        : mockApi.assessment.submitAnswer(sessionId, answer),

    complete: (sessionId: string) =>
      isApiEnabled()
        ? apiFetch<CompleteAssessmentResponse>(`/assessment/${sessionId}/complete`, {
            method: "POST",
            body: JSON.stringify({}),
          })
        : mockApi.assessment.complete(),
  },

  profile: {
    get: (): Promise<GetProfileResponse> =>
      isApiEnabled() ? apiFetch<GetProfileResponse>("/profile") : mockApi.profile.get(),
  },

  results: {
    list: (): Promise<GetResultsResponse> =>
      isApiEnabled() ? apiFetch<GetResultsResponse>("/results") : mockApi.results.list(),
  },

  recruiter: {
    getCandidates: (filters: RecruiterFilters = {}) => {
      if (!isApiEnabled()) return mockApi.recruiter.getCandidates(filters);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== "") params.set(k, String(v));
      });
      const q = params.toString();
      return apiFetch<GetCandidatesResponse>(`/recruiter/candidates${q ? `?${q}` : ""}`);
    },

    getCandidate: (id: string): Promise<GetCandidateResponse> =>
      isApiEnabled()
        ? apiFetch<GetCandidateResponse>(`/recruiter/candidates/${id}`)
        : mockApi.recruiter.getCandidate(id),
  },

  leaderboard: {
    get: (): Promise<GetLeaderboardResponse> =>
      isApiEnabled() ? apiFetch<GetLeaderboardResponse>("/leaderboard") : mockApi.leaderboard.get(),
  },
};
