import Footer from "@/components/layout/footer";
import Hero from "./sections/hero";
import About from "./sections/about";
import Journey from "./sections/journey";
import Things from "./sections/things";
import Gallery from "./sections/gallery";
import Testimonials from "./sections/testimonials";
import Clients from "./sections/clients";
import Contact from "./sections/contact";

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <About />
      <Journey />
      <Things />
      <Gallery />
      <Testimonials />
      <Clients />
      <Contact />
      <Footer variant="full" tagline="A Home page preview with placeholder content." navigation={[]} contact={[]} />
    </div>
  );
}
