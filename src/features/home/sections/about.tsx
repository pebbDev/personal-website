export default function About() {
  return (
    <section id="about" className="home-section home-about" aria-labelledby="about-heading">
      <div className="home-wrap home-about-grid">
        <div>
          <p className="home-eyebrow">About</p>
          <h2 id="about-heading" className="home-heading">
            An introduction.
          </h2>
        </div>
        <div className="home-portrait-placeholder" aria-hidden="true" />
        <p className="home-copy">
          This space is reserved for an introduction. Personal details and imagery will be added after review.
        </p>
      </div>
    </section>
  );
}
