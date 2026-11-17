import assert from "node:assert/strict";
import test from "node:test";
import { meetMeContent } from "../src/features/meet-me/constants.ts";

const placeholderCopy = (value) =>
  value === "Meet Me" ||
  /(?:pending|placeholder|awaiting approval)/i.test(value) ||
  /^(?:Experience|Education|Certification|Skill|Language) \d{2}$/.test(value);

function collectStrings(value, strings = []) {
  if (typeof value === "string") {
    strings.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, strings));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (key !== "id") collectStrings(item, strings);
    });
  }

  return strings;
}

test("Meet Me content uses the approved neutral layout shape", () => {
  const expectedExperienceIds = Array.from(
    { length: 6 },
    (_, index) => `experience-${String(index + 1).padStart(2, "0")}`,
  );
  const actualExperienceIds = meetMeContent.experiences.map(({ id }) => id);

  assert.equal(new Set(actualExperienceIds).size, 6);
  assert.deepEqual(actualExperienceIds, expectedExperienceIds);
  assert.ok(
    meetMeContent.experiences
      .slice(0, 5)
      .every(({ responsibilityLabels }) => Array.isArray(responsibilityLabels)),
  );
  assert.equal(
    Object.hasOwn(meetMeContent.experiences[5], "responsibilityLabels"),
    false,
  );
  assert.deepEqual(
    {
      id: meetMeContent.experiences[5].id,
      organizationLabel: meetMeContent.experiences[5].organizationLabel,
      roleLabel: meetMeContent.experiences[5].roleLabel,
      summaryLabel: meetMeContent.experiences[5].summaryLabel,
    },
    {
      id: "experience-06",
      organizationLabel: "Organization pending approval",
      roleLabel: "Role pending",
      summaryLabel: "Summary pending approval",
    },
  );

  assert.equal(meetMeContent.education.length, 3);
  assert.equal(meetMeContent.certifications.length, 3);
  assert.equal(meetMeContent.skills.length, 7);
  assert.equal(meetMeContent.languages.length, 2);
  assert.equal(meetMeContent.hero.introParagraphs.length, 2);
  assert.notEqual(
    meetMeContent.hero.introParagraphs[0],
    meetMeContent.hero.introParagraphs[1],
  );
});

test("Meet Me content contains only neutral placeholders and no linked assets", () => {
  const strings = collectStrings(meetMeContent);

  assert.ok(
    strings.every((value) => placeholderCopy(value)),
    "display copy must remain neutral placeholder text",
  );
  assert.ok(
    strings.every(
      (value) =>
        !/(?:https?:\/\/|mailto:|www\.)/i.test(value) &&
        !/\.(?:png|jpe?g|webp|svg|mp4|pdf)\b/i.test(value),
    ),
    "content must not include contact, media, or logo links",
  );
});
