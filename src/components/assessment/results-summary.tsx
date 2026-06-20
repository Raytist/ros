"use client";

import Link from "next/link";
import { Trophy, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompetencyBarChart } from "@/components/charts/competency-charts";
import type { AssessmentResult } from "@/types";
import { GLOBAL_GRADE_LABELS, COMPETENCY_LEVEL_LABELS, LABELS } from "@/lib/constants";

interface ResultsSummaryProps {
  result: AssessmentResult;
}

export function ResultsSummary({ result }: ResultsSummaryProps) {
  const gradeLabel = result.globalGrade
    ? GLOBAL_GRADE_LABELS[result.globalGrade]
    : result.competencyLevel
      ? COMPETENCY_LEVEL_LABELS[result.competencyLevel]
      : "Результат";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <Trophy className="mx-auto h-10 w-10 text-[var(--warning)]" />
          <h1 className="mt-3 text-2xl font-semibold">Практикум завершён</h1>
        <p className="mt-1 text-[var(--muted)]">Ваш уровень: {gradeLabel}</p>
        <Badge variant="expert" className="mt-3">
          {LABELS.skillScore}: {result.skillScore}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Target className="h-6 w-6 text-[var(--primary)]" />
            <div>
              <p className="text-xl font-semibold">{result.accuracy}%</p>
              <p className="text-xs text-[var(--muted)]">{LABELS.accuracy}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-6 w-6 text-[var(--primary)]" />
            <div>
              <p className="text-xl font-semibold">{result.avgResponseTime} сек</p>
              <p className="text-xs text-[var(--muted)]">{LABELS.avgTime}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xl font-semibold">{result.errorCount}</p>
            <p className="text-xs text-[var(--muted)]">Ошибок</p>
          </CardContent>
        </Card>
      </div>

      <CompetencyBarChart competencies={result.competencyMap} />

      <Card>
        <CardHeader>
          <CardTitle>{LABELS.aiSummary}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-[var(--foreground)]">{result.aiSummary}</p>
        </CardContent>
      </Card>

      {result.recommendations.length > 0 && (
        <Card className="border-[var(--primary-light)] bg-[var(--primary-light)]">
          <CardContent className="p-5">
            <p className="font-medium text-[var(--primary)]">Рекомендации</p>
            {result.recommendations.map((r, i) => (
              <p key={i} className="mt-2 text-sm">{r}</p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline">На главную</Button>
        </Link>
        <Link href="/profile">
          <Button>Мой профиль</Button>
        </Link>
      </div>
    </div>
  );
}
