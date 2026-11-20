import Placeholder from "@/components/ui/Placeholder";
import type { CaseDetailMedia } from "./types";
export function CasePlaceholder({
  label,
  variant = "landscape",
  scrollable = false,
}: Readonly<{ label: string; variant?: "landscape" | "portrait" | "browser" | "banner"; scrollable?: boolean }>) {
  const graphic = (
    <div className={`case-detail-placeholder case-detail-placeholder--${variant}`}>
      <Placeholder label={label} />
    </div>
  );
  if (!scrollable) return graphic;
  return (
    <div
      className="case-detail-scrollshot"
      role="region"
      tabIndex={0}
      aria-label={`${label}, scroll inside this frame`}
    >
      {graphic}
    </div>
  );
}

export default function CaseMedia({ media }: Readonly<{ media: CaseDetailMedia }>) {
  return (
    <figure className={`case-detail-media-frame${media.scrollable ? " case-detail-media-frame--scroll" : ""}`}>
      <CasePlaceholder label={media.label} variant={media.aspect} scrollable={media.scrollable} />
    </figure>
  );
}
