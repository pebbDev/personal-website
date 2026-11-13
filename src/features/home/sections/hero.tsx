import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="hero" className="home-section home-hero" aria-labelledby="hero-heading">
      <div className="home-wrap">
        <p className="home-eyebrow">Home preview</p>
        <h1 id="hero-heading" className="home-title">
          A space for ideas and work.
        </h1>
        <p className="home-copy">Explore the page structure while content takes shape.</p>
        <Button href="#contact" variant="primary" size="lg">
          Contact section
        </Button>
      </div>
    </section>
  );
}
