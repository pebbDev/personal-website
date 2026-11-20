import assert from "node:assert/strict";
import test from "node:test";

test("unrouted manually authored CaseDetail retains five sections and neutral content", async () => {
  const { caseDetailPreview } = await import("../src/features/work/components/CaseDetail/constants.ts");
  assert.equal(caseDetailPreview.heading, "Case Study Preview 01");
  assert.deepEqual(
    caseDetailPreview.sections.map((section) => section.id),
    ["overview", "problem", "audience", "design", "reflection"]
  );
  assert.equal(
    caseDetailPreview.designPages.reduce((sum, page) => sum + page.media.length, 0),
    13
  );
  assert.equal(caseDetailPreview.challengeSteps.length, 4);
  assert.equal(
    caseDetailPreview.challengeSteps.reduce((sum, item) => sum + item.disclosures.length, 0),
    8
  );
  assert.doesNotMatch(JSON.stringify(caseDetailPreview), /@|https?:|LinkedIn|Cekat|Fachri|\\.jpe?g|\\.png/i);
  assert.equal("canonicalPath" in caseDetailPreview, false);
  assert.equal("id" in caseDetailPreview, false);
});
