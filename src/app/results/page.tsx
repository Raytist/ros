"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResults } from "@/hooks/use-api";
import { GLOBAL_GRADE_LABELS, LABELS, TOPIC_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function ResultsPage() {
  const { data, isLoading } = useResults();
  const results = data?.results ?? [];

  return (
    <AuthGuard role="candidate">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">История результатов</h1>
          <p className="text-sm text-[var(--muted)]">Все пройденные сессии практикума</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-[var(--border)]" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--muted)]">Результатов пока нет</p>
              <Link href="/assessment/global" className="mt-4 inline-block text-[var(--primary)] hover:underline">
                Пройти первую сессию
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <Card key={result.sessionId}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {result.mode === "global"
                        ? "Определение профессионального уровня"
                        : result.topicId
                          ? `${TOPIC_LABELS[result.topicId]} — ${result.mode}`
                          : result.mode}
                    </CardTitle>
                    <p className="text-sm text-[var(--muted)]">{formatDate(result.completedAt)}</p>
                  </div>
                  <Badge variant="expert">{LABELS.skillScore}: {result.skillScore}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-[var(--muted)]">Уровень</p>
                      <p className="font-medium">
                        {result.globalGrade
                          ? GLOBAL_GRADE_LABELS[result.globalGrade]
                          : result.competencyLevel}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted)]">{LABELS.accuracy}</p>
                      <p className="font-medium">{result.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted)]">{LABELS.avgTime}</p>
                      <p className="font-medium">{result.avgResponseTime} сек</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted)]">Ошибок</p>
                      <p className="font-medium">{result.errorCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
