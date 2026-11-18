import MeetMeToc from "./components/MeetMeToc";
import Hero from "./sections/hero";
import Experience from "./sections/experience";
import Education from "./sections/education";
import Certifications from "./sections/certifications";
import Skills from "./sections/skills";
import Languages from "./sections/languages";
import Closing from "./sections/closing";
import Footer from "@/components/layout/Footer";
import { meetMeContent, meetMeTocItems } from "./constants";

export default function MeetMe() {
  return (
    <div className="meet-me">
      <div className="meet-me-container">
        <Hero hero={meetMeContent.hero} />
        <div className="meet-me-case">
          <MeetMeToc items={meetMeTocItems} />{" "}
          <article className="meet-me-content">
            <Experience entries={meetMeContent.experiences} />
            <Education rows={meetMeContent.education} />
            <Certifications entries={meetMeContent.certifications} />
            <Skills rows={meetMeContent.skills} />
            <Languages rows={meetMeContent.languages} />
          </article>
        </div>
        <Closing heading={meetMeContent.closingHeading} />
      </div>
      <Footer variant="compact" notice="Personal website layout preview." />
    </div>
  );
}
