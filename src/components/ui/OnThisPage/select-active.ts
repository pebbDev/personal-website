import type { OnThisPageItem } from "./types";

export function selectActiveSectionId(
  items: readonly OnThisPageItem[],
  getTop: (id: string) => number | null,
  viewportHeight: number
): string | null {
  const readingLine = viewportHeight * 0.35;
  let firstExisting: string | null = null;
  let lastCrossed: string | null = null;

  for (const item of items) {
    const top = getTop(item.id);
    if (top === null || !Number.isFinite(top)) continue;
    firstExisting ??= item.id;
    if (top <= readingLine) lastCrossed = item.id;
  }

  return lastCrossed ?? firstExisting;
}
