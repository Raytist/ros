"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, X } from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useCandidates } from "@/hooks/use-api";
import { useUIStore } from "@/stores/ui-store";
import {
  GLOBAL_GRADE_LABELS,
  TOPIC_LABELS,
  MEDAL_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { GlobalGrade, MedalTier, TopicId } from "@/types";

export default function RecruiterCandidatesPage() {
  const filters = useUIStore((s) => s.recruiterFilters);
  const setRecruiterFilters = useUIStore((s) => s.setRecruiterFilters);
  const resetRecruiterFilters = useUIStore((s) => s.resetRecruiterFilters);
  const [search, setSearch] = useState(filters.search ?? "");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useCandidates({ ...filters, search });
  const candidates = data?.candidates ?? [];

  const applySearch = () => setRecruiterFilters({ search });

  return (
    <AuthGuard role="recruiter">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Кандидаты</h1>
          <p className="text-slate-500">{data?.total ?? 0} специалистов в базе</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-1 gap-2 min-w-[200px]">
            <Input
              placeholder="Поиск по имени..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
            />
            <Button onClick={applySearch} size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Фильтры
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="mb-2 text-sm font-semibold">Грейд</p>
                <div className="flex flex-wrap gap-2">
                  {(["intern", "basic", "expert"] as GlobalGrade[]).map((g) => (
                    <Button
                      key={g}
                      size="sm"
                      variant={filters.grade === g ? "default" : "outline"}
                      onClick={() =>
                        setRecruiterFilters({ grade: filters.grade === g ? undefined : g })
                      }
                    >
                      {GLOBAL_GRADE_LABELS[g]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Медаль</p>
                <div className="flex flex-wrap gap-2">
                  {(["bronze", "silver", "gold", "platinum"] as MedalTier[]).map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      variant={filters.medal === m ? "default" : "outline"}
                      onClick={() =>
                        setRecruiterFilters({ medal: filters.medal === m ? undefined : m })
                      }
                    >
                      {MEDAL_LABELS[m]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Тема</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(TOPIC_LABELS) as TopicId[]).slice(0, 5).map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={filters.topicId === t ? "default" : "outline"}
                      onClick={() =>
                        setRecruiterFilters({ topicId: filters.topicId === t ? undefined : t })
                      }
                    >
                      {TOPIC_LABELS[t]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Мин. рейтинг (Score)</p>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="70"
                  value={filters.minRating ?? ""}
                  onChange={(e) =>
                    setRecruiterFilters({
                      minRating: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="max-w-[120px]"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={resetRecruiterFilters} className="gap-1">
                <X className="h-4 w-4" /> Сбросить
              </Button>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((c) => (
              <Link key={c.id} href={`/recruiter/candidates/${c.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar name={c.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{c.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant={c.globalGrade === "expert" ? "expert" : "basic"}>
                          {GLOBAL_GRADE_LABELS[c.globalGrade]}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {formatDate(c.lastAssessmentDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-semibold text-[var(--primary)]">{c.skillScore}</p>
                      <p className="text-xs text-slate-400">{c.medalCount} 🏅</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
