import assert from "node:assert/strict";
import test from "node:test";
import { eventually, openBrowser } from "./browser-helper.mjs";

test(
  "Work chip focus and hover remain usable without false card links or animation traps",
  { timeout: 150000 },
  async (t) => {
    const browser = await openBrowser(t);
    const { send, evaluate } = browser;
    await send("Page.navigate", { url: `${browser.url}/work.html` });
    await eventually(
      () =>
        evaluate(
          `document.readyState === "complete" && !!document.querySelector('.work-chip[data-filter="branding"]')`
        ),
      Boolean,
      "Work filter did not mount"
    );
    await send("Page.bringToFront");

    const chip = () =>
      evaluate(`(() => {
    const button = document.querySelector('.work-chip[data-filter="branding"]');
    const rect = button.getBoundingClientRect();
    return { border: getComputedStyle(button).borderColor, cursor: getComputedStyle(button).cursor,
      x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
    const before = await chip();
    assert.equal(before.cursor, "pointer");

    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: before.x, y: before.y });
    await eventually(async () => (await chip()).border !== before.border, Boolean, "chip hover border did not change");
    await evaluate(`document.querySelector('.work-chip[data-filter="branding"]').focus({ focusVisible: true })`);
    const focus = await evaluate(`(() => {
    const button = document.querySelector('.work-chip[data-filter="branding"]');
    const style = getComputedStyle(button);
    return { focused: document.activeElement === button, outline: style.outlineStyle,
      width: parseFloat(style.outlineWidth), offset: parseFloat(style.outlineOffset) };
  })()`);
    assert.equal(focus.focused, true);
    assert.notEqual(focus.outline, "none");
    assert.ok(focus.width >= 2, "filter focus ring should have at least 2px outline");
    assert.ok(focus.offset >= 2, "filter focus ring should not touch chip border");

    const card = await evaluate(`(() => {
    const card = document.querySelector('.work-project-card[data-project-id="movastocks"]');
    const rect = card.getBoundingClientRect();
    return { x: rect.left + 15, y: rect.top + 15 };
  })()`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: card.x, y: card.y });
    const inert = await evaluate(`(() => {
    const card = document.querySelector('.work-project-card[data-project-id="movastocks"]');
    return { cursor: getComputedStyle(card).cursor,
      zoom: getComputedStyle(card.querySelector(".work-project-cover")).transform,
      anchors: document.querySelectorAll(".work-project-card a").length };
  })()`);
    assert.equal(inert.anchors, 0, "all cards remain inert while details are not routed");
    assert.notEqual(inert.cursor, "pointer");
    assert.equal(inert.zoom, "none", "inert cards must not mimic clickable hover zoom");

    await browser.motion("reduce");
    const reduced = await evaluate(`(() => {
    const filter = getComputedStyle(document.querySelector(".work-chip"));
    const section = document.querySelector(".work-category");
    return { duration: parseFloat(filter.transitionDuration), sectionVisible: getComputedStyle(section).display !== "none" };
  })()`);
    assert.ok(reduced.duration <= 0.01);
    assert.equal(reduced.sectionVisible, true);
    await evaluate(`(() => {
      const original = window.scrollTo.bind(window);
      const filterBar = document.querySelector(".work-filter-bar");
      window.__expectedFilterScrollTop = Math.max(0, filterBar.getBoundingClientRect().top + window.scrollY - 90);
      window.__lastFilterScrollBehavior = null;
      window.__lastFilterScrollTop = null;
      window.scrollTo = (options) => {
        window.__lastFilterScrollBehavior = options.behavior;
        window.__lastFilterScrollTop = options.top;
        original(options);
      };
      document.querySelector('.work-chip[data-filter="branding"]').click();
    })()`);
    await eventually(
      () =>
        evaluate(
          `document.querySelector('.work-chip[data-filter="branding"]').getAttribute("aria-pressed") === "true"`
        ),
      Boolean,
      "reduced-motion filter selection did not update"
    );
    assert.equal(
      await evaluate("window.__lastFilterScrollBehavior"),
      "auto",
      "reduced motion must use non-animated filter scroll"
    );
    const offsetError = await evaluate("window.__lastFilterScrollTop - window.__expectedFilterScrollTop");
    assert.ok(Math.abs(offsetError) <= 1, `filter scroll should land 90px above chip bar; delta=${offsetError}`);

    // SSR must expose all 30 cards without hydration or JavaScript.
    await send("Emulation.setScriptExecutionDisabled", { value: true });
    await send("Page.navigate", { url: `${browser.url}/work.html` });
    await send("DOM.enable");
    const counts = await eventually(
      async () => {
        const { root } = await send("DOM.getDocument", { depth: 1 });
        const categories = await send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: ".work-category" });
        const cards = await send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: ".work-project-card" });
        return { categories: categories.nodeIds, cards: cards.nodeIds };
      },
      (value) => value.categories.length === 5 && value.cards.length === 30,
      "SSR Catalog not visible without scripts"
    );
    for (const nodeId of counts.categories) {
      const { attributes } = await send("DOM.getAttributes", { nodeId });
      assert.ok(!attributes.includes("hidden"), "no-JS server HTML should not hide sections");
    }
  }
);
