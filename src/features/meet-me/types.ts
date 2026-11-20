export type HeroTextSegment = Readonly<{ text: string; highlighted?: boolean }>;

export type HeroContactId = "email" | "linkedin" | "instagram" | "cv";

export type HeroContact = Readonly<{
  id: HeroContactId;
  label: string;
  href?: string;
}>;

export type MeetMeHeroPortrait =
  Readonly<{ caption: string; src?: never; alt?: never }> | Readonly<{ caption: string; src: string; alt: string }>;

export type MeetMeHero = Readonly<{
  title: string;
  intro: readonly [readonly HeroTextSegment[], readonly HeroTextSegment[]];
  connectLabel: string;
  contacts: readonly [HeroContact, HeroContact, HeroContact, HeroContact];
  portrait: MeetMeHeroPortrait;
}>;

export type MeetMeExperience = Readonly<{
  id: string;
  organizationLabel: string;
  roleLabel: string;
  metaLabel: string;
  summaryLabel: string;
  responsibilityLabels?: readonly string[];
}>;

export type MeetMeSectionId = "experience" | "education" | "certifications" | "skills" | "languages";

export type MeetMeTocItem = Readonly<{
  id: MeetMeSectionId;
  label: string;
}>;

export type MeetMeRow = Readonly<{ label: string; value: string }>;

export type MeetMeCertification = Readonly<{
  id: string;
  titleLabel: string;
  metaLabel: string;
  descriptionLabel: string;
}>;

export type MeetMeContent = Readonly<{
  hero: MeetMeHero;
  experiences: readonly MeetMeExperience[];
  education: readonly MeetMeRow[];
  certifications: readonly MeetMeCertification[];
  skills: readonly MeetMeRow[];
  languages: readonly MeetMeRow[];
  closingHeading: string;
}>;
