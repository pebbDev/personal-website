import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { previewRoutes } from "./config";

export type PreviewTab = keyof typeof previewRoutes;

export type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  href: string;
  children?: ReactNode;
  label?: string;
  Icon?: LucideIcon;
  active?: boolean;
  navTab?: PreviewTab;
  homeBrand?: boolean;
};
