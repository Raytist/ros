"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NmckCalculationContent } from "@/types";

interface Props {
  content: NmckCalculationContent;
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export function NmckCalculationTask({ content, onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-4">
      <p className="text-slate-700">{content.caseDescription}</p>
      {content.items.length > 0 && (
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Наименование</th>
              <th className="px-4 py-2 text-right font-semibold">Цена</th>
              <th className="px-4 py-2 text-right font-semibold">Кол-во</th>
              <th className="px-4 py-2 text-right font-semibold">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {content.items.map((item, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 text-right">{item.price.toLocaleString("ru")} ₽</td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right font-medium">
                  {(item.price * item.quantity).toLocaleString("ru")} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold">
            {content.items.length > 0 ? "НМЦК, ₽" : "Ответ"}
          </label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Введите сумму"
            disabled={disabled}
          />
        </div>
        <Button onClick={() => onSubmit(Number(value))} disabled={disabled || !value}>
          Проверить
        </Button>
      </div>
    </div>
  );
}
