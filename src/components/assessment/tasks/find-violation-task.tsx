"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FindViolationContent } from "@/types";

interface Props {
  content: FindViolationContent;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function FindViolationTask({ content, onSubmit, disabled }: Props) {
  const lines = content.document.split("\n");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const getViolationForLine = (line: string) =>
    content.violations.find((v) => line.includes(v.text));

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">
        Выделите строку документа, в которой содержится нарушение
      </p>
      <div className="rounded-lg border border-[var(--border)] bg-white p-4 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => {
          const violation = getViolationForLine(line);
          const isSelected = violation && highlightedId === violation.id;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled || !violation}
              onClick={() => violation && setHighlightedId(violation.id)}
              className={cn(
                "mb-1 block w-full rounded px-2 py-1 text-left transition-colors",
                violation && "cursor-pointer hover:bg-[var(--primary-light)]",
                isSelected && "bg-[var(--primary-light)] ring-2 ring-[var(--primary)]",
                !violation && "cursor-default"
              )}
            >
              {line || " "}
            </button>
          );
        })}
      </div>
      <Button onClick={() => highlightedId && onSubmit(highlightedId)} disabled={disabled || !highlightedId}>
        Подтвердить выделение
      </Button>
    </div>
  );
}
