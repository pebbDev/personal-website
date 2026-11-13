#!/usr/bin/env node
// PER-21: private Preview only. Never run the destructive preparation step on a developer checkout.
import { lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const MANIFEST = "preview-asset-manifest.json";
const QUARANTINE = "preview-asset-quarantine";
const TEXT_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".css",
  ".scss",
  ".html",
  ".json",
  ".txt",
  ".svg",
  ".xml",
  ".map",
]);
const HAS_LEGACY_URL = /(?:\/assets\/|["'(\s]assets\/|%2fassets%2f|\\u002fassets\\u002f)/i;
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

function assert(condition, message) {
  if (!condition) throw new Error("Preview asset gate: " + message);
}

function statOrNull(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function isInside(base, child) {
  const rel = relative(base, child);
  return rel === "" || (rel !== ".." && !rel.startsWith(".." + sep) && !isAbsolute(rel));
}

function walk(root, relativePrefix = "") {
  const item = statOrNull(root);
  if (!item) return [];
  assert(!item.isSymbolicLink(), "symbolic links are not allowed");
  assert(item.isDirectory(), "expected a directory");
  const files = [];
  for (const name of readdirSync(root).sort()) {
    const abs = join(root, name);
    const rel = relativePrefix ? relativePrefix + "/" + name : name;
    const stat = lstatSync(abs);
    assert(!stat.isSymbolicLink(), "symbolic links are not allowed");
    if (stat.isDirectory()) {
      files.push(...walk(abs, rel));
    } else {
      assert(stat.isFile(), "only regular files are allowed");
      files.push({ abs, rel: rel.replaceAll("\\", "/"), size: stat.size });
    }
  }
  return files;
}

function assertSha(sha) {
  assert(typeof sha === "string" && /^[0-9a-f]{40}$/i.test(sha), "invalid commit SHA");
}

function validatePaths({ workspace, runnerTemp }) {
  assert(typeof workspace === "string" && typeof runnerTemp === "string", "missing workspace/temp directories");
  const w = realpathSync(workspace);
  const t = realpathSync(runnerTemp);
  assert(w !== t && !isInside(w, t) && !isInside(t, w), "runner temp must be outside workspace");
  assert(lstatSync(workspace).isDirectory() && lstatSync(runnerTemp).isDirectory(), "expected directories");
  return { workspace: w, runnerTemp: t };
}

export function assertCiContext(options, env = process.env) {
  const paths = validatePaths(options);
  assertSha(options.sha);
  assert(env.CI === "true" && env.GITHUB_ACTIONS === "true", "GitHub Actions CI environment required");
  assert(env.RUNNER_ENVIRONMENT === "github-hosted", "GitHub-hosted ephemeral runner required");
  assert(
    env.GITHUB_WORKSPACE &&
      env.RUNNER_TEMP &&
      realpathSync(env.GITHUB_WORKSPACE) === paths.workspace &&
      realpathSync(env.RUNNER_TEMP) === paths.runnerTemp,
    "GitHub Actions workspace/temp mismatch"
  );
  assert(env.GITHUB_SHA === options.sha, "commit SHA mismatch");
  return paths;
}

function context(options) {
  if (options.fixtureMode === true) {
    // Unit tests may operate only on throwaway synthetic fixtures, never on a real checkout.
    const paths = validatePaths(options);
    const fixtureParent = dirname(paths.workspace);
    assert(
      basename(paths.workspace) === "workspace" &&
        basename(paths.runnerTemp) === "runner-temp" &&
        fixtureParent === dirname(paths.runnerTemp) &&
        basename(fixtureParent).startsWith("pw-gate-") &&
        isInside(realpathSync(tmpdir()), fixtureParent),
      "fixture mode requires synthetic temporary workspace"
    );
    assertSha(options.sha);
    return paths;
  }
  return assertCiContext(options);
}

function isTextFile(file) {
  const lastDot = file.lastIndexOf(".");
  const ext = lastDot < 0 ? "" : file.slice(lastDot).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

function scanReferences(workspace) {
  const roots = [
    join(workspace, "src"),
    join(workspace, "next.config.mjs"),
    join(workspace, "next.config.js"),
    join(workspace, "tailwind.config.ts"),
    join(workspace, "tailwind.config.js"),
    join(workspace, "postcss.config.mjs"),
    join(workspace, "postcss.config.js"),
  ];
  for (const root of roots) {
    const stat = statOrNull(root);
    if (!stat) continue;
    assert(!stat.isSymbolicLink(), "source symlink is forbidden");
    const paths = stat.isDirectory() ? walk(root).map((x) => x.abs) : [root];
    for (const file of paths) {
      if (!isTextFile(file)) continue;
      const text = readFileSync(file, "utf8");
      assert(!HAS_LEGACY_URL.test(text), "source still references forbidden public assets");
    }
  }
}

export function prepareWorkspace(options) {
  const paths = context(options);
  const { workspace, runnerTemp } = paths;
  const publicPath = join(workspace, "public");
  const quarantine = join(runnerTemp, QUARANTINE);
  const manifestPath = join(runnerTemp, MANIFEST);

  assert(!statOrNull(quarantine) && !statOrNull(manifestPath), "quarantine/manifest already exists");
  assert(!statOrNull(join(workspace, ".vercel", "output")), "unexpected pre-existing Vercel output");
  scanReferences(workspace);
  const publicStat = statOrNull(publicPath);
  const entries = [];
  if (publicStat) {
    assert(publicStat.isDirectory() && !publicStat.isSymbolicLink(), "public must be an ordinary directory");
    for (const file of walk(publicPath)) {
      const bytes = readFileSync(file.abs);
      entries.push({ path: file.rel, size: file.size, sha256: sha256(bytes) });
    }
  }

  mkdirSync(quarantine, { recursive: false });
  if (publicStat) {
    // Runs only on a GitHub-hosted ephemeral workspace. Git index and repository history are untouched.
    renameSync(publicPath, join(quarantine, "public"));
  }
  const manifest = {
    formatVersion: 1,
    workspace,
    sha: options.sha,
    entries,
  };
  writeFileSync(manifestPath, JSON.stringify(manifest), { flag: "wx", mode: 0o600 });
  console.log("Preview prepare: " + entries.length + " public files quarantined on CI runner.");
  return { quarantinedFiles: entries.length };
}

export function verifyArtifact(options) {
  const paths = context(options);
  const { workspace, runnerTemp } = paths;
  const manifestPath = join(runnerTemp, MANIFEST);
  assert(statOrNull(manifestPath)?.isFile(), "preparation manifest missing");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert(manifest.formatVersion === 1, "invalid preparation manifest format");
  assert(manifest.workspace === workspace && manifest.sha === options.sha, "commit SHA/workspace mismatch");
  assert(Array.isArray(manifest.entries), "invalid asset manifest entries");
  assert(!statOrNull(join(workspace, "public")), "public directory unexpectedly present after preparation");

  const quarantinedPublic = join(runnerTemp, QUARANTINE, "public");
  assert(statOrNull(join(runnerTemp, QUARANTINE))?.isDirectory(), "preparation quarantine missing");
  if (manifest.entries.length) {
    assert(statOrNull(quarantinedPublic)?.isDirectory(), "quarantined asset directory missing");
  }

  const output = join(workspace, ".vercel", "output");
  assert(statOrNull(output)?.isDirectory(), "Vercel output missing");
  const configPath = join(output, "config.json");
  assert(statOrNull(configPath)?.isFile(), "Vercel output config missing");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  assert(
    config !== null && config.version === 3 && (config.routes === undefined || Array.isArray(config.routes)),
    "invalid Vercel output config version"
  );

  const hashes = new Set();
  for (const item of manifest.entries) {
    assert(
      typeof item.path === "string" &&
        !item.path.startsWith("/") &&
        !item.path.includes("..") &&
        typeof item.sha256 === "string" &&
        /^[0-9a-f]{64}$/.test(item.sha256) &&
        Number.isSafeInteger(item.size) &&
        item.size >= 0,
      "invalid quarantined asset entry"
    );
    hashes.add(item.size + ":" + item.sha256);
  }

  let scannedFiles = 0;
  for (const file of walk(output)) {
    const safePath = "/" + file.rel;
    assert(!/(?:^|\/)assets\//i.test(safePath), "forbidden legacy assets path in prebuilt output");
    const bytes = readFileSync(file.abs);
    assert(!hashes.has(file.size + ":" + sha256(bytes)), "copied quarantined asset detected");
    if (isTextFile(file.rel)) {
      assert(!HAS_LEGACY_URL.test(bytes.toString("utf8")), "reference to forbidden public asset in output");
    }
    scannedFiles += 1;
  }
  console.log("Preview verifier: " + scannedFiles + " output files scanned, 0 forbidden asset findings.");
  return { scannedFiles, quarantinedFiles: manifest.entries.length, violations: 0 };
}

function main() {
  const action = process.argv[2];
  assert(action === "prepare" || action === "verify", "expected prepare or verify");
  const workspace = process.env.GITHUB_WORKSPACE;
  const runnerTemp = process.env.RUNNER_TEMP;
  const sha = process.env.GITHUB_SHA;
  if (action === "prepare") prepareWorkspace({ workspace, runnerTemp, sha });
  else verifyArtifact({ workspace, runnerTemp, sha });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error("Preview asset gate blocked: " + error.message);
    process.exitCode = 1;
  }
}
