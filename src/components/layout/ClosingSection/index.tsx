"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { ClosingAction, ClosingSectionProps } from "./types";

export type { ClosingAction, ClosingSectionProps } from "./types";

function ClosingButton({ action, variant }: Readonly<{ action: ClosingAction; variant: "line" | "dark" }>) {
  const content = (
    <>
      {action.icon ? <span aria-hidden="true">{action.icon}</span> : null}
      {action.label}
    </>
  );

  if (action.kind === "link") {
    return (
      <Button
        href={action.href}
        variant={variant}
        size="lg"
        {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button type="button" variant={variant} size="lg" disabled>
      {content}
    </Button>
  );
}

export default function ClosingSection({ heading, primary, secondary, className }: ClosingSectionProps) {
  const headingId = useId();
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

    let motion: MediaQueryList;
    try {
      motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      reveal();
      return;
    }
    if (motion.matches || typeof IntersectionObserver === "undefined" || section.contains(document.activeElement)) {
      reveal();
      return;
    }

    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      reveal();
      return;
    }

    const onMotionChange = () => {
      if (motion.matches) revealInstantly();
    };
    let listenerAttached = false;

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
      className={["closing-section", className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
      onFocusCapture={revealInstantly}
    >
      <h2 id={headingId}>{heading}</h2>
      <div className="closing-section-actions">
        {" "}
        <ClosingButton action={primary} variant="line" />
        <ClosingButton action={secondary} variant="dark" />
      </div>
    </section>
  );
}
