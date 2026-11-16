import * as motion from "motion/react-client";
import { Badge } from "@/components/ui/Badge";
import { NavLink } from "@/lib/navigation";
import type { FeaturedProject } from "../../types";

type ProjectFolderProps = Readonly<{ project: FeaturedProject; index: number }>;
const viewport = { once: true, amount: 0.08, margin: "0px 0px -6% 0px" } as const;
const ease = [0.16, 1, 0.3, 1] as const;

export default function ProjectFolder({ project, index }: ProjectFolderProps) {
  const contents = (
    <>
      <div className="home-things-folder" aria-hidden="true">
        <svg className="home-things-folder-back" viewBox="0 0 100 70" preserveAspectRatio="none">
          <path d="M4,10 Q4,8 6,8 L31,8 Q33,8 34.5,9.5 L37,12 Q38,13 39.5,13 L94,13 Q96,13 96,15 L96,62 L4,62 Z" />
        </svg>
        {project.photos.map((photo) => (
          <span key={photo.position} className={`home-things-photo home-things-photo--p${photo.position}`}>
            <span className="home-things-photo-placeholder">{String(photo.position).padStart(2, "0")}</span>
          </span>
        ))}
        <span className="home-things-folder-front">
          <svg viewBox="0 0 100 70" preserveAspectRatio="none">
            <path d="M0,16 Q0,14 2,14 L42,14 Q44,14 45.5,15.5 L50,20.5 Q51,22 53,22 L98,22 Q100,22 100,24 L100,68 Q100,70 98,70 L2,70 Q0,70 0,68 Z" />
          </svg>
        </span>
      </div>
      <h3 className="home-things-title">{project.title}</h3>
      <Badge variant="soft" size="md" className="home-things-badge">
        {project.category}
      </Badge>
    </>
  );

  return (
    <motion.div
      className="home-things-folder-reveal home-things-reveal"
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.9, delay: index * 0.07, ease }}
    >
      {project.href ? (
        <NavLink className="home-things-folder-item" href={project.href}>
          {contents}
        </NavLink>
      ) : (
        <div className="home-things-folder-item home-things-folder-item--inactive">{contents}</div>
      )}
    </motion.div>
  );
}
