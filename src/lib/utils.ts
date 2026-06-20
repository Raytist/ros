import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} мин ${s} сек` : `${s} сек`;
}

export function getMedalColor(medal: string): string {
  const colors: Record<string, string> = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    platinum: "#E5E4E2",
  };
  return colors[medal.toLowerCase()] ?? colors.bronze;
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    intern: "bg-slate-100 text-slate-700",
    basic: "bg-blue-100 text-blue-700",
    advanced: "bg-violet-100 text-violet-700",
    expert: "bg-amber-100 text-amber-800",
  };
  return colors[grade] ?? colors.basic;
}
