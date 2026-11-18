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
      markCounts: Array.from(root.querySelectorAll(".meet-me-intro > p"), el => el.querySelectorAll("mark").length),
      extraneousIntroSpans: root.querySelectorAll(".meet-me-intro > p > span").length,
      heroTag: root.querySelector(".meet-me-hero")?.tagName,
      figureCount: root.querySelectorAll("figure.meet-me-portrait").length,
      inlinePortraitStyles: root.querySelectorAll(".meet-me-portrait[style], .meet-me-portrait [style]").length,
      portraitArtAspect: getComputedStyle(root.querySelector(".meet-me-portrait-art")).aspectRatio,
      caption: root.querySelector(".meet-me-portrait figcaption")?.textContent?.trim(),
      connectSlots: root.querySelectorAll(".meet-me-connect-items > .meet-me-connect-icon[role='img']").length,
      lucideIcons: root.querySelectorAll(".meet-me-connect-items > .meet-me-connect-icon > svg.lucide").length,
      iconDimensions: Array.from(root.querySelectorAll(".meet-me-connect-items > .meet-me-connect-icon > svg")).map(
        (icon) => [icon.getAttribute("width"), icon.getAttribute("height"), icon.getAttribute("stroke-width")]
      ),
      connectControls: root.querySelectorAll(".meet-me-connect a, .meet-me-connect button").length,
      portraitImages: root.querySelectorAll(".meet-me-portrait img").length,
      mediaAndLinks: root.querySelectorAll(        "img, picture, video, audio, iframe, source, object, embed, a[href], [src], [href], [poster]",
      ).length,
      navCount: document.querySelectorAll("nav").length,
    };
  })()`);

  assert.ok(hero, "Meet Me feature should render");
  assert.equal(hero.headingCount, 1, "Meet Me should have one feature h1");
  assert.equal(hero.heading, "Meet Me");
  assert.equal(hero.introCount, 2, "Meet Me hero should contain two intro paragraphs");
  assert.deepEqual(
    hero.introParagraphs,
    meetMeContent.hero.intro.map((paragraph) =>
      paragraph
        .map(({ text }) => text)
        .join("")
        .trim()
    )
  );
  assert.deepEqual(hero.markCounts, [3, 1], "Hero must preserve four source-shaped marked text runs");
  assert.equal(hero.extraneousIntroSpans, 0, "Plain intro segments must remain text nodes, not extra markup");
  assert.equal(hero.heroTag, "HEADER", "Hero uses source-aligned header semantics");
  assert.equal(hero.figureCount, 1, "Meet Me should contain one semantic portrait figure");
  assert.equal(hero.inlinePortraitStyles, 0, "All Meet Me portrait styles belong in globals.css");
  assert.equal(hero.portraitArtAspect, "4 / 5", "Placeholder portrait geometry must remain 4:5");
  assert.equal(hero.caption, "Portrait placeholder", "Portrait caption should remain non-identifying");
  assert.equal(hero.connectSlots, 4, "Meet Me should show four decorative connection slots");
  assert.equal(hero.lucideIcons, 4, "All four Meet Me icons must use the installed Lucide library");
  assert.deepEqual(
    hero.iconDimensions,
    Array.from({ length: 4 }, () => ["18", "18", "1.8"])
  );
  assert.equal(hero.connectControls, 0, "Uncleared contact slots must not be interactive");
  assert.equal(hero.portraitImages, 0, "Portrait must not load real media");
  assert.equal(hero.mediaAndLinks, 0, "Meet Me hero must not contain media or links");
  assert.equal(hero.navCount, 1, "Meet Me must not render a second Navbar");
});

test("Meet Me contact semantics and Lucide icons", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: browser.url + "/#meet-me" });
  await eventually(
    () => browser.evaluate("Boolean(document.querySelector('.meet-me-connect'))"),
    Boolean,
    "Missing Meet Me Connect section",
    20000
  );

  const result = await browser.evaluate(`(() => {
    const root = document.querySelector(".meet-me-connect");
    const items = [...root.querySelectorAll(".meet-me-connect-items > .meet-me-connect-icon")];
    return {
      label: root.querySelector("p")?.textContent?.trim(),
      roles: items.map((el) => el.getAttribute("role")),
      names: items.map((el) => el.getAttribute("aria-label")),
      icons: items.map((el) => el.querySelector("svg")?.getAttribute("class")),
      attributes: items.map((el) => {
        const svg = el.querySelector("svg");
        return [svg?.getAttribute("width"), svg?.getAttribute("height"), svg?.getAttribute("stroke-width"), svg?.getAttribute("aria-hidden")];
      }),
      itemSizes: items.map((el) => [el.getBoundingClientRect().width, el.getBoundingClientRect().height]),
      clickables: root.querySelectorAll("a[href], button, [download], [tabindex]").length,
      cursors: items.map((el) => getComputedStyle(el).cursor),
    };
  })()`);

  assert.equal(result.label, "Let's connect");
  assert.deepEqual(result.roles, ["img", "img", "img", "img"]);
  assert.deepEqual(result.names, [
    "Email — unavailable in preview",
    "LinkedIn — unavailable in preview",
    "Instagram — unavailable in preview",
    "Download CV — unavailable in preview",
  ]);
  assert.deepEqual(
    result.icons.map((value) => value.split(" ").find((className) => className.startsWith("lucide-"))),
    ["lucide-mail", "lucide-briefcase-business", "lucide-camera", "lucide-file-down"]
  );
  assert.deepEqual(
    result.attributes,
    Array.from({ length: 4 }, () => ["18", "18", "1.8", "true"])
  );
  assert.deepEqual(
    result.itemSizes,
    Array.from({ length: 4 }, () => [44, 44])
  );
  assert.equal(result.clickables, 0);
  assert.ok(result.cursors.every((cursor) => cursor !== "pointer"));
});

test("Meet Me portrait fallback semantics", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: browser.url + "/#meet-me" });
  await eventually(
    () => browser.evaluate("Boolean(document.querySelector('figure.meet-me-portrait'))"),
    Boolean,
    "Missing semantic portrait figure",
    20000
  );

  const portrait = await browser.evaluate(`(() => {
    const figure = document.querySelector("figure.meet-me-portrait");
    const art = figure.querySelector(".meet-me-portrait-art");
    const caption = figure.querySelector("figcaption");
    return {
      tag: figure.tagName,
      figureRole: figure.getAttribute("role"),
      artRole: art.getAttribute("role"),
      artLabel: art.getAttribute("aria-label"),
      artAspect: getComputedStyle(art).aspectRatio,
      caption: caption?.textContent?.trim(),
      imageCount: figure.querySelectorAll("img, picture, source, video, [src], [poster]").length,
      inlineStyles: figure.querySelectorAll("[style]").length + Number(figure.hasAttribute("style")),
    };
  })()`);
  assert.equal(portrait.tag, "FIGURE");
  assert.equal(portrait.figureRole, null, "Figure must retain figure/caption semantics");
  assert.equal(portrait.artRole, "img", "Only fallback art should be an illustrative image");
  assert.equal(portrait.artLabel, "Neutral portrait placeholder");
  assert.equal(portrait.artAspect, "4 / 5");
  assert.equal(portrait.caption, "Portrait placeholder");
  assert.equal(portrait.imageCount, 0);
  assert.equal(portrait.inlineStyles, 0);
});

test("Meet Me Experience heading and list contract", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: browser.url + "/#meet-me" });
  await eventually(
    () => browser.evaluate("document.querySelectorAll('#experience .meet-me-timeline-entry').length"),
    (count) => count === 6,
    "Expected six Experience items",
    20000
  );
  const result = await browser.evaluate(`(() => ({
    eyebrow: document.querySelector("#experience .meet-me-section-eyebrow")?.textContent.trim(),
    heading: document.querySelector("#experience h2")?.textContent.trim(),
    orderedList: document.querySelector("#experience > ol.meet-me-timeline")?.tagName,
    headings: [...document.querySelectorAll("#experience .meet-me-timeline-entry h3")].length,
    bullets: [...document.querySelectorAll("#experience .meet-me-timeline-entry")].map(
      (item) => item.querySelectorAll("details li").length
    ),
    closed: [...document.querySelectorAll("#experience details")].every((details) => !details.open),
    media: document.querySelectorAll("#experience img, #experience a[href]").length,
  }))()`);
  assert.equal(result.eyebrow, "01 · Experience");
  assert.equal(result.heading, "Where I’ve been.");
  assert.equal(result.orderedList, "OL");
  assert.equal(result.headings, 6);
  assert.deepEqual(result.bullets, [6, 6, 2, 4, 3, 0]);
  assert.equal(result.closed, true);
  assert.equal(result.media, 0);
});

test("Meet Me Experience source-aligned flex row across nine viewports", { timeout: 150000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: browser.url + "/#meet-me" });
  await eventually(
    () => browser.evaluate("document.querySelectorAll('#experience .meet-me-timeline-entry').length"),
    (count) => count === 6,
    "Experience timeline did not mount",
    20000
  );
  for (const width of [390, 640, 641, 768, 900, 901, 1100, 1101, 1440]) {
    await browser.resize(width);
    const m = await browser.evaluate(`(() => {
      const items = [...document.querySelectorAll("#experience .meet-me-timeline-entry")];
      const first = items[0];
      const top = first.querySelector(".meet-me-timeline-top");
      const company = first.querySelector("h3");
      const role = first.querySelector(".meet-me-timeline-role");
      const logo = first.querySelector(".meet-me-timeline-logo");
      const s = top ? getComputedStyle(top) : null;
      return {
        hasTop: !!top,
        display: s?.display,
        justify: s?.justifyContent,
        align: s?.alignItems,
        wrap: s?.flexWrap,
        rowGap: s?.rowGap,
        columnGap: s?.columnGap,
        roleMarginTop: getComputedStyle(role).marginTop,
        companyBottom: company.getBoundingClientRect().bottom,
        roleTop: role.getBoundingClientRect().top,
        logoWidth: logo.getBoundingClientRect().width,
        fakeLogoLinks: first.querySelectorAll(".meet-me-timeline-logo a, .meet-me-timeline-logo button").length,
        lastConnector: getComputedStyle(items[5], "::after").content,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    })()`);
    assert.equal(m.hasTop, true, "Missing company/role flex wrapper at " + width);
    assert.equal(m.display, "flex");
    assert.equal(m.justify, "space-between");
    assert.equal(m.align, "baseline");
    assert.equal(m.wrap, "wrap");
    assert.equal(m.rowGap, "8px");
    assert.equal(m.columnGap, "24px");
    assert.equal(m.roleMarginTop, "0px");
    assert.equal(m.logoWidth, width <= 640 ? 48 : 64);
    assert.equal(m.fakeLogoLinks, 0);
    assert.equal(m.lastConnector, "none");
    assert.ok(m.overflow <= 1, "Horizontal overflow at " + width);
    if (width >= 1101) {
      assert.ok(m.roleTop <= m.companyBottom, "Desktop role should share company heading row at " + width);
    }
  }
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

test("Meet Me closing safety and footer", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: `${browser.url}/#meet-me` });
  await eventually(
    () => browser.evaluate("Boolean(document.querySelector('.meet-me-hero'))"),
    Boolean,
    "Meet Me absent"
  );

  const snapshot = await browser.evaluate(`(() => {
    const root = document.querySelector(".meet-me");
    const buttons = [...root.querySelectorAll(".meet-me-closing button")];
    const footer = root.querySelector("footer.footer--compact");
    return {
      closing: root.querySelectorAll(".meet-me-closing").length,
      actions: buttons.map((button) => ({ disabled: button.disabled, type: button.type, classes: button.className })),
      unsafeAnchors: root.querySelectorAll(".meet-me-closing a, .meet-me-closing [href]").length,
      footerCount: root.querySelectorAll("footer").length,
      footerText: footer?.textContent?.trim(),
      footerBackground: footer ? getComputedStyle(footer).backgroundColor : null,
      navCount: document.querySelectorAll("nav").length
    };
  })()`);
  assert.equal(snapshot.closing, 1);
  assert.equal(snapshot.actions.length, 2, "Two visual CTAs expected");
  assert.ok(snapshot.actions.every((action) => action.disabled && action.type === "button"));
  assert.match(snapshot.actions[0].classes, /btn--line/);
  assert.match(snapshot.actions[1].classes, /btn--dark/);
  assert.equal(snapshot.unsafeAnchors, 0, "CTAs must not navigate");
  assert.equal(snapshot.footerCount, 1, "One compact footer expected");
  assert.equal(snapshot.footerText, "Personal website layout preview.");
  assert.equal(snapshot.footerBackground, "rgb(17, 17, 17)");
  assert.equal(snapshot.navCount, 1, "Shared Navbar should remain unique");
});

