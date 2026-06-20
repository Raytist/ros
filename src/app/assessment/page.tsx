"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Globe, BookOpen, ArrowRight } from "lucide-react";
import { ASSESSMENT_MODES } from "@/lib/constants";

export default function AssessmentIndexPage() {
  return (
    <AuthGuard role="candidate">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Практикум</h1>
          <p className="text-sm text-[var(--muted)]">Интерактивные задания без формата «теста»</p>
        </div>

        <Card>
          <CardHeader>
            <Globe className="h-5 w-5 text-[var(--primary)]" />
            <CardTitle className="mt-2">{ASSESSMENT_MODES.global}</CardTitle>
            <CardDescription>
              Серия интерактивных этапов: выделение ошибок, перетаскивание, расчёты и кейсы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/assessment/global">
              <Button className="gap-2">
                <Target className="h-4 w-4" />
                Начать
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-5 w-5 text-[var(--primary)]" />
            <CardTitle className="mt-2">Практика по темам</CardTitle>
            <CardDescription>Задания по отдельным направлениям</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/topics">
              <Button variant="outline">Выбрать тему</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
