import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import ProjectCard from "../components/ProjectCard";
import CountUp from "../components/Motion/CountUp";
import { useContent } from "../lib/contentContext";

function Achievements() {
  const { settings, projects } = useContent();
  const [filter, setFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <Seo
        title="Achievements"
        path="/achievements"
        description={`Projects and bills delivered by ${settings.name} as Woman Representative for ${settings.county}.`}
      />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">THE RECORD</span>
          <h1>What I have <span className="accent">delivered.</span></h1>
          <p className="lead">Projects, bills and constituency work from my term as Woman Representative for {settings.county}.</p>
        </div>
      </section>

      <section className="stat-strip">
        <div className="container stat-grid">
          {settings.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-value"><CountUp value={s.value} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filters" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter ${filter === c ? "is-active" : ""}`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c === "All" ? `All ${projects.length}` : c}
              </button>
            ))}
          </div>
          {shown.length ? (
            <div className="grid" key={filter}>
              {shown.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          ) : (
            <p className="empty">Projects will appear here soon.</p>
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>See what comes next for {settings.county}.</h2>
          <Link to="/vision" className="btn btn-navy">Read the plan &rarr;</Link>
        </div>
      </section>
    </>
  );
}

export default Achievements;
