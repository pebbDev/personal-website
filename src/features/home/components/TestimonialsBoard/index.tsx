"use client";

import { motion, useTransform } from "motion/react";
import type { MotionStyle } from "motion/react";

import type { TestimonialsBoardProps, TestimonialNoteProps } from "./types";
import { calculateNotePose, pinnedNoteProgress } from "./geometry";
import { useTestimonialsMotion } from "./useTestimonialsMotion";

const hoverAngles = ["-1.5deg", "1.5deg", "-1deg", "2deg", "-2deg"] as const;

function TestimonialNote({ item, index, pinned, reduced, progress, unpinnedProgress, geometry }: TestimonialNoteProps) {
  const pose = useTransform(() => {
    const isPinned = pinned.get();
    const isReduced = reduced.get();
    // Subscribe to both regimes even when the initial SSR pose is stationary.
    const desktopProgress = progress.get();
    const mobileProgress = unpinnedProgress.get();
    const noteProgress = isReduced ? 1 : isPinned ? pinnedNoteProgress(desktopProgress, index) : mobileProgress;
    const position = geometry.get();
    return calculateNotePose({ index, noteProgress, pinned: isPinned, dx: position.dx, dy: position.dy });
  });
  const transform = useTransform(() => {
    const isReduced = reduced.get();
    const position = pose.get();
    if (isReduced) return "none";
    return (
      "translate(" +
      position.x.toFixed(1) +
      "px, " +
      position.y.toFixed(1) +
      "px) rotate(" +
      position.rotationDeg.toFixed(2) +
      "deg) scale(" +
      position.scale.toFixed(3) +
      ")"
    );
  });

  return (
    <motion.figure
      className="home-words-note"
      style={{ "--hr": hoverAngles[index], transform } as MotionStyle & { "--hr": string }}
    >
      <div className="home-words-note-inner">
        <span className="home-words-pin-icon" aria-hidden="true" />
        <p className="home-words-note-content">{item.notice}</p>
        <figcaption className="home-words-note-author">
          <span className="home-words-avatar" aria-hidden="true" />
          <span>
            <b>{item.label}</b>
            <small>{item.meta}</small>
          </span>
        </figcaption>
      </div>
    </motion.figure>
  );
}

export default function TestimonialsBoard({ items }: TestimonialsBoardProps) {
  const { boardRef, pinned, reduced, progress, unpinnedProgress, geometry } = useTestimonialsMotion(items);

  return (
    <div className="home-words-board" id="board" ref={boardRef} data-testimonials-engine="motion">
      {items.map((item, index) => (
        <TestimonialNote
          key={item.id}
          item={item}
          index={index}
          pinned={pinned}
          reduced={reduced}
          progress={progress}
          unpinnedProgress={unpinnedProgress[index]}
          geometry={geometry[index]}
        />
      ))}
    </div>
  );
}
