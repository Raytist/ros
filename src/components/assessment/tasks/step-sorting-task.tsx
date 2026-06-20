"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StepSortingContent } from "@/types";

function SortableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3",
        isDragging && "z-10 border-[var(--primary)] shadow-md"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-slate-400">
        <GripVertical className="h-5 w-5" />
      </button>
      <span className="font-medium">{label}</span>
    </div>
  );
}

interface Props {
  content: StepSortingContent;
  onSubmit: (value: string[]) => void;
  disabled?: boolean;
}

export function StepSortingTask({ content, onSubmit, disabled }: Props) {
  const [items, setItems] = useState(content.steps.map((s) => s.id));
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const stepMap = Object.fromEntries(content.steps.map((s) => [s.id, s.label]));

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((id) => (
              <SortableItem key={id} id={id} label={stepMap[id]} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button onClick={() => onSubmit(items)} disabled={disabled} className="w-full">
        Подтвердить порядок
      </Button>
    </div>
  );
}
