"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import type { CaseDetailSection } from "./types";

export default function CaseTOC({ sections }: Readonly<{ sections: readonly CaseDetailSection[] }>) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", () => {
    const threshold = window.innerHeight * 0.35;
    let current = sections[0]?.id ?? "";
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element && element.getBoundingClientRect().top <= threshold) current = section.id;
    }
    setActive((previous) => (previous === current ? previous : current));
  });

  return (
    <nav className="case-detail-toc" aria-label="On this page">
      <p className="case-detail-toc-label">On this page</p>
      <ol>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              onClick={() => setActive(section.id)}
            >
              {section.eyebrow.slice(5)}
              {active === section.id ? (
                <motion.span
                  className="case-detail-toc-marker"
                  layoutId="case-detail-toc-marker"
                  initial={false}
                  transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
                  aria-hidden="true"
                />
              ) : null}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
