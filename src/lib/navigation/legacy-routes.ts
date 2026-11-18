export type ImplementedLegacyPage = Readonly<{ sourceFile: "work.html"; kind: "work" }>;

export const implementedLegacyRoutes: readonly ImplementedLegacyPage[] = [{ sourceFile: "work.html", kind: "work" }];

export function resolveImplementedLegacyPage(slug: string): ImplementedLegacyPage | null {
  return implementedLegacyRoutes.find((route) => route.sourceFile === slug) ?? null;
}
