import TitleSection from "@/components/common/title-section/title-section";

export default function Contact() {
  return (
    <section
      id="next-steps"
      className="mt-10 rounded-3xl border border-outline bg-slate-50 p-8 md:p-10"
      aria-labelledby="next-steps-title"
    >
      <TitleSection
        id="next-steps-title"
        eyebrow="Next"
        title="Implement pages after the architecture review"
        description="This foundation intentionally contains no personal contacts, external forms or third-party case studies. Content and publication rights will be reviewed separately."
      />
    </section>
  );
}
