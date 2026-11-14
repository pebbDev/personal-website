import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Resource = {
  name: string;
  navigate_url: string;
};

type Contact = {
  value: string;
  navigate_url?: string;
  icon: LucideIcon;
};

export type FooterType = {
  brand: {
    tagline: string;
    navigate_url: string;
  };
  resource: {
    title: string;
    data: Resource[];
  };
  contact: {
    title: string;
    data: Contact[];
  };
  copyright: {
    notice: string;
    credit: string;
  };
};

export type FooterProps = { variant: "compact"; notice: ReactNode } | { variant: "full" };
