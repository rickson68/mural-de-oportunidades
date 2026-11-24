import { Check, ChevronLeft } from "lucide-react";
import { titleCase } from "../types";
import { fields, labels, type QuizState } from "./useQuiz";

/** Só o cartão do questionário: sem link de voltar nem largura de página. */
export function QuizWizard({ quiz }: { quiz: QuizState }) {
  const { step, setStep, answers, optionsByField, select, setFinished } = quiz;
  const field = fields[step];
  const isLast = step === fields.length - 1;

  return (
    <div className="rounded-2xl border border-ink-200 bg-surface p-5 shadow-sm sm:p-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold text-ink-400">
          <span>QUIZ DE RECOMENDAÇÃO</span>
          <span>{step + 1} de {fields.length}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-primary-600 transition-all"
            style={{ width: `${((step + 1) / fields.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-ink-950">{labels[field].title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-500">{labels[field].subtitle}</p>

      <div className="mt-7 grid gap-2 sm:grid-cols-2">
        {["indiferente", ...optionsByField[field]].map((option) => {
          const active = answers[field].includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => select(field, option)}
              aria-pressed={active}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition ${
                active
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-ink-200 bg-surface text-ink-700 hover:border-primary-200 hover:bg-primary-50/40"
              }`}
            >
              {titleCase(option)}
              <span
                className={`flex size-5 items-center justify-center rounded-full border ${
                  active ? "border-primary-600 bg-primary-600 text-on-color" : "border-ink-300"
                }`}
              >
                {active && <Check size={13} aria-hidden="true" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-5">
        <button
          type="button"
          onClick={() => setStep((v) => Math.max(0, v - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink-500 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={17} aria-hidden="true" /> Voltar
        </button>
        <button
          type="button"
          onClick={() => (isLast ? setFinished(true) : setStep((v) => v + 1))}
          disabled={answers[field].length === 0}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-on-color hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-ink-300"
        >
          {isLast ? "Enviar respostas" : "Continuar"}
        </button>
      </div>
    </div>
  );
}
