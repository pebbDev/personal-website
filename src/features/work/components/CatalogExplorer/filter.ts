import type { WorkCategory, WorkFilterId } from "../../types";

export function selectWorkCategories(
  categories: readonly WorkCategory[],
  filter: WorkFilterId
): readonly WorkCategory[] {
  return filter === "all" ? categories : categories.filter((category) => category.id === filter);
}
