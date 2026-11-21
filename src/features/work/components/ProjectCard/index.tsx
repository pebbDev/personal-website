import { NavLink, localPreviewRoutes } from "@/lib/navigation";
import Placeholder from "@/components/ui/Placeholder";
import { FileText } from "lucide-react";
import type { WorkProject } from "../../types";

export default function ProjectCard({ project }: Readonly<{ project: WorkProject }>) {
  const previewEnabled = process.env.NODE_ENV === "development" && project.id === "concept-k7m2";
  const content = (
    <>
      <div className="work-project-cover">
        <Placeholder label={`Abstract image placeholder for ${project.displayTitle}`} />
      </div>{" "}
      <div className="work-project-body">
        <h3 className="work-project-title">{project.displayTitle}</h3>
        <p className="work-project-meta">{project.displayMeta}</p>
        <span className="work-project-affordance">
          {previewEnabled ? (
            <>
              View case study preview <FileText size={16} strokeWidth={1.8} aria-hidden="true" />
            </>
          ) : (
            "Case study preview · Unavailable"
          )}
        </span>
      </div>
    </>
  );

  if (previewEnabled) {
    return (
      <NavLink
        className="work-project-card work-project-card--preview"
        data-project-id={project.id}
        href={localPreviewRoutes.caseStudy01}
        aria-label={`Open ${project.displayTitle} case study preview`}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <article className="work-project-card" data-project-id={project.id}>
      {content}
    </article>
  );
}
