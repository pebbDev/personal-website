"use client";

import { useEffect, useRef } from "react";
import { useMotionValue } from "motion/react";

import type { OrbitLayout } from "./types";
import { getOrbitLayout } from "./geometry";
export function useOrbitLayout() {
  const ringRef = useRef<HTMLDivElement>(null);
  const layout = useMotionValue<OrbitLayout>(getOrbitLayout(1440, 400));

  useEffect(() => {
    const ring = ringRef.current;
    const hero = ring?.closest<HTMLElement>(".home-hero-orbit");
    const copy = hero?.querySelector<HTMLElement>(".home-hero-copy");
    if (!ring || !hero || !copy) return;

    const mobileLayout = window.matchMedia("(max-width: 640px)");
    let disposed = false;
    let firstFrame: number | null = null;
    let secondFrame: number | null = null;

    function measure() {
      if (disposed) return;
      const nextLayout = getOrbitLayout(hero!.clientWidth, copy!.offsetTop + copy!.offsetHeight / 2);
      ring!.style.setProperty("--home-hero-card-size", `${nextLayout.cardSize}px`);
      layout.set(nextLayout);
    }

    function scheduleLayout() {
      if (disposed || firstFrame !== null) return;
      firstFrame = requestAnimationFrame(() => {
        firstFrame = null;
        // A media-query change can fire before computed margins are updated.
        secondFrame = requestAnimationFrame(() => {
          secondFrame = null;
          measure();
        });
      });
    }

    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleLayout);
    resize?.observe(hero);
    resize?.observe(copy);
    window.addEventListener("resize", scheduleLayout);
    mobileLayout.addEventListener("change", scheduleLayout);
    void document.fonts.ready.then(scheduleLayout);
    measure();

    return () => {
      disposed = true;
      if (firstFrame !== null) cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) cancelAnimationFrame(secondFrame);
      resize?.disconnect();
      window.removeEventListener("resize", scheduleLayout);
      mobileLayout.removeEventListener("change", scheduleLayout);
    };
  }, [layout]);

  return { ringRef, layout };
}
