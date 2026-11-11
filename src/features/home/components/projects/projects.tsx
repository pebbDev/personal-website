import TitleSection from "@/components/common/title-section/title-section";
import Card from "@/components/ui/card/card";

const scopeItems = [
  "Homepage and shared capsule navigation",
  "Meet Me and My Lab",
  "22 individually audited case-study routes",
];

export default function Projects() {
  return (
    <section id="projects" className="py-12" aria-labelledby="projects-title">
      <TitleSection
        id="projects-title"
        eyebrow="Migration scope"
        title="Website-Clone is the next implementation target"
        description="These items are planned, not implemented by this structural cleanup."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {scopeItems.map((item) => (
          <Card key={item} title={item} />
        ))}
      </div>
    </section>
  );
}
