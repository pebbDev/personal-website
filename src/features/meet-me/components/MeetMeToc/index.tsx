"use client";

import { useEffect, useState, type MouseEvent } from "react";
import type { MeetMeSectionId, MeetMeTocItem } from "../../types";

export default function MeetMeToc({ items }: Readonly<{ items: readonly MeetMeTocItem[] }>) {
  const [activeId, setActiveId] = useState<MeetMeSectionId>(items[0]?.id ?? "experience");

  useEffect(() => {
    const updateActive = () => {
      const readingLine = window.innerHeight * 0.35;
      let nextActive = items[0]?.id ?? "experience";

      for (const item of items) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= readingLine) {
          nextActive = item.id;
        }
      }

      setActiveId((previous) => (previous === nextActive ? previous : nextActive));
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [items]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: MeetMeSectionId) => {
    // Preview uses #meet-me for page selection; section fragments would unmount this page.
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ block: "start", behavior: reducedMotion ? "instant" : "smooth" });
    setActiveId(id);
  };

  return (
    <aside className="meet-me-toc" aria-label="On this page">
      <h2 className="meet-me-toc-heading">On this page</h2>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => handleClick(event, item.id)}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
