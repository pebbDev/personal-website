"use client";

import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import { NavLink } from "@/lib/navigation";
import Placeholder from "@/components/ui/Placeholder";
import type { GalleryCategory, GalleryCategoryId } from "../../types";

type GalleryCabinetProps = Readonly<{ categories: readonly GalleryCategory[] }>;

export default function GalleryCabinet({ categories }: GalleryCabinetProps) {
  const [activeId, setActiveId] = useState<GalleryCategoryId>("uiux");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  const selectTab = (id: GalleryCategoryId, index: number, focus = false) => {
    setActiveId(id);
    if (focus) {
      const tab = tabRefs.current[index];
      tab?.focus();
      const container = tabsRef.current;
      if (container && tab) {
        const left = tab.offsetLeft - container.offsetLeft;
        if (left < container.scrollLeft) container.scrollTo({ left, behavior: "auto" });
        else if (left + tab.offsetWidth > container.scrollLeft + container.clientWidth)
          container.scrollTo({ left: left + tab.offsetWidth - container.clientWidth, behavior: "auto" });
      }
    }
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
    event.preventDefault();
    let target = index;
    if (key === "Home") target = 0;
    if (key === "End") target = categories.length - 1;
    if (key === "ArrowRight") target = (index + 1) % categories.length;
    if (key === "ArrowLeft") target = (index - 1 + categories.length) % categories.length;
    const next = categories[target];
    if (next) selectTab(next.id, target, true);
  };

  return (
    <div className="home-gallery-cabinet">
      <div className="home-gallery-tabs" ref={tabsRef} role="tablist" aria-label="Gallery categories">
        {categories.map((category, index) => {
          const active = category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              className={`home-gallery-tab${active ? " is-active" : ""}`}
              style={{ "--gallery-tab-color": category.tabColor } as CSSProperties}
              role="tab"
              id={`tab-${category.id}`}
              aria-controls={`panel-${category.id}`}
              aria-selected={active}
              aria-label={category.title}
              tabIndex={active ? 0 : -1}
              onClick={() => selectTab(category.id, index)}
              onMouseEnter={() => {
                if (window.matchMedia("(hover: hover)").matches) selectTab(category.id, index);
              }}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span className="home-gallery-tab-full" aria-hidden="true">
                {category.title}
              </span>
              <span className="home-gallery-tab-short" aria-hidden="true">
                {category.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
      <div className="home-gallery-body">
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <div
              key={category.id}
              id={`panel-${category.id}`}
              className={`home-gallery-panel${active ? " is-active" : ""}`}
              role="tabpanel"
              aria-labelledby={`tab-${category.id}`}
              aria-hidden={!active}
              inert={!active}
            >
              <div className="home-gallery-panel-top">
                <div>
                  <p className="home-gallery-panel-label">Category</p>
                  <h3 className="home-gallery-panel-title">{category.title}</h3>
                </div>
                <p className="home-gallery-panel-context">{category.description}</p>
              </div>
              {category.href ? (
                <NavLink
                  className="home-gallery-collage"
                  href={category.href}
                  aria-label={`See folder: ${category.title}`}
                >
                  <Placeholder
                    decorative
                    className="home-gallery-collage-grid"
                    positions={category.media.map((slot) => slot.position)}
                  />{" "}
                  <span className="home-gallery-overlay" aria-hidden="true">
                    See Folder <ArrowRight size={20} strokeWidth={1.8} />
                  </span>
                </NavLink>
              ) : (
                <div className="home-gallery-collage" aria-label={category.title}>
                  <Placeholder
                    decorative
                    className="home-gallery-collage-grid"
                    positions={category.media.map((slot) => slot.position)}
                  />{" "}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
