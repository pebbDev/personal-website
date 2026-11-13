"use client";

import { useEffect, useState } from "react";
import { CircleUserRound, FolderOpen, House, Smile } from "lucide-react";
import { usePreviewTab } from "@/lib/preview-tab";
import ThemeToggle from "@/components/common/theme-toggle/theme-toggle";

const links = [
  { href: "#home", label: "Come In", Icon: House },
  { href: "#meet-me", label: "Meet Me", Icon: Smile },
  { href: "#work", label: "My Lab", Icon: FolderOpen },
] as const;

export default function Floating() {
  const activeTab = usePreviewTab();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`topnav${compact ? " compact" : ""}`} id="nav">
      <div className="topnav__in">
        <a className="brand" href="#home" aria-label="Portfolio, Home">
          <span className="brand__mark" aria-hidden="true">
            <CircleUserRound size={30} strokeWidth={1.8} />
          </span>
          <span className="brand__name">Portfolio</span>
        </a>
        <nav className="pill" aria-label="Main navigation">
          <ul>
            {links.map(({ href, label, Icon }) => {
              const active = href.slice(1) === activeTab;
              return (
                <li key={href}>
                  <a href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
                    <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
