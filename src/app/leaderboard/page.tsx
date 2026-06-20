"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLeaderboard } from "@/hooks/use-api";
import { useAuthStore } from "@/stores/auth-store";
import { GLOBAL_GRADE_LABELS, LABELS } from "@/lib/constants";

export default function LeaderboardPage() {
  const { data, isLoading } = useLeaderboard();
  const user = useAuthStore((s) => s.user);
  const entries = data?.entries ?? [];

  return (
    <AuthGuard role="candidate">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Рейтинг специалистов</h1>
          <p className="text-sm text-[var(--muted)]">По {LABELS.skillScore.toLowerCase()}</p>
          {data?.currentUserRank && (
            <Badge variant="default" className="mt-2">
              Ваша позиция: {data.currentUserRank}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--border)]" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const isCurrentUser = entry.userId === user?.id;
              return (
                <Card
                  key={entry.userId}
                  className={isCurrentUser ? "border-[var(--primary)] bg-[var(--primary-light)]" : ""}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <span className="w-6 text-center font-semibold text-[var(--muted)]">{entry.rank}</span>
                    <Avatar name={entry.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">
                        {entry.name}
                        {isCurrentUser && <span className="ml-1 text-xs text-[var(--primary)]">(вы)</span>}
                      </p>
                      <Badge variant="secondary" className="mt-0.5 text-[10px]">
                        {GLOBAL_GRADE_LABELS[entry.globalGrade]}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--primary)]">{entry.skillScore}</p>
                      <p className="text-xs text-[var(--muted)]">{entry.medalCount} медалей</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
