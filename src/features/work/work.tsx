import Footer from "@/components/layout/Footer";
import ClosingSection from "@/components/layout/ClosingSection";
import { previewRoutes } from "@/lib/navigation";

import Intro from "./sections/intro";
import Catalog from "./sections/catalog";

export default function Work() {
  return (
    <div id="work" className="work-page">
      <div className="work-container">
        <Intro />
        <Catalog />
        <ClosingSection
          heading="Keep exploring the portfolio."
          primary={{ kind: "link", label: "Back to Home", href: previewRoutes.home }}
          secondary={{ kind: "link", label: "Meet Me", href: previewRoutes["meet-me"] }}
        />
      </div>
      <Footer variant="compact" notice="Personal portfolio layout preview — content pending authorization." />
    </div>
  );
}
