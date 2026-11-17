import ClientsMarquee from "../components/ClientsMarquee";
import { clientPreviews } from "../constants";

export default function Clients() {
  return (
    <section id="clients" className="home-section home-clients" aria-labelledby="clients-heading">
      <div className="home-wrap home-clients-heading-wrap">
        <div className="home-clients-heading">
          <p className="home-eyebrow">Collaborations</p>
          <h2 id="clients-heading" className="home-heading">
            Space for future collaborations.
          </h2>
        </div>
      </div>
      <ClientsMarquee items={clientPreviews} />
    </section>
  );
}
