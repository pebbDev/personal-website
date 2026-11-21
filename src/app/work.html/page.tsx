import Work from "@/features/work/work";
import CaseDetail from "@/features/work/components/CaseDetail";
import { caseDetailPreview } from "@/features/work/components/CaseDetail/constants";

type WorkLegacyPageProps = Readonly<{
  searchParams: Promise<{ preview?: string | string[] }>;
}>;

export default async function WorkLegacyPage({ searchParams }: WorkLegacyPageProps) {
  const { preview } = await searchParams;
  if (process.env.NODE_ENV === "development" && preview === "case-study-01") {
    return <CaseDetail caseStudy={caseDetailPreview} />;
  }
  return <Work />;
}
