import { Fragment } from "react";
import { CircleDot, CirclePlus, Network, SquarePlus } from "lucide-react";
import MeetMePortrait from "../components/MeetMePortrait";
import type { MeetMeHero } from "../types";

const connectIcons = [
  { key: "orbit", Icon: CircleDot },
  { key: "nodes", Icon: Network },
  { key: "frame", Icon: SquarePlus },
  { key: "lines", Icon: CirclePlus },
] as const;

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
        <div className="meet-me-connect">
          {connectIcons.map(({ key, Icon }) => (
            <span className="meet-me-connect-icon" key={key} aria-hidden="true">
              <Icon size={24} strokeWidth={1.5} />
            </span>
          ))}
        </div>
      </div>
      <MeetMePortrait caption={hero.portrait.caption} />
    </header>
  );
}
