import { Link } from "react-router";
import { MapPin, CalendarDays } from "lucide-react";
import {
  isUrgent,
  daysUntil,
  titleCase,
  formatDate,
  type Opportunity,
} from "../types";

export default function OpportunityCard({
  opportunity,
  score,
}: {
  opportunity: Opportunity;
  score?: number;
}) {
  const urgent = isUrgent(opportunity.dataLimite);
  const days = daysUntil(opportunity.dataLimite);

  return (
    <Link
      to={`/oportunidade/${opportunity.id}`}
      className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-surface p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
          {titleCase(opportunity.tipo)}
        </span>
        {score !== undefined ? (
          <span className="rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700">
            {score} {score === 1 ? "ponto" : "pontos"}
          </span>
        ) : (
          <span className="max-w-[45%] truncate rounded-full bg-ink-100 px-2.5 py-1 text-xs text-ink-600">
            {opportunity.instituicao}
          </span>
        )}
      </div>
      <h2 className="mb-2 text-lg font-semibold leading-snug text-ink-950 transition group-hover:text-primary-700">
        {opportunity.titulo}
      </h2>
      <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-ink-500">
        {opportunity.descricao}
      </p>
      <div className="mb-3 flex items-center gap-1.5 text-xs text-ink-500">
        <MapPin size={14} aria-hidden="true" />
        {titleCase(opportunity.modalidade)}
      </div>
      <div
        className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
          urgent
            ? "border-danger-200 bg-danger-50 text-danger-700"
            : "border-ink-100 bg-ink-50 text-ink-600"
        }`}
      >
        <span className="flex items-center gap-2 text-xs font-medium">
          <CalendarDays size={15} aria-hidden="true" />
          {formatDate(opportunity.dataLimite)}
        </span>
        <span className="text-xs font-semibold">
          {urgent
            ? days === 0
              ? "Encerra hoje"
              : days === 1
                ? "Amanhã"
                : `${days} dias`
            : "Ver detalhes"}
        </span>
      </div>
    </Link>
  );
}
