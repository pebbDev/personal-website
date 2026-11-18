import assert from "node:assert/strict";
import { test } from "node:test";
import { eventually, openBrowser } from "./browser-helper.mjs";
import { meetMeContent } from "../src/features/meet-me/constants.ts";

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
      introParagraphs: Array.from(root.querySelectorAll(".meet-me-intro > p"), el => el.textContent?.trim()),
      figureCount: root.querySelectorAll("figure.meet-me-portrait").length,
      inlinePortraitStyles: root.querySelectorAll(".meet-me-portrait[style], .meet-me-portrait [style]").length,
      portraitArtAspect: getComputedStyle(root.querySelector(".meet-me-portrait-art")).aspectRatio,
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
  assert.deepEqual(hero.introParagraphs, [...meetMeContent.hero.introParagraphs]);
  assert.equal(hero.figureCount, 1, "Meet Me should contain one semantic portrait figure");
  assert.equal(hero.inlinePortraitStyles, 0, "All Meet Me portrait styles belong in globals.css");
  assert.equal(hero.portraitArtAspect, "4 / 5", "Placeholder portrait geometry must remain 4:5");
  assert.equal(hero.caption, "Portrait placeholder", "Portrait caption should remain non-identifying");
  assert.equal(hero.connectSlots, 4, "Meet Me should show four decorative connection slots");
  assert.equal(hero.connectControls, 0, "Decorative connection slots must not be interactive");
  assert.equal(hero.portraitImages, 0, "Portrait must not load real media");
  assert.equal(hero.mediaAndLinks, 0, "Meet Me hero must not contain media or links");
  assert.equal(hero.navCount, 1, "Meet Me must not render a second Navbar");
});

test("Meet Me experience disclosure", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: browser.url + "/#meet-me" });
  await eventually(
    () => browser.evaluate("document.querySelectorAll('.meet-me-timeline-entry').length"),
    (count) => count === 6,
    "Expected six source-shaped experience entries",
    20000
  );

  const snapshot = await browser.evaluate(
    "(() => { const items = [...document.querySelectorAll('.meet-me-timeline-entry')]; const details = [...document.querySelectorAll('#experience details')]; return { count: items.length, detailsPerItem: items.map((item) => item.querySelectorAll('details > summary').length), listsPerItem: items.map((item) => item.querySelectorAll('details ul').length), allClosed: details.every((detail) => !detail.open), logos: items.filter((item) => !!item.querySelector('.meet-me-timeline-logo[aria-hidden]')).length }; })()"
  );
  assert.equal(snapshot.count, 6);
  assert.deepEqual(snapshot.detailsPerItem, [1, 1, 1, 1, 1, 0]);
  assert.deepEqual(snapshot.listsPerItem, [1, 1, 1, 1, 1, 0]);
  assert.equal(snapshot.allClosed, true, "Native disclosures should start closed");
  assert.equal(snapshot.logos, 6, "Each entry needs a decorative logo slot");

  const open = () => browser.evaluate("Boolean(document.querySelector('#experience details')?.open)");
  await browser.send("Page.bringToFront");
  assert.equal(await browser.evaluate("document.hasFocus()"), true, "CDP page must have focus for keyboard test");
  await browser.evaluate("document.querySelector('#experience details summary').focus()");

  await browser.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    text: "\r",
  });
  await browser.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
  await eventually(open, (isOpen) => isOpen, "Enter should open native details", 2000);
  await browser.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: " ",
    code: "Space",
    windowsVirtualKeyCode: 32,
  });
  await browser.send("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
  await eventually(open, (isOpen) => !isOpen, "Space should close native details", 2000);
});

test("Meet Me complete reading structure", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: `${browser.url}/#meet-me` });
  await eventually(
    () => browser.evaluate("Boolean(document.querySelector('.meet-me-hero'))"),
    Boolean,
    "Meet Me hero did not render",
    20000
  );

  const structure = await browser.evaluate(`(() => {
    const root = document.querySelector(".meet-me");
    const toc = root?.querySelector(".meet-me-toc");
    const article = root?.querySelector(".meet-me-content");
    const sections = Array.from(article?.querySelectorAll(":scope > section.meet-me-section") ?? []);
    const tocItems = Array.from(toc?.querySelectorAll("ol > li") ?? []);
    const tocSpans = Array.from(toc?.querySelectorAll("ol > li > span") ?? []);
    return {
      heroCount: root?.querySelectorAll(".meet-me-hero").length ?? 0,
      sectionIds: sections.map((section) => section.id),
      articleCount: root?.querySelectorAll("article.meet-me-content").length ?? 0,
      tocItemCount: tocItems.length,
      tocLabels: tocSpans.map((span) => span.textContent?.trim()),
      tocControlCount: toc?.querySelectorAll(
        "a, button, input, select, textarea, [role='link'], [role='button'], [tabindex], [onclick]",
      ).length ?? 0,
      detailRowCounts: ["education", "skills", "languages"].map(
        (id) => article?.querySelectorAll("#" + id + " dl.meet-me-rows > div").length ?? 0,
      ),
      certificationCount: article?.querySelectorAll(
        "#certifications > ol.meet-me-steps > li.meet-me-step",
      ).length ?? 0,
      hash: window.location.hash,
    };
  })()`);

  assert.equal(structure.heroCount, 1, "Meet Me should keep one hero");
  assert.deepEqual(
    structure.sectionIds,
    ["experience", "education", "certifications", "skills", "languages"],
    "Reading sections should have five unique IDs in source order"
  );
  assert.equal(new Set(structure.sectionIds).size, 5, "Reading section IDs should be unique");
  assert.equal(structure.articleCount, 1, "All reading sections should be in one article");
  assert.equal(structure.tocItemCount, 5, "On this page should contain five labels");
  assert.deepEqual(structure.tocLabels, ["Experience", "Education", "Certifications", "Skills & Tools", "Languages"]);
  assert.equal(structure.tocControlCount, 0, "TOC labels should remain inert, without link-like controls");
  assert.deepEqual(
    structure.detailRowCounts,
    [3, 7, 2],
    "Education, skills, and languages should use the approved row counts"
  );
  assert.equal(structure.certificationCount, 3, "Certifications should contain three ordered steps");
  assert.equal(structure.hash, "#meet-me", "Inspecting the inert TOC should preserve the preview hash");
});
