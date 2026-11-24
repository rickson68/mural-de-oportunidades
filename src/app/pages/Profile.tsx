import type { ReactNode } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Link } from "react-router";
import { CheckboxGroup } from "../components/CheckboxGroup";
import { useAluno } from "../components/useAluno";
import ErrorState from "../components/ErrorState";
import LoadingCards from "../components/LoadingCards";
import { useData } from "../data";
import { QuizWizard } from "../quiz/QuizWizard";
import {
  resetPerfil,
  setPreferencia,
  usePerfil,
  type Preferencia,
} from "../quiz/perfilStore";
import { fields, labels, useQuizState } from "../quiz/useQuiz";

const card =
  "rounded-2xl border border-ink-200 bg-surface p-5 shadow-sm sm:p-6";

function PreferenceRow({
  checked,
  onChange,
  disabled,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-lg border border-transparent px-2 py-2 text-sm text-ink-700 has-[:checked]:border-primary-200 has-[:checked]:bg-primary-50 ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-ink-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-primary-600"
      />
      <span>{children}</span>
    </label>
  );
}

export function Profile() {
  const { aluno } = useAluno();
  const { opportunities, loading, error, retry } = useData();
  const quiz = useQuizState(opportunities);
  const perfil = usePerfil();

  const nome = aluno ?? "Aluno";

  const totalInteresses = fields.reduce(
    (n, f) => n + quiz.answers[f].filter((v) => v !== "indiferente").length,
    0,
  );
  const setPref = (key: Preferencia) => (value: boolean) =>
    setPreferencia(key, value);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
      {/* Cabeçalho */}
      <header className={`${card} flex items-center gap-4`}>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
            {nome}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Conte o que você procura e a gente destaca as oportunidades certas.
          </p>
        </div>
      </header>

      {/* Quiz no meio da tela */}
      <section aria-label="Quiz de recomendação">
        {loading ? (
          <LoadingCards count={1} />
        ) : error ? (
          <ErrorState retry={retry} />
        ) : quiz.finished ? (
          <div
            className={`${card} flex flex-col items-center gap-3 text-center`}
          >
            <CheckCircle2
              size={32}
              className="text-primary-600"
              aria-hidden="true"
            />
            <h2 className="text-xl font-bold text-ink-950">Quiz concluído</h2>
            <p className="text-sm text-ink-500">
              {quiz.results.length}{" "}
              {quiz.results.length === 1
                ? "oportunidade combina"
                : "oportunidades combinam"}{" "}
              com o seu perfil. Ajuste os interesses abaixo quando quiser.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={quiz.restart}
                className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-surface px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
              >
                <RotateCcw size={16} aria-hidden="true" /> Refazer quiz
              </button>
              <Link
                to="/"
                className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-on-color hover:bg-primary-700"
              >
                Ver oportunidades
              </Link>
            </div>
          </div>
        ) : (
          <QuizWizard quiz={quiz} />
        )}
      </section>

      {/* Caixinhas: leem e alteram o mesmo localStorage do quiz */}
      <section aria-labelledby="interesses" className="flex flex-col gap-4">
        <div>
          <h2 id="interesses" className="text-lg font-bold text-ink-950">
            Seus interesses
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Preenchido pelo quiz. Você também pode marcar e desmarcar aqui.
          </p>
        </div>
        {loading || error
          ? null
          : fields.map((field) => (
              <CheckboxGroup
                key={field}
                legend={labels[field].short}
                options={["indiferente", ...quiz.optionsByField[field]]}
                value={quiz.answers[field]}
                onToggle={(value) => quiz.toggle(field, value)}
              />
            ))}
      </section>

      {/* Preferências de aviso */}
      <section aria-labelledby="avisos" className={card}>
        <h2 id="avisos" className="mb-3 text-lg font-bold text-ink-950">
          Avisos
        </h2>
        <div className="flex flex-col gap-1">
          <PreferenceRow
            checked={perfil.emailNovidades}
            onChange={setPref("emailNovidades")}
          >
            Desejo receber novas oportunidades e eventos por e-mail.
          </PreferenceRow>
          <PreferenceRow
            checked={perfil.apenasInteresses}
            onChange={setPref("apenasInteresses")}
            disabled={totalInteresses === 0}
          >
            Desejo receber apenas as oportunidades de meu interesse.
            {totalInteresses === 0 && (
              <span className="block text-xs text-ink-400">
                Escolha ao menos um interesse para ativar.
              </span>
            )}
          </PreferenceRow>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-400">
        <span>Suas escolhas são salvas automaticamente neste navegador.</span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Apagar todas as respostas e preferências?"))
              resetPerfil();
          }}
          className="font-medium text-danger-600 hover:text-danger-800"
        >
          Limpar perfil
        </button>
      </footer>
    </div>
  );
}
