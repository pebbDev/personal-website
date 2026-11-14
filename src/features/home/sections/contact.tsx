import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import { contactCta } from "../constants";

export default function Contact() {
  const { eyebrow, headline, description, label, href } = contactCta;
  const [first, ...rest] = description.split("\n");

  return (
    <section id="contact" className="home-contact" aria-labelledby="contact-heading">
      <div className="home-wrap">
        <div className="home-contact-cta">
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
            <Link className="home-contact-action" href={href}>
              {label}
              <MessageCircleMore className="home-contact-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          ) : (
            <span className="home-contact-action home-contact-action--inactive">
              {label}
              <MessageCircleMore className="home-contact-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
