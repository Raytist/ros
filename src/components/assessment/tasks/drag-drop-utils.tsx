"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function DraggableChip({
  id,
  label,
  disabled,
}: {
  id: string;
  label: string;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "flex cursor-grab items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm",
        isDragging && "z-10 border-[var(--primary)] opacity-80 shadow-md",
        disabled && "cursor-not-allowed opacity-50"
      )}
      {...listeners}
      {...attributes}
    >
      <GripVertical className="h-4 w-4 shrink-0 text-[var(--muted)]" />
      {label}
    </div>
  );
}

export function DropZone({
  id,
  label,
  value,
  placeholder,
  className,
}: {
  id: string;
  label?: string;
  value?: string;
  placeholder: string;
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <p className="text-sm font-medium text-[var(--muted)]">{label}</p>}
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[52px] rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors",
          value
            ? "border-[var(--primary)] bg-[var(--primary-light)] font-medium text-[var(--primary)]"
            : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)]",
          isOver && !value && "border-[var(--primary)] bg-[var(--primary-light)]"
        )}
      >
        {value ?? placeholder}
      </div>
    </div>
  );
}
