import * as motion from "motion/react-client";
import { BriefcaseBusiness, Camera, FileText, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NavLink } from "@/lib/navigation";
import { aboutContent } from "../constants";
import AboutPortrait from "../components/AboutPortrait";

const contactIcons = { email: Mail, professional: BriefcaseBusiness, social: Camera } as const;
const revealViewport = { once: true, amount: 0.08, margin: "0px 0px -6% 0px" } as const;
const revealInitial = { opacity: 0, y: 32, filter: "blur(6px)" };
const revealVisible = { opacity: 1, y: 0, filter: "blur(0px)" };

export default function About() {
  const { eyebrow, heading, description, primaryCta, resumeCta, portrait, contacts } = aboutContent;

  return (
    <section id="about" className="home-section home-about" aria-labelledby="about-heading">
      {/* Local fallback: Motion's in-view animation requires IntersectionObserver. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "if(typeof window.IntersectionObserver!=='function')document.currentScript.parentElement.classList.add('home-about-observer-unavailable');",
        }}
      />
      <noscript>
        <style>
          {
            "#about .home-about-reveal,#about .home-about-portrait{opacity:1!important;transform:none!important;filter:none!important}"
          }
        </style>
      </noscript>
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
            {contacts.map((item) => {
              const Icon = contactIcons[item.id];
              const label = `${item.label}: ${item.value}`;
              const content = (
                <>
                  <span className="home-about-contact-icon">
                    <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="home-about-contact-value">
                    {item.label} · {item.value}
                  </span>
                </>
              );
              return item.href ? (
                <NavLink key={item.id} href={item.href} className="home-about-contact-pill" aria-label={label}>
                  {content}
                </NavLink>
              ) : (
                <motion.span
                  key={item.id}
                  className="home-about-contact-pill home-about-contact-pill--inactive"
                  aria-label={label}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {content}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
