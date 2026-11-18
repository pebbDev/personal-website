import Hero from "./sections/hero";
import Experience from "./sections/experience";
import { meetMeContent } from "./constants";

export default function MeetMe() {
  return (
    <div className="meet-me">
      <div className="meet-me-container">
        <Hero hero={meetMeContent.hero} />
        <Experience entries={meetMeContent.experiences} />
      </div>
    </div>
  );
}
