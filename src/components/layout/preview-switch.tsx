"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import MeetMe from "@/features/meet-me/meet-me";
import Work from "@/features/work/work";
import { sectionRoutes, usePreviewTab } from "@/lib/navigation";

export default function PreviewSwitch({ home }: Readonly<{ home: ReactNode }>) {
  const activeTab = usePreviewTab();

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
