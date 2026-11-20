import type { ReactNode } from "react";

export type ClosingAction = Readonly<
  | { kind: "link"; label: string; href: string; icon?: ReactNode; external?: boolean }
  | { kind: "disabled"; label: string; icon?: ReactNode }
>;

export type ClosingSectionProps = Readonly<{
  heading: string;
  primary: ClosingAction;
  secondary: ClosingAction;
  className?: string;
}>;
