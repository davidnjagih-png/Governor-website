import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useContent } from "../lib/contentContext";

function Vision() {
  const { settings } = useContent();
  return (
    <>
      <Seo
        title="Vision and Manifesto"
        path="/vision"
        description={`${settings.name}'s plan for ${settings.county}: priorities, targets and the first 100 days.`}
      />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">THE MANIFESTO</span>
          <h1>My plan for <span className="accent">{settings.county}.</span></h1>
          <p className="lead">{settings.heroText}</p>
          {settings.manifestoUrl && (
            <a className="btn btn-yellow" href={settings.manifestoUrl} target="_blank" rel="noopener noreferrer">
              Download the full manifesto &darr;
            </a>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          {settings.pillars.map((p, i) => (
            <article className="pillar-row" key={i}>
              <div className="outline-number">{String(i + 1).padStart(2, "0")}</div>
              <div className="pillar-main">
                <h2>{p.title}</h2>
                <p className="lead dark">{p.text}</p>
                <ul className="check-list">
                  {p.commitments.filter(Boolean).map((c, j) => <li key={j}>{c}</li>)}
                </ul>
              </div>
              <aside className="target-box">
                <span>TARGET BY {p.targetYear}</span>
                <strong>{p.targetValue}</strong>
                <small>{p.targetLabel}</small>
              </aside>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">FIRST 100 DAYS</span>
            <h2>What happens first.</h2>
          </div>
          <div className="step-grid">
            {settings.first100.map((s, i) => (
              <div className="step-card" key={i}>
                <span className="muted small bold">DAY {s.day}</span>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <p className="pledge">&ldquo;{settings.pledge}&rdquo;</p>
          <Link to="/contact" className="btn btn-yellow mt">Share your priorities with me</Link>
        </div>
      </section>
    </>
  );
}

export default Vision;
