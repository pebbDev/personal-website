"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { useOrbitLayout } from "./useOrbitLayout";

export function useOrbitMotion() {
  const { ringRef, layout } = useOrbitLayout();
  const motionPreference = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(Boolean(motionPreference));

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", sync);
    sync();
    return () => preference.removeEventListener("change", sync);
  }, []);

  const reduced = useMotionValue(Boolean(reducedMotion));
  const active = useMotionValue(false);
  const frozen = useMotionValue(0);
  const drift = useMotionValue(0);
  const { scrollY } = useScroll();

  // Approximation of the source's 0.12/frame smoothing; fidelity QA still required.
  const easedScroll = useSpring(scrollY, { stiffness: 170, damping: 26, mass: 1 });
  const phase = useTransform(() => {
    // Read all sources unconditionally to preserve subscriptions when paused.
    const isReduced = reduced.get();
    const isActive = active.get();
    const driftPhase = drift.get();
    const easedPhase = easedScroll.get() * 0.16;
    const frozenPhase = frozen.get();
    return isReduced ? 0 : isActive ? easedPhase + driftPhase : frozenPhase;
  });

  useEffect(() => {
    const hero = ringRef.current?.closest<HTMLElement>(".home-hero-orbit");
    if (!hero) return;

    const prefersReducedMotion = Boolean(reducedMotion);
    const animation = animate(drift, drift.get() + 360, {
      duration: 360 / 3.5,
      ease: "linear",
      repeat: Infinity,
    });

    reduced.set(prefersReducedMotion);
    if (prefersReducedMotion) {
      animation.pause();
      drift.set(0);
      frozen.set(0);
      active.set(false);
    }

    // Preserve the native guard used for hash-driven scroll visibility.
    let wasVisible: boolean | null = null;
    function syncVisibility() {
      const bounds = hero!.getBoundingClientRect();
      const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      if (prefersReducedMotion) {
        active.set(false);
        animation.pause();
        return;
      }
      if (visible === wasVisible) return;
      wasVisible = visible;
      if (visible) {
        active.set(true);
        animation.play();
      } else {
        frozen.set(easedScroll.get() * 0.16 + drift.get());
        active.set(false);
        animation.pause();
      }
    }

    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(syncVisibility);
    observer?.observe(hero);
    window.addEventListener("scroll", syncVisibility, { passive: true });
    window.addEventListener("resize", syncVisibility);
    syncVisibility();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", syncVisibility);
      window.removeEventListener("resize", syncVisibility);
      animation.stop();
    };
  }, [active, drift, easedScroll, frozen, reduced, reducedMotion, ringRef]);

  return { ringRef, layout, phase };
}
