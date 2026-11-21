import type { WorkCategoryId } from "../../types";

export type CaseDetailSection = Readonly<{
  id: "overview" | "problem" | "audience" | "design" | "reflection";
  eyebrow: string;
  title: string;
  intro: string;
}>;

export type CaseDetailMeta = Readonly<{ label: string; value: string }>;
export type CaseDetailStep = Readonly<{ title: string; text: string }>;
export type CaseDetailDisclosure = Readonly<{ title: string; body: string }>;

export type CaseDetailChallenge = CaseDetailStep & Readonly<{ disclosures: readonly CaseDetailDisclosure[] }>;

export type CaseDetailAudience = Readonly<{
  title: string;
  points: readonly string[];
  note: string;
}>;

export type CaseDetailMedia = Readonly<{
  id: string;
  label: string;
  aspect: "landscape" | "portrait";
  scrollable?: boolean;
}>;

export type CaseDetailDesignPage = Readonly<{
  id: string;
  title: string;
  summary: string;
  goal: string;
  media: readonly CaseDetailMedia[];
}>;

export type CaseDetailData = Readonly<{
  heading: string;
  lead: string;
  categoryId: WorkCategoryId;
  heroVariant: "browser-preview" | "standard";
  metadata: readonly CaseDetailMeta[];
  sections: readonly CaseDetailSection[];
  challengeSteps: readonly CaseDetailChallenge[];
  audiences: readonly CaseDetailAudience[];
  audienceRows: readonly CaseDetailMeta[];
  insightSteps: readonly CaseDetailStep[];
  designPages: readonly CaseDetailDesignPage[];
  outcomes: readonly string[];
  nextSteps: readonly CaseDetailStep[];
}>;
