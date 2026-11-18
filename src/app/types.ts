export type Opportunity = {
  id: string;
  titulo: string;
  tipo: string;
  instituicao: string;
  modalidade: string;
  dataLimite: string;
  descricao: string;
  area: string;
  natureza: string;
  habilidades: string[];
  linksExternos: string[];
};

export type EventItem = {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  instituicao: string;
  descricao: string;
  linksExternos: string[];
};

export const DIAS_PRAZO_PROXIMO = 5;

export function localDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

export function todayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function daysUntil(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Math.round((date.getTime() - todayAtMidnight().getTime()) / 86400000);
}

export function isOpen(value: string) {
  return daysUntil(value) >= 0;
}

export function isUrgent(value: string) {
  const days = daysUntil(value);
  return days >= 0 && days <= DIAS_PRAZO_PROXIMO;
}

export function formatDate(
  value: string,
  options?: Intl.DateTimeFormatOptions,
) {
  return localDate(value).toLocaleDateString(
    "pt-BR",
    options ?? { day: "2-digit", month: "short", year: "numeric" },
  );
}

export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
