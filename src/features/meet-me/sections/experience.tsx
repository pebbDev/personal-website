import ExperienceEntry from "../components/ExperienceEntry";
import type { MeetMeExperience } from "../types";

export default function Experience({ entries }: Readonly<{ entries: readonly MeetMeExperience[] }>) {
  return (
    <section id="experience" className="meet-me-section" aria-labelledby="meet-me-experience-title">
      <header className="meet-me-section-header">
        <span className="meet-me-section-eyebrow">01 / 05</span>
        <h2 id="meet-me-experience-title">Experience</h2>
      </header>
      <ol className="meet-me-timeline">
        {entries.map((entry) => (
          <ExperienceEntry entry={entry} key={entry.id} />
        ))}
      </ol>
    </section>
  );
}
