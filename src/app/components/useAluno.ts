import { useEffect, useState } from "react";

const KEY = "aluno";

function readAluno() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function useAluno() {
  const [aluno, setAluno] = useState<string | null>(readAluno);

  useEffect(() => {
    const sync = () => setAluno(readAluno());
    window.addEventListener("storage", sync); // outras abas
    window.addEventListener("aluno-change", sync); // mesma aba
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("aluno-change", sync);
    };
  }, []);

  const login = (nome: string) => {
    localStorage.setItem(KEY, nome);
    window.dispatchEvent(new Event("aluno-change"));
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("aluno-change"));
  };

  return { aluno, login, logout };
}
