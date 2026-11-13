#!/usr/bin/env node
// Fail-closed Vercel Authentication preflight. The Vercel REST API may omit "enabled"
// when SSO is configured; "deploymentType: all" is the documented protection scope.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function assertProjectProtection(project, expectedId) {
  if (project?.id !== expectedId) {
    throw new Error("Vercel project ID mismatch before upload");
  }

  const protection = project?.ssoProtection;
  if (!protection || protection.deploymentType !== "all" || ("enabled" in protection && protection.enabled !== true)) {
    throw new Error("Vercel Authentication must protect ALL deployments before upload");
  }

  return true;
}

export async function verifyVercelProtection({ projectId, teamId, token, fetchImpl = fetch }) {
  if (!projectId || !teamId || !token) {
    throw new Error("Missing required Vercel project, team, or token configuration");
  }

  const url = new URL("https://api.vercel.com/v9/projects/" + encodeURIComponent(projectId));
  url.searchParams.set("teamId", teamId);

  const response = await fetchImpl(url.toString(), {
    headers: { Authorization: "Bearer " + token },
  });
  if (!response.ok) {
    throw new Error("Cannot inspect Vercel project protection: HTTP " + response.status);
  }

  return assertProjectProtection(await response.json(), projectId);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await verifyVercelProtection({
      projectId: process.env.VERCEL_PROJECT_ID,
      teamId: process.env.VERCEL_ORG_ID,
      token: process.env.VERCEL_TOKEN,
    });
    console.log("Vercel Authentication: all deployments protected.");
  } catch (error) {
    console.error("Vercel protection preflight blocked: " + error.message);
    process.exitCode = 1;
  }
}
