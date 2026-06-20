"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedalBadge } from "@/components/ui/source-badge";
import { useCandidate } from "@/hooks/use-api";
import { GLOBAL_GRADE_LABELS, TOPIC_LABELS, LABELS } from "@/lib/constants";
import { formatDate, formatDuration } from "@/lib/utils";

export default function RecruiterCandidateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useCandidate(id);
  const candidate = data?.candidate;

  if (isLoading || !candidate) {
    return (
      <AuthGuard role="recruiter">
        <div className="py-12 text-center text-[var(--muted)]">Загрузка...</div>
      </AuthGuard>
    );
  }

  const radarData = candidate.competencies.map((c) => ({
    topic: TOPIC_LABELS[c.topicId]?.slice(0, 10),
    score: c.score,
  }));

  const metrics = [
    { label: LABELS.skillScore, value: candidate.analytics.skillScore },
    { label: LABELS.accuracy, value: `${candidate.analytics.accuracy}%` },
    { label: LABELS.avgTime, value: `${candidate.analytics.avgResponseTime} сек` },
    { label: "Ошибок", value: candidate.analytics.errorCount },
    { label: "Подсказок", value: candidate.analytics.hintsUsed },
    { label: "Уверенность", value: `${candidate.analytics.confidenceLevel}%` },
    { label: LABELS.percentile, value: candidate.analytics.percentileRank },
    { label: "Медалей", value: candidate.medalCount },
  ];

  return (
    <AuthGuard role="recruiter">
      <div className="space-y-6">
        <Link href="/recruiter/candidates" className="text-sm text-[var(--primary)] hover:underline">
          ← К списку кандидатов
        </Link>

        <Card>
          <CardContent className="flex flex-wrap items-center gap-5 p-5">
            <Avatar name={candidate.name} size="lg" />
            <div>
              <h1 className="text-xl font-semibold">{candidate.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="expert">{GLOBAL_GRADE_LABELS[candidate.globalGrade]}</Badge>
                <Badge variant="default">{LABELS.skillScore}: {candidate.skillScore}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4">
                <p className="text-xl font-semibold text-[var(--primary)]">{m.value}</p>
                <p className="text-xs text-[var(--muted)]">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Карта компетенций</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e3e8ef" />
                  <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10 }} />
                  <Radar dataKey="score" stroke="#1e8aff" fill="#1e8aff" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Сравнение с другими кандидатами</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={candidate.analytics.comparisonData}>
                  <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="candidate" fill="#1e8aff" name="Кандидат" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="average" fill="#e3e8ef" name="Среднее" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--primary-light)] bg-[var(--primary-light)]">
          <CardHeader>
            <CardTitle>{LABELS.aiSummary}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {candidate.assessmentHistory[0]?.aiSummary ??
                "Кандидат демонстрирует высокий уровень владения 44-ФЗ и уверенную работу в ЕЭТП."}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Сильные стороны</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {candidate.competencies
                  .filter((c) => c.score >= 70)
                  .map((c) => (
                    <li key={c.topicId} className="flex justify-between">
                      <span>{TOPIC_LABELS[c.topicId]}</span>
                      <span className="font-medium">{c.score}%</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Зоны роста</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {candidate.competencies
                  .filter((c) => c.score < 60)
                  .map((c) => (
                    <li key={c.topicId} className="flex justify-between">
                      <span>{TOPIC_LABELS[c.topicId]}</span>
                      <span className="font-medium">{c.score}%</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2">
          {candidate.competencies
            .filter((c) => c.medal)
            .map((c) => (
              <div key={c.topicId} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                <MedalBadge tier={c.medal!} size="sm" />
                {TOPIC_LABELS[c.topicId]}
              </div>
            ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>История практикума</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {candidate.assessmentHistory.map((h) => (
              <div
                key={h.sessionId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--background)] p-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {h.mode === "global" ? "Общая проверка" : h.topicId ? TOPIC_LABELS[h.topicId] : h.mode}
                  </p>
                  <p className="text-[var(--muted)]">{formatDate(h.completedAt)}</p>
                </div>
                <div className="flex gap-4 text-[var(--muted)]">
                  <span>{LABELS.skillScore}: {h.skillScore}</span>
                  <span>{LABELS.accuracy}: {h.accuracy}%</span>
                  <span>{formatDuration(h.avgResponseTime)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
