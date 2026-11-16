import type { BadgeProps } from "./types";

export type { BadgeProps, BadgeSize, BadgeVariant } from "./types";

export function Badge({ children, variant = "soft", size = "sm", className }: BadgeProps) {
  const classes = ["ui-badge", `ui-badge--${variant}`, `ui-badge--${size}`, className].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
}
