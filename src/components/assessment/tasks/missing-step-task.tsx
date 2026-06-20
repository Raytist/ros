"use client";

import { useState } from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DraggableChip } from "./drag-drop-utils";
import type { MissingStepContent } from "@/types";

function MissingSlot({
  dropped,
  placeholder,
}: {
  dropped?: string;
  placeholder: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: "missing-step-slot" });

  return (
    <span
      ref={setNodeRef}
      className={cn(
        "font-medium",
        dropped ? "text-[var(--primary)]" : "text-[var(--muted)]",
        isOver && !dropped && "underline"
      )}
    >
      {dropped ?? placeholder}
    </span>
  );
}

interface Props {
  content: MissingStepContent;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function MissingStepTask({ content, onSubmit, disabled }: Props) {
  const [dropped, setDropped] = useState<{ id: string; label: string } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const optionMap = Object.fromEntries(content.options.map((o) => [o.id, o.label]));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id === "missing-step-slot" && typeof active.id === "string") {
      setDropped({ id: active.id, label: optionMap[active.id] });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        <p className="text-sm text-[var(--muted)]">Перетащите пропущенный этап на место «?»</p>
        <div className="space-y-2">
          {content.process.map((step, i) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3",
                step.isMissing
                  ? "border-2 border-dashed border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border border-[var(--border)] bg-white"
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
                {i + 1}
              </span>
              {step.isMissing ? (
                <MissingSlot dropped={dropped?.label} placeholder="Перетащите этап сюда" />
              ) : (
                <span className="font-medium">{step.label}</span>
              )}
            </div>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {content.options.map((opt) => (
            <DraggableChip
              key={opt.id}
              id={opt.id}
              label={opt.label}
              disabled={disabled || !!dropped}
            />
          ))}
        </div>
        <Button onClick={() => dropped && onSubmit(dropped.id)} disabled={disabled || !dropped}>
          Подтвердить
        </Button>
      </div>
    </DndContext>
  );
}
