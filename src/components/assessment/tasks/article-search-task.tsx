"use client";

import { useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { DraggableChip, DropZone } from "./drag-drop-utils";
import type { ArticleSearchContent } from "@/types";

interface Props {
  content: ArticleSearchContent;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function ArticleSearchTask({ content, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const optionMap = Object.fromEntries(content.options.map((o) => [o.id, o.label]));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id === "article-drop" && typeof active.id === "string") {
      setSelected({ id: active.id, label: optionMap[active.id] });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        <p className="rounded-lg bg-[var(--primary-light)] p-4 text-sm font-medium text-[var(--primary)]">
          {content.question}
        </p>
        <p className="text-sm text-[var(--muted)]">
          Перетащите нужную статью в область ответа
        </p>
        <DropZone
          id="article-drop"
          label="Найденная статья"
          value={selected?.label}
          placeholder="Перетащите статью сюда"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {content.options.map((opt) => (
            <DraggableChip key={opt.id} id={opt.id} label={opt.label} disabled={disabled} />
          ))}
        </div>
        <Button
          onClick={() => selected && onSubmit(selected.id)}
          disabled={disabled || !selected}
        >
          Подтвердить
        </Button>
      </div>
    </DndContext>
  );
}
