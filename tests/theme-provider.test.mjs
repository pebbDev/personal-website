import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const providerPath = new URL("../src/components/provider/theme-provider.tsx", import.meta.url);
const togglePath = new URL("../src/components/common/theme-toggle/theme-toggle.tsx", import.meta.url);

test("approved provider has centralized class theme config in root layout", () => {
  assert.ok(existsSync(providerPath), "theme provider must exist");
  const provider = read("../src/components/provider/theme-provider.tsx");
  const layout = read("../src/app/layout.tsx");
  const pkg = JSON.parse(read("../package.json"));
  assert.ok(pkg.dependencies["next-themes"]);
  assert.match(provider, /ThemeProvider as NextThemesProvider/);
  for (const required of [
    'attribute="class"',
    'defaultTheme="light"',
    "enableSystem={false}",
    'storageKey="personal-website-theme"',
    "disableTransitionOnChange",
  ])
    assert.ok(layout.includes(required), required);
  assert.match(layout, /<ThemeProvider/);
  assert.match(layout, /suppressHydrationWarning/);
  assert.doesNotMatch(layout, /themeBootScript|dangerouslySetInnerHTML/);
});

test("toggle is independent from Navbar and delegates to next-themes", () => {
  assert.ok(existsSync(togglePath), "dedicated theme toggle must exist");
  const toggle = read("../src/components/common/theme-toggle/theme-toggle.tsx");
  const nav = read("../src/components/layout/Navbar/index.tsx");
  assert.match(toggle, /useTheme/);
  assert.match(toggle, /setTheme/);
  assert.match(toggle, /useSyncExternalStore/);
  assert.match(toggle, /Switch to dark mode/);
  assert.match(toggle, /Switch to light mode/);
  assert.match(toggle, /Sun/);
  assert.match(toggle, /Moon/);
  assert.match(nav, /<ThemeToggle\s*\/>/);
  assert.doesNotMatch(nav, /localStorage|themechange|useSyncExternalStore|document\.documentElement/);
  assert.doesNotMatch(toggle, /localStorage|themechange|document\.documentElement/);
});

test("Website-Clone light CSS baseline remains while dark selectors use class", () => {
  const css = read("../src/app/globals.css");
  assert.match(css, /:root\s*\{[^}]*color-scheme:\s*light/s);
  assert.match(css, /\.dark\s*\{[^}]*color-scheme:\s*dark/s);
  assert.match(css, /--background:\s*#ffffff/);
  assert.match(css, /--background:\s*#101114/);
  assert.doesNotMatch(css, /\[data-theme="dark"\]/);
});

test("Tailwind v3 dark utilities use the manual HTML class selector", () => {
  const config = read("../tailwind.config.ts");
  assert.match(config, /darkMode:\s*"selector"/);
});
