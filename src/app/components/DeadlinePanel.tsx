import { isUrgent, daysUntil, formatDate } from "../types";
import { Clock3 } from "lucide-react";

export default function DeadlinePanel({ value }: { value: string }) {
  const urgent = isUrgent(value);
  const days = daysUntil(value);
  return (
    <div
      className={`rounded-2xl border p-5 ${
        urgent ? "border-danger-200 bg-danger-50" : "border-ink-200 bg-surface"
      }`}
    >
      <p
        className={`mb-2 text-xs font-bold uppercase tracking-wider ${
          urgent ? "text-danger-500" : "text-ink-400"
        }`}
      >
        Data limite
      </p>
      <p
        className={`text-lg font-bold ${
          urgent ? "text-danger-700" : "text-ink-950"
        }`}
      >
        {formatDate(value, { day: "2-digit", month: "long", year: "numeric" })}
      </p>
      {urgent && (
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-danger-600">
          <Clock3 size={14} aria-hidden="true" />
          {days === 0
            ? "Encerra hoje"
            : days === 1
              ? "Encerra amanhã"
              : `Faltam ${days} dias`}
        </p>
      )}
    </div>
  );
}
