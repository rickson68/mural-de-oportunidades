import { RotateCcw } from "lucide-react";

export default function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="font-semibold text-red-800">
        Não foi possível carregar os dados.
      </p>
      <p className="mt-1 text-sm text-red-600">
        Verifique sua conexão e tente novamente.
      </p>
      <button
        onClick={retry}
        className="mx-auto mt-5 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Tentar novamente
      </button>
    </div>
  );
}
