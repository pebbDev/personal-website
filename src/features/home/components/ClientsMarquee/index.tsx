"use client";

import { useRef } from "react";
import { animate, hover } from "motion";
import { useScopeMotion } from "motion/react";
import type { ClientPreview } from "../../types";

type ClientsMarqueeProps = Readonly<{
  items: readonly ClientPreview[];
}>;

type LogoTrackProps = Readonly<{
  items: readonly ClientPreview[];
  reversed?: boolean;
  mobile?: boolean;
}>;

function LogoTrack({ items, reversed = false, mobile = false }: LogoTrackProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  useScopeMotion(
    rootRef,
    () => {
      const root = rootRef.current;
      const track = root?.querySelector<HTMLElement>(".home-clients-track");
      const group = track?.querySelector<HTMLElement>(".home-clients-group");
      if (!root || !track || !group) return;

      // An identical duplicate takes the original's place after one cycle.
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 16;
      const distance = group.getBoundingClientRect().width + gap;
      const animation = animate(
        track,
        { x: reversed ? [-distance, 0] : [0, -distance] },
        { duration: reversed ? 44 : 38, repeat: Infinity, ease: "linear" }
      );

      hover(root, () => {
        hoveredRef.current = true;
        animation.pause();
        return () => {
          hoveredRef.current = false;
          if (document.activeElement !== root) animation.play();
        };
      });

      const pauseOnFocus = () => animation.pause();
      const resumeOnBlur = () => {
        if (!hoveredRef.current) animation.play();
      };
      root.addEventListener("focusin", pauseOnFocus);
      root.addEventListener("focusout", resumeOnBlur);

      return () => {
        root.removeEventListener("focusin", pauseOnFocus);
        root.removeEventListener("focusout", resumeOnBlur);
        hoveredRef.current = false;
      };
    },
    {
      matchMedia: mobile
        ? "(max-width: 640px) and (prefers-reduced-motion: no-preference)"
        : "(min-width: 641px) and (prefers-reduced-motion: no-preference)",
      deps: [items, mobile, reversed],
    }
  );

  return (
    <div
      className={`home-clients-marquee${reversed ? " home-clients-marquee--reverse" : ""}`}
      role="group"
      aria-label="Collaboration previews; focus to pause animation"
      tabIndex={0}
      ref={rootRef}
    >
      <div className="home-clients-track">
        <ul className="home-clients-group">
          {items.map((item) => (
            <li className="home-clients-slot" key={item.id}>
              <span className="home-clients-mark">{item.label}</span>
            </li>
          ))}
        </ul>
        <ul className="home-clients-group" aria-hidden="true">
          {items.map((item) => (
            <li className="home-clients-slot" key={item.id}>
              <span className="home-clients-mark">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ClientsMarquee({ items }: ClientsMarqueeProps): React.JSX.Element {
  const firstHalf = items.slice(0, 7);
  const secondHalf = items.slice(7, 14);

  return (
    <div className="home-clients-shell">
      <div className="home-clients-logo-run">
        <div className="home-clients-logo-run-one">
          <LogoTrack items={items} />
        </div>
        <div className="home-clients-logo-run-two">
          <LogoTrack items={firstHalf} mobile />
          <LogoTrack items={secondHalf} mobile reversed />
        </div>
      </div>
    </div>
  );
}
