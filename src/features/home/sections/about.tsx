import * as motion from "motion/react-client";
import { FileText, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/lib/navigation";
import { aboutContent } from "../constants";
import AboutPortrait from "../components/AboutPortrait";
import ContactItem from "../components/ContactItem";

const revealViewport = { once: true, amount: 0.08, margin: "0px 0px -6% 0px" } as const;
const revealInitial = { opacity: 0, y: 32, filter: "blur(6px)" };
const revealVisible = { opacity: 1, y: 0, filter: "blur(0px)" };

export default function About() {
  const { eyebrow, heading, description, primaryCta, resumeCta, portrait, contacts } = aboutContent;

  return (
    <section id="about" className="home-section home-about" aria-labelledby="about-heading">
      <div className="home-wrap home-about-grid">
        <motion.div
          className="home-about-intro home-about-reveal"
          initial={revealInitial}
          whileInView={revealVisible}
          viewport={revealViewport}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="home-eyebrow">{eyebrow}</p>
          <h2 id="about-heading" className="home-heading">
            {heading}
          </h2>
          <p className="home-copy">{description}</p>
          <div className="home-about-actions">
            <Button href={primaryCta.href} variant="primary" className="home-about-primary">
              {primaryCta.label}
              <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
            </Button>
            {resumeCta.href ? (
              <NavLink href={resumeCta.href} className="home-about-resume">
                {resumeCta.label}
                <FileText size={18} strokeWidth={1.8} aria-hidden="true" />
              </NavLink>
            ) : (
              <span className="home-about-resume home-about-action-disabled">
                {resumeCta.label}
                <FileText size={18} strokeWidth={1.8} aria-hidden="true" />
              </span>
            )}
          </div>
        </motion.div>

        <AboutPortrait {...portrait} />

        <motion.div
          className="home-about-contact home-about-reveal"
          initial={revealInitial}
          whileInView={revealVisible}
          viewport={revealViewport}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="home-eyebrow">Contact</p>
          <h2 className="home-heading">Get in Touch</h2>
          <div className="home-about-contact-list">
            {contacts.map((item) => (
              <ContactItem key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
