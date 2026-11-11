import type { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-outline bg-slate-50 px-3 py-1 text-xs font-semibold text-muted">
      {children}
    </span>
  );
}
