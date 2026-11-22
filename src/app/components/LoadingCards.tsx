export default function LoadingCards({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Carregando oportunidades"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-2xl border border-ink-200 bg-surface p-5"
        >
          <div className="mb-6 h-6 w-24 rounded-full bg-ink-100" />
          <div className="mb-3 h-5 w-4/5 rounded bg-ink-100" />
          <div className="mb-2 h-3 w-full rounded bg-ink-100" />
          <div className="mb-2 h-3 w-11/12 rounded bg-ink-100" />
          <div className="mt-16 h-10 rounded-xl bg-ink-100" />
        </div>
      ))}
    </div>
  );
}
