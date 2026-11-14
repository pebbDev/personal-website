import { Button } from "@/components/ui/Button";
import OrbitRing from "../components/orbit-ring";
import { orbitCards } from "../constants";

export default function Hero() {
  return (
    <section id="hero" className="home-hero home-hero-orbit" aria-labelledby="hero-heading">
      <OrbitRing cards={orbitCards} />
      <span className="home-hero-fade home-hero-fade--left" aria-hidden="true" />
      <span className="home-hero-fade home-hero-fade--right" aria-hidden="true" />
      <span className="home-hero-fade home-hero-fade--bottom" aria-hidden="true" />
      <div className="home-hero-copy">
        <h1 id="hero-heading" className="home-hero-title">
          <span className="home-hero-word">A space for ideas</span>
          <br />
          <span className="home-hero-word">and work.</span>
        </h1>
        <p className="home-hero-description">Explore the page structure while content takes shape.</p>
        <Button href="#contact" variant="primary" size="lg">
          Contact section
        </Button>
      </div>
    </section>
  );
}
