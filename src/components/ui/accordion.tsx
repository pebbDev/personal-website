import type { ReactNode } from "react";

type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export default function Accordion({ title, children, defaultOpen, className }: AccordionProps) {
  return (
    <details className={className ? `toggle ${className}` : "toggle"} open={defaultOpen}>
      <summary>{title}</summary>
      <div className="toggle-body">{children}</div>
    </details>
  );
}
