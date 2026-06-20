"use client";

import { useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { DraggableChip, DropZone } from "./drag-drop-utils";
import type { FasCaseContent } from "@/types";

interface Props {
  content: FasCaseContent;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function FasCaseTask({ content, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const optionMap = Object.fromEntries(content.options.map((o) => [o.id, o.label]));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id === "fas-decision" && typeof active.id === "string") {
      setSelected({ id: active.id, label: optionMap[active.id] });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        <div className="rounded-lg border-l-4 border-[var(--primary)] bg-[var(--background)] p-4">
          <p className="text-sm leading-relaxed">{content.scenario}</p>
        </div>
        <p className="font-medium">{content.question}</p>
        <p className="text-sm text-[var(--muted)]">
          Перетащите наиболее вероятное решение ФАС в область ниже
        </p>
        <DropZone
          id="fas-decision"
          label="Решение ФАС"
          value={selected?.label}
          placeholder="Перетащите решение сюда"
        />
        <div className="space-y-2">
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
