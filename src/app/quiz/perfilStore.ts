import { useSyncExternalStore } from "react";

/**
 * Fonte única da verdade do perfil do aluno, guardada no localStorage.
 * Quiz e caixinhas leem e escrevem aqui, então ficam sempre sincronizados,
 * inclusive entre abas. Qualquer outra tela (ex.: Home) pode usar usePerfil().
 */

export type Field = "area" | "tipo" | "natureza" | "habilidades" | "modalidade";
export type Answers = Record<Field, string[]>;

export const emptyAnswers: Answers = {
  area: [], tipo: [], natureza: [], habilidades: [], modalidade: [],
};

export type Preferencia = "emailNovidades" | "apenasInteresses";

export type Perfil = {
  answers: Answers;
  concluido: boolean; // terminou o quiz
  emailNovidades: boolean;
  apenasInteresses: boolean;
};

const KEY = "aluno-perfil";
const EVENT = "perfil-change";

const DEFAULT: Perfil = {
  answers: emptyAnswers,
  concluido: false,
  emailNovidades: false,
  apenasInteresses: false,
};

// Cache: useSyncExternalStore exige que getSnapshot devolva a MESMA referência
// enquanto nada mudou, senão o React entra em loop.
let cachedRaw: string | null = null;
let cached: Perfil = DEFAULT;

function parse(raw: string | null): Perfil {
  if (!raw) return DEFAULT;
  try {
    const data = JSON.parse(raw);
    return { ...DEFAULT, ...data, answers: { ...emptyAnswers, ...data.answers } };
  } catch {
    return DEFAULT;
  }
}

function getSnapshot(): Perfil {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cached; // storage bloqueado: segue em memória
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
  }
  return cached;
}

function write(next: Perfil) {
  cached = next;
  try {
    const raw = JSON.stringify(next);
    localStorage.setItem(KEY, raw);
    cachedRaw = raw;
  } catch {
    /* sem storage: mantém só em memória */
  }
  window.dispatchEvent(new Event(EVENT)); // avisa a mesma aba
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); // outras abas
  window.addEventListener(EVENT, callback); // esta aba
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function usePerfil(): Perfil {
  return useSyncExternalStore(subscribe, getSnapshot);
}

const update = (fn: (p: Perfil) => Perfil) => write(fn(getSnapshot()));

/** Escolha única por pergunta (exceto "habilidades"), como no quiz. */
export function selectAnswer(field: Field, value: string) {
  update((p) => {
    if (field !== "habilidades" || value === "indiferente") {
      return { ...p, answers: { ...p.answers, [field]: [value] } };
    }
    const selected = p.answers.habilidades.filter((i) => i !== "indiferente");
    return {
      ...p,
      answers: {
        ...p.answers,
        habilidades: selected.includes(value)
          ? selected.filter((i) => i !== value)
          : [...selected, value],
      },
    };
  });
}

/** Marca/desmarca livremente (várias por grupo), como nas caixinhas. */
export function toggleAnswer(field: Field, value: string) {
  update((p) => {
    const current = p.answers[field];
    let next: string[];
    if (current.includes(value)) next = current.filter((i) => i !== value);
    else if (value === "indiferente") next = ["indiferente"];
    else next = [...current.filter((i) => i !== "indiferente"), value];
    return { ...p, answers: { ...p.answers, [field]: next } };
  });
}

export const setConcluido = (concluido: boolean) =>
  update((p) => ({ ...p, concluido }));

export const setPreferencia = (key: Preferencia, value: boolean) =>
  update((p) => ({ ...p, [key]: value }));

/** Refaz o quiz sem apagar as preferências de e-mail. */
export const clearQuiz = () =>
  update((p) => ({ ...p, answers: emptyAnswers, concluido: false }));

export const resetPerfil = () => write(DEFAULT);
