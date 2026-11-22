import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import AccessCard from "../components/AccessCard";
import ErrorState from "../components/ErrorState";
import LoadingCards from "../components/LoadingCards";
import OpportunityCard from "../components/OpportunityCard";
import { FilterBar, type Filters } from "../components/FilterBar";
import { useData } from "../data";
import { useMemo, useState } from "react";
import { isOpen, isUrgent } from "../types";

const initialFilters: Filters = {
  search: "",
  type: "",
  institution: "",
  modality: "",
  sort: "near",
};

export function Home() {
  const { opportunities, loading, error, retry } = useData();
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const open = useMemo(
    () => opportunities.filter((item) => isOpen(item.dataLimite)),
    [opportunities],
  );

  const update = (changes: Partial<Filters>) =>
    setFilters((current) => ({ ...current, ...changes }));
  const clear = () => setFilters(initialFilters);

  const options = (field: "tipo" | "instituicao" | "modalidade") =>
    [...new Set(open.map((item) => item[field]))].sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLocaleLowerCase("pt-BR");
    return open
      .filter(
        (item) =>
          !term || item.titulo.toLocaleLowerCase("pt-BR").includes(term),
      )
      .filter((item) => !filters.type || item.tipo === filters.type)
      .filter(
        (item) =>
          !filters.institution || item.instituicao === filters.institution,
      )
      .filter(
        (item) => !filters.modality || item.modalidade === filters.modality,
      )
      .sort((a, b) =>
        filters.sort === "far"
          ? b.dataLimite.localeCompare(a.dataLimite)
          : a.dataLimite.localeCompare(b.dataLimite),
      );
  }, [open, filters]);

  return (
    <>
      <section className="border-b border-ink-200 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12">
          <div className="mb-8 max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                UFC Sobral
              </span>
              {!loading && open.some((item) => isUrgent(item.dataLimite)) && (
                <span className="rounded-full bg-danger-50 px-3 py-1 text-xs font-semibold text-danger-600">
                  {open.filter((item) => isUrgent(item.dataLimite)).length} com
                  prazo próximo
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              Encontre sua próxima oportunidade
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink-500">
              Bolsas, estágios, monitorias e projetos selecionados para
              estudantes de Engenharia de Computação.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <AccessCard
              to="/quiz"
              icon={<Sparkles size={20} aria-hidden="true" />}
              title="Fazer o quiz de recomendação"
              description="Descubra oportunidades que combinam com seu perfil"
            />
            <AccessCard
              to="/calendario"
              icon={<CalendarDays size={20} aria-hidden="true" />}
              title="Ver calendário de eventos"
              description="Palestras, minicursos e workshops do campus"
            />
          </div>
        </div>
      </section>

      <FilterBar
        filters={filters}
        onChange={update}
        onClear={clear}
        options={{
          tipo: options("tipo"),
          instituicao: options("instituicao"),
          modalidade: options("modalidade"),
        }}
      />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loading ? (
          <LoadingCards />
        ) : error ? (
          <ErrorState retry={retry} />
        ) : filtered.length ? (
          <>
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-ink-950">
                Oportunidades em aberto
              </h2>
              <span className="text-sm text-ink-400">
                {filtered.length} resultados
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <OpportunityCard key={item.id} opportunity={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-ink-200 bg-surface p-10 text-center">
            <h2 className="text-lg font-semibold text-ink-950">
              Nenhuma oportunidade encontrada
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Tente alterar os termos ou remover alguns filtros.
            </p>
            <button
              onClick={clear}
              className="mt-5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </>
  );
}
