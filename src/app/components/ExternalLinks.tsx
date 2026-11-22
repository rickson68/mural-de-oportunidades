import { ExternalLink } from "lucide-react";

export default function ExternalLinks({ links }: { links: string[] }) {
  return (
    <div className="space-y-2">
      {links.map((url, index) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {index === 0 ? "Acessar inscrição" : `Link Externo ${index + 1}`}
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
