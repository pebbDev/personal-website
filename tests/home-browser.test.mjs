import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { eventually, openBrowser } from "./browser-helper.mjs";

test("Home Hero orbit in real Chrome", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  const { send, evaluate, resize, motion } = browser;
  const pose = () => evaluate(`Array.from(document.querySelectorAll('.home-hero-card'), card => card.style.transform)`);
  const requireCards = async () =>
    assert.equal(
      await evaluate(`document.querySelectorAll('.home-hero-card').length`),
      16,
      "Hero must render 16 generic orbit slots"
    );
  await resize(1440);
  await motion("reduce");
  await send("Page.navigate", { url: `${browser.url}/#home` });
  await eventually(() => evaluate(`!!document.querySelector('#hero h1')`), Boolean, "Hero did not load");
  await delay(500);

  await t.test("renders inert generic slots, copy, real Contact CTA and layered fades", async () => {
    await browser.screenshot("before-or-after-1440.png");
    await requireCards();
    const dom = await evaluate(`(() => {
      const hero = document.querySelector('#hero');
      const copy = hero.querySelector('.home-hero-copy');
      return {
        labels: Array.from(hero.querySelectorAll('.home-hero-card'), card => card.textContent.trim()),
        headings: hero.querySelectorAll('h1').length,
        description: !!copy?.querySelector('p')?.textContent.trim(),
        links: Array.from(hero.querySelectorAll('a'), a => a.getAttribute('href')),
        contact: !!document.querySelector('#contact'),
        unsafe: hero.querySelectorAll('.home-hero-card a, .home-hero-card button, .home-hero-card[tabindex], img, video').length,
        fades: Array.from(hero.querySelectorAll('.home-hero-fade'), fade => ({ hidden: fade.getAttribute('aria-hidden'), events: getComputedStyle(fade).pointerEvents, z: +getComputedStyle(fade).zIndex, background: getComputedStyle(fade).backgroundImage })),
        copyZ: copy && +getComputedStyle(copy).zIndex,
      };
    })()`);
    assert.deepEqual(
      dom.labels,
      Array.from({ length: 16 }, (_, i) => `Project study ${String(i + 1).padStart(2, "0")}`)
    );
    assert.equal(dom.headings, 1);
    assert.equal(dom.description, true);
    assert.deepEqual(dom.links, ["#contact"]);
    assert.equal(dom.contact, true);
    assert.equal(dom.unsafe, 0);
    assert.equal(dom.fades.length, 3);
    dom.fades.forEach((fade) => {
      assert.equal(fade.hidden, "true");
      assert.equal(fade.events, "none");
      assert.ok(fade.background.includes("linear-gradient"));
      assert.ok(dom.copyZ > fade.z);
    });

    const initialDark = await evaluate(`document.documentElement.classList.contains('dark')`);
    const contrastSamples = [];
    try {
      for (const theme of ["light", "dark"]) {
        if ((await evaluate(`document.documentElement.classList.contains('dark')`)) !== (theme === "dark")) {
          await evaluate(`document.querySelector('.theme-toggle').click()`);
        }
        await eventually(
          () => evaluate(`document.documentElement.classList.contains('dark')`),
          (dark) => dark === (theme === "dark"),
          `Theme did not become ${theme}`
        );
        for (const width of [390, 1440]) {
          await resize(width);
          for (const state of ["rest", "word-0", "word-1"]) {
            const point = await evaluate(`(() => {
              const word = document.querySelectorAll('.home-hero-word')[${state === "word-1" ? 1 : 0}];
              const rect = word.getBoundingClientRect();
              return ${state === "rest" ? "{ x: 1, y: 1 }" : "{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }"};
            })()`);
            await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
            const sample = await evaluate(`(() => {
              const title = document.querySelector('.home-hero-title');
              const canvas = document.createElement('canvas');
              canvas.width = canvas.height = 1;
              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              const rgb = color => {
                ctx.clearRect(0, 0, 1, 1);
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 1, 1);
                return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3);
              };
              const luminance = channels => channels.map(c => {
                const s = c / 255;
                return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
              }).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
              const background = rgb(getComputedStyle(document.body).backgroundColor);
              const bg = luminance(background);
              return {
                fontSize: parseFloat(getComputedStyle(title).fontSize),
                background,
                words: Array.from(title.querySelectorAll('.home-hero-word'), word => {
                  const foreground = rgb(getComputedStyle(word).color);
                  const fg = luminance(foreground);
                  return { foreground, contrast: (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05), hovered: word.matches(':hover') };
                }),
              };
            })()`);
            contrastSamples.push({ theme, width, state, ...sample });
            t.diagnostic(`heading contrast ${JSON.stringify(contrastSamples.at(-1))}`);
          }
        }
      }
    } finally {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1, y: 1 });
      if ((await evaluate(`document.documentElement.classList.contains('dark')`)) !== initialDark) {
        await evaluate(`document.querySelector('.theme-toggle').click()`);
      }
      await resize(1440);
    }
    for (const { theme, width, state, fontSize, words } of contrastSamples) {
      assert.ok(fontSize >= 24, `Large-text threshold at ${width}`);
      words.forEach(({ contrast, hovered }, index) => {
        assert.equal(hovered, state === `word-${index}`, `Actual hover state at ${theme}/${width}/${state}`);
        assert.ok(
          contrast >= 3,
          `Heading contrast ${contrast.toFixed(4)}:1 at ${theme}/${width}/${state}/word-${index}; requires >=3:1`
        );
      });
    }
  });

  await t.test("source geometry, aspect and CSS inclusivity survive viewport resizing without overflow", async () => {
    await requireCards();
    for (const width of [390, 639, 640, 641, 768, 900, 901, 999, 1000, 1020, 1021, 1440]) {
      await resize(width);
      await eventually(
        () =>
          evaluate(`(() => {
          const copy = document.querySelector('.home-hero-copy');
          const card = document.querySelectorAll('.home-hero-card')[4];
          const style = getComputedStyle(card);
            const topCard = document.querySelector('.home-hero-card');
          return {
            size: parseFloat(style.width),
            gap: new DOMMatrix(style.transform).m42 - (copy.offsetTop + copy.offsetHeight / 2 - parseFloat(style.height) / 2),
              gapX: new DOMMatrix(getComputedStyle(topCard).transform).m41 - (${width} / 2 - parseFloat(style.width) / 2),
            minHeight: parseFloat(getComputedStyle(document.querySelector('#hero')).minHeight),
          };
        })()`),
        (value) =>
          value.size === (width < 640 ? 96 : width < 1000 ? 120 : 140) &&
          Math.abs(value.gap) < 0.11 &&
          Math.abs(value.gapX) < 0.11 &&
          value.minHeight === (width <= 640 ? 600 : 660),
        `Responsive orbit did not settle at ${width}`,
        2000
      );
      const metrics = await evaluate(`(() => {
        const hero = document.querySelector('#hero');
        const copy = hero.querySelector('.home-hero-copy');
        const cards = Array.from(hero.querySelectorAll('.home-hero-card'));
        return {
          width: hero.clientWidth, height: hero.clientHeight,
          minHeight: parseFloat(getComputedStyle(hero).minHeight),
          padding: getComputedStyle(hero).padding,
          copyY: copy.offsetTop + copy.offsetHeight / 2,
          margin: parseFloat(getComputedStyle(copy).marginTop),
          titleSize: parseFloat(getComputedStyle(hero.querySelector('h1')).fontSize),
          fadeWidth: hero.querySelector('.home-hero-fade').getBoundingClientRect().width,
          overflow: document.documentElement.scrollWidth > innerWidth,
          cards: cards.map(card => ({ width: parseFloat(getComputedStyle(card).width), height: parseFloat(getComputedStyle(card).height), matrix: Array.from(new DOMMatrix(getComputedStyle(card).transform).toFloat64Array()), opacity: +getComputedStyle(card).opacity, visibility: getComputedStyle(card).visibility })),
        };
      })()`);
      assert.equal(metrics.width, width);
      assert.equal(metrics.height, 900);
      assert.equal(metrics.minHeight, width <= 640 ? 600 : 660, `CSS minimum height at ${width}`);
      assert.equal(metrics.padding, "0px");
      assert.equal(metrics.margin, width <= 640 ? 162 : 198);
      assert.ok(Math.abs(metrics.titleSize - Math.max(36, Math.min(64, width * 0.05))) < 0.01);
      assert.ok(Math.abs(metrics.fadeWidth - width * (width <= 640 ? 0.16 : 0.24)) < 0.1);
      assert.equal(metrics.overflow, false, `horizontal overflow at ${width}`);
      t.diagnostic(
        `viewport ${width}: cardSize=${metrics.cards[0].width}, copyY=${metrics.copyY}, cardY=${metrics.cards[4].matrix[13]}, cardHeight=${metrics.cards[4].height}, overflow=${metrics.overflow}`
      );
      assert.equal(new Set(metrics.cards.map(({ matrix }) => `${matrix[12]},${matrix[13]}`)).size, 16);
      metrics.cards.forEach((card) => assert.ok(Math.abs(card.width / card.height - 360 / 389) < 0.001));
      // Independent cardinal observations at a static phase, not expected values from the geometry helper.
      assert.ok(Math.abs(metrics.cards[0].matrix[12] - (width / 2 - metrics.cards[0].width / 2)) < 0.11);
      assert.ok(
        Math.abs(metrics.cards[4].matrix[13] - (metrics.copyY - metrics.cards[4].height / 2)) < 0.11,
        `card/copy center at ${width}`
      );
      assert.equal(metrics.cards[0].opacity, 1);
      assert.equal(metrics.cards[8].visibility, "hidden");
      if ([390, 768, 1440].includes(width)) await browser.screenshot(`hero-${width}.png`);
    }
    for (const [width, height, expected] of [
      [390, 500, 600],
      [640, 500, 600],
      [641, 500, 660],
      [1440, 1000, 900],
    ]) {
      await resize(width, height);
      await eventually(
        () => evaluate(`document.querySelector('#hero').clientHeight`),
        (value) => value === expected,
        `Hero height at ${width}x${height}`
      );
    }
  });

  await t.test(
    "reduced motion stays static across time/scroll and preference toggles restart exactly one loop",
    async () => {
      await requireCards();
      await resize(1440);
      await evaluate(`scrollTo({top:0, behavior:'instant'})`);
      await delay(100);
      const still = await pose();
      await delay(200);
      assert.deepEqual(await pose(), still);
      await evaluate(`scrollTo({top:200, behavior:'instant'})`);
      await delay(200);
      assert.deepEqual(await pose(), still, "Reduced motion must ignore scroll phase");
      await motion("no-preference");
      await eventually(pose, (current) => JSON.stringify(current) !== JSON.stringify(still), "Motion did not resume");
      await delay(100);
      assert.equal(await evaluate(`window.__orbitProbe.pending.size`), 1);
      await motion("reduce");
      await delay(100);
      const reset = await pose();
      await delay(200);
      assert.deepEqual(await pose(), reset);
      assert.deepEqual(reset, still, "Static layout must reset phase, including accumulated drift");
      assert.equal(await evaluate(`window.__orbitProbe.pending.size`), 0);
    }
  );

  await t.test("scroll drives phase beyond idle drift; offscreen ring suspends RAF and resumes once", async () => {
    await requireCards();
    await motion("no-preference");
    await evaluate(`scrollTo({top:0, behavior:'instant'})`);
    // Let the source's .12 eased scroll settle from the preceding reduced-motion case.
    await delay(1000);
    const angle = () =>
      evaluate(
        `(() => { const m = new DOMMatrix(getComputedStyle(document.querySelector('.home-hero-card')).transform); return Math.atan2(m.b,m.a)*180/Math.PI; })()`
      );
    const before = await angle();
    await delay(200);
    const idle = await angle();
    assert.ok(idle > before, `Idle drift must advance: ${before} -> ${idle}`);
    await evaluate(`scrollTo({top:240, behavior:'instant'})`);
    await delay(400);
    const scrolled = await angle();
    assert.ok(scrolled - idle > 8, "Scroll must contribute phase beyond slow idle drift");
    await evaluate(`scrollTo({top:1600, behavior:'instant'})`);
    await delay(200);
    const offscreen = await pose();
    const calls = await evaluate(`window.__orbitProbe.calls`);
    await delay(200);
    assert.deepEqual(await pose(), offscreen);
    assert.equal(await evaluate(`window.__orbitProbe.calls`), calls);
    assert.equal(await evaluate(`window.__orbitProbe.pending.size`), 0);
    await evaluate(`scrollTo({top:0, behavior:'instant'})`);
    await eventually(
      pose,
      (value) => JSON.stringify(value) !== JSON.stringify(offscreen),
      "Orbit did not resume onscreen"
    );
    assert.equal(await evaluate(`window.__orbitProbe.pending.size`), 1);
  });

  await t.test("keyboard reaches visible CTA, activates Contact, and preview unmount cancels animation", async () => {
    await requireCards();
    for (let tab = 0; tab < 12; tab++) {
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
      if (await evaluate(`document.activeElement.matches('#hero a')`)) break;
    }
    assert.equal(await evaluate(`document.activeElement.matches('#hero a:focus-visible')`), true);
    assert.equal(await evaluate(`getComputedStyle(document.activeElement).outlineStyle`), "solid");
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
    await eventually(
      () => evaluate(`location.hash`),
      (value) => value === "#contact",
      "CTA did not reach Contact"
    );
    await evaluate(
      `window.__removedCards = Array.from(document.querySelectorAll('.home-hero-card')); location.hash = '#meet-me'`
    );
    await eventually(
      () => evaluate(`document.querySelector('#hero') === null`),
      Boolean,
      "Preview did not unmount Hero"
    );
    await delay(150);
    const removed = await evaluate(`window.__removedCards.map(card => card.style.transform)`);
    await resize(999);
    await motion("reduce");
    await motion("no-preference");
    await evaluate(`dispatchEvent(new Event('resize')); dispatchEvent(new Event('scroll'))`);
    await delay(150);
    assert.deepEqual(await evaluate(`window.__removedCards.map(card => card.style.transform)`), removed);
    assert.equal(await evaluate(`window.__orbitProbe.pending.size`), 0);
    await evaluate(`location.hash = '#home'; scrollTo({top:0, behavior:'instant'})`);
    await eventually(
      () => evaluate(`document.querySelectorAll('.home-hero-card').length`),
      (value) => value === 16,
      "Hero did not remount"
    );
    await eventually(
      () => evaluate(`window.__orbitProbe.pending.size`),
      (value) => value === 1,
      "Remount must start one loop"
    );
    await delay(200);
    assert.equal(await evaluate(`window.__orbitProbe.pending.size`), 1);
  });
  assert.deepEqual(browser.exceptions, [], "No runtime exceptions");
});
