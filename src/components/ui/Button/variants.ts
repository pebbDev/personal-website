import type { ButtonSize, ButtonVariant } from "./types";

export function getButtonClasses(variant: ButtonVariant, size: ButtonSize, className?: string): string {
  return ["btn", variant === "base" ? "" : `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(" ");
}
