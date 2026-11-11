import TitleSection from "@/components/common/title-section/title-section";
import Card from "@/components/ui/card/card";

export default function WorkExperience() {
  return (
    <section id="structure" className="py-12" aria-labelledby="structure-title">
      <TitleSection
        id="structure-title"
        eyebrow="Architecture"
        title="A modular application structure"
        description="Routes, feature modules and reusable components are organized independently to support the Personal-Website refactor."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="src/app"
          description="Routes, metadata, global styles and the application shell."
        />
        <Card
          title="src/features"
          description="Domain features organized by page, with local components."
        />
        <Card
          title="src/components"
          description="Reusable common components and small UI primitives."
        />
      </div>
    </section>
  );
}
