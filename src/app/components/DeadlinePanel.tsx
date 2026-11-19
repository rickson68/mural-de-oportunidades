import { isUrgent, daysUntil, formatDate } from "../types";
import { Clock3 } from "lucide-react";

export default function DeadlinePanel({ value }: { value: string }) {
  const urgent = isUrgent(value);
  const days = daysUntil(value);
  return (
    <div
      className={`rounded-2xl border p-5 ${
        urgent ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
      }`}
    >
      <p
        className={`mb-2 text-xs font-bold uppercase tracking-wider ${
          urgent ? "text-red-500" : "text-gray-400"
        }`}
      >
        Data limite
      </p>
      <p
        className={`text-lg font-bold ${
          urgent ? "text-red-700" : "text-gray-950"
        }`}
      >
        {formatDate(value, { day: "2-digit", month: "long", year: "numeric" })}
      </p>
      {urgent && (
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600">
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
