export type NavItem = {
  label: string;
  href: string;
};

export type PortfolioAsset = {
  path: string;
  alt: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  categories: string[];
  assets: PortfolioAsset[];
};
