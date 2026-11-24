import { useState, type FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";

const inputClass =
  "w-full rounded-lg border border-ink-300 bg-surface px-3.5 py-2.5 text-sm text-ink-800 " +
  "placeholder:text-ink-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

export function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  const handleGoogleLogin = () => {
    localStorage.setItem("aluno", "Pedro Rickson");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-ink-200 bg-surface p-8 shadow-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-ink-950">
            Entrar
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Acesse o Mural de Oportunidades.
          </p>
        </header>

        <section aria-labelledby="alunos">
          <h2 id="alunos" className="mb-3 text-sm font-semibold text-ink-700">
            Alunos
          </h2>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-ink-300 bg-surface px-4 py-3 text-sm font-medium text-ink-700 shadow-sm transition hover:bg-ink-50"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="size-5" aria-hidden="true" />
            Continuar com Google
          </button>
        </section>

        <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
          <span className="h-px flex-1 bg-ink-200" />
          ou
          <span className="h-px flex-1 bg-ink-200" />
        </div>

        <section aria-labelledby="editores">
          <h2 id="editores" className="mb-3 text-sm font-semibold text-ink-700">
            Editores
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Usuário
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu usuário"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-on-color transition hover:bg-primary-700"
            >
              Entrar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
