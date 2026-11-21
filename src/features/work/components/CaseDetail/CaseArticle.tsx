import CaseMedia, { CasePlaceholder } from "./CaseMedia";
import CaseSection from "./CaseSection";
import type { CaseDetailData, CaseDetailStep } from "./types";

function OrderedSteps({ steps, small = false }: Readonly<{ steps: readonly CaseDetailStep[]; small?: boolean }>) {
  return (
    <ol className={`case-detail-steps${small ? " case-detail-steps--compact" : ""}`}>
      {steps.map((step, index) => (
        <li className="case-detail-step" key={step.title}>
          <span className="case-detail-step-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export default function CaseArticle({ caseStudy }: Readonly<{ caseStudy: CaseDetailData }>) {
  const [overview, problem, audience, design, reflection] = caseStudy.sections;
  return (
    <article className="case-detail-article" aria-label="Project case study">
      <CaseSection section={overview}>
        <p>
          Strong experiences begin with focused information, clear visual priorities, and a sense of direction. This
          example uses neutral copy to preserve the layout while original materials remain unavailable.
        </p>
        <blockquote className="case-detail-quote">
          Design is most useful when it makes the next step feel natural.
        </blockquote>
      </CaseSection>

      <CaseSection section={problem}>
        <ol className="case-detail-steps">
          {caseStudy.challengeSteps.map((step, index) => (
            <li className="case-detail-step" key={step.title}>
              <span className="case-detail-step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="case-detail-disclosures">
                  {step.disclosures.map((disclosure) => (
                    <details className="case-detail-disclosure" key={disclosure.title}>
                      <summary>
                        {disclosure.title}
                        <span aria-hidden="true">+</span>
                      </summary>
                      <p>{disclosure.body}</p>
                    </details>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseSection section={audience}>
        <div className="case-detail-audiences">
          {caseStudy.audiences.map((item) => (
            <div className="case-detail-audience" key={item.title}>
              <h3>{item.title}</h3>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="case-detail-audience-note">{item.note}</p>
            </div>
          ))}
        </div>
        <dl className="case-detail-research-rows">
          {caseStudy.audienceRows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <h3 className="case-detail-subheading">Insights that shaped the concept</h3>
        <OrderedSteps steps={caseStudy.insightSteps} small />
        <figure className="case-detail-audience-media">
          <CasePlaceholder label="Responsive device mockup placeholder" />
        </figure>
      </CaseSection>

      <CaseSection section={design}>
        <div className="case-detail-design-pages">
          {caseStudy.designPages.map((page) => (
            <section className="case-detail-design-page" key={page.id} aria-label={page.title}>
              <div className="case-detail-page-heading">
                <h3>{page.title}</h3>
                <div>
                  <p>{page.summary}</p>
                  <p className="case-detail-goal">{page.goal}</p>
                </div>
              </div>
              <div className="case-detail-media-grid">
                {page.media.map((media) => (
                  <CaseMedia media={media} key={media.id} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </CaseSection>

      <CaseSection section={reflection}>
        <ul className="case-detail-outcomes">
          {caseStudy.outcomes.map((outcome) => (
            <li key={outcome}>
              <span aria-hidden="true">✓</span>
              {outcome}
            </li>
          ))}
        </ul>
        <h3 className="case-detail-subheading">Next steps</h3>
        <OrderedSteps steps={caseStudy.nextSteps} small />
      </CaseSection>
    </article>
  );
}
