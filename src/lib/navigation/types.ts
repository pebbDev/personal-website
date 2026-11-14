import type { LucideIcon } from "lucide-react";
import type { previewRoutes } from "./config";

export type PreviewTab = keyof typeof previewRoutes;

export type NavLinkProps = {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
};
