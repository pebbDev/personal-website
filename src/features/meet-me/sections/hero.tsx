import { Fragment } from "react";
import MeetMeConnect from "../components/MeetMeConnect";
import MeetMePortrait from "../components/MeetMePortrait";
import type { MeetMeHero } from "../types";

export default function Hero({ hero }: Readonly<{ hero: MeetMeHero }>) {
  return (
    <header className="meet-me-hero" aria-labelledby="meet-me-title">
      <div className="meet-me-hero-copy">
        <h1 id="meet-me-title">{hero.title}</h1>
        <div className="meet-me-intro">
          {hero.intro.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>
              {paragraph.map((segment, segmentIndex) =>
                segment.highlighted ? (
                  <mark key={segmentIndex}>{segment.text}</mark>
                ) : (
                  <Fragment key={segmentIndex}>{segment.text}</Fragment>
                )
              )}
            </p>
          ))}
        </div>
        <MeetMeConnect label={hero.connectLabel} contacts={hero.contacts} />
      </div>
      <MeetMePortrait caption={hero.portrait.caption} />
    </header>
  );
}
