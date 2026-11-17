"use client";

import { useSyncExternalStore } from "react";
import { previewRoutes, sectionRoutes } from "./config";
import type { PreviewTab } from "./types";

let lastPreviewTab: PreviewTab = "home";

function tabFromHash(hash: string): PreviewTab | null {
  if (hash === previewRoutes["meet-me"]) return "meet-me";
  if (hash === previewRoutes.work) return "work";
  if (hash === previewRoutes.home || hash === sectionRoutes.contact) return "home";
  return null;
}

function getSnapshot(): PreviewTab {
  const hash = window.location.hash;
  if (hash === sectionRoutes.mainContent) return lastPreviewTab;
  return tabFromHash(hash) ?? "home";
}

function subscribe(onChange: () => void) {
  const rememberTab = () => {
    const tab = tabFromHash(window.location.hash);
    if (tab) lastPreviewTab = tab;
  };
  rememberTab();

  const onHashChange = () => {
    rememberTab();
    // Native hash transitions need syncing with the Next.js canonical URL.
    // replaceState is patched by Next.js and preserves this history entry.
    window.history.replaceState(null, "", window.location.href);
    onChange();
  };
  window.addEventListener("hashchange", onHashChange);
  return () => window.removeEventListener("hashchange", onHashChange);
}

export function usePreviewTab(): PreviewTab {
  return useSyncExternalStore(subscribe, getSnapshot, () => "home");
}
