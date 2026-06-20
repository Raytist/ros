"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/layout/auth-guard";
import { TopicCard } from "@/components/dashboard/topic-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProfile, useTopics } from "@/hooks/use-api";
import { GLOBAL_GRADE_LABELS, LABELS, TOPIC_LABELS } from "@/lib/constants";

export default function DashboardPage() {
  const { data: profileData } = useProfile();
  const { data: topicsData } = useTopics();
  const profile = profileData?.profile;
  const topics = topicsData?.topics ?? [];

  return (
    <AuthGuard role="candidate">
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--muted)]">Соискателю</p>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Проверьте знания и подтвердите квалификацию
            </h1>
          </div>
          <Link href="/assessment/global">
            <Button>Начать практикум</Button>
          </Link>
        </div>

        {profile && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-[var(--muted)]">{LABELS.skillScore}</p>
                <p className="mt-1 text-3xl font-semibold text-[var(--primary)]">{profile.skillScore}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-[var(--muted)]">Уровень</p>
                <p className="mt-1 text-lg font-semibold">{GLOBAL_GRADE_LABELS[profile.globalGrade]}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-[var(--muted)]">Медали</p>
                <p className="mt-1 text-3xl font-semibold">{profile.medalCount}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {profile && profile.competencies.length > 0 && (
          <Card>
            <CardContent className="space-y-4 p-5">
              <h2 className="font-semibold">Компетенции по темам</h2>
              <div className="space-y-3">
                {profile.competencies.slice(0, 5).map((c) => (
                  <div key={c.topicId}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{TOPIC_LABELS[c.topicId]}</span>
                      <span className="font-medium">{c.score}%</span>
                    </div>
                    <Progress value={c.score} />
                  </div>
                ))}
              </div>
              <Link href="/profile" className="text-sm text-[var(--primary)] hover:underline">
                Подробнее в профиле
              </Link>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="mb-4 text-lg font-semibold">Тематические направления</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.slice(0, 6).map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                competency={profile?.competencies.find((c) => c.topicId === topic.id)}
              />
            ))}
          </div>
          <Link href="/topics" className="mt-4 inline-block text-sm text-[var(--primary)] hover:underline">
            Все темы
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
}
