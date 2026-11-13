"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, FolderOpen, Hand, House, Smile } from "lucide-react";
import { getActiveNavHref } from "@/lib/routing/routes";
import "./navbar.css";

const links = [
  { href: "/index.html", label: "Come In", Icon: House },
  { href: "/meet-me.html", label: "Meet Me", Icon: Smile },
  { href: "/work.html", label: "My Lab", Icon: FolderOpen },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activePath = getActiveNavHref(pathname);

  return (
    <header className={`topnav${compact ? " compact" : ""}`} id="nav">
      <div className="topnav__in">
        <Link className="brand" href="/index.html" aria-label="Portfolio, Home">
          <span className="brand__mark" aria-hidden="true">
            <CircleUserRound size={30} strokeWidth={1.8} />
          </span>
          <span className="brand__name">Portfolio</span>
        </Link>
        <nav className="pill" aria-label="Main navigation">
          <ul>
            {links.map(({ href, label, Icon }) => {
              const active = href === activePath;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={active ? "active" : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <span
          className="sayhi"
          aria-label="Say Hello is unavailable until contact details are approved"
        >
          <Hand className="sayhi__hand" size={20} strokeWidth={1.8} aria-hidden="true" />
          <span className="sayhi__text">Say Hello</span>
        </span>
      </div>
    </header>
  );
}
