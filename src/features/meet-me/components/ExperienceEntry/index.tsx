import Accordion from "@/components/ui/Accordion";
import type { MeetMeExperience } from "../../types";

export default function ExperienceEntry({ entry }: Readonly<{ entry: MeetMeExperience }>) {
  return (
    <li className="meet-me-timeline-entry">
      <span className="meet-me-timeline-logo" aria-hidden="true" />
      <div className="meet-me-timeline-copy">
        <div className="meet-me-timeline-top">
          <h3 className="meet-me-timeline-organization">{entry.organizationLabel}</h3>
          <p className="meet-me-timeline-role">{entry.roleLabel}</p>
        </div>{" "}
        <p className="meet-me-timeline-meta">{entry.metaLabel}</p>
        <p className="meet-me-timeline-summary">{entry.summaryLabel}</p>
        {entry.responsibilityLabels?.length ? (
          <Accordion title="What I did" className="meet-me-timeline-details">
            <ul className="meet-me-timeline-responsibilities">
              {entry.responsibilityLabels.map((responsibility) => (
                <li key={responsibility}>{responsibility}</li>
              ))}
            </ul>
          </Accordion>
        ) : null}
      </div>
    </li>
  );
}
