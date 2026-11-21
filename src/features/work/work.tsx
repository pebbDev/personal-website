import Footer from "@/components/layout/Footer";
import ClosingSection from "@/components/layout/ClosingSection";

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
          primary={{ kind: "link", label: "Back to Home", href: "/" }}
          secondary={{ kind: "link", label: "Meet Me", href: "/#meet-me" }}
        />
      </div>
      <Footer variant="compact" notice="Personal portfolio layout preview — content pending authorization." />
    </div>
  );
}
