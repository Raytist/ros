"use client";

import { useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DraggableChip, DropZone } from "./drag-drop-utils";
import type { NextStepContent } from "@/types";

interface Props {
  content: NextStepContent;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function NextStepTask({ content, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const optionMap = Object.fromEntries(content.options.map((o) => [o.id, o.label]));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id === "next-step-slot" && typeof active.id === "string") {
      setSelected({ id: active.id, label: optionMap[active.id] });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        <div className="space-y-2">
          {content.completedSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
              {step}
            </div>
          ))}
          <div className="rounded-lg bg-[var(--primary-light)] px-4 py-3 text-sm font-medium text-[var(--primary)]">
            Текущий этап: {content.currentStep}
          </div>
        </div>
        <DropZone
          id="next-step-slot"
          label="Следующий этап"
          value={selected?.label}
          placeholder="Перетащите следующий шаг процесса"
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
