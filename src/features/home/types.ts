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

export type JourneyExperience = {
  id: string;
  organizationLabel: string;
  periodLabel: string;
  roleLabel: string;
  skills: readonly string[];
  logo?: { src: string; alt: string; wide?: boolean };
};

export type JourneyContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  aboutAction: { label: string; href: string };
  resumeAction: { label: string; href?: string };
  experiences: readonly JourneyExperience[];
};
export type FeaturedPhotoSlot = Readonly<{
  position: 1 | 2 | 3 | 4;
  src?: string;
  alt?: string;
}>;

export type FeaturedProject = Readonly<{
  id: string;
  title: string;
  category: string;
  href?: string;
  photos: readonly [FeaturedPhotoSlot, FeaturedPhotoSlot, FeaturedPhotoSlot, FeaturedPhotoSlot];
}>;
