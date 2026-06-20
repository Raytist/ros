"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MedalBadge } from "@/components/ui/source-badge";
import { CompetencyRadar } from "@/components/charts/competency-charts";
import { useProfile } from "@/hooks/use-api";
import {
  GLOBAL_GRADE_LABELS,
  TOPIC_LABELS,
  COMPETENCY_LEVEL_LABELS,
  LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { data, isLoading } = useProfile();
  const profile = data?.profile;

  if (isLoading || !profile) {
    return (
      <AuthGuard role="candidate">
        <div className="py-12 text-center text-[var(--muted)]">Загрузка профиля...</div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="candidate">
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-5 p-5">
            <Avatar name={profile.name} size="lg" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{profile.name}</h1>
              <p className="text-sm text-[var(--muted)]">{profile.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="expert">{GLOBAL_GRADE_LABELS[profile.globalGrade]}</Badge>
                <Badge variant="default">{LABELS.skillScore}: {profile.skillScore}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[var(--muted)]">{LABELS.accuracy}</p>
              <p className="text-2xl font-semibold">{profile.analytics.accuracy}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[var(--muted)]">{LABELS.avgTime}</p>
              <p className="text-2xl font-semibold">{profile.analytics.avgResponseTime} сек</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[var(--muted)]">{LABELS.percentile}</p>
              <p className="text-2xl font-semibold">{profile.analytics.percentileRank}</p>
            </CardContent>
          </Card>
        </div>

        <CompetencyRadar competencies={profile.competencies} />

        <div>
          <h2 className="mb-3 font-semibold">Медали</h2>
          <div className="flex flex-wrap gap-2">
            {profile.competencies
              .filter((c) => c.medal)
              .map((c) => (
                <div key={c.topicId} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <MedalBadge tier={c.medal!} size="sm" />
                  <span>{TOPIC_LABELS[c.topicId]}</span>
                  <span className="text-[var(--muted)]">{COMPETENCY_LEVEL_LABELS[c.level]}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">Достижения</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.achievements.map((ach) => (
              <Card key={ach.id}>
                <CardContent className="p-4">
                  <p className="font-medium">{ach.title}</p>
                  <p className="text-sm text-[var(--muted)]">{ach.description}</p>
                  {ach.unlockedAt && (
                    <p className="mt-1 text-xs text-[var(--primary)]">{formatDate(ach.unlockedAt)}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Link href="/results" className="text-sm text-[var(--primary)] hover:underline">
          История практикума
        </Link>
      </div>
    </AuthGuard>
  );
}
