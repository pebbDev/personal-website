export const routePaths = [
  "index.html",
  "meet-me.html",
  "work.html",
  "cekat-ai-website.html",
  "cekat-innov-2025.html",
  "creative-designer-cekat-ai.html",
  "de-jamu.html",
  "ergotron.html",
  "furrr-fun.html",
  "grid-network.html",
  "jaro.html",
  "k-circle.html",
  "kaporak.html",
  "maku.html",
  "movastocks.html",
  "mr-roastman.html",
  "nexta-dashboard.html",
  "ocistok-graphic.html",
  "ocistok-mobile-apps.html",
  "poci.html",
  "realfood-kiddos.html",
  "realfood-marketplace.html",
  "realfood-mobile-apps.html",
  "santuy-coffee.html",
  "subaru-indonesia.html",
] as const;

export type SourceRoutePath = (typeof routePaths)[number];
export type RouteRecord = {
  readonly path: SourceRoutePath;
  readonly title: string;
  readonly description: string;
  readonly kind: "home" | "about" | "work" | "case-study";
};

const titles: Partial<Record<SourceRoutePath, string>> = {
  "index.html": "Home",
  "meet-me.html": "Meet Me",
  "work.html": "My Lab",
};
const exceptions: Partial<Record<SourceRoutePath, string>> = {
  "cekat-ai-website.html": "Cekat.AI Website",
  "cekat-innov-2025.html": "Cekat Innov 2025",
  "k-circle.html": "K-Circle",
  "movastocks.html": "MovaStocks",
  "nexta-dashboard.html": "Nexta Dashboard",
  "ocistok-mobile-apps.html": "Ocistok Mobile Apps",
};
const cases = new Map<SourceRoutePath, RouteRecord>(
  routePaths.map((path): [SourceRoutePath, RouteRecord] => {
    const kind: RouteRecord["kind"] =
      path === "index.html"
        ? "home"
        : path === "meet-me.html"
          ? "about"
          : path === "work.html"
            ? "work"
            : "case-study";
    const title =
      titles[path] ??
      exceptions[path] ??
      path
        .replace(/\.html$/, "")
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    const description =
      kind === "home"
        ? "This is the Home page. Feature content will be added in a later development slice."
        : kind === "about"
          ? "This is the Meet Me page. The full page experience will be added in a later slice."
          : kind === "work"
            ? "This is the My Lab page. Projects and filters will be added in a later slice."
            : `This is the ${title} case-study page. Its unique layout and content will be added in a later slice.`;
    return [path, { path, title, description, kind }];
  }),
);

export function getRoute(path: string): RouteRecord | undefined {
  return cases.get(path as SourceRoutePath);
}

/** Map all case-study routes to the active My Lab tab, as in the source HTML. */
export function getActiveNavHref(pathname: string): string | null {
  const route = getRoute(pathname === "/" ? "index.html" : pathname.replace(/^\//, ""));
  if (!route) return null;
  return route.kind === "case-study" ? "/work.html" : `/${route.path}`;
}
