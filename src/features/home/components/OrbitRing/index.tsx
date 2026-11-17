"use client";

import { motion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

import type { OrbitCardData, OrbitLayout } from "./types";
import { getOrbitCardState } from "./geometry";
import { useOrbitMotion } from "./useOrbitMotion";

function OrbitCard({
  card,
  index,
  count,
  phase,
  layout,
}: Readonly<{
  card: OrbitCardData;
  index: number;
  count: number;
  phase: MotionValue<number>;
  layout: MotionValue<OrbitLayout>;
}>) {
  const pose = useTransform(() => getOrbitCardState(index, count, phase.get(), layout.get()));
  const transform = useTransform(() => {
    const state = pose.get();
    return `translate3d(${state.x.toFixed(1)}px,${state.y.toFixed(1)}px,0) rotate(${state.rotation.toFixed(2)}deg)`;
  });
  const opacity = useTransform(() => Number(pose.get().opacity.toFixed(2)));
  const visibility = useTransform(() => (pose.get().visible ? "visible" : "hidden"));

  return (
    <motion.div className="home-hero-card" style={{ transform, opacity, visibility }}>
      <span className="home-hero-card-label">{card.label}</span>
    </motion.div>
  );
}

export default function OrbitRing({ cards }: Readonly<{ cards: readonly OrbitCardData[] }>) {
  const { ringRef, layout, phase } = useOrbitMotion();

  return (
    <div ref={ringRef} className="home-hero-ring" data-orbit-engine="motion" aria-hidden="true">
      {cards.map((card, index) => (
        <OrbitCard key={card.id} card={card} index={index} count={cards.length} phase={phase} layout={layout} />
      ))}
    </div>
  );
}
