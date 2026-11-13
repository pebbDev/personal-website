/**
 * Optional private-browser QA. Requires local Chrome.
 * Captures source and implementation screenshots outside Git, never uploads them.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = path.join(tmpdir(), `per14-chrome-${process.pid}`);
const output = process.env.PER14_EVIDENCE ?? "D:/Personal-Website/evidence/PER-14";
const port = 9331;
await mkdir(output, { recursive: true });
const child = spawn(
  chrome,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--disable-gpu",
    "--hide-scrollbars",
    "--remote-allow-origins=*",
    "about:blank",
  ],
  { stdio: "ignore" }
);
let ws;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  let target;
  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json`);
      const tabs = await response.json();
      target = tabs.find((tab) => tab.type === "page");
      if (target) break;
    } catch {
      // The browser debugging port may not be ready during startup.
    }
    await sleep(200);
  }
  assert.ok(target, "Chrome remote debugging did not become ready");
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  const pending = new Map();
  const clientErrors = [];
  let id = 0;
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.method === "Runtime.consoleAPICalled" && msg.params?.type === "error") {
      clientErrors.push((msg.params.args ?? []).map((a) => a.value ?? a.description ?? "").join(" "));
    }
    if (!msg.id) return;
    const next = pending.get(msg.id);
    if (next) {
      pending.delete(msg.id);
      msg.error ? next.reject(new Error(JSON.stringify(msg.error))) : next.resolve(msg.result);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const current = ++id;
      pending.set(current, { resolve, reject });
      ws.send(JSON.stringify({ id: current, method, params }));
    });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await send("Page.enable");
  await send("Runtime.enable");
  const report = [];
  for (const [name, origin] of [
    ["source", "http://127.0.0.1:8123"],
    ["target", "http://127.0.0.1:3104"],
  ]) {
    for (const [width, height] of [
      [390, 844],
      [820, 1180],
      [900, 900],
      [901, 900],
      [1024, 768],
      [1440, 900],
    ]) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await send("Page.navigate", { url: origin + (name === "source" ? "/index.html" : "/") });
      await sleep(name === "source" ? 900 : 1400);
      const state = await evaluate(`(() => {
        const nav = document.querySelector('.topnav');
        const wrap = document.querySelector('.topnav__in');
        const pill = document.querySelector('.pill');
        if(!nav || !wrap || !pill) return {error:'nav missing'};
        const r = nav.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        const p = pill.getBoundingClientRect();
        return { viewport: innerWidth, top: Math.round(r.top), bottom: Math.round(r.bottom),
          wrapWidth: Math.round(w.width), pillWidth: Math.round(p.width),
          h1: document.querySelector('h1')?.textContent?.slice(0,60),
          active: document.querySelector('.pill [aria-current="page"]')?.textContent?.trim(),
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth+1
        };
      })()`);
      assert.ok(!state.error, `${name} nav ${width}`);
      assert.equal(state.horizontalOverflow, false, `${name} overflow ${width}`);
      if (name === "target") {
        assert.equal(state.active, "Come In", `active home ${width}`);
        assert.ok(
          width <= 900 ? state.top > height / 2 : Math.abs(state.top - 16) <= 1,
          `position at ${width}: ${JSON.stringify(state)}`
        );
      }
      const screenshot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      await writeFile(path.join(output, `${name}-home-${width}.png`), Buffer.from(screenshot.data, "base64"));
      report.push({ name, width, ...state });
    }
  }
  for (const width of [390, 820, 900, 901, 1024, 1440]) {
    const source = report.find((item) => item.name === "source" && item.width === width);
    const target = report.find((item) => item.name === "target" && item.width === width);
    assert.ok(Math.abs(source.wrapWidth - target.wrapWidth) <= 3, `navbar container width mismatch at ${width}`);
    assert.ok(Math.abs(source.pillWidth - target.pillWidth) <= 3, `pill width mismatch at ${width}`);
  }
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:3104/" });
  await sleep(1300);
  await evaluate('window.location.hash = "#work"');
  await sleep(200);
  assert.equal(await evaluate("document.querySelector('.pill [aria-current=page]')?.textContent?.trim()"), "My Lab");
  await evaluate("document.body.style.minHeight='200vh';window.scrollTo(0,180)");
  await sleep(250);
  assert.equal(await evaluate("document.querySelector('.topnav')?.classList.contains('compact')"), true);
  await evaluate("document.querySelector('.pill a[href=\"#meet-me\"]').click()");
  await sleep(1000);
  assert.equal(await evaluate("location.pathname"), "/");
  assert.equal(await evaluate("location.hash"), "#meet-me");
  assert.equal(await evaluate("document.querySelector('.pill [aria-current=page]')?.textContent?.trim()"), "Meet Me");
  await evaluate("history.back()");
  await sleep(350);
  assert.equal(await evaluate("location.hash"), "#work");
  assert.equal(await evaluate("document.querySelector('.page-placeholder h1')?.textContent"), "My Lab");
  await evaluate("history.forward()");
  await sleep(350);
  assert.equal(await evaluate("location.hash"), "#meet-me");
  assert.equal(await evaluate("document.querySelector('.page-placeholder h1')?.textContent"), "Meet Me");
  // Owner-approved next-themes integration: persistent class-based theme without new routes.
  const themeState = () =>
    evaluate(`(() => {
      const button = document.querySelector('.theme-toggle');
      const pill = document.querySelector('.pill ul');
      return {
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        background: getComputedStyle(document.body).backgroundColor,
        pill: getComputedStyle(pill).backgroundColor,
        label: button?.getAttribute('aria-label'),
        pressed: button?.getAttribute('aria-pressed'),
        saved: localStorage.getItem('personal-website-theme'),
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
      };
    })()`);
  const initialTheme = await themeState();
  assert.equal(initialTheme.theme, "light");
  assert.equal(initialTheme.background, "rgb(255, 255, 255)");
  assert.equal(initialTheme.label, "Switch to dark mode");
  // OS dark preference must not override the Website-Clone default light palette.
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
  await send("Page.navigate", { url: "http://127.0.0.1:3104/" });
  await sleep(1100);
  assert.equal((await themeState()).theme, "light");
  await send("Emulation.setEmulatedMedia", { features: [] });

  await evaluate("document.querySelector('.theme-toggle').click()");
  await sleep(350);
  const darkTheme = await themeState();
  assert.equal(darkTheme.theme, "dark");
  assert.equal(darkTheme.background, "rgb(16, 17, 20)");
  assert.equal(darkTheme.label, "Switch to light mode");
  assert.equal(darkTheme.pressed, "true");
  assert.equal(darkTheme.saved, "dark");
  assert.notEqual(darkTheme.pill, initialTheme.pill);
  const darkDesktop = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(output, "target-dark-home-1440.png"), Buffer.from(darkDesktop.data, "base64"));

  await send("Page.navigate", { url: "http://127.0.0.1:3104/#work" });
  await sleep(1300);
  assert.equal((await themeState()).theme, "dark");
  assert.equal(await evaluate("document.querySelector('.page-placeholder h1')?.textContent"), "My Lab");

  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await sleep(200);
  assert.equal((await themeState()).overflow, false);
  assert.ok(await evaluate("document.querySelector('.theme-toggle').getBoundingClientRect().top > innerHeight / 2"));
  const darkMobile = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(output, "target-dark-home-390.png"), Buffer.from(darkMobile.data, "base64"));

  // Native keyboard activation should switch the theme exactly like a pointer click.
  await send("Page.bringToFront");
  await evaluate("document.querySelector('.theme-toggle').focus()");
  assert.equal(await evaluate("document.activeElement?.classList.contains('theme-toggle')"), true);
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
    text: "\r",
    unmodifiedText: "\r",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13,
  });
  await sleep(350);
  const restoredLight = await themeState();
  assert.equal(restoredLight.theme, "light");
  assert.equal(restoredLight.background, "rgb(255, 255, 255)");
  assert.equal(restoredLight.saved, "light");
  await send("Page.navigate", { url: "http://127.0.0.1:3104/" });
  await sleep(1100);
  assert.equal((await themeState()).theme, "light");

  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  assert.equal(await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"), true);
  assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), "auto");
  await send("Emulation.setEmulatedMedia", { features: [] });
  assert.deepEqual(
    clientErrors.filter((error) => /hydration|did not match|server rendered HTML/i.test(error)),
    [],
    "No hydration mismatch errors are expected"
  );
  console.log(
    JSON.stringify(
      {
        cases: report.length + 5,
        report,
        workActive: true,
        scrollCompact: true,
        linkNavigation: true,
        screenshotDirectory: output,
      },
      null,
      2
    )
  );
} finally {
  ws?.close();
  child.kill();
  await rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 }).catch(() => {});
}
