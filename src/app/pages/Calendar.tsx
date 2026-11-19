import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  MapPin,
  RotateCcw,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Link } from "react-router";
import { useData } from "../data";
import { formatDate, titleCase, type EventItem } from "../types";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const GRID_SIZE = 42; // 6 semanas x 7 dias

/* ---------- utilidades de data (sempre no fuso local) ---------- */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

function addDays(key: string, amount: number) {
  const date = fromKey(key);
  date.setDate(date.getDate() + amount);
  return toKey(date);
}

/** Soma meses mantendo o dia (ou o último dia do mês, se não existir). */
function addMonths(key: string, amount: number) {
  const date = fromKey(key);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + amount);
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  date.setDate(Math.min(day, lastDay));
  return toKey(date);
}

function monthKey(key: string) {
  return key.slice(0, 7);
}

/** 42 dias da grade, começando no domingo da semana do dia 1. */
function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1, 12);
  const start = new Date(year, month, 1 - first.getDay(), 12);
  return Array.from({ length: GRID_SIZE }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return toKey(day);
  });
}

/* ---------- página ---------- */

export function Calendar() {
  const { events, loading, error, retry } = useData();

  const [todayKey] = useState(() => toKey(new Date()));
  const [selected, setSelected] = useState(todayKey);
  const [viewMonth, setViewMonth] = useState(monthKey(todayKey));

  const cellRefs = useRef(new Map<string, HTMLButtonElement>());
  const shouldFocus = useRef(false);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const event of events) {
      const list = map.get(event.data) ?? [];
      list.push(event);
      map.set(event.data, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));
    }
    return map;
  }, [events]);

  const [year, month] = viewMonth.split("-").map(Number);
  const grid = useMemo(() => buildGrid(year, month - 1), [year, month]);
  const weeks = Array.from({ length: GRID_SIZE / 7 }, (_, i) =>
    grid.slice(i * 7, i * 7 + 7),
  );

  // Só um dia da grade entra na ordem de tabulação (roving tabindex).
  const tabStop =
    monthKey(selected) === viewMonth ? selected : `${viewMonth}-01`;

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    cellRefs.current.get(selected)?.focus();
  }, [selected, viewMonth]);

  function moveSelection(key: string, focus = false) {
    shouldFocus.current = focus;
    setSelected(key);
    setViewMonth(monthKey(key));
  }

  /** Botões de mês: vai para hoje (se for o mês atual) ou para o dia 1. */
  function changeMonth(amount: number) {
    const target = addMonths(`${viewMonth}-01`, amount);
    moveSelection(monthKey(target) === monthKey(todayKey) ? todayKey : target);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, key: string) {
    const weekday = fromKey(key).getDay();
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(key, -1),
      ArrowRight: () => addDays(key, 1),
      ArrowUp: () => addDays(key, -7),
      ArrowDown: () => addDays(key, 7),
      PageUp: () => addMonths(key, -1),
      PageDown: () => addMonths(key, 1),
      Home: () => addDays(key, -weekday),
      End: () => addDays(key, 6 - weekday),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    moveSelection(move(), true);
  }

  const selectedEvents = eventsByDay.get(selected) ?? [];
  const selectedIsPast = selected < todayKey;
  const monthTitle = fromKey(`${viewMonth}-01`).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={17} aria-hidden="true" /> Voltar ao mural
      </Link>
      <div className="mb-7">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
          <CalendarDays size={17} aria-hidden="true" /> Agenda acadêmica
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          Calendário de eventos
        </h1>
        <p className="mt-2 text-gray-500">
          Palestras, workshops e atividades para complementar sua formação.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
        >
          <p className="font-semibold text-red-800">
            Não foi possível carregar os dados.
          </p>
          <p className="mt-1 text-sm text-red-600">
            Verifique sua conexão e tente novamente.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mx-auto mt-5 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section
            aria-labelledby="calendar-title"
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Mês anterior"
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <h2
                id="calendar-title"
                aria-live="polite"
                className="text-base font-bold capitalize text-gray-950 sm:text-lg"
              >
                {monthTitle}
              </h2>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Próximo mês"
                className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
              >
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>

            {loading ? (
              <div role="status" aria-label="Carregando calendário">
                <span className="sr-only">Carregando calendário…</span>
                <div className="grid grid-cols-7 gap-px bg-gray-100 p-px">
                  {Array.from({ length: GRID_SIZE }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square animate-pulse bg-white p-2"
                    >
                      <div className="size-5 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div role="grid" aria-labelledby="calendar-title">
                <div
                  role="row"
                  className="grid grid-cols-7 border-b border-gray-100 bg-gray-50"
                >
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      role="columnheader"
                      className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wide text-gray-400 sm:text-xs"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-px bg-gray-100">
                  {weeks.map((week) => (
                    <div
                      key={week[0]}
                      role="row"
                      className="grid grid-cols-7 gap-px bg-gray-100"
                    >
                      {week.map((key) => {
                        const list = eventsByDay.get(key) ?? [];
                        const outside = monthKey(key) !== viewMonth;
                        const isToday = key === todayKey;
                        const isSelected = key === selected;
                        const isPast = key < todayKey;
                        const label = `${formatDate(key, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}${isToday ? ", hoje" : ""}${
                          list.length === 0
                            ? ""
                            : list.length === 1
                              ? ", 1 evento"
                              : `, ${list.length} eventos`
                        }`;

                        return (
                          <button
                            key={key}
                            type="button"
                            role="gridcell"
                            ref={(node) => {
                              if (node) cellRefs.current.set(key, node);
                              else cellRefs.current.delete(key);
                            }}
                            tabIndex={key === tabStop ? 0 : -1}
                            aria-label={label}
                            aria-selected={isSelected}
                            aria-current={isToday ? "date" : undefined}
                            onClick={() => moveSelection(key)}
                            onKeyDown={(event) => handleKeyDown(event, key)}
                            className={`relative aspect-square min-h-12 bg-white p-1.5 text-left transition hover:bg-blue-50 sm:min-h-20 sm:p-2.5 ${
                              outside ? "text-gray-300" : "text-gray-700"
                            } ${
                              isSelected
                                ? "z-10 ring-2 ring-inset ring-blue-500"
                                : ""
                            }`}
                          >
                            <span
                              className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-medium sm:size-7 sm:text-sm ${
                                isToday ? "bg-blue-600 text-white" : ""
                              }`}
                            >
                              {fromKey(key).getDate()}
                            </span>
                            {list.length > 0 && (
                              <span
                                aria-hidden="true"
                                className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 sm:bottom-2.5"
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    isPast ? "bg-gray-400" : "bg-blue-500"
                                  }`}
                                />
                                <span
                                  className={`hidden text-[10px] font-semibold sm:inline ${
                                    isPast ? "text-gray-500" : "text-blue-600"
                                  }`}
                                >
                                  {list.length}
                                </span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400 sm:px-6">
              Use as setas do teclado para mudar de dia e PageUp/PageDown para
              mudar de mês.
            </p>
          </section>

          <aside
            aria-live="polite"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Eventos de
            </p>
            <h2 className="mt-1 text-xl font-bold text-gray-950">
              {formatDate(selected, {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="mt-5 space-y-4">
              {!loading && selectedEvents.length === 0 && (
                <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                  Não há eventos nesta data.
                </div>
              )}
              {selectedEvents.map((event) => (
                <article
                  key={event.id}
                  className={`rounded-xl border p-4 ${
                    selectedIsPast
                      ? "border-gray-200 bg-gray-50"
                      : "border-blue-100 bg-blue-50/40"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                        selectedIsPast
                          ? "bg-gray-200 text-gray-600"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {titleCase(event.tipo)}
                    </span>
                    {selectedIsPast && (
                      <span className="rounded-full bg-gray-800 px-2 py-1 text-[11px] font-bold text-white">
                        Encerrado
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-950">
                    {event.titulo}
                  </h3>
                  <div className="mt-3 space-y-2 text-xs text-gray-500">
                    <p className="flex items-center gap-2">
                      <Clock3 size={14} aria-hidden="true" />
                      {event.horarioInicio}–{event.horarioFim}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} aria-hidden="true" />
                      {event.local}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {event.descricao}
                  </p>
                  <p className="mt-3 text-xs font-medium text-gray-500">
                    {event.instituicao}
                  </p>
                  {event.linksExternos.map((url, index) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {index === 0
                        ? "Mais informações"
                        : `Mais informações ${index + 1}`}{" "}
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ))}
                </article>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
