import Footer from "@/components/layout/Footer";
import ClosingSection from "@/components/layout/ClosingSection";
import { previewRoutes } from "@/lib/navigation";
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
        <ClosingSection
          heading="Explore more from My Lab."
          primary={{ kind: "link", label: "Back to My Lab", href: previewRoutes.work }}
          secondary={{ kind: "link", label: "Back to Home", href: previewRoutes.home }}
        />
      </div>
      <Footer variant="compact" notice="Personal portfolio layout preview — content pending authorization." />{" "}
    </div>
  );
}
