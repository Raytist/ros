"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { APP_SECTION, APP_TAGLINE } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Logo />
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/login">
              <Button>Начать</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        <p className="text-sm text-[var(--muted)]">{APP_SECTION}</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight text-[var(--foreground)] lg:text-4xl">
          {APP_TAGLINE}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          Система разработана экспертами Росэлторг для объективной оценки компетенций
          специалистов в сфере государственных и корпоративных закупок.
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button size="lg" className="gap-2">
            Начать практикум
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--background)] py-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-3 lg:px-6">
          {[
            { title: "Интерактивные задания", desc: "Перетаскивание, выделение текста, расчёт НМЦК, кейсы ФАС" },
            { title: "Подтверждение квалификации", desc: "Уровень, медали и карта компетенций по 9 темам" },
            { title: "Для работодателей", desc: "Кабинет рекрутера с фильтрами и заключением системы" },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <ul className="space-y-2 text-sm text-[var(--foreground)]">
          {[
            "Статус «Кандидат проверен» для резюме",
            "Разряды квалификации: золото, серебро, бронза",
            "Практические ситуационные задания",
            "Сертификаты для работодателей",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--primary)]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--muted)]">
        © 2026 Росэлторг · {APP_SECTION}
      </footer>
    </div>
  );
}
