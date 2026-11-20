import type { CaseDetailData } from "./types";
export const caseDetailPreview: CaseDetailData = {
  heading: "Case Study Preview 01",
  lead: "An exploration of a digital experience, from early challenges to a clearer interface and a more confident journey.",
  categoryId: "uiux",
  heroVariant: "browser-preview",
  metadata: [
    { label: "Discipline", value: "Interface design" },
    { label: "Project type", value: "Concept preview" },
    { label: "Focus", value: "Research & experience" },
  ],
  sections: [
    {
      id: "overview",
      eyebrow: "01 · Overview",
      title: "A more thoughtful first impression.",
      intro:
        "This neutral case-study preview explores how an experience can become more approachable, structured, and easy to navigate.",
    },
    {
      id: "problem",
      eyebrow: "02 · The problem",
      title: "Turning friction into clarity.",
      intro:
        "Four recurring design challenges guided the direction of the experience. Each insight informed a practical response.",
    },
    {
      id: "audience",
      eyebrow: "03 · The audience",
      title: "Different needs, one clear experience.",
      intro:
        "The interface needed to work for people discovering a service for the first time and for experienced teams looking for useful details.",
    },
    {
      id: "design",
      eyebrow: "04 · The design",
      title: "An experience built with purpose.",
      intro:
        "Each screen in the concept has a specific role, forming a coherent path from exploration through decision making.",
    },
    {
      id: "reflection",
      eyebrow: "05 · Reflection",
      title: "What the exploration revealed.",
      intro:
        "The process reinforced the value of simple navigation, considerate content hierarchy, and continuous evaluation.",
    },
  ],
  challengeSteps: [
    {
      title: "Help visitors find a starting point",
      text: "Early impressions need one clear path forward.",
      disclosures: [
        { title: "The challenge", body: "Too many competing visual priorities can make the first action unclear." },
        { title: "The approach", body: "Establish a concise headline, focused navigation, and a visible next step." },
      ],
    },
    {
      title: "Make the experience feel welcoming",
      text: "Content should feel accessible rather than overwhelming.",
      disclosures: [
        { title: "The challenge", body: "Dense explanations can hide the meaning behind useful features." },
        { title: "The approach", body: "Organize information into shorter sections with supporting visual examples." },
      ],
    },
    {
      title: "Design for clarity and discovery",
      text: "Users should understand where they are and what comes next.",
      disclosures: [
        { title: "The challenge", body: "Inconsistent hierarchy can make related ideas difficult to locate." },
        { title: "The approach", body: "Use predictable section patterns and a responsive navigation structure." },
      ],
    },
    {
      title: "Support confident decisions",
      text: "People need the right information at the right moment.",
      disclosures: [
        { title: "The challenge", body: "Important details can become buried in a lengthy page." },
        { title: "The approach", body: "Surface key comparisons, supporting examples, and clear calls to action." },
      ],
    },
  ],
  audiences: [
    {
      title: "New explorers",
      points: ["Understand the offering quickly", "Discover the main benefits", "Move confidently between sections"],
      note: "Needs: reassurance, accessibility, and a clear entry point.",
    },
    {
      title: "Experienced evaluators",
      points: ["Explore detailed capabilities", "Compare relevant options", "Find evidence before deciding"],
      note: "Needs: depth, consistency, and predictable information.",
    },
  ],
  audienceRows: [
    { label: "Context", value: "A mix of first-time visitors and returning evaluators." },
    { label: "Goal", value: "Find information efficiently and feel confident taking the next step." },
    { label: "Device", value: "Responsive experience from small screens to desktop." },
    { label: "Approach", value: "Clear content, approachable language, and familiar interaction patterns." },
  ],
  insightSteps: [
    { title: "Clarity first", text: "Put essential information where visitors expect to find it." },
    { title: "Reduce uncertainty", text: "Support decisions with examples and direct explanations." },
    { title: "Serve every screen", text: "Adapt content density and layouts to the available space." },
  ],
  designPages: [
    {
      id: "landing",
      title: "Landing experience",
      summary: "Introduce the central value and help visitors choose the next step.",
      goal: "A focused first impression.",
      media: [
        { id: "landing-full", label: "Landing page long-form placeholder", aspect: "portrait", scrollable: true },
        { id: "landing-hero", label: "Landing hero placeholder", aspect: "landscape" },
        { id: "landing-content", label: "Landing content placeholder", aspect: "landscape" },
      ],
    },
    {
      id: "features",
      title: "Feature exploration",
      summary: "Explain capabilities in a clear, progressive sequence.",
      goal: "Make individual capabilities easy to discover.",
      media: [
        { id: "features-full", label: "Feature page long-form placeholder", aspect: "portrait", scrollable: true },
        { id: "features-hero", label: "Feature hero placeholder", aspect: "landscape" },
        { id: "features-details", label: "Feature details placeholder", aspect: "landscape" },
      ],
    },
    {
      id: "plans",
      title: "Plan comparison",
      summary: "Offer a straightforward way to consider available options.",
      goal: "Support an informed choice.",
      media: [{ id: "plans-single", label: "Plan overview placeholder", aspect: "landscape" }],
    },
    {
      id: "team",
      title: "Team opportunities",
      summary: "Provide a place for people to explore roles and context.",
      goal: "Make important details easier to navigate.",
      media: [
        { id: "team-full", label: "Team page long-form placeholder", aspect: "portrait", scrollable: true },
        { id: "team-one", label: "Team section one placeholder", aspect: "landscape" },
        { id: "team-two", label: "Team section two placeholder", aspect: "landscape" },
        { id: "team-details", label: "Team detail long-form placeholder", aspect: "portrait", scrollable: true },
      ],
    },
    {
      id: "articles",
      title: "Knowledge library",
      summary: "Organize helpful material into a recognizable content library.",
      goal: "Make learning and discovery feel effortless.",
      media: [{ id: "articles-full", label: "Knowledge page placeholder", aspect: "portrait", scrollable: true }],
    },
    {
      id: "story",
      title: "About the concept",
      summary: "Introduce the motivations and people behind a project.",
      goal: "Build context and credibility through clear storytelling.",
      media: [{ id: "story-full", label: "About page placeholder", aspect: "portrait", scrollable: true }],
    },
  ],
  outcomes: [
    "A stronger visual hierarchy for important content.",
    "A more consistent path between related screens.",
    "A responsive foundation designed for further validation.",
  ],
  nextSteps: [
    { title: "Observe the experience", text: "Gather qualitative insights from realistic user journeys." },
    { title: "Refine the language", text: "Test which explanations make each next step clearer." },
    { title: "Iterate the system", text: "Use the findings to improve consistency across screens." },
  ],
};
