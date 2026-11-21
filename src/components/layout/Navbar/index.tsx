"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import { navbarLinks } from "./constants";
import { NavLink, previewRoutes, resolveNavbarHref, usePreviewTab } from "@/lib/navigation";
import ThemeToggle from "@/components/common/theme-toggle/theme-toggle";

const Navbar = () => {
  const previewTab = usePreviewTab();
  const onWorkPage = usePathname() === "/work.html";
  const activeTab = onWorkPage ? "work" : previewTab;
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
        <NavLink className="brand" href={onWorkPage ? "/" : previewRoutes.home} aria-label="Portfolio, Home">
          <span className="brand__mark" aria-hidden="true">
            <CircleUserRound size={30} strokeWidth={1.8} />
          </span>
          <span className="brand__name">Portfolio</span>
        </NavLink>
        <nav className="pill" aria-label="Main navigation">
          <ul>
            {navbarLinks.map((link) => (
              <li key={link.id}>
                <NavLink {...link} href={resolveNavbarHref(link.id, onWorkPage)} active={link.id === activeTab} />{" "}
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
