export type MeetMeHero = Readonly<{
  title: string;
  introParagraphs: readonly [string, string];
  portraitCaption: string;
}>;

export type MeetMeExperience = Readonly<{
  id: string;
  organizationLabel: string;
  roleLabel: string;
  metaLabel: string;
  summaryLabel: string;
  responsibilityLabels?: readonly string[];
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
