import type { ReactNode } from "react";

export type BadgeVariant = "soft" | "solid";
export type BadgeSize = "sm" | "md";

export type BadgeProps = Readonly<{
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}>;
