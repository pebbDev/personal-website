"use client";

import { useEffect, useRef } from "react";

import type { OrbitCardData } from "../types";
import { getOrbitCardState, getOrbitLayout } from "./orbit-geometry";

export default function OrbitRing({ cards }: Readonly<{ cards: readonly OrbitCardData[] }>) {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const hero = ring?.closest<HTMLElement>(".home-hero-orbit");
    const copy = hero?.querySelector<HTMLElement>(".home-hero-copy");
    if (!ring || !hero || !copy) return;

    const elements = Array.from(ring.children) as HTMLElement[];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileLayout = window.matchMedia("(max-width: 640px)");
    let reduced = preference.matches;
    let disposed = false;
    let frameId: number | null = null;
    let layoutFrameId: number | null = null;
    let drift = 0;
    let scroll = window.scrollY;
    let last = performance.now();
    let layout = getOrbitLayout(hero.clientWidth, copy.offsetTop + copy.offsetHeight / 2);
    const bounds = hero.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight;

    function draw() {
      const phase = reduced ? 0 : scroll * 0.16 + drift;
      elements.forEach((element, index) => {
        const state = getOrbitCardState(index, elements.length, phase, layout);
        element.style.transform = `translate3d(${state.x.toFixed(1)}px,${state.y.toFixed(1)}px,0) rotate(${state.rotation.toFixed(2)}deg)`;
        element.style.opacity = state.opacity.toFixed(2);
        element.style.visibility = state.visible ? "visible" : "hidden";
      });
    }

    function frame(now: number) {
      frameId = null;
      if (disposed || reduced || !visible) return;
      drift += Math.min(64, now - last) * 0.0035;
      last = now;
      scroll += (window.scrollY - scroll) * 0.12;
      draw();
      frameId = requestAnimationFrame(frame);
    }

    function stop() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    }

    function start() {
      if (disposed || reduced || !visible || frameId !== null) return;
      last = performance.now();
      frameId = requestAnimationFrame(frame);
    }

    function relayout() {
      if (disposed) return;
      layout = getOrbitLayout(hero!.clientWidth, copy!.offsetTop + copy!.offsetHeight / 2);
      ring!.style.setProperty("--home-hero-card-size", `${layout.cardSize}px`);
      draw();
    }

    function scheduleLayout() {
      if (disposed || layoutFrameId !== null) return;
      layoutFrameId = requestAnimationFrame(() => {
        // Media-query changes can precede the corresponding computed styles.
        layoutFrameId = requestAnimationFrame(() => {
          layoutFrameId = null;
          relayout();
        });
      });
    }

    function onPreferenceChange() {
      reduced = preference.matches;
      stop();
      if (reduced) {
        drift = 0;
        scroll = window.scrollY;
      }
      draw();
      start();
    }

    const intersection =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
          });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleLayout);
    intersection?.observe(hero);
    resize?.observe(hero);
    resize?.observe(copy);
    window.addEventListener("resize", scheduleLayout);
    // A margin-only breakpoint moves the copy without resizing its observed box.
    mobileLayout.addEventListener("change", scheduleLayout);
    preference.addEventListener("change", onPreferenceChange);
    void document.fonts.ready.then(scheduleLayout);
    relayout();
    start();

    return () => {
      disposed = true;
      stop();
      if (layoutFrameId !== null) cancelAnimationFrame(layoutFrameId);
      intersection?.disconnect();
      resize?.disconnect();
      window.removeEventListener("resize", scheduleLayout);
      mobileLayout.removeEventListener("change", scheduleLayout);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [cards]);

  return (
    <div ref={ringRef} className="home-hero-ring" aria-hidden="true">
      {cards.map((card) => (
        <div key={card.id} className="home-hero-card">
          <span className="home-hero-card-label">{card.label}</span>
        </div>
      ))}
    </div>
  );
}
