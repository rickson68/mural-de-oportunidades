export type Keyword = {
  value: string;
  fields: string[]; // categorias a que a palavra pertence (quase sempre 1)
};

type KeywordCloudProps = {
  legend: string;
  keywords: Keyword[];
  isSelected: (keyword: Keyword) => boolean;
  onToggle: (keyword: Keyword) => void;
  onClear?: () => void;
};

/** Um único grupo de checkboxes em formato de chips (nuvem de palavras-chave). */
export function KeywordCloud({
  legend, keywords, isSelected, onToggle, onClear,
}: KeywordCloudProps) {
  const total = keywords.filter(isSelected).length;

  return (
    <fieldset className="rounded-2xl border border-ink-200 bg-surface p-5 shadow-sm sm:p-6">
      <legend className="sr-only">{legend}</legend>

      <div className="mb-4 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold uppercase tracking-wide text-ink-400" aria-live="polite">
          {total === 0
            ? "Nenhum selecionado"
            : `${total} ${total === 1 ? "selecionado" : "selecionados"}`}
        </span>
        {onClear && total > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="font-medium text-primary-600 hover:text-primary-800"
          >
            Limpar seleção
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <label key={keyword.value} className="cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected(keyword)}
              onChange={() => onToggle(keyword)}
              className="peer sr-only"
            />
            <span className="block rounded-full border border-ink-200 bg-surface px-3.5 py-1.5 text-sm text-ink-700 transition first-letter:uppercase hover:border-primary-200 hover:bg-primary-50/40 peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-checked:text-on-color peer-checked:hover:bg-primary-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-600">
              {keyword.value}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
