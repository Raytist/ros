import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";
import { useAuthStore } from "@/stores/auth-store";
import type { RecruiterFilters, TopicId } from "@/types";

function useAuthReady() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  return isAuthenticated && Boolean(token);
}

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: () => api.topics.list(),
  });
}

export function useTopic(id: TopicId) {
  return useQuery({
    queryKey: ["topics", id],
    queryFn: () => api.topics.get(id),
    enabled: !!id,
  });
}

export function useProfile() {
  const ready = useAuthReady();
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.profile.get(),
    enabled: ready,
  });
}

export function useResults() {
  const ready = useAuthReady();
  return useQuery({
    queryKey: ["results"],
    queryFn: () => api.results.list(),
    enabled: ready,
  });
}

export function useCandidates(filters: RecruiterFilters = {}) {
  const ready = useAuthReady();
  return useQuery({
    queryKey: ["candidates", filters],
    queryFn: () => api.recruiter.getCandidates(filters),
    enabled: ready,
  });
}

export function useCandidate(id: string) {
  const ready = useAuthReady();
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: () => api.recruiter.getCandidate(id),
    enabled: ready && !!id,
  });
}

export function useLeaderboard() {
  const ready = useAuthReady();
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api.leaderboard.get(),
    enabled: ready,
  });
}
