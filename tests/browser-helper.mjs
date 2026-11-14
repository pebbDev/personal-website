import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

export async function eventually(read, accepts, message, timeout = 10000) {
  const deadline = Date.now() + timeout;
  let value;
  do {
    value = await read();
    if (accepts(value)) return value;
    await delay(50);
  } while (Date.now() < deadline);
  throw new Error(`${message}; last value: ${JSON.stringify(value)}`);
}

async function freePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function stop(child) {
  if (!child?.pid || child.exitCode !== null) return;
  const exited = once(child, "exit");
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true });
  } else {
    child.kill("SIGTERM");
  }
  await Promise.race([exited, delay(5000, undefined, { ref: false })]);
}

// Shared Node24/native-WebSocket CDP harness. No browser packages or remote services.
export async function openBrowser(t) {
  const agentContract = await readFile("AGENTS.md", "utf8");
  const profile = await mkdtemp(join(tmpdir(), "per15-chrome-"));
  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  let server;
  let chrome;
  let socket;
  let generatedContract;
  let output = "";
  const pending = new Map();
  t.after(async () => {
    socket?.close();
    for (const { reject, timer } of pending.values()) {
      clearTimeout(timer);
      reject(new Error("CDP session closed"));
    }
    await stop(chrome);
    await stop(server);
    if (dirname(profile) !== resolve(tmpdir()) || !basename(profile).startsWith("per15-chrome-")) {
      throw new Error("Refusing to remove an unexpected Chrome profile path");
    }
    await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    // next dev appends its docs pointer. Remove only that generated suffix;
    // preserve the owner's exact contract and any concurrent edits.
    const currentContract = await readFile("AGENTS.md", "utf8");
    const prefix = agentContract.trimEnd();
    if (
      !agentContract.includes("<!-- BEGIN:nextjs-agent-rules -->") &&
      currentContract === generatedContract &&
      currentContract.startsWith(prefix) &&
      /^\s*<!-- BEGIN:nextjs-agent-rules -->[\s\S]*<!-- END:nextjs-agent-rules -->\s*$/.test(
        currentContract.slice(prefix.length)
      )
    )
      await writeFile("AGENTS.md", agentContract);
  });
  const launch = (command, args) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", (error) => {
      output += `\n${error.stack}`;
    });
    return child;
  };
  server = launch(process.execPath, [
    resolve("node_modules/next/dist/bin/next"),
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ]);
  await eventually(
    async () => {
      try {
        return (await fetch(url)).status;
      } catch {
        return output;
      }
    },
    (value) => value === 200,
    "Local Next server unavailable",
    60000
  );
  generatedContract = await readFile("AGENTS.md", "utf8");

  const executable =
    process.env.CHROME_PATH ||
    (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : "google-chrome");
  chrome = launch(executable, [
    "--headless=new",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    "--remote-debugging-address=127.0.0.1",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--disable-extensions",
    "about:blank",
  ]);
  const debugPort = await eventually(
    async () => {
      try {
        return Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]);
      } catch {
        return output;
      }
    },
    (value) => typeof value === "number" && value > 0,
    "Chrome CDP unavailable",
    15000
  );
  const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
  socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
  await once(socket, "open");
  let id = 0;
  const exceptions = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails);
    if (!message.id) return;
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const requestId = ++id;
      const timer = setTimeout(() => {
        pending.delete(requestId);
        reject(new Error(`CDP timed out: ${method}`));
      }, 15000);
      pending.set(requestId, { resolve, reject, timer });
      socket.send(JSON.stringify({ id: requestId, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
    (() => {
      const request = window.requestAnimationFrame.bind(window);
      const cancel = window.cancelAnimationFrame.bind(window);
      const pending = new Set();
      window.__orbitProbe = { pending, calls: 0 };
      window.requestAnimationFrame = (callback) => {
        const id = request((now) => {
          pending.delete(id);
          window.__orbitProbe.calls++;
          callback(now);
        });
        pending.add(id);
        return id;
      };
      window.cancelAnimationFrame = (id) => { pending.delete(id); cancel(id); };
    })();
  `,
  });
  const resize = async (width, height = 900) => {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    // CDP's reply can precede resize/media-query delivery in the renderer.
    await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`);
  };
  const motion = (value) =>
    send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value }] });
  const screenshot = async (name) => {
    if (!process.env.HOME_BROWSER_EVIDENCE) return;
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(process.env.HOME_BROWSER_EVIDENCE, name), Buffer.from(data, "base64"));
  };
  t.diagnostic(`Node ${process.version}; ${(await send("Browser.getVersion")).product}; Next localhost only`);
  return { send, evaluate, resize, motion, screenshot, exceptions, url };
}
