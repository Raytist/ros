"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Target, BookOpen, Layers, Flame, ArrowRight } from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MedalBadge } from "@/components/ui/source-badge";
import { useTopic, useProfile } from "@/hooks/use-api";
import { ASSESSMENT_MODES, COMPETENCY_LEVEL_LABELS, TOPIC_LABELS } from "@/lib/constants";
import type { TopicId } from "@/types";

const testModes = [
  { key: "competency", label: ASSESSMENT_MODES.competency, icon: Target, desc: "Адаптивная проверка" },
  { key: "basic", label: ASSESSMENT_MODES.basic, icon: BookOpen, desc: "Базовый уровень" },
  { key: "medium", label: ASSESSMENT_MODES.medium, icon: Layers, desc: "Средний уровень" },
  { key: "hard", label: ASSESSMENT_MODES.hard, icon: Flame, desc: "Сложный уровень" },
] as const;

export default function TopicDetailPage() {
  const params = useParams();
  const id = params.id as TopicId;
  const { data: topic } = useTopic(id);
  const { data: profileData } = useProfile();
  const competency = profileData?.profile?.competencies.find((c) => c.topicId === id);

  if (!topic) {
    return (
      <AuthGuard role="candidate">
        <div className="py-12 text-center text-[var(--muted)]">Загрузка...</div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="candidate">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/topics" className="text-sm text-[var(--primary)] hover:underline">
          ← Все темы
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{TOPIC_LABELS[id]}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{topic.description}</p>
          </div>
          {competency?.medal && <MedalBadge tier={competency.medal} />}
        </div>

        {competency && (
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <Badge variant={competency.level === "expert" ? "expert" : "basic"}>
                  {COMPETENCY_LEVEL_LABELS[competency.level]}
                </Badge>
                <span className="font-semibold text-[var(--primary)]">{competency.score}%</span>
              </div>
              <Progress value={competency.score} />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {testModes.map((mode) => (
            <Link key={mode.key} href={`/topics/${id}/${mode.key}`}>
              <Card className="cursor-pointer transition-colors hover:border-[var(--primary)]">
                <CardHeader>
                  <mode.icon className="h-5 w-5 text-[var(--primary)]" />
                  <CardTitle className="mt-2">{mode.label}</CardTitle>
                  <CardDescription>{mode.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)]">
                    Начать <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
