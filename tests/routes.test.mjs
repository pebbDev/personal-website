import assert from "node:assert/strict";
import { test } from "node:test";
test("registry has 25 unique source HTML routes and rejects unknown", async () => {
  const { routePaths, getRoute, getActiveNavHref } = await import("../src/lib/routing/routes.ts");
  assert.equal(routePaths.length, 25);
  assert.equal(new Set(routePaths).size, 25);
  for (const path of routePaths) {
    assert.match(path, /^[a-z0-9-]+\.html$/);
    assert.ok(getRoute(path), path);
  }
  assert.equal(getRoute("index.html")?.title, "Home");
  assert.equal(getRoute("meet-me.html")?.title, "Meet Me");
  assert.equal(getRoute("work.html")?.title, "My Lab");
  assert.equal(getRoute("unknown.html"), undefined);
  assert.equal(getRoute("../index.html"), undefined);
  assert.equal(getActiveNavHref("/"), "/index.html");
  assert.equal(getActiveNavHref("/index.html"), "/index.html");
  assert.equal(getActiveNavHref("/meet-me.html"), "/meet-me.html");
  assert.equal(getActiveNavHref("/work.html"), "/work.html");
  assert.equal(getActiveNavHref("/cekat-ai-website.html"), "/work.html");
  assert.equal(getActiveNavHref("/unknown.html"), null);
});
