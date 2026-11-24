type CheckboxGroupProps = {
  legend: string;
  options: string[];
  value: string[];
  onToggle: (option: string) => void;
};

export function CheckboxGroup({
  legend,
  options,
  value,
  onToggle,
}: CheckboxGroupProps) {
  return (
    <fieldset className="rounded-2xl border border-ink-200 bg-surface p-5">
      <legend className="px-2 text-sm font-semibold text-ink-700">
        {legend}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-700 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => onToggle(option)}
              className="size-4 accent-primary-600"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
