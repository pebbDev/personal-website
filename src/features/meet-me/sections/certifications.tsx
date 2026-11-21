import type { MeetMeCertification } from "../types";

export default function Certifications({ entries }: Readonly<{ entries: readonly MeetMeCertification[] }>) {
  return (
    <section id="certifications" className="meet-me-section" aria-labelledby="meet-me-certifications-title">
      <header className="meet-me-section-header">
        <span className="meet-me-section-eyebrow">03 / 05</span>
        <h2 id="meet-me-certifications-title">Certifications</h2>
      </header>
      <ol className="meet-me-steps">
        {entries.map((entry) => (
          <li className="meet-me-step" key={entry.id}>
            <span className="meet-me-step-dot" aria-hidden="true" />
            <div className="meet-me-step-copy">
              <h3 className="meet-me-step-title">{entry.titleLabel}</h3>
              <p className="meet-me-step-meta">{entry.metaLabel}</p>
              <p className="meet-me-step-description">{entry.descriptionLabel}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
