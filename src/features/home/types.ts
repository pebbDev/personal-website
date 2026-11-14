export type ContactCta = {
  eyebrow: string;
  headline: string;
  description: string;
  label: string;
  href?: string;
};

export type OrbitCardData = {
  id: string;
  label: string;
};

export type OrbitLayout = {
  centerX: number;
  centerY: number;
  cardSize: number;
  radiusX: number;
  radiusY: number;
};

export type OrbitCardState = {
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  visible: boolean;
};
