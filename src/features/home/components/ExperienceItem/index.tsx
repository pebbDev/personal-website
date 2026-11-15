import * as motion from "motion/react-client";
import type { JourneyExperience } from "../../types";
import { Badge } from "@/components/ui/Badge";
type ExperienceItemProps = Readonly<{
  experience: JourneyExperience;
  index: number;
}>;

const revealViewport = { once: true, amount: 0.08, margin: "0px 0px -6% 0px" } as const;
const revealInitial = { opacity: 0, y: 32, filter: "blur(6px)" };
const revealVisible = { opacity: 1, y: 0, filter: "blur(0px)" };
const revealEase = [0.16, 1, 0.3, 1] as const;

export default function ExperienceItem({ experience, index }: ExperienceItemProps) {
  return (
    <motion.li
      className="home-journey-entry home-journey-reveal"
      initial={revealInitial}
      whileInView={revealVisible}
      viewport={revealViewport}
      transition={{ duration: 0.9, delay: Math.min(index, 7) * 0.07, ease: revealEase }}
    >
      <span className="home-journey-logo" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="home-journey-org">
        <p className="home-journey-org-name">{experience.organizationLabel}</p>
        <p className="home-journey-period">{experience.periodLabel}</p>
      </div>
      <p className="home-journey-role">{experience.roleLabel}</p>
      <div className="home-journey-tags">
        {experience.skills.map((skill) => (
          <Badge key={skill} variant="soft" size="sm" className="home-journey-tag">
            {skill}
          </Badge>
        ))}
      </div>
    </motion.li>
  );
}
