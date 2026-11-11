import Activities from "@/features/home/components/activities/activities";
import Contact from "@/features/home/components/contact/contact";
import HeroSection from "@/features/home/components/hero/hero-section";
import Projects from "@/features/home/components/projects/projects";
import WorkExperience from "@/features/home/components/work-experience/work-experience";
import ScrollToTop from "@/components/common/scroll-to-top/ScrollToTop";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WorkExperience />
      <Activities />
      <Projects />
      <Contact />
      <ScrollToTop />
    </>
  );
}
