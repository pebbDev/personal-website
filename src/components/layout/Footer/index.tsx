import Link from "next/link";
import { dataFooter, type FooterProps } from "./constants";

const Footer = (props: FooterProps) => {
  const { brand, resource, contact, copyright } = dataFooter;

  if (props.variant === "compact") {
    return (
      <footer className="footer footer--compact">
        <div className="footer__container">
          <p>{props.notice}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer footer--full">
      <div className="footer__container">
        <div className="footer__card">
          <div className="footer__grid footer__grid--3">
            {/* Brand */}
            <div className="footer__identity">
              <Link href={brand.navigate_url} className="footer__brand" aria-label="Back to top">
                <span className="footer__brand-placeholder" aria-hidden="true" />
              </Link>
              <p className="footer__tag">{brand.tagline}</p>
            </div>

            {/* Resources */}
            <div>
              <h4>{resource.title}</h4>
              <ul>
                {resource.data.map((data) => (
                  <li key={data.navigate_url}>
                    <Link href={data.navigate_url}>{data.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4>{contact.title}</h4>
              <ul className="footer__contact">
                {contact.data.map((data) => (
                  <li key={data.value}>
                    {data.navigate_url ? (
                      <Link
                        href={data.navigate_url}
                        target={data.navigate_url.startsWith("https://") ? "_blank" : undefined}
                        rel={data.navigate_url.startsWith("https://") ? "noopener noreferrer" : undefined}
                      >
                        <data.icon className="footer__icon" size={16} strokeWidth={1.8} aria-hidden="true" />
                        {data.value}
                      </Link>
                    ) : (
                      <span className="footer__inactive">
                        <data.icon className="footer__icon" size={16} strokeWidth={1.8} aria-hidden="true" />
                        {data.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer__bottom">
            <span>{copyright.notice}</span>
            <span>{copyright.credit}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
