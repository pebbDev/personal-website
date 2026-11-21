"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import MeetMe from "@/features/meet-me/meet-me";
import Work from "@/features/work/work";
import { sectionRoutes, usePreviewTab } from "@/lib/navigation";
import type { PreviewTab } from "@/lib/navigation";

// The three hash previews share one document scroll position.
// Keep each tab's position separately until its first visit (which starts at top).
export default function PreviewSwitch({ home }: Readonly<{ home: ReactNode }>) {
  const activeTab = usePreviewTab();
  const displayedTab = useRef<PreviewTab>(activeTab);
  const scrollPositions = useRef<Partial<Record<PreviewTab, number>>>({});

  useEffect(() => {
    const rememberScroll = () => {
      scrollPositions.current[displayedTab.current] = window.scrollY;
    };
    window.addEventListener("scroll", rememberScroll, { passive: true });
    return () => window.removeEventListener("scroll", rememberScroll);
  }, []);

  useLayoutEffect(() => {
    if (displayedTab.current === activeTab) return;
    displayedTab.current = activeTab;

    // #contact is a section destination, not the Home tab's last position.
    // The contact effect below scrolls to the section after it is mounted.
    if (activeTab === "home" && window.location.hash === sectionRoutes.contact) return;

    window.scrollTo({ top: scrollPositions.current[activeTab] ?? 0, behavior: "instant" });
  }, [activeTab]);

  // The Contact section may not be mounted when navigating from Work/Meet Me.
  useEffect(() => {
    if (activeTab !== "home" || window.location.hash !== sectionRoutes.contact) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionRoutes.contact.slice(1))?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeTab]);

  if (activeTab === "home") return home;
  if (activeTab === "meet-me") return <MeetMe />;
  return <Work />;
}
