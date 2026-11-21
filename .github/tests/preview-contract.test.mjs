import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const source = readFileSync(join(root, ".github/workflows/cd.yml"), "utf8");
const projectId = "prj_EtYBH7RYrHjuTD1sgkLyd8tKOujD";
const teamId = "team_9k1zQIUlgcV3hNaBqW9EL3ON";

function job(name) {
  const start = source.indexOf("\n  " + name + ":\n");
  assert.notEqual(start, -1, "Expected " + name + " job");
  const end = name === "verify" ? source.indexOf("\n  preview:\n", start) : source.length;
  return source.slice(start, end === -1 ? undefined : end);
}

function guardScript(section) {
  const first = section.indexOf("- name: Reject public directory or symlink before build");
  assert.ok(first >= 0, "Missing no-public path guard");
  const end = section.indexOf("\n      - name:", first + 1);
  const step = section.slice(first, end === -1 ? undefined : end);
  const runAt = step.indexOf("run: |");
  assert.ok(runAt >= 0, "Guard must be executable shell block");
  const lines = step.slice(runAt + "run: |".length).split(/\r?\n/);
  while (lines[0]?.trim() === "") lines.shift();
  return lines
    .map((line) => line.replace(/^ {10}/, ""))
    .join("\n")
    .trimEnd();
}

function preflight() {
  const startToken = "node --input-type=module <<'NODE'";
  const start = source.indexOf(startToken);
  assert.ok(start >= 0, "No inline pre-upload protection test");
  const end = source.indexOf("\n          NODE", start + startToken.length);
  assert.ok(end > start, "Missing heredoc close delimiter");
  return source
    .slice(start + startToken.length + 1, end)
    .split(/\r?\n/)
    .map((line) => line.replace(/^ {10}/, ""))
    .join("\n");
}

function runPreflight({
  project = { id: projectId, ssoProtection: { deploymentType: "all" } },
  status = 200,
  env = {},
} = {}) {
  const mock = `
globalThis.fetch = async (url, options) => {
  if (url.hostname !== "api.vercel.com" || !url.pathname.endsWith(process.env.VERCEL_PROJECT_ID) || url.searchParams.get("teamId") !== process.env.VERCEL_ORG_ID) {
    throw new Error("Unexpected Vercel API endpoint");
  }
  if (options.headers.Authorization !== "Bearer " + process.env.VERCEL_TOKEN) {
    throw new Error("Unexpected Authorization header");
  }
  const status = Number(process.env.MOCK_STATUS);
  return { ok: status === 200, status, json: async () => JSON.parse(process.env.MOCK_PROJECT) };
};
`;
  const mergedEnv = {
    ...process.env,
    VERCEL_ORG_ID: teamId,
    VERCEL_PROJECT_ID: projectId,
    VERCEL_TOKEN: "local-test-token",
    MOCK_STATUS: String(status),
    MOCK_PROJECT: JSON.stringify(project),
    ...env,
  };
  return spawnSync(process.execPath, ["--input-type=module", "--eval", mock + preflight()], {
    cwd: root,
    env: mergedEnv,
    encoding: "utf8",
    timeout: 15000,
  });
}

test("both Preview jobs fail closed for source public paths, before build", () => {
  const verify = job("verify");
  const preview = job("preview");
  for (const section of [verify, preview]) {
    const script = guardScript(section);
    assert.match(script, /-e public/);
    assert.match(script, /-L public/);
    assert.match(script, /exit 1/);
    assert.ok(section.indexOf("Reject public directory") < section.indexOf("Set up pnpm"));
  }
  assert.ok(preview.indexOf("Reject public directory") < preview.indexOf("Deploy Vercel Preview"));
});

test("Preview pre-upload protection checks pass for exact project and All SSO", () => {
  const r = runPreflight();
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /all Preview deployments protected/);
  assert.ok(
    job("preview").indexOf("Verify Vercel Authentication BEFORE") < job("preview").indexOf("Pull Preview configuration")
  );
});

test("Preview preflight rejects wrong project, wrong team, missing token, disabled SSO or API error", () => {
  const cases = [
    { env: { VERCEL_PROJECT_ID: "prj_incorrect" } },
    { env: { VERCEL_ORG_ID: "team_incorrect" } },
    { env: { VERCEL_TOKEN: "" } },
    { project: { id: "prj_wrong", ssoProtection: { deploymentType: "all" } } },
    { project: { id: projectId, ssoProtection: { deploymentType: "preview" } } },
    { project: { id: projectId, ssoProtection: { deploymentType: "all", enabled: false } } },
    { project: { id: projectId } },
    { status: 403 },
  ];
  for (const entry of cases) {
    const r = runPreflight(entry);
    assert.notEqual(r.status, 0, "Unsafe preflight case passed: " + JSON.stringify(entry));
    assert.doesNotMatch(r.stdout, /all Preview deployments protected/);
  }
});

test("postdeploy SSO redirect and Preview-only deployment remain", () => {
  const preview = job("preview");
  assert.match(preview, /vercel deploy --prebuilt/);
  assert.doesNotMatch(preview, /vercel (?:build|deploy)[^\r\n]*--prod/);
  assert.match(preview, /HTTP\/\[0-9\.\]\+ 302/);
  assert.match(preview, /vercel\.com\/sso-api/);
  assert.match(preview, /environment:\s*\n\s*name: preview-deploy/);
  assert.match(preview, /Verify CLI resolved exact project/);
  assert.match(preview, /git rev-parse HEAD/);
});

test("obsolete helpers are no longer present or referenced", () => {
  assert.doesNotMatch(source, /preview-asset-gate|verify-vercel-auth/);
  assert.equal(existsSync(join(root, ".github/security/preview-asset-gate.mjs")), false);
  assert.equal(existsSync(join(root, ".github/security/verify-vercel-auth.mjs")), false);
});

test(
  "runtime guard rejects an ordinary public directory and a dangling symlink on POSIX",
  { skip: process.platform === "win32" },
  () => {
    const script = guardScript(job("verify"));
    const temp = mkdtempSync(join(tmpdir(), "per21-no-public-"));
    try {
      assert.equal(spawnSync("bash", ["-c", script], { cwd: temp }).status, 0);
      mkdirSync(join(temp, "public"));
      assert.notEqual(spawnSync("bash", ["-c", script], { cwd: temp }).status, 0);
      rmSync(join(temp, "public"), { recursive: true });
      symlinkSync(join(temp, "missing-target"), join(temp, "public"));
      assert.notEqual(spawnSync("bash", ["-c", script], { cwd: temp }).status, 0);
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  }
);
