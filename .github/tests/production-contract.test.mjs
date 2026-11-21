import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const file = readFileSync(join(root, ".github/workflows/production.yml"), "utf8");
const prodProject = "prj_yQtGZhqJHjLQNUL5w6WEAVa2Y963";
const prodTeam = "team_9k1zQIUlgcV3hNaBqW9EL3ON";
const sha = "c129657abf04a3422efc5b831c871faeedf3b42b";

test("Git integration cannot deploy independently of the GitHub Actions controller", () => {
  const config = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
  assert.equal(config.git?.deploymentEnabled, false);
});

function stage(name) {
  const ix = file.indexOf("      - name: " + name);
  assert.ok(ix > -1, "Expected Production step: " + name);
  return ix;
}

function extractNodeHereDoc() {
  const first = file.indexOf("node --input-type=module <<'NODE'");
  assert.ok(first > -1, "Missing staging provenance check");
  const end = file.indexOf("\n          NODE", first);
  assert.ok(end > first);
  return file
    .slice(first + "node --input-type=module <<'NODE'".length + 1, end)
    .split(/\r?\n/)
    .map((line) => line.replace(/^ {10}/, ""))
    .join("\n");
}

function mockedCandidate({
  projectId = prodProject,
  target = "production",
  readyState = "READY",
  meta = { per21CommitSha: sha },
  status = 200,
  override = {},
} = {}) {
  const inject = `
globalThis.fetch = async (url, opts) => {
  if (!url.hostname.endsWith("api.vercel.com") || !url.pathname.includes("deployments") ||
      !url.pathname.endsWith("candidate.vercel.app") || url.searchParams.get("teamId") !== process.env.VERCEL_ORG_ID ||
      opts.headers.Authorization !== "Bearer " + process.env.VERCEL_TOKEN) {
    throw Error("Incorrect Vercel GET request");
  }
  const status = Number(process.env.MOCK_STATUS);
  return { ok: status === 200, status, json: async () => JSON.parse(process.env.MOCK_DEPLOYMENT) };
};
`;
  return spawnSync(process.execPath, ["--input-type=module", "--eval", inject + extractNodeHereDoc()], {
    cwd: root,
    encoding: "utf8",
    timeout: 15000,
    env: {
      ...process.env,
      VERCEL_ORG_ID: prodTeam,
      VERCEL_PROJECT_ID: prodProject,
      VERCEL_TOKEN: "local-only-fake-token",
      DEPLOYMENT_URL: "https://candidate.vercel.app",
      GITHUB_SHA: sha,
      MOCK_DEPLOYMENT: JSON.stringify({ projectId, target, readyState, meta }),
      MOCK_STATUS: String(status),
      ...override,
    },
  });
}

test("Manual First Release only from main with public content flag; push additionally needs activation", () => {
  assert.match(file, /workflow_dispatch:/);
  assert.match(file, /push:\s*\n\s*branches:\s*\[main\]/);
  assert.match(file, /github\.ref == 'refs\/heads\/main'/);
  assert.match(file, /vars\.PUBLIC_CONTENT_APPROVED == 'true'/);
  assert.match(file, /github\.event_name == 'workflow_dispatch' \|\| vars\.PRODUCTION_CD_ENABLED == 'true'/);
  assert.doesNotMatch(file, /pull_request:/);
  assert.match(file, /environment:\s*\n\s*name: production/);
  assert.match(file, /cancel-in-progress: false/);
  assert.match(file, /permissions:\s*\n\s*contents: read/);
});

test("Production targets exact existing project and never Preview project", () => {
  assert.match(file, /vars\.PRODUCTION_VERCEL_ORG_ID/);
  assert.match(file, /vars\.PRODUCTION_VERCEL_PROJECT_ID/);
  assert.ok(file.includes(prodProject));
  assert.ok(file.includes(prodTeam));
  assert.doesNotMatch(file, /prj_EtYBH7RYrHjuTD1sgkLyd8tKOujD/);
  assert.match(file, /test -n "\$VERCEL_TOKEN"/);
  assert.match(file, /test "\$VERCEL_PROJECT_ID"/);
  assert.match(file, /test "\$VERCEL_ORG_ID"/);
  assert.match(file, /VERCEL_CLI_VERSION/);
  assert.match(file, /--frozen-lockfile --ignore-scripts/);
  assert.match(file, /-e public.*-L public/);
});

test("Exact SHA is checked before build and again before promotion", () => {
  const a = file.indexOf("git ls-remote origin refs/heads/main");
  const b = file.lastIndexOf("git ls-remote origin refs/heads/main");
  assert.ok(a > -1 && b > a);
  assert.ok(a < stage("Build immutable Production candidate"));
  assert.ok(b > stage("Verify READY staging artifact"));
  assert.ok(b < stage("Promote verified candidate"));
  assert.match(file, /git rev-parse HEAD/);
  assert.match(file, /"\$remote_sha" = "\$GITHUB_SHA"/);
});

test("Single prebuilt Production artifact is staged, inspected and then promoted", () => {
  const pull = stage("Pull Production configuration");
  const build = stage("Build immutable Production candidate");
  const deploy = stage("Stage Production candidate without moving domain");
  const inspect = stage("Verify READY staging artifact, project, and commit provenance");
  const latest = stage("Refuse stale candidate immediately before Production promotion");
  const promote = stage("Promote verified candidate to Production");
  const smoke = stage("Smoke-test public Vercel domain (no login)");
  assert.ok(
    pull < build && build < deploy && deploy < inspect && inspect < latest && latest < promote && promote < smoke
  );
  assert.match(file, /vercel pull --yes --environment=production/);
  assert.match(file, /vercel build --prod/);
  assert.match(file, /vercel deploy --prebuilt --prod --skip-domain --meta "per21CommitSha=\$GITHUB_SHA"/);
  assert.match(file, /vercel promote "\$DEPLOYMENT_URL" --yes/);
  assert.match(file, /\.vercel\/project\.json/);
});

test("READY Production candidate exact project and custom commit meta passes", () => {
  const result = mockedCandidate();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Production candidate READY/);
});

test("Unready candidate, wrong project/target/SHA, bad API response fail before promote", () => {
  const cases = [
    { projectId: "prj_wrong" },
    { target: "preview" },
    { readyState: "ERROR" },
    { meta: { per21CommitSha: "a".repeat(40) } },
    { meta: {} },
    { status: 401 },
    { override: { VERCEL_ORG_ID: "team_wrong" } },
  ];
  for (const c of cases) {
    const r = mockedCandidate(c);
    assert.notEqual(r.status, 0, "Bad candidate accepted " + JSON.stringify(c));
    assert.doesNotMatch(r.stdout, /Production candidate READY/);
  }
});

test("Post-promotion smoke is anonymous and never follows redirect-to-login", () => {
  assert.match(file, /PUBLIC_DOMAIN: personal-website-nine-iota-82\.vercel\.app/);
  assert.match(file, /"https:\/\/\$PUBLIC_DOMAIN\/"/);
  assert.doesNotMatch(file, /\/work\.html/);
  assert.match(file, /curl --silent --show-error --output \/dev\/null/);
  assert.doesNotMatch(file, /curl[^\r\n]*--location/);
  assert.match(file, /test "\$code" = "200"/);
  assert.match(file, /GITHUB_STEP_SUMMARY/);
});
