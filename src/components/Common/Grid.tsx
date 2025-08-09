import type { ReactNode } from "react";

interface GridProps {
  className?: string;
  children: ReactNode;
}

export default function Grid({ className, children }: GridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] ${
        className || ""
      }`.trim()}
    >
      {children}
    </div>
  );
}
