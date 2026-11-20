import Footer from "@/components/layout/Footer";
import CaseArticle from "./CaseArticle";
import CaseHero from "./CaseHero";
import { CasePlaceholder } from "./CaseMedia";
import CaseTOC from "./CaseTOC";
import type { CaseDetailData } from "./types";

export default function CaseDetail({ caseStudy }: Readonly<{ caseStudy: CaseDetailData }>) {
  return (
    <div className="case-detail">
      <div className="case-detail-container">
        <CaseHero caseStudy={caseStudy} />
        <figure className="case-detail-banner">
          <CasePlaceholder label="Project cover placeholder" variant="banner" />
        </figure>
        <div className="case-detail-reading-grid">
          <aside className="case-detail-aside">
            <CaseTOC sections={caseStudy.sections} />
          </aside>
          <CaseArticle caseStudy={caseStudy} />
        </div>
      </div>
      <Footer variant="compact" notice="Personal portfolio layout preview — content pending authorization." />
    </div>
  );
}
