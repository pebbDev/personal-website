import Footer from "@/components/layout/Footer";

import Intro from "./sections/intro";
import Catalog from "./sections/catalog";

export default function Work() {
  return (
    <div id="work" className="work-page">
      <div className="work-container">
        <Intro />
        <Catalog />
      </div>
      <Footer variant="compact" notice="Personal portfolio layout preview — content pending authorization." />
    </div>
  );
}
