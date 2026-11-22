import { Search, SlidersHorizontal } from "lucide-react";
import { titleCase } from "../types";

export type Filters = {
  search: string;
  type: string;
  institution: string;
  modality: string;
  sort: string;
};

type FilterBarProps = {
  filters: Filters;
  onChange: (changes: Partial<Filters>) => void;
  onClear: () => void;
  options: {
    tipo: string[];
    instituicao: string[];
    modalidade: string[];
  };
};

const selectClass =
  "rounded-lg border border-ink-200 bg-surface px-3 py-2 text-sm text-ink-700";

export function FilterBar({
  filters,
  onChange,
  onClear,
  options,
}: FilterBarProps) {
  const { search, type, institution, modality, sort } = filters;
  const hasFilters =
    search || type || institution || modality || sort === "far";

  return (
    <section className="border-b border-ink-200 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="relative mb-3">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            size={18}
            aria-hidden="true"
          />
          <label htmlFor="search" className="sr-only">
            Buscar pelo título
          </label>
          <input
            id="search"
            value={search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Buscar oportunidade pelo título..."
            className="w-full rounded-xl border border-ink-200 bg-ink-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:bg-surface"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal
            size={17}
            className="mr-1 text-ink-400"
            aria-hidden="true"
          />

          <select
            aria-label="Tipo"
            value={type}
            className={selectClass}
            onChange={(e) => onChange({ type: e.target.value })}
          >
            <option value="">Tipo</option>
            {options.tipo.map((o) => (
              <option key={o} value={o}>
                {titleCase(o)}
              </option>
            ))}
          </select>

          <select
            aria-label="Instituição"
            value={institution}
            className={selectClass}
            onChange={(e) => onChange({ institution: e.target.value })}
          >
            <option value="">Instituição</option>
            {options.instituicao.map((o) => (
              <option key={o} value={o}>
                {titleCase(o)}
              </option>
            ))}
          </select>

          <select
            aria-label="Modalidade"
            value={modality}
            className={selectClass}
            onChange={(e) => onChange({ modality: e.target.value })}
          >
            <option value="">Modalidade</option>
            {options.modalidade.map((o) => (
              <option key={o} value={o}>
                {titleCase(o)}
              </option>
            ))}
          </select>

          <select
            aria-label="Ordenação"
            value={sort}
            className={selectClass}
            onChange={(e) => onChange({ sort: e.target.value })}
          >
            <option value="near">Prazo mais próximo</option>
            <option value="far">Prazo mais distante</option>
          </select>

          {hasFilters && (
            <button
              onClick={onClear}
              className="px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
