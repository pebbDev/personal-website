import { navbarItems } from "@/constants";

export default function Navbar() {
  return (
    <header className="hidden border-b border-outline bg-white md:block">
      <nav
        className="mx-auto flex max-w-site items-center justify-between px-7 py-5"
        aria-label="Primary navigation"
      >
        <a href="#overview" className="text-sm font-semibold tracking-tight text-ink">
          Personal-Website
        </a>
        <ul className="flex items-center gap-7">
          {navbarItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-ink focus-visible:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
