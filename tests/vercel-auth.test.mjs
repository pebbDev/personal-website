import assert from "node:assert/strict";
import { test } from "node:test";
import { assertProjectProtection, verifyVercelProtection } from "../scripts/ci/verify-vercel-auth.mjs";

const projectId = "prj_test_preview";
const teamId = "team_test";
const scope = { deploymentType: "all" };

test("Vercel API ssoProtection with deploymentType=all and NO enabled field is protected", () => {
  assert.equal(assertProjectProtection({ id: projectId, ssoProtection: scope }, projectId), true);
});

test("an explicit enabled=true is also accepted", () => {
  assert.equal(assertProjectProtection({ id: projectId, ssoProtection: { ...scope, enabled: true } }, projectId), true);
});

test("an explicit enabled=false is rejected", () => {
  assert.throws(
    () => assertProjectProtection({ id: projectId, ssoProtection: { ...scope, enabled: false } }, projectId),
    /authentication|protection|enabled/i
  );
});

test("missing, null, and preview-only protection are rejected", () => {
  for (const protection of [undefined, null, { deploymentType: "preview" }, { deploymentType: "none" }]) {
    assert.throws(
      () => assertProjectProtection({ id: projectId, ssoProtection: protection }, projectId),
      /authentication|protection|all/i
    );
  }
});

test("unexpected project ID is rejected even when SSO is all", () => {
  assert.throws(
    () => assertProjectProtection({ id: "other-project", ssoProtection: scope }, projectId),
    /project|mismatch/i
  );
});

test("the API request uses exact team/project and safe bearer header", async () => {
  let called = 0;
  const result = await verifyVercelProtection({
    projectId,
    teamId,
    token: "fixture_token_not_real",
    fetchImpl: async (url, options) => {
      called += 1;
      const parsed = new URL(url);
      assert.equal(parsed.hostname, "api.vercel.com");
      assert.equal(parsed.pathname, "/v9/projects/" + projectId);
      assert.equal(parsed.searchParams.get("teamId"), teamId);
      assert.equal(options.headers.Authorization, "Bearer fixture_token_not_real");
      return { ok: true, json: async () => ({ id: projectId, ssoProtection: scope }) };
    },
  });
  assert.equal(result, true);
  assert.equal(called, 1);
});

test("non-success API results fail closed before upload", async () => {
  await assert.rejects(
    () =>
      verifyVercelProtection({
        projectId,
        teamId,
        token: "fixture_token_not_real",
        fetchImpl: async () => ({ ok: false, status: 403 }),
      }),
    /HTTP 403/
  );
});

test("missing token or team/project IDs are rejected before any request", async () => {
  for (const bad of [{ token: "" }, { teamId: "" }, { projectId: "" }]) {
    await assert.rejects(
      () =>
        verifyVercelProtection({
          projectId,
          teamId,
          token: "fixture_token_not_real",
          ...bad,
          fetchImpl: async () => {
            throw new Error("This network call must not happen");
          },
        }),
      /missing|invalid|required/i
    );
  }
});
