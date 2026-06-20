"use client";

import { cn } from "@/lib/utils";
import type { TextHighlightContent } from "@/types";

interface Props {
  content: TextHighlightContent;
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export function TextHighlightTask({ content, onSubmit, disabled }: Props) {
  return (
    <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
      {content.sentences.map((sentence, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onSubmit(i)}
          className={cn(
            "block w-full rounded-md px-3 py-2.5 text-left text-sm leading-relaxed transition-colors",
            "hover:bg-[var(--primary-light)] hover:ring-1 hover:ring-[var(--primary)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          {sentence}
        </button>
      ))}
    </div>
  );
}
