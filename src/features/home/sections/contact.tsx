import * as motion from "motion/react-client";
import { NavLink } from "@/lib/navigation";
import { MessageCircleMore } from "lucide-react";
import { contactCta } from "../constants";

const revealViewport = { once: true, amount: 0.12, margin: "0px 0px -40px 0px" } as const;
const revealEase = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  const { eyebrow, headline, description, label, href } = contactCta;
  const [first, ...rest] = description.split("\n");

  return (
    <section id="contact" className="home-contact" aria-labelledby="contact-heading">
      <div className="home-wrap">
        <motion.div
          className="home-contact-cta home-halftone-surface"
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={revealViewport}
          transition={{ duration: 1.1, ease: revealEase }}
        >
          <p className="home-eyebrow">{eyebrow}</p>
          <h2 id="contact-heading" className="home-heading">
            {headline}
          </h2>
          <p className="home-contact-copy">
            {first}
            {rest.length > 0 && (
              <>
                <br className="home-contact-br-lg" /> {rest.join(" ")}
              </>
            )}
          </p>
          {href ? (
            <NavLink className="home-contact-action" href={href}>
              {label}
              <MessageCircleMore className="home-contact-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
            </NavLink>
          ) : (
            <>
              <span
                className="home-contact-action home-contact-action--inactive"
                aria-describedby="contact-availability"
              >
                {label}
                <MessageCircleMore className="home-contact-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p id="contact-availability" className="home-contact-status">
                Contact details are not available in this preview.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
