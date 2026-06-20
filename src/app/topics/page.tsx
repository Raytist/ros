"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { TopicCard } from "@/components/dashboard/topic-card";
import { useTopics, useProfile } from "@/hooks/use-api";

export default function TopicsPage() {
  const { data: topicsData, isLoading } = useTopics();
  const { data: profileData } = useProfile();
  const topics = topicsData?.topics ?? [];
  const profile = profileData?.profile;

  return (
    <AuthGuard role="candidate">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-[var(--muted)]">Соискателю</p>
          <h1 className="text-2xl font-semibold">Тематические направления</h1>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-lg bg-[var(--border)]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                competency={profile?.competencies.find((c) => c.topicId === topic.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
