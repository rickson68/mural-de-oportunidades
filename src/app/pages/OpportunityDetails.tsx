import { useParams, Link } from "react-router";
import { useData } from "../data";
import { titleCase } from "../types";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import LoadingCards from "../components/LoadingCards";
import ErrorState from "../components/ErrorState";
import ExternalLinks from "../components/ExternalLinks";
import DeadlinePanel from "../components/DeadlinePanel";

export function OpportunityDetails() {
  const { id } = useParams();
  const { opportunities, loading, error, retry } = useData();
  const opportunity = opportunities.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <LoadingCards count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <ErrorState retry={retry} />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-950">
          Oportunidade não encontrada
        </h1>
        <p className="mt-2 text-gray-500">
          O link pode estar incorreto ou a oportunidade foi removida.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Voltar ao mural
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={17} aria-hidden="true" /> Voltar ao mural
      </Link>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {titleCase(opportunity.tipo)}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {opportunity.area}
              </span>
            </div>
            <h1 className="max-w-3xl text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              {opportunity.titulo}
            </h1>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Building2 size={16} aria-hidden="true" />
                {opportunity.instituicao}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} aria-hidden="true" />
                {titleCase(opportunity.modalidade)}
              </span>
            </div>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-950">
              Sobre a oportunidade
            </h2>
            <p className="mt-3 leading-7 text-gray-600">
              {opportunity.descricao}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {opportunity.habilidades.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-4">
          <DeadlinePanel value={opportunity.dataLimite} />
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-950">
              Como se inscrever
            </h2>
            <ExternalLinks links={opportunity.linksExternos} />
          </section>
        </aside>
      </div>
    </div>
  );
}
