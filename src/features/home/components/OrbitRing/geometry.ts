import type { OrbitCardState, OrbitLayout } from "./types";

export function getOrbitLayout(width: number, copyCenterY: number): OrbitLayout {
  const cardSize = width < 640 ? 96 : width < 1000 ? 120 : 140;
  const radiusX = width < 640 ? Math.max(250, width * 0.66) : Math.min(600, Math.max(400, width * 0.45));

  return {
    centerX: width / 2,
    centerY: copyCenterY,
    cardSize,
    radiusX,
    radiusY: Math.max(220, Math.min(radiusX, copyCenterY - 96 + cardSize * 0.25)),
  };
}

export function getOrbitCardState(index: number, count: number, phaseDeg: number, layout: OrbitLayout): OrbitCardState {
  const theta = ((((phaseDeg + (index * 360) / count) % 360) + 540) % 360) - 180;
  const thetaRad = (theta * Math.PI) / 180;
  const opacity = Math.max(0, Math.min(1, (150 - Math.abs(theta)) / 35));

  return {
    x: layout.centerX + layout.radiusX * Math.sin(thetaRad) - layout.cardSize / 2,
    y: layout.centerY - layout.radiusY * Math.cos(thetaRad) - (layout.cardSize * 389) / 360 / 2,
    rotation: theta * 0.28,
    opacity,
    visible: opacity >= 0.02,
  };
}
