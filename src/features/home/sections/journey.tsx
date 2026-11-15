import * as motion from "motion/react-client";
import { ArrowUpRight, Download } from "lucide-react";
import { NavLink } from "@/lib/navigation";
import { journeyContent } from "../constants";

const revealViewport = { once: true, amount: 0.08, margin: "0px 0px -6% 0px" } as const;
const revealInitial = { opacity: 0, y: 32, filter: "blur(6px)" };
const revealVisible = { opacity: 1, y: 0, filter: "blur(0px)" };
const revealEase = [0.16, 1, 0.3, 1] as const;

export default function Journey() {
  const { eyebrow, heading, lead, aboutAction, resumeAction, experiences } = journeyContent;

  return (
    <section id="journey" className="home-section home-journey" aria-labelledby="journey-heading">
      <script
        dangerouslySetInnerHTML={{
          __html:
            "if(typeof window.IntersectionObserver!=='function')document.currentScript.parentElement.classList.add('home-journey-observer-unavailable');",
        }}
      />
      <noscript>
        <style>
          {"#journey .home-journey-reveal{opacity:1!important;transform:none!important;filter:none!important}"}
        </style>
      </noscript>
      <div className="home-wrap">
        <motion.div
          className="home-journey-head home-journey-reveal"
          initial={revealInitial}
          whileInView={revealVisible}
          viewport={revealViewport}
          transition={{ duration: 0.9, ease: revealEase }}
        >
          <div className="home-journey-intro">
            <p className="home-eyebrow">{eyebrow}</p>
            <h2 id="journey-heading" className="home-heading">
              {heading}
            </h2>
            <p className="home-copy">{lead}</p>
          </div>
          <div className="home-journey-actions">
            <NavLink href={aboutAction.href} className="home-journey-go">
              {aboutAction.label}
              <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </NavLink>
            {resumeAction.href ? (
              <NavLink href={resumeAction.href} className="home-journey-go home-journey-resume">
                {resumeAction.label}
                <Download size={16} strokeWidth={1.8} aria-hidden="true" />
              </NavLink>
            ) : (
              <span className="home-journey-go home-journey-resume home-journey-resume--inactive">
                {resumeAction.label}
                <Download size={16} strokeWidth={1.8} aria-hidden="true" />
              </span>
            )}
          </div>
        </motion.div>
        <ol className="home-journey-experiences">
          {experiences.map((experience, index) => (
            <motion.li
              key={experience.id}
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
                  <span className="home-journey-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
