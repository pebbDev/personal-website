"use client";

import { useState } from "react";

import { navbarItems } from "@/constants";

export default function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-outline bg-white md:hidden">
      <nav className="mx-auto max-w-site px-5 py-4" aria-label="Mobile navigation">
        <div className="flex items-center justify-between">
          <a
            href="#overview"
            className="text-sm font-semibold text-ink"
            onClick={() => setIsOpen(false)}
          >
            Personal-Website
          </a>
          <button
            type="button"
            aria-controls="mobile-nav-items"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            className="rounded-lg border border-outline px-3 py-2 text-sm font-medium"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
        {isOpen && (
          <ul
            id="mobile-nav-items"
            className="mt-4 flex flex-col gap-1 border-t border-outline pt-3"
          >
            {navbarItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-slate-50 hover:text-ink"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
