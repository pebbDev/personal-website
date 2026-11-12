import type { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function Card({ title, description, children }: CardProps) {
  return (
    <article className="rounded-2xl border border-outline bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 text-sm leading-6 text-muted">{description}</p>}
      {children}
    </article>
  );
}
