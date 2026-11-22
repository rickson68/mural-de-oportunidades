import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function AccessCard({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-primary-100 bg-primary-50/60 p-4 transition hover:border-primary-200 hover:bg-primary-50"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary-600 shadow-sm">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink-950">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-ink-500">
          {description}
        </span>
      </span>
      <ArrowRight
        className="text-primary-500 transition group-hover:translate-x-0.5"
        size={18}
        aria-hidden="true"
      />
    </Link>
  );
}
