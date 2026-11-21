import type { WorkCategory, WorkFilterId } from "../../types";

export function parseWorkFilter(hash: string): WorkFilterId {
  switch (hash) {
    case "#uiux":
      return "uiux";
    case "#branding":
      return "branding";
    case "#social":
      return "social";
    case "#event":
      return "event";
    case "#ecommerce":
      return "ecommerce";
    default:
      return "all";
  }
}

export function selectWorkCategories(
  categories: readonly WorkCategory[],
  filter: WorkFilterId
): readonly WorkCategory[] {
  return filter === "all" ? categories : categories.filter((category) => category.id === filter);
}
