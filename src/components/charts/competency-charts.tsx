"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOPIC_LABELS } from "@/lib/constants";
import type { TopicCompetency } from "@/types";

interface CompetencyRadarProps {
  competencies: TopicCompetency[];
  className?: string;
}

export function CompetencyRadar({ competencies, className }: CompetencyRadarProps) {
  const data = competencies.map((c) => ({
    topic: TOPIC_LABELS[c.topicId]?.slice(0, 12) ?? c.topicId,
    score: c.score,
    fullMark: 100,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Карта компетенций</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e3e8ef" />
            <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11, fill: "#6b7785" }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="Компетенция"
              dataKey="score"
              stroke="#1e8aff"
              fill="#1e8aff"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface CompetencyBarChartProps {
  competencies: TopicCompetency[];
}

export function CompetencyBarChart({ competencies }: CompetencyBarChartProps) {
  const data = competencies.map((c) => ({
    name: TOPIC_LABELS[c.topicId],
    score: c.score,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Уровень по темам</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`${v}%`, "Балл"]} />
            <Bar dataKey="score" fill="#1e8aff" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
