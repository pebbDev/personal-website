"use client";

import { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import { navbarLinks } from "./constants";
import { NavLink, usePreviewTab } from "@/lib/navigation";
import ThemeToggle from "@/components/common/theme-toggle/theme-toggle";

const Navbar = () => {
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
            {navbarLinks.map((link) => (
              <li key={link.id}>
                <NavLink {...link} active={link.id === activeTab} />
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
