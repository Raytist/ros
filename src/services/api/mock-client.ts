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
  TopicId,
} from "@/types";
import { mockTopics } from "@/data/mock/topics";
import {
  mockCandidateProfile,
  mockCandidates,
  mockLeaderboard,
  mockUsers,
} from "@/data/mock/users";
import { mockAssessmentResults } from "@/data/mock/results";
import { getTasksForAssessment } from "@/data/mock/tasks";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  auth: {
    login: async (email: string, role?: "candidate" | "recruiter"): Promise<LoginResponse> => {
      await delay();
      const user =
        mockUsers.find((u) => u.email === email && u.role === role) ??
        mockUsers.find((u) => u.role === (role ?? "candidate"))!;
      return { user, token: `mock-token-${user.id}` };
    },
  },

  topics: {
    list: async (): Promise<GetTopicsResponse> => {
      await delay();
      return { topics: mockTopics };
    },
    get: async (id: TopicId) => {
      await delay();
      return mockTopics.find((t) => t.id === id) ?? null;
    },
  },

  assessment: {
    start: async (
      userId: string,
      mode: AssessmentMode,
      topicId?: TopicId
    ): Promise<StartAssessmentResponse> => {
      await delay();
      const tasks = getTasksForAssessment(mode, topicId, mode === "global" ? 18 : 10);
      return {
        session: {
          id: `session-${Date.now()}`,
          userId,
          mode,
          topicId,
          startedAt: new Date().toISOString(),
          tasks,
          answers: [],
          currentIndex: 0,
          difficulty: 2,
          status: "in_progress",
        },
      };
    },

    submitAnswer: async (
      sessionId: string,
      answer: TaskAnswer
    ): Promise<SubmitAnswerResponse> => {
      await delay(200);
      return {
        session: {
          id: sessionId,
          userId: "user-1",
          mode: "global",
          startedAt: new Date().toISOString(),
          tasks: getTasksForAssessment("global", undefined, 18),
          answers: [answer],
          currentIndex: 1,
          difficulty: 2,
          status: "in_progress",
        },
        isComplete: false,
      };
    },

    complete: async (): Promise<CompleteAssessmentResponse> => {
      await delay();
      return { result: mockAssessmentResults[0] };
    },
  },

  profile: {
    get: async (): Promise<GetProfileResponse> => {
      await delay();
      return {
        profile: {
          ...mockCandidateProfile,
          assessmentHistory: mockAssessmentResults,
        },
      };
    },
  },

  results: {
    list: async (): Promise<GetResultsResponse> => {
      await delay();
      return { results: mockAssessmentResults };
    },
  },

  recruiter: {
    getCandidates: async (
      filters: RecruiterFilters = {}
    ): Promise<GetCandidatesResponse> => {
      await delay();
      let candidates = [...mockCandidates];

      if (filters.grade) {
        candidates = candidates.filter((c) => c.globalGrade === filters.grade);
      }
      if (filters.minRating) {
        candidates = candidates.filter((c) => c.skillScore >= filters.minRating!);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        candidates = candidates.filter((c) => c.name.toLowerCase().includes(q));
      }
      if (filters.topicId) {
        candidates = candidates.filter((c) =>
          c.competencies.some((comp) => comp.topicId === filters.topicId)
        );
      }
      if (filters.medal) {
        candidates = candidates.filter((c) =>
          c.competencies.some((comp) => comp.medal === filters.medal)
        );
      }

      return { candidates, total: candidates.length };
    },

    getCandidate: async (id: string): Promise<GetCandidateResponse> => {
      await delay();
      const listItem = mockCandidates.find((c) => c.id === id);
      if (!listItem) throw new Error("Candidate not found");

      return {
        candidate: {
          ...mockCandidateProfile,
          id: listItem.id,
          name: listItem.name,
          globalGrade: listItem.globalGrade,
          skillScore: listItem.skillScore,
          medalCount: listItem.medalCount,
          competencies: listItem.competencies,
          assessmentHistory: mockAssessmentResults,
        },
      };
    },
  },

  leaderboard: {
    get: async (): Promise<GetLeaderboardResponse> => {
      await delay();
      return { entries: mockLeaderboard, currentUserRank: 2 };
    },
  },
};
