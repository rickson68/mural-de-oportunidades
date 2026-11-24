import { Link, NavLink, Outlet } from "react-router";
import { Handshake } from "lucide-react";
import { LogOut } from "lucide-react";
import { useAluno } from "./useAluno";
import { useNavigate } from "react-router";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-primary-50 text-primary-700"
      : "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
  }`;

export function Layout() {
  const { aluno, logout } = useAluno();
  const primeiroNome = aluno?.split(" ")[0];

  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-ink-50 text-ink-800">
      <header className="border-b border-ink-200 bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3 rounded-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
              <Handshake
                size={19}
                aria-hidden="true"
                className="text-ink-1000"
              />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink-950 sm:text-base">
                Mural de Oportunidades
              </span>
              <span className="hidden text-xs text-ink-400 sm:block">
                Encontre sua próxima oportunidade
              </span>
            </span>
          </Link>
          <nav
            aria-label="Navegação principal"
            className="flex items-center gap-1"
          >
            <NavLink to="/" end className={navClass}>
              Início
            </NavLink>
            <NavLink to="/quiz" className={navClass}>
              Quiz
            </NavLink>
            <NavLink to="/calendario" className={navClass}>
              Calendário
            </NavLink>

            {aluno && (
              <div className="ml-2 flex items-center gap-2 border-l border-ink-200 pl-3">
                <span className="hidden text-sm font-medium text-ink-700 sm:block">
                  Olá,{" "}
                  <NavLink to="/profile" className="text-primary-700 underline">
                    {primeiroNome}
                  </NavLink>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  aria-label="Sair"
                  title="Sair"
                  className="rounded-lg p-2 text-ink-400 transition hover:bg-ink-50 hover:text-ink-900"
                >
                  <LogOut size={17} aria-hidden="true" />
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="mt-12 border-t border-ink-200 bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-7 text-center text-xs text-ink-400">
          Mural de Oportunidades · Engenharia de Computação · UFC Sobral · 2026
        </div>
      </footer>
    </div>
  );
}
