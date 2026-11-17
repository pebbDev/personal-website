import type { NativeNoteRect, NoteGeometry, NotePose } from "./types";

const fanAngles = [-7, 5, -3, 8, -5] as const;
const restAngles = [-2, 1.5, -1, 2.5, 1.5] as const;
const fanOffsets = [-14, 10, -6, 16, -10] as const;

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function easeInOutCubic(progress: number): number {
  const t = clamp01(progress);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function pinnedTargetProgress(pinTop: number, viewportHeight: number): number {
  return clamp01(-pinTop / (viewportHeight * 0.8));
}

export function pinnedNoteProgress(progress: number, index: number): number {
  if (progress >= 1) return 1;
  return clamp01((progress - (index * 0.35) / 4) / 0.65);
}

export function unpinnedNoteProgress(naturalTop: number, viewportHeight: number): number {
  return clamp01((viewportHeight * 0.92 - naturalTop) / (viewportHeight * 0.32));
}

export function calculateNoteGeometry(
  notes: readonly NativeNoteRect[],
  boardWidth: number,
  boardHeight: number,
  pinned: boolean
): readonly NoteGeometry[] {
  const centerX = boardWidth / 2;
  const centerY = boardHeight / 2;
  return notes.map((note, index) => {
    const cx = note.left + note.width / 2;
    const cy = note.top + note.height / 2;
    const previous = notes[index - 1];
    const targetX = pinned ? centerX : previous ? previous.left + previous.width / 2 : cx;
    const targetY = pinned ? centerY : previous ? previous.top + previous.height / 2 : cy;
    return {
      dx: targetX - cx + (pinned ? (fanOffsets[index] ?? 0) : 0),
      dy: targetY - cy + (pinned ? (fanOffsets[index] ?? 0) * 0.4 : 0),
      nativeTop: note.top,
    };
  });
}

export function calculateNotePose({
  index,
  noteProgress,
  pinned,
  dx,
  dy,
}: Readonly<{ index: number; noteProgress: number; pinned: boolean; dx: number; dy: number }>): NotePose {
  const eased = easeInOutCubic(noteProgress);
  const startAngle = (fanAngles[index] ?? 0) * (pinned ? 1 : 0.5);
  const restAngle = restAngles[index] ?? 0;
  return {
    x: eased === 1 ? 0 : dx * (1 - eased),
    y: eased === 1 ? 0 : dy * (1 - eased),
    rotationDeg: startAngle * (1 - eased) + restAngle * eased,
    scale: 1 - 0.03 * (1 - eased),
  };
}
