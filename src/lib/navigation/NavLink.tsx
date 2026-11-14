import type { NavLinkProps } from "./types";

export default function NavLink({ href, label, Icon, active }: NavLinkProps) {
  return (
    <a href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
