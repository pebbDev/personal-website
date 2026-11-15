export type ContactCta = {
  eyebrow: string;
  headline: string;
  description: string;
  label: string;
  href?: string;
};

export type AboutContactItem = {
  id: "email" | "professional" | "social";
  label: string;
  value: string;
  href?: string;
};

export type AboutContent = {
  eyebrow: string;
  heading: string;
  description: string;
  primaryCta: { label: string; href: string };
  resumeCta: { label: string; href?: string };
  portrait: { src?: string; alt?: string; captionName: string; captionRole: string };
  contacts: readonly AboutContactItem[];
};
