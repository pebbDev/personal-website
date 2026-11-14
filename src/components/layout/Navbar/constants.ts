import { FolderOpen, House, Smile } from "lucide-react";
import type { NavbarLink } from "./types";
import { previewRoutes } from "@/lib/navigation/config";

export const navbarLinks: NavbarLink[] = [
  { id: "home", href: previewRoutes.home, label: "Come In", Icon: House },
  { id: "meet-me", href: previewRoutes["meet-me"], label: "Meet Me", Icon: Smile },
  { id: "work", href: previewRoutes.work, label: "My Lab", Icon: FolderOpen },
];
