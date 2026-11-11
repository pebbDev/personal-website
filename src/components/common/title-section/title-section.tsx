type TitleSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function TitleSection({ id, eyebrow, title, description }: TitleSectionProps) {
  return (
    <div className="mb-7">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">{eyebrow}</p>
      )}
      <h2 id={id} className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{description}</p>}
    </div>
  );
}
