import Hero from "./sections/hero";
import Experience from "./sections/experience";
import Education from "./sections/education";
import Certifications from "./sections/certifications";
import Skills from "./sections/skills";
import Languages from "./sections/languages";
import Closing from "./sections/closing";
import Footer from "@/components/layout/Footer";
import { meetMeContent } from "./constants";

export default function MeetMe() {
  return (
    <div className="meet-me">
      <div className="meet-me-container">
        <Hero hero={meetMeContent.hero} />
        <div className="meet-me-case">
          <aside className="meet-me-toc" aria-label="On this page">
            <h2 className="meet-me-toc-heading">On this page</h2>
            <ol>
              <li>
                <span>Experience</span>
              </li>
              <li>
                <span>Education</span>
              </li>
              <li>
                <span>Certifications</span>
              </li>
              <li>
                <span>Skills &amp; Tools</span>
              </li>
              <li>
                <span>Languages</span>
              </li>
            </ol>
          </aside>
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
