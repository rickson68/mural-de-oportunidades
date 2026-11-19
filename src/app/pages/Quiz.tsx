import { ArrowLeft, Check, ChevronLeft, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import ErrorState from "../components/ErrorState";
import LoadingCards from "../components/LoadingCards";
import OpportunityCard from "../components/OpportunityCard";
import { useData } from "../data";
import { isOpen, titleCase, type Opportunity } from "../types";

type Field = "area" | "tipo" | "natureza" | "habilidades" | "modalidade";
type Answers = Record<Field, string[]>;

const LABELS: Record<Field, { title: string; subtitle: string }> = {
  area: {
    title: "Qual área mais desperta seu interesse?",
    subtitle: "Escolha a área em que você gostaria de se desenvolver.",
  },
  tipo: {
    title: "Que tipo de oportunidade você procura?",
    subtitle: "Pense no formato que faz mais sentido para seu momento.",
  },
  natureza: {
    title: "Que tipo de atividade você prefere?",
    subtitle: "Escolha o estilo de trabalho que mais combina com você.",
  },
  habilidades: {
    title: "Quais habilidades você quer praticar?",
    subtitle: "Você pode escolher uma ou mais opções.",
  },
  modalidade: {
    title: "Qual modalidade você prefere?",
    subtitle: "Escolha onde você se sente mais produtivo.",
  },
};

const FIELDS: Field[] = [
  "area",
  "tipo",
  "natureza",
  "habilidades",
  "modalidade",
];

const EMPTY_ANSWERS: Answers = {
  area: [],
  tipo: [],
  natureza: [],
  habilidades: [],
  modalidade: [],
};

function getValues(items: Opportunity[], field: Field) {
  const values = items.flatMap((item) =>
    field === "habilidades" ? item.habilidades : [item[field]],
  );
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function Quiz() {
  const { opportunities, loading, error, retry } = useData();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  //const [finished, setFinished] = useState(false);

  const openOpportunities = useMemo(
    () => opportunities.filter((item) => isOpen(item.dataLimite)),
    [opportunities],
  );

  const currentField = FIELDS[step];
  const options = getValues(openOpportunities, currentField);

  const results = useMemo(() => {
    return openOpportunities
      .map((opportunity) => {
        let score = 0;

        for (const key of FIELDS) {
          if (answers[key].includes("indiferente")) continue;

          if (key === "habilidades") {
            score += answers.habilidades.filter((skill) =>
              opportunity.habilidades.includes(skill),
            ).length;
          } else if (answers[key].includes(opportunity[key])) {
            score += 1;
          }
        }

        return { opportunity, score };
      })
      .filter((item) => item.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.opportunity.dataLimite.localeCompare(b.opportunity.dataLimite),
      );
  }, [answers, openOpportunities]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => {
      if (currentField !== "habilidades" || value === "indiferente") {
        return { ...prev, [currentField]: [value] };
      }

      const currentSkills = prev.habilidades.filter(
        (item) => item !== "indiferente",
      );
      const exists = currentSkills.includes(value);

      const updatedSkills = exists
        ? currentSkills.filter((item) => item !== value)
        : [...currentSkills, value];

      return { ...prev, habilidades: updatedSkills };
    });
  };

  const handleRestart = () => {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <LoadingCards count={3} />
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={17} aria-hidden="true" /> Voltar ao mural
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold text-gray-400">
            <span>QUIZ DE RECOMENDAÇÃO</span>
            <span>
              {step + 1} de {FIELDS.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${((step + 1) / FIELDS.length) * 100}%` }}
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-950">
          {LABELS[currentField].title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {LABELS[currentField].subtitle}
        </p>

        <div className="mt-7 grid gap-2 sm:grid-cols-2">
          {["indiferente", ...options].map((option) => {
            const isActive = answers[currentField].includes(option);
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                aria-pressed={isActive}
                className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/40"
                }`}
              >
                {titleCase(option)}
                <span
                  className={`flex size-5 items-center justify-center rounded-full border ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {isActive && <Check size={13} aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={17} aria-hidden="true" /> Voltar
          </button>

          <button
            onClick={() => {
              if (step === FIELDS.length - 1) {
                //setFinished(true);
              } else {
                setStep((prev) => prev + 1);
              }
            }}
            disabled={answers[currentField].length === 0}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {step === FIELDS.length - 1 ? "Enviar respostas" : "Continuar"}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        Suas respostas ficam apenas neste navegador.
      </p>
    </div>
  );
}
