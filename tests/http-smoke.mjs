import assert from "node:assert/strict";

const base = process.env.PER14_BASE_URL ?? "http://127.0.0.1:3104";
const homepage = await fetch(new URL("/", base));
assert.equal(homepage.status, 200);
const html = await homepage.text();
assert.match(html, /Main navigation/);
assert.match(html, /Home/);

let passed = 1;
for (const path of [
  "/meet-me",
  "/work",
  "/index.html",
  "/meet-me.html",
  "/work.html",
  "/cekat-ai-website.html",
  "/unknown",
]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 404, `not a standalone route: ${path}`);
  passed++;
}
console.log(JSON.stringify({ passed, failed: 0, actualRoutes: ["/"], legacyRoutesExcluded: true }));
