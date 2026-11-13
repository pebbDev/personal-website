import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { mkdtempSync, rmSync } from "node:fs";
import { test } from "node:test";
import { assertCiContext, prepareWorkspace, verifyArtifact } from "../scripts/ci/preview-asset-gate.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "pw-gate-"));
  const workspace = join(root, "workspace");
  const runnerTemp = join(root, "runner-temp");
  mkdirSync(workspace);
  mkdirSync(runnerTemp);
  const sha = "a".repeat(40);
  return {
    workspace,
    runnerTemp,
    sha,
    cleanup() {
      rmSync(root, { recursive: true, force: true });
    },
  };
}

function put(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function validOutput(f) {
  const output = join(f.workspace, ".vercel", "output");
  put(join(output, "config.json"), JSON.stringify({ version: 3, routes: [] }));
  put(join(output, "static", "index.html"), "<html><body>Neutral preview</body></html>");
  return output;
}

function prepare(f) {
  return prepareWorkspace({
    workspace: f.workspace,
    runnerTemp: f.runnerTemp,
    sha: f.sha,
    fixtureMode: true,
  });
}

function verify(f) {
  return verifyArtifact({
    workspace: f.workspace,
    runnerTemp: f.runnerTemp,
    sha: f.sha,
    fixtureMode: true,
  });
}

test("production path requires GitHub Actions CI environment and exact workspace", () => {
  const f = fixture();
  try {
    assert.throws(
      () => assertCiContext({ workspace: f.workspace, runnerTemp: f.runnerTemp, sha: f.sha }, {}),
      /GitHub Actions|CI|environment/i
    );
  } finally {
    f.cleanup();
  }
});

test("GitHub-hosted CI context accepts matching SHA and rejects self-hosted runner", () => {
  const f = fixture();
  try {
    const env = {
      CI: "true",
      GITHUB_ACTIONS: "true",
      RUNNER_ENVIRONMENT: "github-hosted",
      GITHUB_WORKSPACE: f.workspace,
      RUNNER_TEMP: f.runnerTemp,
      GITHUB_SHA: f.sha,
    };
    assert.equal(
      assertCiContext({ workspace: f.workspace, runnerTemp: f.runnerTemp, sha: f.sha }, env).workspace,
      f.workspace
    );
    assert.throws(
      () =>
        assertCiContext(
          { workspace: f.workspace, runnerTemp: f.runnerTemp, sha: f.sha },
          { ...env, RUNNER_ENVIRONMENT: "self-hosted" }
        ),
      /github-hosted|ephemeral/i
    );
  } finally {
    f.cleanup();
  }
});

test("Vercel v3 config permits an omitted routes array", () => {
  const f = fixture();
  try {
    prepare(f);
    const output = validOutput(f);
    put(join(output, "config.json"), JSON.stringify({ version: 3 }));
    assert.equal(verify(f).violations, 0);
  } finally {
    f.cleanup();
  }
});

test("prepare quarantines all public files only inside synthetic fixture", () => {
  const f = fixture();
  try {
    const original = join(f.workspace, "public", "assets", "img", "profile.jpg");
    const extra = join(f.workspace, "public", "new-file.txt");
    put(original, "fixture-only-photo-not-real");
    put(extra, "unknown new file must be denied");
    const result = prepare(f);
    assert.equal(result.quarantinedFiles, 2);
    assert.equal(existsSync(original), false);
    assert.equal(existsSync(extra), false);
    assert.equal(
      readFileSync(join(f.runnerTemp, "preview-asset-quarantine", "public", "new-file.txt"), "utf8"),
      "unknown new file must be denied"
    );
    assert.equal(existsSync(join(f.runnerTemp, "preview-asset-manifest.json")), true);
  } finally {
    f.cleanup();
  }
});

test("prepare rejects public symlinks without moving files", () => {
  const f = fixture();
  try {
    const publicDir = join(f.workspace, "public");
    mkdirSync(publicDir);
    symlinkSync(f.runnerTemp, join(publicDir, "external"), process.platform === "win32" ? "junction" : "dir");
    assert.throws(() => prepare(f), /symlink|symbolic|link/i);
    assert.equal(existsSync(publicDir), true);
  } finally {
    f.cleanup();
  }
});

test("prepare rejects quarantine collisions instead of overwriting", () => {
  const f = fixture();
  try {
    put(join(f.workspace, "public", "assets", "blocked.txt"), "private");
    put(join(f.runnerTemp, "preview-asset-quarantine", "do-not-overwrite"), "protected");
    assert.throws(() => prepare(f), /exists|quarantine|collision/i);
    assert.equal(existsSync(join(f.workspace, "public", "assets", "blocked.txt")), true);
  } finally {
    f.cleanup();
  }
});

test("prepare rejects source references to quarantined asset URLs", () => {
  const f = fixture();
  try {
    put(join(f.workspace, "src", "app", "page.tsx"), 'const photo = "/assets/img/profile.jpg";');
    put(join(f.workspace, "public", "assets", "img", "profile.jpg"), "private");
    assert.throws(() => prepare(f), /reference|assets/i);
    assert.equal(existsSync(join(f.workspace, "public", "assets", "img", "profile.jpg")), true);
  } finally {
    f.cleanup();
  }
});

test("verify accepts a sanitized v3 output without public assets", () => {
  const f = fixture();
  try {
    put(join(f.workspace, "public", "assets", "img", "profile.jpg"), "private");
    prepare(f);
    validOutput(f);
    const result = verify(f);
    assert.ok(result.scannedFiles >= 2);
    assert.equal(result.violations, 0);
  } finally {
    f.cleanup();
  }
});

test("verify fails on forbidden public assets path in static output", () => {
  const f = fixture();
  try {
    put(join(f.workspace, "public", "assets", "img", "profile.jpg"), "private");
    prepare(f);
    validOutput(f);
    put(join(f.workspace, ".vercel", "output", "static", "assets", "img", "profile.jpg"), "any byte content");
    assert.throws(() => verify(f), /forbidden|assets|path/i);
  } finally {
    f.cleanup();
  }
});

test("verify detects exact raw asset copied under a different output path", () => {
  const f = fixture();
  try {
    const bytes = "synthetic-private-binary-fixture";
    put(join(f.workspace, "public", "assets", "img", "profile.jpg"), bytes);
    prepare(f);
    validOutput(f);
    put(join(f.workspace, ".vercel", "output", "static", "renamed.jpg"), bytes);
    assert.throws(() => verify(f), /copied|digest|forbidden|asset/i);
  } finally {
    f.cleanup();
  }
});

test("verify refuses embedded references to denied assets", () => {
  const f = fixture();
  try {
    put(join(f.workspace, "public", "assets", "img", "profile.jpg"), "private");
    prepare(f);
    validOutput(f);
    put(join(f.workspace, ".vercel", "output", "static", "app.js"), 'const img="/assets/img/profile.jpg"');
    assert.throws(() => verify(f), /reference|assets|forbidden/i);
  } finally {
    f.cleanup();
  }
});

test("verify refuses output symlinks, unknown output versions and missing configs", () => {
  const f = fixture();
  try {
    prepare(f);
    const output = validOutput(f);
    put(join(output, "config.json"), JSON.stringify({ version: 9, routes: [] }));
    assert.throws(() => verify(f), /version|config/i);
    put(join(output, "config.json"), JSON.stringify({ version: 3, routes: [] }));
    symlinkSync(f.runnerTemp, join(output, "static", "external"), process.platform === "win32" ? "junction" : "dir");
    assert.throws(() => verify(f), /symlink|symbolic|link/i);
  } finally {
    f.cleanup();
  }
});

test("verify rejects missing preparation marker or mismatched commit SHA", () => {
  const f = fixture();
  try {
    assert.throws(() => verify(f), /prepare|manifest|marker/i);
    prepare(f);
    validOutput(f);
    assert.throws(
      () =>
        verifyArtifact({ workspace: f.workspace, runnerTemp: f.runnerTemp, sha: "b".repeat(40), fixtureMode: true }),
      /commit|SHA|mismatch/i
    );
  } finally {
    f.cleanup();
  }
});

test("verify refuses a complete digest match for synthetic quarantined data", () => {
  const f = fixture();
  try {
    const bytes = Buffer.from("synthetic sensitive data", "utf8");
    const hash = createHash("sha256").update(bytes).digest("hex");
    put(join(f.workspace, "public", "assets", "secret.txt"), bytes);
    prepare(f);
    const manifest = JSON.parse(readFileSync(join(f.runnerTemp, "preview-asset-manifest.json"), "utf8"));
    assert.ok(manifest.entries.some((x) => x.sha256 === hash));
    validOutput(f);
    put(join(f.workspace, ".vercel", "output", "functions", "index.func", "payload.bin"), bytes);
    assert.throws(() => verify(f), /copied|digest|forbidden|asset/i);
  } finally {
    f.cleanup();
  }
});
