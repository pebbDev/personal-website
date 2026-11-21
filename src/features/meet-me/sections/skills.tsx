import DetailRows from "../components/DetailRows";
import type { MeetMeRow } from "../types";

export default function Skills({ rows }: Readonly<{ rows: readonly MeetMeRow[] }>) {
  return (
    <section id="skills" className="meet-me-section" aria-labelledby="meet-me-skills-title">
      <header className="meet-me-section-header">
        <span className="meet-me-section-eyebrow">04 / 05</span>
        <h2 id="meet-me-skills-title">Skills &amp; Tools</h2>
      </header>
      <DetailRows rows={rows} />
    </section>
  );
}
