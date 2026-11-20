"use client";

import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

export default function Closing({ heading }: Readonly<{ heading: string }>) {
  const sectionRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const reveal = useCallback(() => {
    if (sectionRef.current) sectionRef.current.dataset.reveal = "visible";
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  const revealInstantly = useCallback(() => {
    reveal();
    if (sectionRef.current) sectionRef.current.dataset.reveal = "instant";
  }, [reveal]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || typeof IntersectionObserver === "undefined" || section.contains(document.activeElement)) {
      reveal();
      return;
    }

    const rect = section.getBoundingClientRect();
    // Never hide SSR-visible content already within the viewport on hydration.
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      reveal();
      return;
    }

    const onMotionChange = () => {
      if (motion.matches) revealInstantly();
    };
    let listenerAttached = false;

    // Complete setup before hiding content so unsupported event APIs fail visibly.
    try {
      motion.addEventListener("change", onMotionChange);
      listenerAttached = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) reveal();
        },
        { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
      );
      observerRef.current = observer;
      observer.observe(section);
      if (motion.matches) revealInstantly();
      else section.dataset.reveal = "pending";
    } catch {
      reveal();
      if (listenerAttached) {
        motion.removeEventListener?.("change", onMotionChange);
        listenerAttached = false;
      }
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (listenerAttached) motion.removeEventListener?.("change", onMotionChange);
    };
  }, [reveal, revealInstantly]);

  return (
    <section
      ref={sectionRef}
      className="meet-me-closing"
      aria-labelledby="meet-me-closing-title"
      onFocusCapture={revealInstantly}
    >
      <h2 id="meet-me-closing-title">{heading}</h2>
      <div className="meet-me-closing-actions">
        <Button href="#work" variant="line" size="lg">
          See my work
        </Button>
        <Button type="button" variant="dark" size="lg" disabled>
          Say Hi 💬
        </Button>
      </div>
    </section>
  );
}
