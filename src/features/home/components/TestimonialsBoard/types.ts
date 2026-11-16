import type { MotionValue } from "motion";
import type { RefObject } from "react";
import type { TestimonialPreview } from "../../types";

export type TestimonialsBoardProps = Readonly<{ items: readonly TestimonialPreview[] }>;

export type NotePose = Readonly<{ x: number; y: number; rotationDeg: number; scale: number }>;

export type NativeNoteRect = Readonly<{ left: number; top: number; width: number; height: number }>;

export type NoteGeometry = Readonly<{ dx: number; dy: number; nativeTop: number }>;

export type TestimonialsMotionState = Readonly<{
  boardRef: RefObject<HTMLDivElement | null>;
  pinned: MotionValue<boolean>;
  reduced: MotionValue<boolean>;
  progress: MotionValue<number>;
  unpinnedProgress: readonly MotionValue<number>[];
  geometry: readonly MotionValue<NoteGeometry>[];
}>;

export type TestimonialNoteProps = Readonly<{
  item: TestimonialPreview;
  index: number;
  pinned: MotionValue<boolean>;
  reduced: MotionValue<boolean>;
  progress: MotionValue<number>;
  unpinnedProgress: MotionValue<number>;
  geometry: MotionValue<NoteGeometry>;
}>;
