"use client";

import PagePlaceholder from "@/components/common/page-placeholder";
import { usePreviewTab } from "@/lib/preview-tab";

const previews = {
  home: {
    title: "Home",
    description: "This is the Home page. The reconstructed experience will be built section by section.",
  },
  "meet-me": {
    title: "Meet Me",
    description: "This is the Meet Me preview. Its original experience will be reconstructed in a later slice.",
  },
  work: {
    title: "My Lab",
    description: "This is the My Lab preview. Project content and filters will be reconstructed in a later slice.",
  },
} as const;

export default function Home() {
  const activeTab = usePreviewTab();
  return <PagePlaceholder {...previews[activeTab]} />;
}
