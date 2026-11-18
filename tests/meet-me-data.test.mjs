import assert from "node:assert/strict";
import test from "node:test";
import { meetMeContent } from "../src/features/meet-me/constants.ts";

const allowedPlaceholders = new Set([
  "Meet Me",
  "Portrait placeholder",
  "This page is a layout-only introduction to ",
  "visual design and digital experiences",
  ". It shows how ",
  "creative work",
  " can connect to ",
  "product and business goals",
  ". Personal details and professional claims remain under review. Neutral copy helps test the editorial rhythm without borrowing another person's identity or biography.",
  "This preview explores ",
  "measurable design decisions",
  " while identity, contact links, and protected media remain under review for a later release.",
  "Let's connect",
  "email",
  "linkedin",
  "instagram",
  "cv",
  "Email",
  "LinkedIn",
  "Instagram",
  "Download CV",
  "Organization pending approval",
  "Role pending",
  "Dates pending approval",
  "Summary pending approval",
  "Responsibility pending approval",
  "Details pending approval",
  "Description pending approval",
  "More details pending approval",
]);

const placeholderCopy = (value) =>
  allowedPlaceholders.has(value) ||
  /^(?:experience-0[1-6]|certification-0[1-3])$/.test(value) ||
  /^Organization 0[1-5] pending approval$/.test(value) ||
  /^(?:Experience 0[1-6]|Education 0[1-3]|Certification 0[1-3]|Skill 0[1-7]|Language 0[1-2])$/.test(value);

function collectStrings(value, strings = []) {
  if (typeof value === "string") {
    strings.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, strings));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      collectStrings(item, strings);
    });
  }

  return strings;
}

test("placeholder safety rejects identities even when labeled pending", () => {
  assert.equal(placeholderCopy("Actual Person pending approval"), false);
  assert.equal(placeholderCopy("Certification 99"), false);
  assert.equal(placeholderCopy("experience-01-real-person"), false);
});

test("Meet Me content uses the approved neutral layout shape", () => {
  const expectedExperienceIds = Array.from(
    { length: 6 },
    (_, index) => `experience-${String(index + 1).padStart(2, "0")}`
  );
  const actualExperienceIds = meetMeContent.experiences.map(({ id }) => id);

  assert.equal(new Set(actualExperienceIds).size, 6);
  assert.deepEqual(actualExperienceIds, expectedExperienceIds);
  assert.ok(
    meetMeContent.experiences.slice(0, 5).every(({ responsibilityLabels }) => Array.isArray(responsibilityLabels))
  );
  assert.equal(Object.hasOwn(meetMeContent.experiences[5], "responsibilityLabels"), false);
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
    }
  );

  assert.deepEqual(
    meetMeContent.certifications.map(({ id }) => id),
    ["certification-01", "certification-02", "certification-03"]
  );
  assert.equal(meetMeContent.education.length, 3);
  assert.equal(meetMeContent.certifications.length, 3);
  assert.equal(meetMeContent.skills.length, 7);
  assert.equal(meetMeContent.languages.length, 2);
  assert.equal(meetMeContent.hero.intro.length, 2);
  assert.notDeepEqual(meetMeContent.hero.intro[0], meetMeContent.hero.intro[1]);
});

test("Meet Me content contains only neutral placeholders and no linked assets", () => {
  const strings = collectStrings(meetMeContent);

  assert.ok(
    strings.every((value) => placeholderCopy(value)),
    "display copy must remain neutral placeholder text"
  );
  assert.ok(
    strings.every(
      (value) => !/(?:https?:\/\/|mailto:|www\.)/i.test(value) && !/\.(?:png|jpe?g|webp|svg|mp4|pdf)\b/i.test(value)
    ),
    "content must not include contact, media, or logo links"
  );
});

test("Meet Me hero rich intro contract", () => {
  const { hero } = meetMeContent;
  assert.ok(Array.isArray(hero.intro), "Hero intro must be a segmented pair of paragraphs");
  assert.equal(hero.intro.length, 2);
  assert.deepEqual(
    hero.intro.map((paragraph) => paragraph.filter((segment) => segment.highlighted).length),
    [3, 1]
  );
  assert.ok(
    hero.intro.every((paragraph) => paragraph.every(({ text }) => typeof text === "string" && text.length > 0))
  );
  assert.deepEqual(
    hero.contacts.map(({ id }) => id),
    ["email", "linkedin", "instagram", "cv"]
  );
  assert.deepEqual(
    hero.contacts.map(({ label }) => label),
    ["Email", "LinkedIn", "Instagram", "Download CV"]
  );
  assert.ok(hero.contacts.every((contact) => contact.href === undefined));
  assert.equal(hero.connectLabel, "Let's connect");
  assert.equal(hero.portrait.caption, "Portrait placeholder");
  assert.equal(hero.portrait.src, undefined);
});
