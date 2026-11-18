import assert from "node:assert/strict";
import { test } from "node:test";
import { eventually, openBrowser } from "./browser-helper.mjs";

test("Meet Me hero baseline", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: `${browser.url}/#meet-me` });

  await eventually(
    () => browser.evaluate("Boolean(document.querySelector('.meet-me-hero'))"),
    Boolean,
    "Meet Me hero did not render",
    20000
  );

  const hero = await browser.evaluate(`(() => {
    const root = document.querySelector(".meet-me");
    if (!root) return null;
    return {
      headingCount: root.querySelectorAll("h1").length,
      heading: root.querySelector("h1")?.textContent?.trim(),
      introCount: root.querySelectorAll(".meet-me-intro > p").length,
      figureCount: root.querySelectorAll(".meet-me-portrait").length,
      caption: root.querySelector(".meet-me-portrait figcaption")?.textContent?.trim(),
      connectSlots: root.querySelectorAll(".meet-me-connect [aria-hidden='true']").length,
      connectControls: root.querySelectorAll(".meet-me-connect a, .meet-me-connect button").length,
      portraitImages: root.querySelectorAll(".meet-me-portrait img").length,
      mediaAndLinks: root.querySelectorAll(
        "img, picture, video, audio, iframe, source, object, embed, a[href], [src], [href], [poster]",
      ).length,
      navCount: document.querySelectorAll("nav").length,
    };
  })()`);

  assert.ok(hero, "Meet Me feature should render");
  assert.equal(hero.headingCount, 1, "Meet Me should have one feature h1");
  assert.equal(hero.heading, "Meet Me");
  assert.equal(hero.introCount, 2, "Meet Me hero should contain two intro paragraphs");
  assert.equal(hero.figureCount, 1, "Meet Me should contain one portrait figure");
  assert.equal(hero.caption, "Portrait placeholder", "Portrait caption should remain non-identifying");
  assert.equal(hero.connectSlots, 4, "Meet Me should show four decorative connection slots");
  assert.equal(hero.connectControls, 0, "Decorative connection slots must not be interactive");
  assert.equal(hero.portraitImages, 0, "Portrait must not load real media");
  assert.equal(hero.mediaAndLinks, 0, "Meet Me hero must not contain media or links");
  assert.equal(hero.navCount, 1, "Meet Me must not render a second Navbar");
});