test("Meet Me layout breakpoints", { timeout: 180000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: `${browser.url}/#meet-me` });
  await eventually(
    () => browser.evaluate("Boolean(document.querySelector('.meet-me-hero'))"),
    Boolean,
    "Meet Me absent"
  );

  for (const width of [390, 640, 641, 768, 900, 901, 1100, 1101, 1440]) {
    await browser.resize(width);
    const m = await browser.evaluate(`(() => {
      const css = (selector) => getComputedStyle(document.querySelector(selector));
      const count = (selector) => css(selector).gridTemplateColumns.split(" ").filter(Boolean).length;
      return {
        width: innerWidth,
        overflow: document.documentElement.scrollWidth - innerWidth,
        containerWidth: document.querySelector(".meet-me-container").getBoundingClientRect().width,
        tocDisplay: css(".meet-me-toc").display,
        tocPosition: css(".meet-me-toc").position,
        tocTop: css(".meet-me-toc").top,
        heroColumns: count(".meet-me-hero"),
        portraitAspect: css(".meet-me-portrait-art").aspectRatio,
        portraitTransform: css(".meet-me-portrait").transform,
        logoWidth: document.querySelector(".meet-me-timeline-logo").getBoundingClientRect().width,
        rowColumns: count(".meet-me-rows > div"),
        sectionOpacity: css(".meet-me-section").opacity,
      };
    })()`);
    assert.equal(m.width, width);
    assert.ok(m.overflow <= 1, `Horizontal overflow ${m.overflow}px at ${width}`);
    assert.ok(m.containerWidth <= 1161, `Wrapper exceeds source maximum at ${width}`);
    assert.equal(m.tocDisplay === "none", width <= 1100, `TOC visibility at ${width}`);
    if (width > 1100) {
      assert.equal(m.tocPosition, "sticky", `Desktop TOC sticky at ${width}`);
      assert.equal(m.tocTop, "110px");
    }
    assert.equal(m.heroColumns, width <= 900 ? 1 : 2, `Hero columns at ${width}`);
    assert.equal(m.portraitAspect, "4 / 5", `Portrait aspect at ${width}`);
    if (width <= 900) assert.equal(m.portraitTransform, "none", `Mobile portrait must not rotate at ${width}`);
    else assert.notEqual(m.portraitTransform, "none", `Desktop portrait tilt required at ${width}`);
    assert.equal(m.logoWidth, width <= 640 ? 48 : 64, `Timeline logo at ${width}`);
    assert.equal(m.rowColumns, width <= 640 ? 1 : 2, `Detail grid columns at ${width}`);
    assert.equal(m.sectionOpacity, "1", `Sections must remain visible at ${width}`);
  }
  await browser.motion("reduce");
  await browser.resize(901);
  const reduced = await browser.evaluate(`(() => ({
    opacity: getComputedStyle(document.querySelector(".meet-me-section")).opacity,
    transition: getComputedStyle(document.querySelector(".meet-me-timeline-logo")).transitionDuration,
  }))()`);
  assert.equal(reduced.opacity, "1");
  assert.ok(
    Number.parseFloat(reduced.transition) <= 0.00001,
    `Reduced motion should eliminate perceptible timeline transitions; observed ${reduced.transition}`
  );
  await browser.motion("no-preference");
  assert.equal(await browser.evaluate("getComputedStyle(document.querySelector('.meet-me-section')).opacity"), "1");
});

