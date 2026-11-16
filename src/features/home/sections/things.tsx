import * as motion from "motion/react-client";
import { featuredProjects } from "../constants";
import ProjectFolder from "../components/ProjectFolder";

const viewport = { once: true, amount: 0.08, margin: "0px 0px -6% 0px" } as const;
const ease = [0.16, 1, 0.3, 1] as const;

export default function Things() {
  return (
    <section id="things" className="home-section home-things" aria-labelledby="things-heading">
      <div className="home-wrap">
        <motion.div
          className="home-things-head home-things-reveal"
          initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewport}
          transition={{ duration: 0.9, ease }}
        >
          <p className="home-eyebrow">Featured</p>
          <h2 id="things-heading" className="home-heading">
            The Things
          </h2>
          <p className="home-copy">Hand-picked projects from the archive.</p>
        </motion.div>
        <div className="home-things-folders">
          {featuredProjects.map((project, index) => (
            <ProjectFolder key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
