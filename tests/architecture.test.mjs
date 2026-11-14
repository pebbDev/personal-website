import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

test("App Router still exposes only homepage while previews have feature-owned modules", () => {
  const app = join(root, "src", "app");
  for (const name of ["meet-me", "work", "[slug]"]) {
    assert.equal(existsSync(join(app, name)), false, name);
  }
  assert.equal(existsSync(join(root, "src", "lib", "routing", "routes.ts")), false);
  assert.deepEqual(
    readdirSync(app, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.endsWith(".html"))
      .map((entry) => entry.name),
    []
  );
  assert.match(read("src/app/page.tsx"), /@\/features\/home\/home/);
  for (const feature of ["meet-me", "work"]) {
    for (const file of [feature + ".tsx", "constants.ts", "types.ts"]) {
      assert.ok(existsSync(join(root, "src", "features", feature, file)), feature + "/" + file);
    }
  }
});

test("configuration follows Vicky structure with Website-Clone visual tokens", () => {
  const prettier = JSON.parse(read(".prettierrc.json"));
  assert.equal(prettier.printWidth, 120);
  assert.equal(prettier.trailingComma, "es5");
  assert.equal(prettier.singleQuote, false);
  assert.equal(prettier.tabWidth, 2);
  const eslint = read("eslint.config.mjs");
  assert.match(eslint, /eslint-config-next\/core-web-vitals/);
  assert.doesNotMatch(eslint, /readFileSync|typescriptPlugin|@eslint\/js/);
  const tailwind = read("tailwind.config.ts");
  for (const directory of ["app", "components", "features", "pages"])
    assert.ok(tailwind.includes(`./src/${directory}/**/*.`), directory);
  assert.match(tailwind, /var\(--foreground\)/);
  const next = read("next.config.mjs");
  assert.doesNotMatch(next, /@next\/mdx|withMDX/);
});
