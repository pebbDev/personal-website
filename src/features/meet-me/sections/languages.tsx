import DetailRows from "../components/DetailRows";
import type { MeetMeRow } from "../types";

export default function Languages({ rows }: Readonly<{ rows: readonly MeetMeRow[] }>) {
  return (
    <section id="languages" className="meet-me-section" aria-labelledby="meet-me-languages-title">
      <header className="meet-me-section-header">
        <span className="meet-me-section-eyebrow">05 / 05</span>
        <h2 id="meet-me-languages-title">Languages</h2>
      </header>
      <DetailRows rows={rows} />
    </section>
  );
}
