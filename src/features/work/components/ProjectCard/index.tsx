import Placeholder from "@/components/ui/Placeholder";
import type { WorkProject } from "../../types";

export default function ProjectCard({ project }: Readonly<{ project: WorkProject }>) {
  return (
    <article className="work-project-card" data-project-id={project.id}>
      <div className="work-project-cover">
        <Placeholder label={`Abstract image placeholder for ${project.displayTitle}`} />
      </div>{" "}
      <div className="work-project-body">
        <h3 className="work-project-title">{project.displayTitle}</h3>
        <p className="work-project-meta">{project.displayMeta}</p>
        <span className="work-project-affordance">Case study preview · Unavailable</span>
      </div>
    </article>
  );
}
