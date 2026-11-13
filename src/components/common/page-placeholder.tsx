import type { RouteRecord } from "@/lib/routing/routes";

export default function PagePlaceholder({ route }: { readonly route: RouteRecord }) {
  return (
    <article className="page-placeholder" aria-label={route.title}>
      <p className="page-placeholder__eyebrow">Personal Website · Page preview</p>
      <h1>{route.title}</h1>
      <p>{route.description}</p>
    </article>
  );
}
