"use client";

import { useEffect, useMemo, useRef } from "react";
import { motionValue, scroll } from "motion";
import { useMotionValue, useSpring } from "motion/react";

import { calculateNoteGeometry, pinnedNoteProgress, pinnedTargetProgress, unpinnedNoteProgress } from "./geometry";
import type { NoteGeometry, NativeNoteRect, TestimonialsBoardProps, TestimonialsMotionState } from "./types";

const pinnedQuery = "(min-width: 901px) and (min-height: 640px)";
const emptyGeometry: NoteGeometry = { dx: 0, dy: 0, nativeTop: 0 };

export function useTestimonialsMotion(items: TestimonialsBoardProps["items"]): TestimonialsMotionState {
  const boardRef = useRef<HTMLDivElement>(null);
  const pinned = useMotionValue(false);
  // Start stationary on SSR and until layout is measured.
  const reduced = useMotionValue(true);
  const targetProgress = useMotionValue(0);
  const progress = useSpring(targetProgress, { stiffness: 140, damping: 30, mass: 1, skipInitialAnimation: true });

  const geometry = useMemo(() => items.map(() => motionValue<NoteGeometry>(emptyGeometry)), [items]);
  const unpinnedProgress = useMemo(() => items.map(() => motionValue(1)), [items]);

  useEffect(() => {
    const board = boardRef.current;
    const section = board?.closest<HTMLElement>("#words");
    const pin = section?.querySelector<HTMLElement>(".home-words-pin");
    if (!board || !section || !pin) return;

    const notes = Array.from(board.querySelectorAll<HTMLElement>(".home-words-note"));
    const layoutQuery = window.matchMedia(pinnedQuery);
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let resizeFrame: number | null = null;

    const updateSpread = () => {
      if (disposed || !board.isConnected) return;
      const allSpread = pinned.get()
        ? notes.every((_, index) => pinnedNoteProgress(progress.get(), index) >= 0.98)
        : unpinnedProgress.every((value) => value.get() >= 0.98);
      board.classList.toggle("is-spread", !reduced.get() && allSpread);
    };

    const measure = () => {
      if (disposed) return;
      const pinnedNow = layoutQuery.matches;
      const reducedNow = reduceQuery.matches;
      const nativeRects: NativeNoteRect[] = notes.map((note) => ({
        left: note.offsetLeft,
        top: note.offsetTop,
        width: note.offsetWidth,
        height: note.offsetHeight,
      }));
      calculateNoteGeometry(nativeRects, board.clientWidth, board.clientHeight, pinnedNow).forEach((position, index) =>
        geometry[index]?.set(position)
      );
      notes.forEach((note, index) => {
        note.style.zIndex = String(notes.length - index);
      });
      pinned.set(pinnedNow);
      reduced.set(reducedNow);
      section.classList.toggle("is-pinned", pinnedNow);
      const top = board.getBoundingClientRect().top;
      nativeRects.forEach((note, index) => {
        unpinnedProgress[index]?.set(unpinnedNoteProgress(top + note.top, window.innerHeight));
      });
      const initialProgress = pinnedTargetProgress(pin.getBoundingClientRect().top, window.innerHeight);
      targetProgress.set(initialProgress);
      // Avoid springing from a stale viewport position after a breakpoint change.
      progress.jump(initialProgress);
      updateSpread();
    };

    const scheduleMeasure = () => {
      if (disposed || resizeFrame !== null) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        measure();
      });
    };

    // Motion owns the continuous scroll tracking and interpolation. No custom animation RAF.
    const stopPinned = scroll(
      (value) => {
        if (!disposed && pinned.get()) targetProgress.set(value);
      },
      { target: pin, offset: ["start start", "start -80vh"] }
    );
    const stopUnpinned = notes.map((note, index) =>
      scroll(
        (value) => {
          if (!disposed && !pinned.get()) unpinnedProgress[index]?.set(value);
        },
        { target: note, offset: ["start 92%", "start 60%"] }
      )
    );
    const stopSpreadProgress = progress.on("change", updateSpread);
    const stopSpreadNotes = unpinnedProgress.map((value) => value.on("change", updateSpread));

    window.addEventListener("resize", scheduleMeasure);
    layoutQuery.addEventListener("change", scheduleMeasure);
    reduceQuery.addEventListener("change", scheduleMeasure);
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleMeasure);
    resizeObserver?.observe(board);
    notes.forEach((note) => resizeObserver?.observe(note));
    void document.fonts.ready.then(() => {
      if (!disposed) scheduleMeasure();
    });
    measure();

    return () => {
      disposed = true;
      stopPinned();
      stopUnpinned.forEach((stop) => stop());
      stopSpreadProgress();
      stopSpreadNotes.forEach((stop) => stop());
      window.removeEventListener("resize", scheduleMeasure);
      layoutQuery.removeEventListener("change", scheduleMeasure);
      reduceQuery.removeEventListener("change", scheduleMeasure);
      resizeObserver?.disconnect();
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      notes.forEach((note) => {
        note.style.zIndex = "";
      });
      board.classList.remove("is-spread");
      section.classList.remove("is-pinned");
    };
  }, [geometry, pinned, progress, reduced, targetProgress, unpinnedProgress]);

  return { boardRef, pinned, reduced, progress, unpinnedProgress, geometry };
}
