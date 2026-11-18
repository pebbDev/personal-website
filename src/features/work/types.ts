export type PagePreview = {
  title: string;
  description: string;
};

export type WorkCategoryId = "uiux" | "branding" | "social" | "event" | "ecommerce";

export type WorkProject = Readonly<{
  id: string;
  sourceHref: string;
  displayTitle: string;
  displayMeta: string;
  approvedCover?: string;
}>;

export type WorkCategory = Readonly<{
  id: WorkCategoryId;
  title: string;
  description: string;
  projectIds: readonly string[];
}>;
