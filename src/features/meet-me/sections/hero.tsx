import MeetMePortrait from "../components/MeetMePortrait";
import type { MeetMeHero } from "../types";

const connectIcons = [
  <svg key="orbit" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2" />
  </svg>,
  <svg key="nodes" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 7l10 10M17 7 7 17" />
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="7" r="2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>,
  <svg key="frame" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="5" width="14" height="14" rx="3" />
    <path d="M9 12h6M12 9v6" />
  </svg>,
  <svg key="lines" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="7" />
    <path d="M12 5v14M5 12h14" />
  </svg>,
];

export default function Hero({ hero }: Readonly<{ hero: MeetMeHero }>) {
  return (
    <section className="meet-me-hero" aria-labelledby="meet-me-title">
      <div className="meet-me-hero-copy">
        <h1 id="meet-me-title">{hero.title}</h1>
        <div className="meet-me-intro">
          {hero.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="meet-me-connect">
          {connectIcons.map((icon) => (
            <span className="meet-me-connect-icon" key={icon.key} aria-hidden="true">
              {icon}
            </span>
          ))}
        </div>
      </div>
      <MeetMePortrait caption={hero.portraitCaption} />
    </section>
  );
}
