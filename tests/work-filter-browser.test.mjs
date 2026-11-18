import assert from "node:assert/strict";
import test from "node:test";
import { eventually, openBrowser } from "./browser-helper.mjs";

test("Work Catalog filters follow counts, URL state and preview safety", { timeout: 150000 }, async (t) => {
  const browser = await openBrowser(t);
  const { send, evaluate } = browser;
  const base = browser.url;
  const snapshot = () =>
    evaluate(`(() => {
      const root = document.querySelector(".work-page");
      const chips = [...(root?.querySelectorAll(".work-chip") ?? [])];
      const categories = [...(root?.querySelectorAll(".work-category") ?? [])];
      const shown = categories.filter(section => !section.hidden);
      return {
        path: location.pathname, hash: location.hash, search: location.search,
        historyLength: history.length,
        chips: chips.map(button => ({
          id: button.dataset.filter, label: button.textContent.replace(/\\s+/g, " ").trim(),
          disabled: button.disabled, pressed: button.getAttribute("aria-pressed"),
        })),
        visibleCategoryIds: shown.map(section => section.dataset.category),
        visibleCards: shown.reduce((total, section) => total + section.querySelectorAll(".work-project-card").length, 0),
        totalCards: root?.querySelectorAll(".work-project-card").length ?? 0,
        unsafeCards: root?.querySelectorAll(".work-project-card a, .work-project-card button, .work-project-card[tabindex]").length ?? 0,
        unsafeMedia: root?.querySelectorAll("img, video, picture, iframe").length ?? 0,
      };
    })()`);
  const navigate = async (suffix) => {
    await send("Page.navigate", { url: base + suffix });
    await eventually(
      () => evaluate(`document.readyState === "complete" && !!document.querySelector(".work-page")`),
      Boolean,
      "Work did not mount"
    );
  };
  const selected = (state, id, expectedCount) => {
    assert.equal(state.chips.length, 6);
    assert.deepEqual(
      state.chips.filter((chip) => chip.pressed === "true").map((chip) => chip.id),
      [id]
    );
    assert.equal(state.visibleCards, expectedCount);
    assert.equal(state.totalCards, 30);
    assert.equal(state.unsafeCards, 0);
    assert.equal(state.unsafeMedia, 0);
    assert.ok(
      state.chips.every((chip) => !chip.disabled),
      "category buttons must be operable"
    );
    assert.equal(state.chips[0].label, "All 22");
  };
  const clickFilter = async (id, expectedCount) => {
    await evaluate(`document.querySelector('.work-chip[data-filter="${id}"]').click()`);
    const expectedVisible = id === "all" ? 5 : 1;
    await eventually(
      async () => {
        const state = await snapshot();
        return (
          state.visibleCards === expectedCount &&
          state.visibleCategoryIds.length === expectedVisible &&
          state.chips.find((chip) => chip.id === id)?.pressed === "true"
        );
      },
      Boolean,
      `Filter ${id} did not select`
    );
    return snapshot();
  };

  await navigate("/work.html");
  const initial = await snapshot();
  selected(initial, "all", 30);
  assert.deepEqual(initial.visibleCategoryIds, ["uiux", "branding", "social", "event", "ecommerce"]);
  const allSpacing = await evaluate(`(() => {
    const sections = document.querySelectorAll(".work-category");
    const branding = getComputedStyle(sections[1]);
    return { marginTop: branding.marginTop, borderTopWidth: branding.borderTopWidth };
  })()`);
  assert.equal(allSpacing.marginTop, "64px", "All keeps dividers between visible categories");
  assert.equal(allSpacing.borderTopWidth, "1px");
  for (const [id, count] of [
    ["uiux", 9],
    ["branding", 9],
    ["social", 5],
    ["event", 5],
    ["ecommerce", 2],
  ]) {
    const state = await clickFilter(id, count);
    selected(state, id, count);
    if (id === "branding") {
      const spacing = await evaluate(`(() => {
        const section = document.querySelector('.work-category[data-category="branding"]');
        const style = getComputedStyle(section);
        return { marginTop: style.marginTop, borderTopWidth: style.borderTopWidth };
      })()`);
      assert.equal(spacing.marginTop, "0px", "single visible filter must not retain hidden sibling spacing");
      assert.equal(spacing.borderTopWidth, "0px", "single visible filter must not show an orphan separator");
    }

    assert.equal(state.hash, `#${id}`);
    assert.equal(state.historyLength, initial.historyLength, "filter selection must replace, not push, history");
  }
  const reset = await clickFilter("all", 30);
  selected(reset, "all", 30);
  assert.equal(reset.hash, "");

  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const samples = [];
      window.__workHydrationTrace = samples;
      const capture = () => {
        const categories = [...document.querySelectorAll(".work-category")];
        if (categories.length !== 5) return;
        const visible = categories.filter(node => !node.hidden).map(node => node.dataset.category);
        if (samples.at(-1)?.visible.join("|") !== visible.join("|")) {
          samples.push({ ms: performance.now(), visible });
        }
      };
      new MutationObserver(capture).observe(document, {
        childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"]
      });
      document.addEventListener("DOMContentLoaded", capture);
    })();`,
  });
  await navigate("/work.html?from=qa#branding");
  await eventually(
    async () => (await snapshot()).visibleCategoryIds.join(",") === "branding",
    Boolean,
    "direct Branding hash did not hydrate"
  );
  selected(await snapshot(), "branding", 9);
  const hydration = await evaluate("window.__workHydrationTrace ?? []");
  const firstAll = hydration.find((frame) => frame.visible.length === 5);
  const firstBranding = hydration.find((frame) => frame.visible.join(",") === "branding");
  assert.ok(firstAll, `SSR All-first categories were never observed: ${JSON.stringify(hydration)}`);
  assert.ok(firstBranding && firstBranding.ms >= firstAll.ms, "hydration must select Branding after SSR All");
  t.diagnostic(`Direct #branding DOM All-first interval: ${Math.round(firstBranding.ms - firstAll.ms)}ms`);

  const preserved = await clickFilter("all", 30);
  assert.equal(preserved.search, "?from=qa");
  assert.equal(preserved.hash, "");

  await evaluate(`window.location.hash = "#event"`);
  await eventually(
    async () => (await snapshot()).visibleCategoryIds.join(",") === "event",
    Boolean,
    "native hashchange not reflected"
  );
  selected(await snapshot(), "event", 5);
  await evaluate(`(() => {
    history.replaceState(null, "", location.pathname + location.search + "#social");
    dispatchEvent(new PopStateEvent("popstate"));
  })()`);
  await eventually(
    async () => (await snapshot()).visibleCategoryIds.join(",") === "social",
    Boolean,
    "popstate not reflected"
  );
  selected(await snapshot(), "social", 5);

  await navigate("/work.html#unknown-category");
  await eventually(async () => (await snapshot()).visibleCards === 30, Boolean, "unknown hash did not fallback");
  const unknown = await snapshot();
  selected(unknown, "all", 30);
  assert.equal(unknown.hash, "#unknown-category", "unknown fragment should persist until selection");

  await navigate("/#work");
  await eventually(() => evaluate(`!!document.querySelector(".work-page")`), Boolean, "root Work did not mount");
  const root = await clickFilter("branding", 9);
  assert.equal(root.path, "/");
  assert.equal(root.hash, "#work", "root preview hash must remain owned by PreviewSwitch");
  const focus = await evaluate(`(() => {
    const button = document.querySelector('.work-chip[data-filter="event"]');
    button.focus();
    return { focused: document.activeElement === button, disabled: button.disabled };
  })()`);
  assert.deepEqual(focus, { focused: true, disabled: false });
});
