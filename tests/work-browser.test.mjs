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
  await evaluate(`document.querySelector('.pill a[href="#work"]').click()`);
  try {
    await eventually(
      () => evaluate(`location.hash === "#work" && !!document.querySelector(".work-page")`),
      Boolean,
      "Work preview did not restore and settle on #work after Home navigation"
    );
    const settled = await evaluate(`new Promise(resolve => {
      const states = [];
      const check = () => {
        states.push({ hash: location.hash, work: !!document.querySelector(".work-page") });
        if (states.length === 9) resolve(states);
        else setTimeout(check, 50);
      };
      check();
    })`);
    assert.ok(
      settled.every((state) => state.hash === "#work" && state.work),
      `Home-to-Work hash changed after rendering: ${JSON.stringify(settled)}`
    );
  } catch (error) {
    t.diagnostic(
      `Home-to-Work restore state: ${JSON.stringify(
        await evaluate(`(() => ({
          href: location.href,
          hash: location.hash,
          home: !!document.querySelector(".home"),
          work: !!document.querySelector(".work-page"),
          placeholder: !!document.querySelector(".page-preview-frame"),
          activeNav: Array.from(document.querySelectorAll(".pill a[aria-current=page]"), node => node.textContent.trim()),
        }))()`)
      )}`
    );
    throw error;
  }
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
      { label: "All 22", disabled: false, pressed: "true" },
      { label: "UI/UX 9", disabled: false, pressed: "false" },
      { label: "Branding 9", disabled: false, pressed: "false" },
      { label: "Social Media 5", disabled: false, pressed: "false" },
      { label: "Event 5", disabled: false, pressed: "false" },
      { label: "E-commerce 2", disabled: false, pressed: "false" },
    ]);
    assert.equal(catalog.filtersHint, false);
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

  await t.test("source-proportioned Work layout across ten breakpoints", async () => {
    const expectedColumns = [1, 1, 1, 2, 2, 2, 2, 2, 3, 3];
    const widths = [390, 639, 640, 641, 900, 901, 999, 1000, 1001, 1440];

    for (const [index, width] of widths.entries()) {
      await browser.resize(width);
      await evaluate(`window.scrollTo({ top: 0, behavior: "instant" })`);
      await browser.screenshot(`work-${width}.png`);
      const geometry = await evaluate(`(() => {
        const page = document.querySelector(".work-page");
        const grid = page.querySelector(".work-project-grid");
        const chips = page.querySelector(".work-chips");
        const head = page.querySelector(".work-category-head");
        const cover = page.querySelector(".work-project-cover").getBoundingClientRect();
        const nav = document.querySelector(".topnav");
        const container = page.querySelector(".work-container");
        const columns = value => value.trim().split(/\\s+/).filter(Boolean).length;
        return {
          columns: columns(getComputedStyle(grid).gridTemplateColumns),
          headingColumns: columns(getComputedStyle(head).gridTemplateColumns),
          coverRatio: cover.width / cover.height,
          chipWrap: getComputedStyle(chips).flexWrap,
          chipOverflow: getComputedStyle(chips).overflowX,
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          navTop: getComputedStyle(nav).top,
          navBottom: getComputedStyle(nav).bottom,
          navCount: document.querySelectorAll(".topnav").length,
          workNavCount: page.querySelectorAll("nav").length,
          gutter: parseFloat(getComputedStyle(container).paddingLeft),
          maxWidth: getComputedStyle(container).maxWidth,
          introTop: parseFloat(getComputedStyle(page.querySelector(".work-intro")).paddingTop),
          titleSize: parseFloat(getComputedStyle(page.querySelector(".work-intro-title")).fontSize),
        };
      })()`);
      t.diagnostic(`Work geometry ${width}px: ${JSON.stringify(geometry)}`);

      assert.equal(geometry.columns, expectedColumns[index], `grid columns at ${width}px`);
      assert.equal(geometry.headingColumns, width <= 640 ? 1 : 2, `category head at ${width}px`);
      assert.ok(Math.abs(geometry.coverRatio - 1.6) < 0.045, `cover aspect at ${width}px`);
      assert.ok(geometry.pageWidth <= geometry.viewportWidth, `horizontal overflow at ${width}px`);
      assert.equal(geometry.maxWidth, "1160px");
      assert.equal(geometry.gutter, width <= 640 ? 16 : 24);
      assert.equal(geometry.introTop, width <= 900 ? 56 : 132);
      assert.ok(geometry.titleSize >= 44 && geometry.titleSize <= 76);
      assert.equal(geometry.navCount, 1);
      assert.equal(geometry.workNavCount, 0);
      if (width <= 900) {
        assert.ok(geometry.navBottom !== "auto" && parseFloat(geometry.navBottom) >= 0, `nav bottom at ${width}px`);
      } else {
        assert.equal(geometry.navTop, "16px", `nav top at ${width}px`);
      }
      if (width <= 640) {
        assert.equal(geometry.chipWrap, "nowrap");
        assert.equal(geometry.chipOverflow, "auto");
      }
    }
  });

  await t.test("Work focus, dark-theme and reduced-motion safety", async () => {
    await send("Page.bringToFront");
    await browser.resize(390);
    await browser.motion("reduce");
    const keyboard = await evaluate(`(() => {
      const link = document.querySelector('.work-closing a[href="#home"]');
      const chips = Array.from(document.querySelectorAll(".work-chip"));
      link.focus({ focusVisible: true });
      const focused = document.activeElement === link;
      const outline = getComputedStyle(link).outlineStyle;
      const matched = link.matches(".work-closing-action:focus");
      const className = link.className;
      const outlineWidth = getComputedStyle(link).outlineWidth;
      chips[0]?.focus();
      return {
        focused,
        tabIndex: link.tabIndex,
        outline,
        matched,
        className,
        outlineWidth,
        hasDocumentFocus: document.hasFocus(),
        chipsDisabled: chips.every(chip => chip.disabled),
        chipFocused: chips.some(chip => document.activeElement === chip),
        cardFocusable: document.querySelectorAll(".work-project-card a, .work-project-card button, .work-project-card[tabindex]").length,
        visibleCards: Array.from(document.querySelectorAll(".work-project-card")).every(card => {
          const style = getComputedStyle(card);
          return style.opacity !== "0" && style.visibility === "visible" && style.display !== "none";
        }),
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        coverTransition: getComputedStyle(document.querySelector(".work-project-cover")).transitionDuration,
      };
    })()`);
    t.diagnostic(`Work keyboard: ${JSON.stringify(keyboard)}`);
    assert.equal(keyboard.focused, true);
    assert.ok(keyboard.tabIndex >= 0);
    assert.notEqual(keyboard.outline, "none");
    assert.equal(keyboard.chipsDisabled, false);
    assert.equal(keyboard.chipFocused, true);
    assert.equal(keyboard.cardFocusable, 0);
    assert.equal(keyboard.visibleCards, true);
    assert.equal(keyboard.reducedMotion, true);
    assert.ok(parseFloat(keyboard.coverTransition) <= 0.01);

    const initialDark = await evaluate(`document.documentElement.classList.contains("dark")`);
    try {
      for (const dark of [false, true]) {
        const isDark = await evaluate(`document.documentElement.classList.contains("dark")`);
        if (isDark !== dark) await evaluate(`document.querySelector(".theme-toggle").click()`);
        await eventually(
          () => evaluate(`document.documentElement.classList.contains("dark")`),
          (value) => value === dark,
          "Theme toggle failed"
        );
        for (const width of [390, 1440]) {
          await browser.resize(width);
          await evaluate(`window.scrollTo({ top: 0, behavior: "instant" })`);
          await browser.screenshot(`work-${dark ? "dark" : "light"}-${width}.png`);
          const colors = await evaluate(`(() => ({
            background: getComputedStyle(document.body).backgroundColor,
            heading: getComputedStyle(document.querySelector(".work-intro-title")).color,
            visible: getComputedStyle(document.querySelector(".work-project-card")).opacity !== "0",
          }))()`);
          t.diagnostic(`Work theme ${dark ? "dark" : "light"} ${width}px: ${JSON.stringify(colors)}`);
          assert.notEqual(colors.background, colors.heading);
          assert.equal(colors.visible, true);
        }
      }
    } finally {
      const dark = await evaluate(`document.documentElement.classList.contains("dark")`);
      if (dark !== initialDark) await evaluate(`document.querySelector(".theme-toggle").click()`);
      await browser.motion("no-preference");
    }
  });
});
test("exact Work legacy route coexists with root preview and safe nav", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  const { send, evaluate } = browser;
  const workUrl = `${browser.url}/work.html`;

  await send("Page.navigate", { url: workUrl });
  await eventually(
    () => evaluate(`document.readyState === "complete" && !!document.querySelector(".work-page")`),
    Boolean,
    "Exact Work route did not mount"
  );

  const inspect = () =>
    evaluate(`(() => ({
    path: location.pathname,
    h1: document.querySelector(".work-page h1")?.textContent.trim(),
    workPageCount: document.querySelectorAll(".work-page").length,
    navCount: document.querySelectorAll(".topnav").length,
    mainCount: document.querySelectorAll("main").length,
    compactFooterCount: document.querySelectorAll(".work-page footer.footer--compact").length,
    active: Array.from(document.querySelectorAll(".pill a[aria-current=page]"), node => node.textContent.trim()),
    homeHref: document.querySelector(".work-closing a")?.getAttribute("href"),
    navTargets: Array.from(document.querySelectorAll(".pill a"), node => [node.textContent.trim(), node.getAttribute("href")]),
    cardAnchors: document.querySelectorAll(".work-project-card a").length,
  }))()`);

  assert.deepEqual(await inspect(), {
    path: "/work.html",
    h1: "My Lab",
    workPageCount: 1,
    navCount: 1,
    mainCount: 1,
    compactFooterCount: 1,
    active: ["My Lab"],
    homeHref: "/#home",
    navTargets: [
      ["Come In", "/#home"],
      ["Meet Me", "/#meet-me"],
      ["My Lab", "/work.html"],
    ],
    cardAnchors: 0,
  });

  await send("Page.reload", { ignoreCache: true });
  await eventually(() => evaluate(`!!document.querySelector(".work-page")`), Boolean, "Work refresh failed");
  assert.equal((await inspect()).path, "/work.html");

  await evaluate(`document.querySelector('.pill a[href="/#meet-me"]').click()`);
  await eventually(
    () =>
      evaluate(
        `location.pathname === "/" && location.hash === "#meet-me" && !!document.querySelector(".page-preview-frame")`
      ),
    Boolean,
    "Meet Me preview did not mount from Work"
  );

  await send("Page.navigate", { url: `${browser.url}/#work` });
  await eventually(() => evaluate(`!!document.querySelector(".work-page")`), Boolean, "Root Work preview regressed");
  assert.equal(await evaluate(`location.hash`), "#work");

  await send("Page.navigate", { url: `${browser.url}/missing-work.html` });
  await eventually(
    () => evaluate(`document.readyState === "complete" && !!document.body`),
    Boolean,
    "Unknown path navigation incomplete"
  );
  assert.equal(await evaluate(`document.querySelector(".work-page") === null`), true);
  assert.ok(await evaluate(`document.body.textContent.includes("404")`));
});
