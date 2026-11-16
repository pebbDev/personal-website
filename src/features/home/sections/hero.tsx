import { Button } from "@/components/ui/Button";
import HoverLift from "../components/HoverLift";
import OrbitRing from "../components/OrbitRing";
import { orbitCards } from "../constants";
import { sectionRoutes } from "@/lib/navigation";

export default function Hero() {
  return (
    <section id="hero" className="home-hero home-hero-orbit" aria-labelledby="hero-heading">
      <OrbitRing cards={orbitCards} />
      <span className="home-hero-fade home-hero-fade--left" aria-hidden="true" />
      <span className="home-hero-fade home-hero-fade--right" aria-hidden="true" />
      <span className="home-hero-fade home-hero-fade--bottom" aria-hidden="true" />
      <div className="home-hero-copy">
        <h1 id="hero-heading" className="home-hero-title">
          <HoverLift className="home-hero-word">A space for ideas</HoverLift>
          <br />
          <HoverLift className="home-hero-word">and work.</HoverLift>
        </h1>
        <p className="home-hero-description">Explore the page structure while content takes shape.</p>
        <Button href={sectionRoutes.contact} variant="primary" size="lg">
          Contact section
        </Button>
      </div>
    </section>
  );
}
