import DetailRows from "../components/DetailRows";
import type { MeetMeRow } from "../types";

export default function Education({ rows }: Readonly<{ rows: readonly MeetMeRow[] }>) {
  return (
    <section id="education" className="meet-me-section" aria-labelledby="meet-me-education-title">
      <header className="meet-me-section-header">
        <span className="meet-me-section-eyebrow">02 / 05</span>
        <h2 id="meet-me-education-title">Education</h2>
      </header>
      <DetailRows rows={rows} />
    </section>
  );
}
