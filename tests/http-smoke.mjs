import assert from "node:assert/strict";
import { routePaths, getRoute } from "../src/lib/routing/routes.ts";

const base = process.env.PER14_BASE_URL ?? "http://127.0.0.1:3104";
let passed = 0;
for (const slug of ["", ...routePaths]) {
  const response = await fetch(new URL("/" + slug, base));
  assert.equal(response.status, 200, `/${slug}`);
  const html = await response.text();
  assert.match(html, /Main navigation/, `navbar / ${slug}`);
  assert.match(html, /Personal Website/, `route / ${slug}`);
  assert.ok(html.includes(getRoute(slug || "index.html").title), `title / ${slug}`);
  passed++;
}
const notFound = await fetch(new URL("/unknown.html", base));
assert.equal(notFound.status, 404);
passed++;
console.log(
  JSON.stringify({
    passed,
    failed: 0,
    routes: routePaths.length,
    includesRoot: true,
    unknown404: true,
  }),
);
