"use client";

import Link from "next/link";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCandidates } from "@/hooks/use-api";
import { GLOBAL_GRADE_LABELS, LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function RecruiterDashboardPage() {
  const { data } = useCandidates();
  const candidates = data?.candidates ?? [];
  const experts = candidates.filter((c) => c.globalGrade === "expert").length;
  const avgScore = candidates.length
    ? Math.round(candidates.reduce((s, c) => s + c.skillScore, 0) / candidates.length)
    : 0;

  return (
    <AuthGuard role="recruiter">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Кабинет рекрутера</h1>
            <p className="text-sm text-[var(--muted)]">Подбор специалистов по закупкам</p>
          </div>
          <Link href="/recruiter/candidates">
            <Button>Каталог кандидатов</Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-5 w-5 text-[var(--primary)]" />
              <div>
                <p className="text-2xl font-semibold">{candidates.length}</p>
                <p className="text-xs text-[var(--muted)]">Кандидатов</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <UserCheck className="h-5 w-5 text-[var(--primary)]" />
              <div>
                <p className="text-2xl font-semibold">{experts}</p>
                <p className="text-xs text-[var(--muted)]">Экспертов</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
              <div>
                <p className="text-2xl font-semibold">{avgScore}</p>
                <p className="text-xs text-[var(--muted)]">Средний {LABELS.skillScore.toLowerCase()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Последние кандидаты</CardTitle>
            <Link href="/recruiter/candidates">
              <Button variant="ghost" size="sm">Все</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {candidates.slice(0, 5).map((c) => (
              <Link key={c.id} href={`/recruiter/candidates/${c.id}`}>
                <div className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 transition-colors hover:bg-[var(--background)]">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {GLOBAL_GRADE_LABELS[c.globalGrade]} · {formatDate(c.lastAssessmentDate)}
                    </p>
                  </div>
                  <p className="font-semibold text-[var(--primary)]">{c.skillScore}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
