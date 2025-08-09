import { useState } from "react";

import { LuCheck, LuCopy } from "react-icons/lu";

interface CopyTextProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyText({ text, label, className = "" }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-base-content/70 text-xs">{label}</span>}
      <div className="bg-base-200 flex flex-1 items-center gap-2 rounded-md px-3 py-2">
        <input
          type="text"
          value={text}
          readOnly
          className="flex-1 bg-transparent text-xs outline-none"
          onClick={(e) => e.currentTarget.select()}
        />
        <button
          onClick={handleCopy}
          className="btn btn-ghost btn-xs p-1"
          aria-label="Copy to clipboard"
        >
          {copied ? <LuCheck className="h-4 w-4" /> : <LuCopy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
