"use client";

import type { ReactNode } from "react";
import MeetMe from "@/features/meet-me/meet-me";
import Work from "@/features/work/work";
import { usePreviewTab } from "@/lib/navigation";

export default function PreviewSwitch({ home }: Readonly<{ home: ReactNode }>) {
  const activeTab = usePreviewTab();

  if (activeTab === "home") return home;
  if (activeTab === "meet-me") return <MeetMe />;
  return <Work />;
}
