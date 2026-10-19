import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import { useContent } from "../lib/contentContext";
import { calendarLink, dateParts } from "../lib/format";

function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo" onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <Photo src={item.image} label="PHOTO" alt={item.caption} dark />
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close photo">&times;</button>
    </div>
  );
}

function News() {
  const { settings, news, events, gallery } = useContent();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  const cats = ["All", ...new Set(gallery.map((g) => g.category).filter(Boolean))];
  const shown = filter === "All" ? gallery : gallery.filter((g) => g.category === filter);

  return (
    <>
      <Seo
        title="News, Events and Gallery"
        path="/news"
        description={`Latest news, upcoming events and photos from the ${settings.name} campaign.`}
      />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">ON THE GROUND</span>
          <h1>News, events <span className="accent">&amp; gallery.</span></h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Upcoming events</h2>
          <div className="event-list">
            {events.length === 0 && <p className="empty">No events are scheduled right now. Check back soon.</p>}
            {events.map((ev) => {
              const d = dateParts(ev.date);
              const link = calendarLink(ev);
              return (
                <div className="event-card wide" key={ev.id}>
                  <div className="date-tile"><strong>{d.day}</strong><span>{d.month}</span></div>
                  <div className="grow">
                    <h3>{ev.title}</h3>
                    <p className="muted">{[ev.venue, ev.time].filter(Boolean).join(" · ")}</p>
                  </div>
                  {link && <a className="btn btn-outline btn-sm" href={link} target="_blank" rel="noopener noreferrer">Add to calendar</a>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>Latest news</h2>
          {news.length === 0 && <p className="empty">News will appear here soon.</p>}
          <div className="news-grid">
            {news.map((n) => (
              <article className="news-card" key={n.id}>
                <Photo src={n.image} label="NEWS PHOTO" alt={n.title} />
                <div className="news-body">
                  <span className="eyebrow small">{[dateParts(n.date).full, n.tag].filter(Boolean).join(" · ").toUpperCase()}</span>
                  <h3>{n.title}</h3>
                  <p className="muted">{n.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Gallery</h2>
          <div className="filters" role="group" aria-label="Filter gallery">
            {cats.map((c) => (
              <button key={c} type="button" className={`filter ${filter === c ? "is-active" : ""}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          {shown.length === 0 && <p className="empty">Photos will appear here soon.</p>}
          <div className="gallery" key={filter}>
            {shown.map((g, i) => (
              <button type="button" className={`gallery-item ${i === 0 ? "big" : ""}`} key={g.id} onClick={() => setOpen(g)} aria-label={`Open photo: ${g.caption || "gallery photo"}`}>
                <Photo src={g.image} label="PHOTO" alt={g.caption} />
              </button>
            ))}
          </div>
        </div>
      </section>
      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </>
  );
}

export default News;
