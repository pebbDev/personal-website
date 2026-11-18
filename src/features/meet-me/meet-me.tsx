import Hero from "./sections/hero";
import { meetMeContent } from "./constants";

export default function MeetMe() {
  return (
    <div className="meet-me">
      <div className="meet-me-container">
        <Hero hero={meetMeContent.hero} />
      </div>
    </div>
  );
}
