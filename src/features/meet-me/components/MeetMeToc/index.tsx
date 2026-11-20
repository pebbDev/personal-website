"use client";

import { useCallback, type MouseEvent } from "react";
import { useReducedMotion } from "motion/react";
import OnThisPage from "@/components/ui/OnThisPage";
import type { OnThisPageItem } from "@/components/ui/OnThisPage/types";
import { useOnThisPageScrollspy } from "@/components/ui/OnThisPage/use-scrollspy";
import type { MeetMeTocItem } from "../../types";

export default function MeetMeToc({ items }: Readonly<{ items: readonly MeetMeTocItem[] }>) {
  const { activeId, setActiveId } = useOnThisPageScrollspy(items);
  const reduceMotion = useReducedMotion();

  const handleNavigate = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, item: OnThisPageItem) => {
      // Preview selects the page through #meet-me; section fragments would unmount it.
      event.preventDefault();
      const target = document.getElementById(item.id);
      if (!target) return;
      target.scrollIntoView({ block: "start", behavior: reduceMotion ? "instant" : "smooth" });
      setActiveId(item.id);
    },
    [reduceMotion, setActiveId]
  );

  return (
    <aside className="meet-me-toc">
      <OnThisPage items={items} activeId={activeId} onNavigate={handleNavigate} />
    </aside>
  );
}
