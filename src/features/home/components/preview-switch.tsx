"use client";

import type { ReactNode } from "react";
import PagePlaceholder from "@/components/common/page-placeholder";
import { usePreviewTab } from "@/lib/preview-tab";

const previews = {
  "meet-me": {
    title: "Meet Me",
    description: "This is the Meet Me preview. Its original experience will be reconstructed in a later slice.",
  },
  work: {
    title: "My Lab",
    description: "This is the My Lab preview. Project content and filters will be reconstructed in a later slice.",
  },
} as const;

export default function PreviewSwitch({ home }: Readonly<{ home: ReactNode }>) {
  const activeTab = usePreviewTab();
  if (activeTab === "home") return home;
  return (
    <div className="page-preview-frame">
      <PagePlaceholder {...previews[activeTab]} />
    </div>
  );
}
