"use client";

import { useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DraggableChip } from "./drag-drop-utils";
import type { FillBlanksContent } from "@/types";

function BlankSlot({
  id,
  value,
  placeholder,
}: {
  id: string;
  value?: string;
  placeholder: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <span
      ref={setNodeRef}
      className={cn(
        "mx-1 inline-flex min-w-[80px] items-center justify-center rounded border-2 border-dashed px-2 py-0.5 align-middle text-sm font-medium",
        value
          ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
          : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)]",
        isOver && !value && "border-[var(--primary)]"
      )}
    >
      {value ?? placeholder}
    </span>
  );
}

interface Props {
  content: FillBlanksContent;
  onSubmit: (value: Record<string, string>) => void;
  disabled?: boolean;
}

export function FillBlanksTask({ content, onSubmit, disabled }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const usedWords = new Set(Object.values(answers));
  const allWords = content.blanks.flatMap((b) => b.options);
  const wordBank = [...new Set(allWords)].filter((w) => !usedWords.has(w));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || typeof active.id !== "string" || typeof over.id !== "string") return;
    if (!over.id.startsWith("blank-")) return;

    const blankId = over.id.replace("blank-", "");
    const word = active.id as string;
    setAnswers((prev) => ({ ...prev, [blankId]: word }));
  };

  const parts = content.template.split("___");

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        <p className="text-sm text-[var(--muted)]">Перетащите слова в пропуски текста</p>
        <p className="text-base leading-loose">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < content.blanks.length && (
                <BlankSlot
                  id={`blank-${content.blanks[i].id}`}
                  value={answers[content.blanks[i].id]}
                  placeholder="..."
                />
              )}
            </span>
          ))}
        </p>
        <div className="flex flex-wrap gap-2">
          {wordBank.map((word) => (
            <DraggableChip key={word} id={word} label={word} disabled={disabled} />
          ))}
        </div>
        <Button
          onClick={() => onSubmit(answers)}
          disabled={disabled || Object.keys(answers).length < content.blanks.length}
        >
          Проверить
        </Button>
      </div>
    </DndContext>
  );
}
