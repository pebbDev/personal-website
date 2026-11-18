import { notFound } from "next/navigation";
import Work from "@/features/work/work";
import { implementedLegacyRoutes, resolveImplementedLegacyPage } from "@/lib/navigation/legacy-routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return implementedLegacyRoutes.map(({ sourceFile }) => ({ slug: sourceFile }));
}

export default async function LegacyHtmlPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  if (!resolveImplementedLegacyPage(slug)) notFound();
  return <Work homeHref="/#home" />;
}
