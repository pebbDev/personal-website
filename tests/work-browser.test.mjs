import assert from "node:assert/strict";
import test from "node:test";
import { eventually, openBrowser } from "./browser-helper.mjs";

test("Work shell uses the approved safe editorial composition", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  const { send, evaluate } = browser;

  await send("Page.navigate", { url: `${browser.url}/#work` });
  await eventually(
    () => evaluate(`!!document.querySelector(".page-preview-frame, .work-page")`),
    Boolean,
    "Work preview did not mount"
  );

  const shell = await evaluate(`(() => {
    const root = document.querySelector(".work-page");
    const closing = root?.querySelector(".work-closing");
    const inactive = closing?.querySelector(".work-closing-action--inactive");
    return {
      root: !!root && root.id === "work",
      container: !!root?.querySelector(".work-container"),
      headings: Array.from(root?.querySelectorAll("h1") || [], heading => heading.textContent.trim()),
      lead: !!root?.querySelector(".work-intro .work-intro-copy")?.textContent.trim(),
      closing: closing?.querySelector("h2")?.textContent.trim(),
      footer: root?.querySelectorAll(".footer--compact").length || 0,
      footerNotice: root?.querySelector(".footer--compact")?.textContent.trim(),
      placeholders: document.querySelectorAll(".page-placeholder, .page-preview-frame").length,
      nestedMain: document.querySelectorAll("main main").length,
      homeHref: closing?.querySelector('a[href="#home"]')?.getAttribute("href"),
      inactiveTag: inactive?.tagName,
      inactiveLabel: inactive?.textContent.trim(),
      inactiveStatus: !!closing?.querySelector(".work-closing-status")?.textContent.trim(),
      unsafeLinks: root?.querySelectorAll('a[href^="http"], a[href$=".html"]').length || 0,
    };
  })()`);

  assert.equal(shell.root, true);
  assert.equal(shell.container, true);
  assert.deepEqual(shell.headings, ["My Lab"]);
  assert.equal(shell.lead, true);
  assert.equal(shell.closing, "Have a project in mind?");
  assert.equal(shell.footer, 1);
  assert.equal(shell.footerNotice, "Personal portfolio layout preview — content pending authorization.");
  assert.equal(shell.placeholders, 0);
  assert.equal(shell.nestedMain, 0);
  assert.equal(shell.homeHref, "#home");
  assert.equal(shell.inactiveTag, "SPAN");
  assert.equal(shell.inactiveLabel, "Say Hi");
  assert.equal(shell.inactiveStatus, true);
  assert.equal(shell.unsafeLinks, 0);

  await evaluate(`document.querySelector('.work-closing a[href="#home"]').click()`);
  await eventually(
    () => evaluate(`window.location.hash === "#home" && !!document.querySelector(".home")`),
    Boolean,
    "Home action did not navigate to the Home preview"
  );
  await evaluate(`window.location.hash = "#work"`);
  await eventually(
    () => evaluate(`!!document.querySelector(".work-page")`),
    Boolean,
    "Work preview did not restore after Home navigation"
  );

  await t.test("catalog renders the source-ordered rights-safe All preview", async () => {
    const catalog = await evaluate(`(() => {
      const root = document.querySelector(".work-page");
      const buttons = Array.from(root.querySelectorAll(".work-chips button"), button => ({
        label: button.textContent.replace(/\\s+/g, " ").trim(),
        disabled: button.disabled,
        pressed: button.getAttribute("aria-pressed"),
      }));
      const categories = Array.from(root.querySelectorAll(".work-category"), section => ({
        id: section.dataset.category,
        heading: !!section.querySelector("h2")?.textContent.trim(),
        description: !!section.querySelector(".work-category-description")?.textContent.trim(),
        ids: Array.from(section.querySelectorAll(".work-project-card"), card => card.dataset.projectId),
      }));
      const cards = Array.from(root.querySelectorAll(".work-project-card"));
      return {
        buttons,
        filtersHint: !!root.querySelector(".work-filter-status")?.textContent.trim(),
        categories,
        cardCount: cards.length,
        uniqueCount: new Set(cards.map(card => card.dataset.projectId)).size,
        cardsComplete: cards.every(card => !!card.querySelector("h3")?.textContent.trim() &&
          !!card.querySelector(".work-project-meta")?.textContent.trim() &&
          !!card.querySelector(".work-project-cover") &&
          !!card.querySelector(".work-project-affordance")?.textContent.trim()),
        unsafeCards: root.querySelectorAll(".work-project-card a, .work-project-card button, .work-project-card[tabindex]").length,
        mediaCount: root.querySelectorAll("img, video, picture, iframe, source").length,
        unsafeLinks: root.querySelectorAll('a[href^="http"], a[href$=".html"]').length,
        forbiddenCopy: /cekat|subaru|realfood|ocistok|linkedin|instagram/i.test(root.textContent),
      };
    })()`);

    assert.deepEqual(catalog.buttons, [
      { label: "All 22", disabled: true, pressed: "true" },
      { label: "UI/UX 9", disabled: true, pressed: "false" },
      { label: "Branding 9", disabled: true, pressed: "false" },
      { label: "Social Media 5", disabled: true, pressed: "false" },
      { label: "Event 5", disabled: true, pressed: "false" },
      { label: "E-commerce 2", disabled: true, pressed: "false" },
    ]);
    assert.equal(catalog.filtersHint, true);
    const expectedCategories = [
      [
        "uiux",
        [
          "cekat-ai-website",
          "movastocks",
          "ocistok-mobile-apps",
          "poci",
          "maku",
          "realfood-mobile-apps",
          "nexta-dashboard",
          "k-circle",
          "jaro",
        ],
      ],
      [
        "branding",
        [
          "cekat-innov-2025",
          "creative-designer-cekat-ai",
          "furrr-fun",
          "realfood-kiddos",
          "ocistok-graphic",
          "kaporak",
          "mr-roastman",
          "de-jamu",
          "santuy-coffee",
        ],
      ],
      ["social", ["cekat-innov-2025", "creative-designer-cekat-ai", "grid-network", "subaru-indonesia", "ergotron"]],
      [
        "event",
        ["cekat-innov-2025", "creative-designer-cekat-ai", "grid-network", "ocistok-graphic", "subaru-indonesia"],
      ],
      ["ecommerce", ["realfood-marketplace", "subaru-indonesia"]],
    ];
    assert.deepEqual(
      catalog.categories.map(({ id, ids }) => [id, ids]),
      expectedCategories
    );
    for (const category of catalog.categories) {
      assert.equal(category.heading, true);
      assert.equal(category.description, true);
      assert.equal(new Set(category.ids).size, category.ids.length);
    }
    assert.equal(catalog.cardCount, 30);
    assert.equal(catalog.uniqueCount, 22);
    assert.equal(catalog.cardsComplete, true);
    assert.equal(catalog.unsafeCards, 0);
    assert.equal(catalog.mediaCount, 0);
    assert.equal(catalog.unsafeLinks, 0);
    assert.equal(catalog.forbiddenCopy, false);
  });
});
