export default function Things() {
  return (
    <section id="things" className="home-section home-things" aria-labelledby="things-heading">
      <div className="home-wrap">
        <p className="home-eyebrow">Featured work</p>
        <h2 id="things-heading" className="home-heading">
          Selected explorations.
        </h2>
        <p className="home-copy">Two spaces reserved for featured projects.</p>
        <div className="home-projects">
          <article className="home-project-placeholder">
            <h3>Project placeholder 01</h3>
          </article>
          <article className="home-project-placeholder">
            <h3>Project placeholder 02</h3>
          </article>
        </div>
      </div>
    </section>
  );
}
