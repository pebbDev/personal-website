export default function MeetMePortrait({ caption }: Readonly<{ caption: string }>) {
  return (
    <figure className="meet-me-portrait" role="img" aria-label="Portrait placeholder awaiting approval">
      <div className="meet-me-portrait-art" aria-hidden="true">
        <span className="meet-me-portrait-head" />
        <span className="meet-me-portrait-shoulders" />
      </div>
      <figcaption className="meet-me-portrait-caption">{caption}</figcaption>
    </figure>
  );
}
