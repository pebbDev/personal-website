import { Camera, ContactRound, Mail } from "lucide-react";
import type { FooterType } from "./types";
export type { FooterProps } from "./types";

export const dataFooter: FooterType = {
  brand: {
    tagline: "A space for ideas, learning, and exploration.",
    navigate_url: "#home",
  },
  resource: {
    title: "Quick Links",
    data: [
      { name: "Home", navigate_url: "#home" },
      { name: "Meet Me", navigate_url: "#meet-me" },
      { name: "My Lab", navigate_url: "#work" },
      { name: "Contact", navigate_url: "#contact" },
    ],
  },
  contact: {
    title: "Get in Touch",
    // Contact destinations remain unavailable until rights are cleared.
    data: [
      { value: "Social profile", icon: ContactRound },
      { value: "Creative profile", icon: Camera },
      { value: "Email", icon: Mail },
    ],
  },
  copyright: {
    notice: "Personal website preview.",
    credit: "Creative work · Indonesia",
  },
};
