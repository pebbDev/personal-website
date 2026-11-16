import type {
  AboutContent,
  ContactCta,
  FeaturedProject,
  GalleryCategory,
  JourneyContent,
  TestimonialPreview,
} from "./types";
import type { OrbitCardData } from "./components/OrbitRing/types";
import { previewRoutes } from "../../lib/navigation/config.ts";

export const aboutContent: AboutContent = {
  eyebrow: "Meet me",
  heading: "A Bit About Me",
  description: "A space to share how design, product thinking, and collaboration come together.",
  primaryCta: { label: "Take a Closer Look", href: previewRoutes["meet-me"] },
  resumeCta: { label: "Me in docs" },
  portrait: { captionName: "Profile preview", captionRole: "Content pending review" },
  contacts: [
    { id: "email", label: "Email", value: "Available after review" },
    { id: "professional", label: "Professional profile", value: "Available after review" },
    { id: "social", label: "Social profile", value: "Available after review" },
  ],
};

export const journeyContent: JourneyContent = {
  eyebrow: "Roller Coaster My Experiences",
  heading: "Where I’ve Been",
  lead: "Different industries, one way of designing.",
  aboutAction: { label: "More about me", href: previewRoutes["meet-me"] },
  resumeAction: { label: "Full Resume" },
  experiences: [
    {
      id: "experience-01",
      organizationLabel: "Experience 01",
      periodLabel: "Period pending review",
      roleLabel: "Role pending review",
      skills: ["Practice area 01", "Practice area 02", "Practice area 03", "Practice area 04", "Practice area 05"],
    },
    {
      id: "experience-02",
      organizationLabel: "Experience 02",
      periodLabel: "Period pending review",
      roleLabel: "Role pending review",
      skills: ["Practice area 06", "Practice area 07", "Practice area 08", "Practice area 09", "Practice area 10"],
    },
    {
      id: "experience-03",
      organizationLabel: "Experience 03",
      periodLabel: "Period pending review",
      roleLabel: "Role pending review",
      skills: ["Practice area 11", "Practice area 12", "Practice area 13", "Practice area 14"],
    },
    {
      id: "experience-04",
      organizationLabel: "Experience 04",
      periodLabel: "Period pending review",
      roleLabel: "Role pending review",
      skills: ["Practice area 15", "Practice area 16"],
    },
    {
      id: "experience-05",
      organizationLabel: "Experience 05",
      periodLabel: "Period pending review",
      roleLabel: "Role pending review",
      skills: ["Practice area 17", "Practice area 18", "Practice area 19", "Practice area 20", "Practice area 21"],
    },
  ],
};

export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: "featured-project-01",
    title: "Featured Project 01",
    category: "Website project",
    href: previewRoutes.work,
    photos: [{ position: 1 }, { position: 4 }, { position: 2 }, { position: 3 }],
  },
  {
    id: "featured-project-02",
    title: "Featured Project 02",
    category: "Brand project",
    href: previewRoutes.work,
    photos: [{ position: 1 }, { position: 4 }, { position: 2 }, { position: 3 }],
  },
];

export const galleryCategories: readonly GalleryCategory[] = [
  {
    id: "uiux",
    title: "UI/UX Design",
    shortTitle: "UI/UX",
    description: "Mobile apps, dashboards, and websites, from user flows and wireframes to a working design system.",
    tabColor: "#f2f2f2",
    href: previewRoutes.work,
    media: [{ position: 1 }, { position: 2 }, { position: 3 }, { position: 4 }],
  },
  {
    id: "branding",
    title: "Branding Design",
    shortTitle: "Branding",
    description: "Logos, visual identities, and brand guidelines that keep every touchpoint consistent.",
    tabColor: "#eaeaea",
    href: previewRoutes.work,
    media: [{ position: 1 }, { position: 2 }, { position: 3 }, { position: 4 }],
  },
  {
    id: "social",
    title: "Social Media Design",
    shortTitle: "Social",
    description: "Campaign key visuals and content series for social channels and marketplaces.",
    tabColor: "#e2e2e2",
    href: previewRoutes.work,
    media: [{ position: 1 }, { position: 2 }, { position: 3 }, { position: 4 }],
  },
  {
    id: "event",
    title: "Event Design",
    shortTitle: "Event",
    description: "Online and offline event materials, from first concept to vendor-ready files.",
    tabColor: "#dadada",
    href: previewRoutes.work,
    media: [{ position: 1 }, { position: 2 }, { position: 3 }, { position: 4 }],
  },
  {
    id: "ecommerce",
    title: "E-commerce Design",
    shortTitle: "E-com",
    description: "Marketplace visuals, store homepages, and product pages that guide people to checkout.",
    tabColor: "#d2d2d2",
    href: previewRoutes.work,
    media: [{ position: 1 }, { position: 2 }, { position: 3 }, { position: 4 }],
  },
];

export const testimonialPreviews: readonly TestimonialPreview[] = Array.from({ length: 5 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0") as "01" | "02" | "03" | "04" | "05";
  return {
    id: `preview-${number}` as TestimonialPreview["id"],
    label: `Feedback preview ${number}`,
    notice: "Layout preview — verified feedback not yet available.",
    meta: "Example card, not an endorsement",
  };
});

export const contactCta: ContactCta = {
  eyebrow: "Contact",
  headline: "A place to connect.",
  description: "Contact options will appear here after review.",
  label: "Get in touch",
};

export const orbitCards: readonly OrbitCardData[] = [
  { id: "project-study-01", label: "Project study 01" },
  { id: "project-study-02", label: "Project study 02" },
  { id: "project-study-03", label: "Project study 03" },
  { id: "project-study-04", label: "Project study 04" },
  { id: "project-study-05", label: "Project study 05" },
  { id: "project-study-06", label: "Project study 06" },
  { id: "project-study-07", label: "Project study 07" },
  { id: "project-study-08", label: "Project study 08" },
  { id: "project-study-09", label: "Project study 09" },
  { id: "project-study-10", label: "Project study 10" },
  { id: "project-study-11", label: "Project study 11" },
  { id: "project-study-12", label: "Project study 12" },
  { id: "project-study-13", label: "Project study 13" },
  { id: "project-study-14", label: "Project study 14" },
  { id: "project-study-15", label: "Project study 15" },
  { id: "project-study-16", label: "Project study 16" },
];
