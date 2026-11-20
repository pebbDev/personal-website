"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { canonicalRoutes, getNavbarHref, previewRoutes } from "./config";
import { usePreviewTab } from "./preview-tab";
import type { NavLinkProps } from "./types";

// Hash previews and external schemes must stay native; internal routes use Next.js.
function isNativeDestination(href: string) {
  return href.startsWith("#") || href.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(href);
}

export default function NavLink({
  href,
  label,
  Icon,
  active,
  navTab,
  homeBrand = false,
  children,
  className,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();
  const previewTab = usePreviewTab();
  const destination = navTab
    ? getNavbarHref(navTab, pathname)
    : homeBrand && pathname === canonicalRoutes.home
      ? previewRoutes.home
      : href;
  const isActive = navTab
    ? pathname === canonicalRoutes.work
      ? navTab === "work"
      : pathname === canonicalRoutes.home && navTab === previewTab
    : active;

  const content = children ?? (
    <>
      {Icon && <Icon size={18} strokeWidth={1.8} aria-hidden="true" />}
      {label && <span>{label}</span>}
    </>
  );
  const attributes = {
    ...rest,
    className: [className, isActive ? "active" : undefined].filter(Boolean).join(" ") || undefined,
    "aria-current": isActive ? ("page" as const) : rest["aria-current"],
  };

  if (isNativeDestination(destination)) {
    return (
      <a href={destination} {...attributes}>
        {content}
      </a>
    );
  }

  return (
    <NextLink href={destination} {...attributes}>
      {content}
    </NextLink>
  );
}
