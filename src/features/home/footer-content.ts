// Server-only: node:fs keeps this resolver out of the browser module graph.
import { lstatSync, readFileSync } from "node:fs";
import { isAbsolute } from "node:path";

export type HomeFooterLink = Readonly<{ label: string; href?: string }>;

export type HomeFooterContent = Readonly<{
  cta: Readonly<{
    eyebrow: string;
    headline: string;
    description: string;
    label: string;
    href?: string;
  }>;
  brand?: Readonly<{
    label: string;
    href?: string;
    avatarAvailable: boolean;
    avatar?: Readonly<{ src: "/assets/memoji.png"; alt: string }>;
  }>;
  tagline: string;
  navigation: readonly [HomeFooterLink, HomeFooterLink, HomeFooterLink, HomeFooterLink];
  contact: readonly [HomeFooterLink, HomeFooterLink, HomeFooterLink];
  bottom: string;
}>;

function neutralContent(): HomeFooterContent {
  return {
    cta: {
      eyebrow: "Contact",
      headline: "A place to connect.",
      description: "Contact options will appear here after review.",
      label: "Get in touch",
    },
    brand: { label: "Home", href: "#home", avatarAvailable: false },
    tagline: "A space for ideas, learning, and exploration.",
    navigation: [
      { label: "Home", href: "#home" },
      { label: "Meet Me", href: "#meet-me" },
      { label: "My Lab", href: "#work" },
      { label: "Contact", href: "#contact" },
    ],
    contact: [{ label: "Social profile" }, { label: "Creative profile" }, { label: "Email" }],
    bottom: "Personal website preview.",
  };
}

function object(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Invalid content");
  return value as Record<string, unknown>;
}

function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value.length > 4000 || /[\x00-\x1f\x7f]/.test(value)) {
    throw new Error("Invalid text");
  }
  return value;
}

function href(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  const link = text(value);
  if (/[\s\\]|%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(link)) throw new Error("Invalid link");
  if (/^#[a-zA-Z0-9_-]*$/.test(link)) return link;
  if (/^mailto:[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(link)) return link;
  if (/^https:\/\/[^/?#]+/.test(link)) {
    const url = new URL(link);
    if (url.protocol === "https:" && url.hostname && !url.username && !url.password) return link;
  }
  throw new Error("Invalid link");
}

function link(value: unknown): HomeFooterLink {
  const item = object(value);
  return { label: text(item.label), ...(item.href !== undefined && { href: href(item.href) }) };
}

function brand(value: unknown): HomeFooterContent["brand"] {
  if (value === undefined) return undefined;
  const item = object(value);
  const identity = link(item);
  if (typeof item.avatarAvailable !== "boolean") throw new Error("Invalid avatar flag");
  let avatar: NonNullable<HomeFooterContent["brand"]>["avatar"];
  if (item.avatar !== undefined) {
    const image = object(item.avatar);
    if (image.src !== "/assets/memoji.png") throw new Error("Invalid avatar path");
    avatar = { src: image.src, alt: text(image.alt) };
  }
  if (item.avatarAvailable && !avatar) throw new Error("Missing avatar metadata");
  return {
    ...identity,
    avatarAvailable: item.avatarAvailable,
    ...(item.avatarAvailable && { avatar }),
  };
}

function privateContent(value: unknown): HomeFooterContent {
  const content = object(value);
  const cta = object(content.cta);
  if (!Array.isArray(content.navigation) || content.navigation.length !== 4) throw new Error("Invalid navigation");
  if (!Array.isArray(content.contact) || content.contact.length !== 3) throw new Error("Invalid contacts");
  const identity = brand(content.brand);
  return {
    cta: {
      eyebrow: text(cta.eyebrow),
      headline: text(cta.headline),
      description: text(cta.description),
      label: text(cta.label),
      ...(cta.href !== undefined && { href: href(cta.href) }),
    },
    ...(identity && { brand: identity }),
    tagline: text(content.tagline),
    navigation: [
      link(content.navigation[0]),
      link(content.navigation[1]),
      link(content.navigation[2]),
      link(content.navigation[3]),
    ],
    contact: [link(content.contact[0]), link(content.contact[1]), link(content.contact[2])],
    bottom: text(content.bottom),
  };
}

export function getHomeFooterContent(): HomeFooterContent {
  const file = process.env.PER24_PRIVATE_FOOTER_FILE;
  // Explicit local absolute JSON paths only: no CWD lookup, URLs, UNC/device
  // paths, parent traversal, alternate data streams, or symlink files.
  if (
    !file ||
    file !== file.trim() ||
    !isAbsolute(file) ||
    /^[\\/]{2}/.test(file) ||
    /[\x00-\x1f\x7f]/.test(file) ||
    file.slice(2).includes(":") ||
    file.split(/[\\/]/).some((part) => part === ".." || part === ".") ||
    !/\.json$/i.test(file)
  ) {
    return neutralContent();
  }
  try {
    const stat = lstatSync(file);
    if (!stat.isFile() || stat.size > 64 * 1024) return neutralContent();
    return privateContent(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    // Missing/unreadable/malformed fixtures fail closed; never log private data.
    return neutralContent();
  }
}
