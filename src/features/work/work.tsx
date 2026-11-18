import Footer from "@/components/layout/Footer";

import Intro from "./sections/intro";
import Catalog from "./sections/catalog";
import Closing from "./sections/closing";

export default function Work({ homeHref = "#home" }: Readonly<{ homeHref?: string }>) {
  return (
    <div id="work" className="work-page">
      <div className="work-container">
        <Intro />
        <Catalog />
        <Closing homeHref={homeHref} />
      </div>
      <Footer variant="compact" notice="Personal portfolio layout preview — content pending authorization." />
    </div>
  );
}
