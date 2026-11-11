import Badge from "@/components/ui/badge/badge";

export default function HeroSection() {
  return (
    <section id="overview" aria-labelledby="hero-heading" className="pb-14 pt-12 md:pb-24">
      <Badge>Refactor foundation</Badge>
      <h1
        id="hero-heading"
        className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-ink md:text-6xl"
      >
        Personal-Website
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
        A clean Next.js structure is in place. The final interface and content will be implemented
        from the approved Website-Clone reference in separate reviewable tasks.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#structure"
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
        >
          Explore structure
        </a>
        <a
          href="#assets"
          className="rounded-full border border-outline px-5 py-3 text-sm font-medium text-ink"
        >
          Asset preservation
        </a>
      </div>
    </section>
  );
}
