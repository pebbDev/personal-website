"use client";

import { useSyncExternalStore } from "react";

export type PreviewTab = "home" | "meet-me" | "work";

function getSnapshot(): PreviewTab {
  const hash = window.location.hash.slice(1);
  return hash === "meet-me" || hash === "work" ? hash : "home";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function usePreviewTab(): PreviewTab {
  return useSyncExternalStore(subscribe, getSnapshot, () => "home");
}
