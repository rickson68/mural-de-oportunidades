import { useMemo, useState } from "react";
import { isOpen, type Opportunity } from "../types";
import {
  clearQuiz, selectAnswer, setConcluido, toggleAnswer, usePerfil,
  type Answers, type Field,
} from "./perfilStore";

export type { Answers, Field };

export const fields: Field[] = ["area", "tipo", "natureza", "habilidades", "modalidade"];

export const labels: Record<Field, { title: string; subtitle: string; short: string }> = {
  area: { short: "Área", title: "Qual área mais desperta seu interesse?", subtitle: "Escolha a área em que você gostaria de se desenvolver." },
  tipo: { short: "Tipo", title: "Que tipo de oportunidade você procura?", subtitle: "Pense no formato que faz mais sentido para seu momento." },
  natureza: { short: "Atividade", title: "Que tipo de atividade você prefere?", subtitle: "Escolha o estilo de trabalho que mais combina com você." },
  habilidades: { short: "Habilidades", title: "Quais habilidades você quer praticar?", subtitle: "Você pode escolher uma ou mais opções." },
  modalidade: { short: "Modalidade", title: "Qual modalidade você prefere?", subtitle: "Escolha onde você se sente mais produtivo." },
};

export function valuesFor(items: Opportunity[], field: Field) {
  const values = items.flatMap((item) =>
    field === "habilidades" ? item.habilidades : [item[field]],
  );
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/**
 * Respostas e "quiz concluído" vêm do localStorage (perfilStore).
 * Só a etapa atual do questionário é estado local.
 */
export function useQuizState(opportunities: Opportunity[]) {
  const perfil = usePerfil();
  const [step, setStep] = useState(0);
  const answers = perfil.answers;

  const open = useMemo(
    () => opportunities.filter((item) => isOpen(item.dataLimite)),
    [opportunities],
  );

  const optionsByField = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field) => [field, valuesFor(open, field)]),
      ) as Record<Field, string[]>,
    [open],
  );

  const results = useMemo(
    () =>
      open
        .map((opportunity) => {
          let score = 0;
          for (const key of fields) {
            if (answers[key].includes("indiferente")) continue;
            if (key === "habilidades") {
              score += answers.habilidades.filter((s) => opportunity.habilidades.includes(s)).length;
            } else if (answers[key].includes(opportunity[key])) score += 1;
          }
          return { opportunity, score };
        })
        .filter((item) => item.score > 0)
        .sort(
          (a, b) =>
            b.score - a.score ||
            a.opportunity.dataLimite.localeCompare(b.opportunity.dataLimite),
        ),
    [answers, open],
  );

  const restart = () => {
    clearQuiz();
    setStep(0);
  };

  return {
    step, setStep,
    answers,
    finished: perfil.concluido,
    setFinished: setConcluido,
    optionsByField, results,
    select: selectAnswer,
    toggle: toggleAnswer,
    restart,
  };
}

export type QuizState = ReturnType<typeof useQuizState>;
