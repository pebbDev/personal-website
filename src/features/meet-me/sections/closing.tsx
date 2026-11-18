import { Button } from "@/components/ui/Button";

export default function Closing({ heading }: Readonly<{ heading: string }>) {
  return (
    <section className="meet-me-closing" aria-labelledby="meet-me-closing-title">
      <h2 id="meet-me-closing-title">{heading}</h2>
      <div className="meet-me-closing-actions">
        <Button type="button" variant="line" size="lg" disabled>
          Explore work
        </Button>
        <Button type="button" variant="dark" size="lg" disabled>
          Get in touch
        </Button>
      </div>
    </section>
  );
}
