import type { ReactNode } from "react";

type FooterLink = Readonly<{ label: string; href: string }>;

type FooterProps =
  | { variant: "compact"; notice: ReactNode }
  | {
      variant: "full";
      brand?: ReactNode;
      tagline: string;
      navigation: readonly FooterLink[];
      contact: readonly FooterLink[];
      bottom?: ReactNode;
    };

export default function Footer(props: FooterProps) {
  if (props.variant === "compact") {
    return (
      <footer className="footer footer--compact">
        <div className="footer__container">
          <p>{props.notice}</p>
        </div>
      </footer>
    );
  }

  const columnCount = 1 + Number(props.navigation.length > 0) + Number(props.contact.length > 0);

  return (
    <footer className="footer footer--full">
      <div className="footer__container">
        <div className="footer__card">
          <div className={`footer__grid footer__grid--${columnCount}`}>
            <div className="footer__identity">
              {props.brand}
              <p className="footer__tag">{props.tagline}</p>
            </div>
            {props.navigation.length > 0 && (
              <div>
                <h4>Quick Links</h4>
                <ul>
                  {props.navigation.map((link) => (
                    <li key={link.href + link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {props.contact.length > 0 && (
              <div>
                <h4>Get in Touch</h4>
                <ul className="footer__contact">
                  {props.contact.map((link) => (
                    <li key={link.href + link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {props.bottom && <div className="footer__bottom">{props.bottom}</div>}
        </div>
      </div>
    </footer>
  );
}
