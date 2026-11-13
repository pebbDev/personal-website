import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PagePlaceholder from "@/components/common/page-placeholder";
import { getRoute, routePaths } from "@/lib/routing/routes";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return routePaths.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getRoute(slug);
  return { title: route ? `${route.title} | Personal Website` : "Not Found" };
}

export default async function SourceRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const route = getRoute(slug);
  if (!route) notFound();
  return <PagePlaceholder route={route} />;
}
