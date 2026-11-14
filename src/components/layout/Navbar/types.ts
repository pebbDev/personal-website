import type { LucideIcon } from "lucide-react";
import type { PreviewTab } from "@/lib/navigation";

export type NavbarLink = {
  id: PreviewTab;
  href: string;
  label: string;
  Icon: LucideIcon;
};
