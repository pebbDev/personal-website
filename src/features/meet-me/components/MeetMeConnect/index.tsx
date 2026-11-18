import { BriefcaseBusiness, Camera, FileDown, Mail } from "lucide-react";
import type { HeroContactId, MeetMeHero } from "../../types";

const contactIcons = {
  email: Mail,
  linkedin: BriefcaseBusiness,
  instagram: Camera,
  cv: FileDown,
} satisfies Record<HeroContactId, typeof Mail>;

export default function MeetMeConnect({
  label,
  contacts,
}: Readonly<{ label: string; contacts: MeetMeHero["contacts"] }>) {
  return (
    <div className="meet-me-connect">
      <p className="meet-me-connect-label">{label}</p>
      <div className="meet-me-connect-items">
        {contacts.map((contact) => {
          const Icon = contactIcons[contact.id];
          return (
            <span
              key={contact.id}
              className="meet-me-connect-icon"
              role="img"
              aria-label={contact.label + " — unavailable in preview"}
              data-tip={contact.id === "cv" ? "CV unavailable" : undefined}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
