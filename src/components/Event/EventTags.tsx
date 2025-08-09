import { LuTag } from "react-icons/lu";

interface EventTagsProps {
  tags?: string[];
}

export default function EventTags({ tags }: EventTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <LuTag className="text-base-content/70 h-4 w-4" />
      {tags.map((tag, index) => (
        <span key={index} className="badge badge-ghost">
          {tag}
        </span>
      ))}
    </div>
  );
}
