"use client";

import type { MouseEvent } from "react";
import type { OnThisPageItem } from "./types";

export type OnThisPageProps = Readonly<{
  items: readonly OnThisPageItem[];
  activeId: string | null;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, item: OnThisPageItem) => void;
  headingElement?: "h2" | "p";
  className?: string;
  headingClassName?: string;
}>;

export default function OnThisPage({
  items,
  activeId,
  onNavigate,
  headingElement: Heading = "h2",
  className,
  headingClassName,
}: OnThisPageProps) {
  return (
    <nav className={["on-this-page", className].filter(Boolean).join(" ")} aria-label="On this page">
      <Heading className={["on-this-page-heading", headingClassName].filter(Boolean).join(" ")}>On this page</Heading>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              onClick={onNavigate ? (event) => onNavigate(event, item) : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
