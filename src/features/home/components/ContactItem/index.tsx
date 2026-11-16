import * as motion from "motion/react-client";
import { BriefcaseBusiness, Camera, Mail } from "lucide-react";
import { NavLink } from "@/lib/navigation";
import type { AboutContactItem } from "../../types";

type ContactItemProps = Readonly<{ item: AboutContactItem }>;

const contactIcons = { email: Mail, professional: BriefcaseBusiness, social: Camera } as const;

export default function ContactItem({ item }: ContactItemProps) {
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
    <NavLink href={item.href} className="home-about-contact-pill" aria-label={label}>
      {content}
    </NavLink>
  ) : (
    <motion.span
      className="home-about-contact-pill home-about-contact-pill--inactive"
      aria-label={label}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {content}
    </motion.span>
  );
}
