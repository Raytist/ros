"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Topic, TopicCompetency } from "@/types";
import { COMPETENCY_LEVEL_LABELS } from "@/lib/constants";
import { MedalBadge } from "@/components/ui/source-badge";

interface TopicCardProps {
  topic: Topic;
  competency?: TopicCompetency;
}

export function TopicCard({ topic, competency }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.id}`}>
      <Card className="cursor-pointer transition-colors hover:border-[var(--primary)]">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{topic.title}</CardTitle>
            {competency?.medal && <MedalBadge tier={competency.medal} size="sm" />}
          </div>
          <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {competency ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <Badge variant={competency.level === "expert" ? "expert" : "basic"}>
                  {COMPETENCY_LEVEL_LABELS[competency.level]}
                </Badge>
                <span className="font-medium text-[var(--primary)]">{competency.score}%</span>
              </div>
              <Progress value={competency.score} />
            </div>
          ) : (
            <p className="text-xs text-[var(--muted)]">
              {topic.questionCount} заданий · ~{topic.estimatedMinutes} мин
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
