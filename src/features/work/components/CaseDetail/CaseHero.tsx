import { previewRoutes } from "@/lib/navigation";
import { workCategories } from "../../constants";
import { CasePlaceholder } from "./CaseMedia";
import type { CaseDetailData } from "./types";

export default function CaseHero({ caseStudy }: Readonly<{ caseStudy: CaseDetailData }>) {
  const category = workCategories.find((item) => item.id === caseStudy.categoryId);
  if (!category) throw new Error(`Unknown case study category: ${caseStudy.categoryId}`);

  return (
    <header className="case-detail-hero">
      <div className="case-detail-hero-copy">
        <nav className="case-detail-breadcrumb" aria-label="Breadcrumb">
          <a href={previewRoutes.work}>My Lab</a>
          <span className="case-detail-breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <span>{category.title}</span>
          <span className="case-detail-breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <span className="case-detail-breadcrumb-current" aria-current="page">
            {caseStudy.heading}
          </span>
        </nav>
        <p className="case-detail-eyebrow">Selected work / Interface exploration</p>
        <h1>{caseStudy.heading}</h1>
        <p className="case-detail-lead">{caseStudy.lead}</p>
        <dl className="case-detail-meta">
          {caseStudy.metadata.map((entry) => (
            <div key={entry.label}>
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="case-detail-browser" aria-label="Concept browser preview">
        <div className="case-detail-browser-toolbar" aria-hidden="true">
          <div className="case-detail-browser-dots">
            <span />
            <span />
            <span />
          </div>
          <span className="case-detail-browser-address">Experience preview</span>
        </div>
        <div className="case-detail-browser-screen">
          <CasePlaceholder label="Browser hero concept placeholder" variant="browser" />
        </div>
      </div>
    </header>
  );
}
