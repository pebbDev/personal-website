"use client";

import { useSyncExternalStore } from "react";
import { previewRoutes } from "./config";
import type { PreviewTab } from "./types";

function getSnapshot(): PreviewTab {
  const hash = window.location.hash;
  if (hash === previewRoutes["meet-me"]) return "meet-me";
  if (hash === previewRoutes.work) return "work";
  return "home";
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

export function usePreviewTab(): PreviewTab {
  return useSyncExternalStore(subscribe, getSnapshot, () => "home");
}