test("Meet Me Hero nine-viewport geometry and reduced motion", { timeout: 180000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: browser.url + "/#meet-me" });
  await eventually(
    () => browser.evaluate("Boolean(document.querySelector('header.meet-me-hero .meet-me-connect'))"),
    Boolean,
    "Meet Me Hero did not render",
    20000
  );

  for (const width of [390, 640, 641, 768, 900, 901, 1100, 1101, 1440]) {
    await browser.resize(width);
    const hero = await browser.evaluate(`(() => {
      const root = document.querySelector("header.meet-me-hero");
      const portrait = root.querySelector(".meet-me-portrait");
      const intro = root.querySelector(".meet-me-intro");
      const icons = [...root.querySelectorAll(".meet-me-connect-icon")];
      const css = (el) => getComputedStyle(el);
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        heroColumns: css(root).gridTemplateColumns.split(" ").filter(Boolean).length,
        heroPaddingTop: css(root).paddingTop,
        wrapperWidth: document.querySelector(".meet-me-container").getBoundingClientRect().width,
        titleCount: root.querySelectorAll("h1").length,
        paragraphCount: intro.querySelectorAll(":scope > p").length,
        marks: [...intro.querySelectorAll(":scope > p")].map((p) => p.querySelectorAll("mark").length),
        highlightWeight: css(intro.querySelector("mark")).fontWeight,
        contactLabel: root.querySelector(".meet-me-connect-label").textContent.trim(),
        contactLabelFont: css(root.querySelector(".meet-me-connect-label")).fontSize,
        iconSizes: icons.map((el) => [el.getBoundingClientRect().width, el.getBoundingClientRect().height]),
        iconGlyphs: icons.map((el) => [el.querySelector("svg")?.getAttribute("width"), el.querySelector("svg")?.getAttribute("height")]),
        fakeControls: root.querySelectorAll(".meet-me-connect a, .meet-me-connect button, .meet-me-connect [tabindex]").length,
        portraitAspect: css(portrait.querySelector(".meet-me-portrait-art")).aspectRatio,
        portraitWidth: parseFloat(css(portrait).width),
        portraitTransform: css(portrait).transform,
        captionLeft: css(portrait.querySelector("figcaption")).left,
        captionBottom: css(portrait.querySelector("figcaption")).bottom,
        invisibleNodes: [...root.querySelectorAll("h1, .meet-me-intro p, .meet-me-connect-label, .meet-me-portrait-caption")]
          .filter((el) => css(el).opacity === "0" || css(el).visibility === "hidden").length,
      };
    })()`);
    assert.ok(hero.overflow <= 1, "Hero overflow at width " + width);
    assert.ok(hero.wrapperWidth <= 1161, "Wrapper max width at " + width);
    assert.equal(hero.heroColumns, width <= 900 ? 1 : 2);
    assert.equal(hero.heroPaddingTop, width <= 900 ? "56px" : "128px");
    assert.equal(hero.titleCount, 1);
    assert.equal(hero.paragraphCount, 2);
    assert.deepEqual(hero.marks, [3, 1]);
    assert.equal(hero.highlightWeight, "500");
    assert.equal(hero.contactLabel, "Let's connect");
    assert.equal(hero.contactLabelFont, "16px");
    assert.deepEqual(
      hero.iconSizes,
      Array.from({ length: 4 }, () => [44, 44])
    );
    assert.deepEqual(
      hero.iconGlyphs,
      Array.from({ length: 4 }, () => ["18", "18"])
    );
    assert.equal(hero.fakeControls, 0);
    assert.equal(hero.portraitAspect, "4 / 5");
    assert.equal(hero.captionLeft, "14px");
    assert.equal(hero.captionBottom, "14px");
    assert.equal(hero.invisibleNodes, 0);
    if (width <= 900) {
      assert.ok(hero.portraitWidth <= 380.5);
      assert.equal(hero.portraitTransform, "none");
    } else {
      assert.notEqual(hero.portraitTransform, "none");
    }
  }

  await browser.motion("reduce");
  await browser.resize(390);
  const reduced = await browser.evaluate(`(() => {
    const root = document.querySelector(".meet-me-hero");
    return {
      hidden: [...root.querySelectorAll("h1, .meet-me-intro p, .meet-me-connect-label, .meet-me-portrait-caption")]
        .filter((el) => getComputedStyle(el).opacity === "0" || getComputedStyle(el).visibility === "hidden").length,
      iconCount: root.querySelectorAll("svg.lucide").length,
      headerCount: document.querySelectorAll("header.meet-me-hero").length,
    };
  })()`);
  assert.equal(reduced.hidden, 0);
  assert.equal(reduced.iconCount, 4);
  assert.equal(reduced.headerCount, 1);
  await browser.motion("no-preference");
});

