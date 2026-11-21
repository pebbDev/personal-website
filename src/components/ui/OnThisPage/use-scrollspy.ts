"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { selectActiveSectionId } from "./select-active";
import type { OnThisPageItem } from "./types";

export function useOnThisPageScrollspy(items: readonly OnThisPageItem[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const itemsRef = useRef(items);
  const idsKey = items.map((item) => item.id).join("\u0000");
  const { scrollY } = useScroll();

  const refresh = useCallback(() => {
    const nextActive = selectActiveSectionId(
      itemsRef.current,
      (id) => document.getElementById(id)?.getBoundingClientRect().top ?? null,
      window.innerHeight
    );
    setActiveId((previous) => (previous === nextActive ? previous : nextActive));
  }, []);

  useMotionValueEvent(scrollY, "change", refresh);

  useEffect(() => {
    itemsRef.current = items;
    refresh();
  }, [items, refresh]);

  useEffect(() => {
    refresh();
    window.addEventListener("resize", refresh);

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            refresh();
          });

    if (observer) {
      for (const item of itemsRef.current) {
        const target = document.getElementById(item.id);
        if (target) observer.observe(target);
      }
    }

    return () => {
      window.removeEventListener("resize", refresh);
      observer?.disconnect();
    };
  }, [idsKey, refresh]);

  const selectImmediately = useCallback((id: string) => {
    setActiveId((previous) => (previous === id ? previous : id));
  }, []);

  return { activeId, setActiveId: selectImmediately, refresh };
}
