type PlaceholderProps = Readonly<{
  label?: string;
  decorative?: boolean;
  className?: string;
  positions?: readonly number[];
}>;
const defaultPositions = [1, 2, 3, 4] as const;
// Shared, asset-free version of the Home Gallery's four-panel visual pattern.
export default function Placeholder({
  label = "Abstract image placeholder",
  decorative = false,
  className,
  positions = defaultPositions,
}: PlaceholderProps) {
  return (
    <span
      className={["project-placeholder", className].filter(Boolean).join(" ")}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      {positions.map((position) => (
        <span
          key={position}
          className={`project-placeholder__tile project-placeholder__tile--${position}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
