import TitleSection from "@/components/common/title-section/title-section";
import Card from "@/components/ui/card/card";

export default function Activities() {
  return (
    <section id="assets" className="py-12" aria-labelledby="assets-title">
      <TitleSection
        id="assets-title"
        eyebrow="Preserved"
        title="Your assets remain intact"
        description="Existing image files, certifications, project media, PDF, CSS, JavaScript and vendor assets have been moved to Next.js public/assets without changing their bytes."
      />
      <Card
        title="public/assets"
        description="Use /assets/... URLs inside Next.js. A separate SHA-256 manifest verifies all 138 legacy asset files."
      />
    </section>
  );
}
