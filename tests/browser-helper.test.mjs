import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { openBrowser } from "./browser-helper.mjs";

const original = "# Owner contract\r\nKeep owner instructions.\r\n\r\n";
const footer = "\n\n<!-- BEGIN:nextjs-agent-rules -->\nGenerated docs pointer.\n<!-- END:nextjs-agent-rules -->\n";

// Exercise the real startup/after-hook path and real files without running Next
// or ever writing the repository's AGENTS.md. Startup health/time are faked;
// child processes and cleanup are real.
async function failedStartup(t, { generated = true, edit, cleanupFailure = false } = {}) {
  const cwd = process.cwd();
  const fixture = await mkdtemp(join(tmpdir(), "per15-helper-test-"));
  const previousTemp = { TEMP: process.env.TEMP, TMP: process.env.TMP, TMPDIR: process.env.TMPDIR };
  let cleanup;
  try {
    process.chdir(fixture);
    // Keep the Chrome profile inside this fixture, including when its cleanup fails.
    for (const key of Object.keys(previousTemp)) process.env[key] = fixture;
    await writeFile("AGENTS.md", original);
    await mkdir("node_modules/next/dist/bin", { recursive: true });
    await writeFile("node_modules/next/dist/bin/next", "// No-op startup fixture.\n");
    let clock = 0;
    t.mock.method(Date, "now", () => (clock += 60001));
    t.mock.method(globalThis, "fetch", async () => {
      if (generated) await writeFile("AGENTS.md", original.trimEnd() + footer);
      throw new Error("Simulated startup health failure");
    });
    await assert.rejects(openBrowser({ after: (hook) => (cleanup = hook) }), /Local Next server unavailable/);
    t.mock.restoreAll();
    const before = await readFile("AGENTS.md", "utf8");
    if (edit) await writeFile("AGENTS.md", edit(before));
    if (cleanupFailure) {
      // Trigger the existing profile safety guard before AGENTS restoration.
      for (const key of Object.keys(previousTemp)) process.env[key] = cwd;
      await assert.rejects(cleanup(), /Refusing to remove an unexpected Chrome profile path/);
    } else {
      await cleanup();
    }
    return await readFile("AGENTS.md", "utf8");
  } finally {
    t.mock.restoreAll();
    process.chdir(cwd);
    for (const [key, value] of Object.entries(previousTemp)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    assert.equal(join(tmpdir(), fixture.split(/[\\/]/).at(-1)), fixture);
    await rm(fixture, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
}

test("removes the generated suffix after health fails before startup completes", async (t) => {
  assert.equal(await failedStartup(t), original);
});

test("restores the contract even when an earlier cleanup step throws", async (t) => {
  assert.equal(await failedStartup(t, { cleanupFailure: true }), original);
});

test("preserves concurrent owner edits to the original contract", async (t) => {
  const edit = (text) => text.replace("Keep owner instructions.", "Keep updated owner instructions.");
  assert.equal(await failedStartup(t, { edit }), edit(original.trimEnd() + footer));
});

test("preserves concurrent owner additions after the generated suffix", async (t) => {
  const edit = (text) => text + "\nOwner addition.\n";
  assert.equal(await failedStartup(t, { edit }), edit(original.trimEnd() + footer));
});

test("preserves concurrent edits inside the generated block after startup fails", async (t) => {
  const edit = (text) => text.replace("Generated docs pointer.", "Owner annotation.");
  assert.equal(await failedStartup(t, { edit }), edit(original.trimEnd() + footer));
});

test("leaves the exact original bytes alone when no suffix was generated", async (t) => {
  assert.equal(await failedStartup(t, { generated: false }), original);
});
