import type { MeetMeRow } from "../../types";

export default function DetailRows({ rows }: Readonly<{ rows: readonly MeetMeRow[] }>) {
  return (
    <dl className="meet-me-rows">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
