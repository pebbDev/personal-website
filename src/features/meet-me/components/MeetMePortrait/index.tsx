import type { MeetMeHeroPortrait } from "../../types";

export default function MeetMePortrait({ portrait }: Readonly<{ portrait: MeetMeHeroPortrait }>) {
  return (
    <figure className="meet-me-portrait">
      <div className="meet-me-portrait-art" role="img" aria-label="Neutral portrait placeholder">
        <span className="meet-me-portrait-head" aria-hidden="true" />
        <span className="meet-me-portrait-shoulders" aria-hidden="true" />
      </div>
      <figcaption className="meet-me-portrait-caption">{portrait.caption}</figcaption>
    </figure>
  );
}