test("Meet Me Connect hover matches source without enabling inactive contacts", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  await browser.send("Page.navigate", { url: browser.url + "/#meet-me" });
  await eventually(
    () => browser.evaluate("document.querySelectorAll('.meet-me-connect-icon').length"),
    (count) => count === 4,
    "Four Meet Me contact slots did not render",
    20000
  );
  await browser.resize(901);

  const snapshot = (index) =>
    browser.evaluate(
      `(() => {
      const items = [...document.querySelectorAll(".meet-me-connect-icon")];
      const item = items[INDEX];
      const style = getComputedStyle(item);
      const tip = getComputedStyle(item, "::after");
      const rect = item.getBoundingClientRect();
      const connect = document.querySelector(".meet-me-connect");
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        size: [rect.width, rect.height],
        background: style.backgroundColor,
        foreground: style.color,
        border: style.borderTopColor,
        transition: style.transitionDuration,
        cursor: style.cursor,
        role: item.getAttribute("role"),
        label: item.getAttribute("aria-label"),
        tipContent: tip.content,
        tipOpacity: tip.opacity,
        tipTransition: tip.transitionDuration,
        tipBottom: tip.bottom,
        tipTransform: tip.transform,
        tipPointerEvents: tip.pointerEvents,
        unsafeControls: connect.querySelectorAll("a, button, [href], [download], [tabindex], [onclick]").length,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    })()`.replace("INDEX", String(index))
    );

  const moveTo = async (item) => {
    await browser.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: item.x,
      y: item.y,
    });
  };
  const rest = await snapshot(0);
  assert.deepEqual(rest.size, [44, 44]);
  assert.equal(rest.unsafeControls, 0);
  assert.notEqual(rest.cursor, "pointer");
  assert.equal(rest.role, "img");
  assert.match(rest.label, /unavailable in preview/);

  for (const index of [0, 1, 2, 3]) {
    const before = await snapshot(index);
    await moveTo(before);
    const hovered = await eventually(
      () => snapshot(index),
      (state) => state.background === "rgb(17, 17, 17)" && state.foreground === "rgb(255, 255, 255)",
      "Source hover inversion must settle on slot " + index,
      3500
    );
    assert.equal(hovered.background, "rgb(17, 17, 17)", "Source hover background absent on slot " + index);
    assert.equal(hovered.border, "rgb(17, 17, 17)");
    assert.equal(hovered.foreground, "rgb(255, 255, 255)");
    assert.equal(hovered.transition, "0.2s, 0.2s, 0.2s");
    assert.deepEqual(hovered.size, [44, 44]);
    assert.notEqual(hovered.cursor, "pointer");
    assert.equal(hovered.unsafeControls, 0);
    assert.ok(hovered.overflow <= 1);
    if (index === 3) {
      const cvHover = await eventually(
        () => snapshot(index),
        (state) => state.tipOpacity === "1",
        "CV tooltip must fully reveal after 300ms source transition",
        3500
      );
      assert.equal(cvHover.tipContent, '"CV unavailable"');
      assert.equal(cvHover.tipBottom, "50px", "Tooltip sits 8px above the 42px inner box (44px including border)");
      assert.equal(cvHover.tipTransition, "0.3s, 0.3s");
      assert.equal(cvHover.tipPointerEvents, "none");
    }
    await browser.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1, y: 1 });
    const after = await eventually(
      () => snapshot(index),
      (state) =>
        state.background === before.background &&
        state.foreground === before.foreground &&
        (index !== 3 || state.tipOpacity === "0"),
      "Contact hover and CV tooltip must fully reset",
      3500
    );
    assert.equal(after.background, before.background, "Hover must restore idle background");
    assert.equal(after.foreground, before.foreground, "Hover must restore idle foreground");
    if (index === 3) {
      assert.equal(after.tipOpacity, "0", "CV tooltip must disappear on mouseout");
    }
  }

  await browser.motion("reduce");
  const cv = await snapshot(3);
  assert.ok(
    cv.transition.split(", ").every((duration) => Number.parseFloat(duration) <= 0.00001),
    "Reduced motion must eliminate perceptible icon transitions"
  );
  assert.ok(
    cv.tipTransition.split(", ").every((duration) => Number.parseFloat(duration) <= 0.00001),
    "Reduced motion must eliminate perceptible tooltip transitions"
  );
  assert.match(cv.tipTransform, /, 0\)$/, "Reduced motion tooltip must not move vertically");
  await moveTo(cv);
  const reducedHover = await snapshot(3);
  assert.equal(reducedHover.background, "rgb(17, 17, 17)");
  assert.equal(reducedHover.tipOpacity, "1");
  assert.equal(reducedHover.unsafeControls, 0);
  await browser.motion("no-preference");
});
