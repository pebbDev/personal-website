type SocialLink = {
  label: string;
  href: string;
};

export default function SocialMedia({ links = [] }: { links?: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-4" aria-label="Social media">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline underline-offset-4"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
