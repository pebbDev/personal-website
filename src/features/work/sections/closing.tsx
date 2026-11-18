import { Button } from "@/components/ui/Button";

export default function Closing() {
  return (
    <section className="work-closing" aria-labelledby="work-closing-title">
      <h2 id="work-closing-title" className="work-closing-title">
        Have a project in mind?
      </h2>
      <div className="work-closing-actions">
        <Button href="#home" variant="line" className="work-closing-action">
          Home
        </Button>
        <span
          className="work-closing-action work-closing-action--inactive"
          aria-describedby="work-contact-availability"
        >
          Say Hi
        </span>
      </div>
      <p id="work-contact-availability" className="work-closing-status">
        Contact details are not available in this preview.
      </p>
    </section>
  );
}
