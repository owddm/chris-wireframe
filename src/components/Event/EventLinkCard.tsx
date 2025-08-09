import { LuLink } from "react-icons/lu";

interface EventLinkCardProps {
  link: {
    type: string;
    title: string;
    description?: string;
    url: string;
  };
}

export default function EventLinkCard({ link }: EventLinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card bg-base-100 shadow-xl transition-shadow hover:shadow-2xl"
    >
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="text-primary">
            <LuLink size={32} />
          </div>
          <div className="flex-1">
            <h3 className="card-title text-lg">{link.title}</h3>
            {link.description && <p className="text-base-content/70 mt-2">{link.description}</p>}
          </div>
        </div>
      </div>
    </a>
  );
}
