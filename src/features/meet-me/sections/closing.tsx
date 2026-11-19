import { Button } from "@/components/ui/Button";

export default function Closing({ heading }: Readonly<{ heading: string }>) {
  return (
    <section className="meet-me-closing" aria-labelledby="meet-me-closing-title">
      <h2 id="meet-me-closing-title">{heading}</h2>
      <div className="meet-me-closing-actions">
        <Button href="#work" variant="line" size="lg">
          See my work
        </Button>
        <Button type="button" variant="dark" size="lg" disabled>
          Say Hi 💬
        </Button>
      </div>
    </section>
  );
}
