import TestimonialsBoard from "../components/TestimonialsBoard";
import { testimonialPreviews } from "../constants";

export default function Testimonials() {
  return (
    <section id="words" className="home-section home-words" aria-labelledby="words-heading">
      <div className="home-words-pin">
        <div className="home-words-sticky">
          <div className="home-wrap home-words-head">
            <p className="home-eyebrow">The Feedback</p>
            <h2 id="words-heading" className="home-heading">
              Nice Things People Said
            </h2>
          </div>
          <div className="home-wrap">
            <TestimonialsBoard items={testimonialPreviews} />
          </div>
        </div>
      </div>
    </section>
  );
}
