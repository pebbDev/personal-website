import type { AccordionProps } from "./types";

export type { AccordionProps } from "./types";
export default function Accordion({ title, children, defaultOpen, className }: AccordionProps) {
  return (
    <details className={className ? `toggle ${className}` : "toggle"} open={defaultOpen}>
      <summary>{title}</summary>
      <div className="toggle-body">{children}</div>
    </details>
  );
}
