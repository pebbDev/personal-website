"use client";

import { useMemo } from "react";
import OnThisPage from "@/components/ui/OnThisPage";
import { useOnThisPageScrollspy } from "@/components/ui/OnThisPage/use-scrollspy";
import type { CaseDetailSection } from "./types";

export default function CaseTOC({ sections }: Readonly<{ sections: readonly CaseDetailSection[] }>) {
  const items = useMemo(() => sections.map(({ id, eyebrow }) => ({ id, label: eyebrow.slice(5) })), [sections]);
  const { activeId, setActiveId } = useOnThisPageScrollspy(items);
  return (
    <OnThisPage
      items={items}
      activeId={activeId}
      onNavigate={(_event, item) => setActiveId(item.id)}
      className="case-detail-toc"
      headingElement="p"
      headingClassName="case-detail-toc-label"
    />
  );
}
