import type { ReactNode } from "react";
import type { CaseDetailSection } from "./types";

export default function CaseSection({
  section,
  children,
}: Readonly<{ section: CaseDetailSection; children: ReactNode }>) {
  return (
    <section id={section.id} className="case-detail-section" aria-labelledby={"case-" + section.id + "-title"}>
      <p className="case-detail-kicker">{section.eyebrow}</p>
      <h2 id={"case-" + section.id + "-title"}>{section.title}</h2>
      <p className="case-detail-section-lead">{section.intro}</p>
      {children}
    </section>
  );
}
