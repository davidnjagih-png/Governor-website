import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import CountUp from "../components/Motion/CountUp";
import ProjectCarousel from "../components/ProjectCarousel";
import { useContent } from "../lib/contentContext";
import { dateParts } from "../lib/format";

function Home() {
  const { settings, projects, news, events } = useContent();
  const { stats, pillars } = settings;
  const upcoming = events.slice(0, 2);
  const latest = news[0];

  return (
    <>
      <Seo />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow-pill">FORMER WOMAN REPRESENTATIVE · {settings.county.toUpperCase()}</span>
            <h1>
              Proven results.
              <br />
              <span className="accent">Ready to lead</span> {settings.county}.
            </h1>
            <p className="lead">{settings.heroText}</p>
            <div className="btn-row">
              <Link to="/achievements" className="btn btn-yellow">See what I have delivered</Link>
              <Link to="/vision" className="btn btn-outline-light">Read my plan for {settings.county}</Link>
            </div>
          </div>
          <div className="hero-visual">
            <Photo src={settings.heroImage} label="PORTRAIT PHOTO" alt={settings.name} dark className="hero-photo" />
            <div className="hero-chip">
              <strong>{stats[0]?.value}</strong>
              <span>{stats[0]?.label?.toLowerCase()}</span>
            </div>
            <div className="hero-chip second yellow">
              <strong>{stats[1]?.value}</strong>
              <span>{stats[1]?.label?.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stat-strip" aria-label="Results at a glance">
        <div className="container stat-grid">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-value"><CountUp value={s.value} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head split">
            <div>
              <span className="eyebrow">WHAT I HAVE DONE</span>
              <h2>Delivered, not promised.</h2>
              <p className="muted">Highlights from my term as Woman Representative. They rotate automatically, or use the arrows.</p>
            </div>
            <Link to="/achievements" className="text-link">View all achievements &rarr;</Link>
          </div>
          <ProjectCarousel projects={projects.slice(0, 9)} />
        </div>
      </section>

      <section className="section alt">
        <div className="container about-grid">
          <div className="about-photo">
            <Photo src={settings.aboutImage} label="PHOTO" alt={settings.name} className="round-photo" />
          </div>
          <div className="about-text">
            <span className="eyebrow">MEET {settings.name.toUpperCase()}</span>
            <h2>{settings.aboutHeadline}</h2>
            <p className="lead dark">{settings.aboutText}</p>
            <ul className="tags">
              {settings.credentials.filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section navy">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow light">WHAT I WILL DO NEXT</span>
            <h2>My plan for {settings.county}.</h2>
          </div>
          <div className="pillar-grid">
            {pillars.map((p, i) => (
              <div className="pillar-card" key={i}>
                <div className="big-number">{String(i + 1).padStart(2, "0")}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <Link to="/vision" className="btn btn-yellow mt">Read the full plan &rarr;</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head split">
            <div>
              <span className="eyebrow">ON THE GROUND</span>
              <h2>News &amp; upcoming events</h2>
            </div>
            <Link to="/news" className="text-link">All news &amp; gallery &rarr;</Link>
          </div>
          <div className="event-grid">
            {upcoming.map((ev) => {
              const d = dateParts(ev.date);
              return (
                <div className="event-card" key={ev.id}>
                  <div className="date-tile"><strong>{d.day}</strong><span>{d.month}</span></div>
                  <div>
                    <h3>{ev.title}</h3>
                    <p className="muted small">{[ev.venue, ev.time].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
              );
            })}
            {latest && (
              <Link to="/news" className="event-card latest">
                <div>
                  <span className="eyebrow small">LATEST NEWS · {dateParts(latest.date).full}</span>
                  <h3>{latest.title}</h3>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Have a question or an idea for {settings.county}?</h2>
          <Link to="/contact" className="btn btn-navy">Contact the team</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
