"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Highlighter } from "lucide-react";
import type { HighlightErrorsContent } from "@/types";

interface Props {
  content: HighlightErrorsContent;
  onSubmit: (value: string[]) => void;
  disabled?: boolean;
}

export function HighlightErrorsTask({ content, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    if (disabled) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-[var(--primary-light)] px-3 py-2 text-sm text-[var(--primary)]">
        <Highlighter className="h-4 w-4 shrink-0" />
        <span>Кликайте по фрагментам текста, чтобы отметить ошибки. Можно выбрать несколько.</span>
      </div>

      {content.intro && (
        <p className="text-sm font-medium text-[var(--foreground)]">{content.intro}</p>
      )}

      <div className="rounded-lg border border-[var(--border)] bg-white p-5 text-sm leading-8">
        {content.paragraphs.map((paragraph, pi) => (
          <p key={pi} className="mb-4 last:mb-0">
            {paragraph.segments.map((segment) => {
              const isSelected = selected.has(segment.id);
              return (
                <button
                  key={segment.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(segment.id)}
                  className={cn(
                    "rounded px-0.5 transition-colors",
                    "hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
                    isSelected && "bg-red-200 text-red-900 ring-2 ring-red-400",
                    disabled && "pointer-events-none opacity-70"
                  )}
                >
                  {segment.text}
                </button>
              );
            })}
          </p>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)]">
        Отмечено фрагментов: {selected.size}
      </p>

      <Button
        onClick={() => onSubmit([...selected])}
        disabled={disabled || selected.size === 0}
      >
        Подтвердить выделение
      </Button>
    </div>
  );
}
