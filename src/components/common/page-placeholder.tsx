type PagePlaceholderProps = {
  title: string;
  description: string;
};

export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <article className="page-placeholder" aria-label={title}>
      <p className="page-placeholder__eyebrow">Personal Website · Page preview</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </article>
  );
}
