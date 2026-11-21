import NextLink from "next/link";
import type { NavLinkProps } from "./types";

// Keep hash previews and external schemes native; app routes use Next.js.
function isNativeDestination(href: string) {
  return href.startsWith("#") || href.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(href);
}

export default function NavLink({ href, label, Icon, active, children, className, ...rest }: NavLinkProps) {
  const content = children ?? (
    <>
      {Icon && <Icon size={18} strokeWidth={1.8} aria-hidden="true" />}
      {label && <span>{label}</span>}
    </>
  );
  const attributes = {
    ...rest,
    className: [className, active ? "active" : undefined].filter(Boolean).join(" ") || undefined,
    "aria-current": active ? ("page" as const) : rest["aria-current"],
  };

  if (isNativeDestination(href)) {
    return (
      <a href={href} {...attributes}>
        {content}
      </a>
    );
  }

  return (
    <NextLink href={href} {...attributes}>
      {content}
    </NextLink>
  );
}
