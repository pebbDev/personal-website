export default function MeetMePortrait({ caption }: Readonly<{ caption: string }>) {
  return (
    <figure
      className="meet-me-portrait"
      role="img"
      aria-label="Portrait placeholder awaiting approval"
      style={{ margin: 0 }}
    >
      <div
        className="meet-me-portrait-art"
        aria-hidden="true"
        style={{
          aspectRatio: "4 / 5",
          background: "linear-gradient(145deg, #f0efec, #dedcd7)",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <span
          style={{
            backgroundColor: "#c7c4be",
            borderRadius: "50%",
            height: "36%",
            left: "32%",
            position: "absolute",
            top: "18%",
            width: "36%",
          }}
        />
        <span
          style={{
            backgroundColor: "#b9b6b0",
            borderRadius: "50% 50% 0 0",
            bottom: 0,
            height: "42%",
            left: "12%",
            position: "absolute",
            width: "76%",
          }}
        />
      </div>
      <figcaption className="meet-me-portrait-caption">{caption}</figcaption>
    </figure>
  );
}
