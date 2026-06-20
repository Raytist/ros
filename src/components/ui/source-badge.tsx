import { cn } from "@/lib/utils";
import { Medal, BookOpen } from "lucide-react";
import type { KnowledgeSource } from "@/types";

interface SourceBadgeProps {
  source: KnowledgeSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm",
        className
      )}
    >
      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
      <div>
        <p className="font-medium text-[var(--foreground)]">
          {source.article ?? source.chapter ?? source.law}
        </p>
        <p className="text-[var(--muted)]">Источник: {source.label}</p>
      </div>
    </div>
  );
}

interface MedalBadgeProps {
  tier: "bronze" | "silver" | "gold" | "platinum";
  label?: string;
  size?: "sm" | "md" | "lg";
}

const medalLabels = {
  bronze: "Бронза",
  silver: "Серебро",
  gold: "Золото",
  platinum: "Платина",
};

const medalStyles = {
  bronze: "bg-amber-700/10 text-amber-800",
  silver: "bg-slate-200 text-slate-700",
  gold: "bg-amber-100 text-amber-900",
  platinum: "bg-violet-100 text-violet-800",
};

export function MedalBadge({ tier, label, size = "md" }: MedalBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        medalStyles[tier],
        size === "lg" && "px-3 py-1 text-sm"
      )}
    >
      <Medal className="h-3.5 w-3.5" />
      {label ?? medalLabels[tier]}
    </span>
  );
}
