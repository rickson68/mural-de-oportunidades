import { Link, NavLink, Outlet } from "react-router";
import { BookOpen } from "lucide-react";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-blue-50 text-blue-700"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
  }`;

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3 rounded-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <BookOpen size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-bold text-gray-950 sm:text-base">
                Mural de Oportunidades
              </span>
              <span className="hidden text-xs text-gray-400 sm:block">
                Engenharia de Computação · UFC Sobral
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
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-7 text-center text-xs text-gray-400">
          Mural de Oportunidades · Engenharia de Computação · UFC Sobral · 2026
        </div>
      </footer>
    </div>
  );
}
