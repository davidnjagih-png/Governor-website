import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContent } from "../../lib/contentContext";
import { CATEGORIES, SAMPLE_EVENTS, SAMPLE_GALLERY, SAMPLE_NEWS, SAMPLE_PROJECTS } from "../../data/defaults";
import { dateParts } from "../../lib/format";
import Crud from "./Crud";
import SiteEditor from "./SiteEditor";
import Messages from "./Messages";

const projectFields = [
  { key: "title", label: "Project or bill name", required: true, max: 120, wide: true },
  { key: "category", label: "Category", type: "select", options: CATEGORIES, default: CATEGORIES[0] },
  { key: "year", label: "Year", max: 20, placeholder: "2024" },
  { key: "ward", label: "Ward and sub-county", max: 120, placeholder: "Ward, Sub-county" },
  { key: "result", label: "Result", max: 160, placeholder: "e.g. 12,000 people served", hint: "One short line with a number if possible." },
  { key: "summary", label: "Description", type: "textarea", max: 600, wide: true },
  { key: "image", label: "Photo", type: "image" },
];

const newsFields = [
  { key: "title", label: "Headline", required: true, max: 140, wide: true },
  { key: "date", label: "Date", type: "date" },
  { key: "tag", label: "Label", max: 40, placeholder: "Press release" },
  { key: "summary", label: "Summary", type: "textarea", max: 500, wide: true },
  { key: "image", label: "Photo", type: "image" },
];

const eventFields = [
  { key: "title", label: "Event title", required: true, max: 140, wide: true },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "time", label: "Time", max: 40, placeholder: "2:00 PM" },
  { key: "venue", label: "Venue and town", max: 140, wide: true },
];

const galleryFields = [
  { key: "image", label: "Photo", type: "image", maxSide: 1400 },
  { key: "caption", label: "Caption", max: 160, wide: true },
  { key: "category", label: "Group", max: 40, placeholder: "Projects, Community, Parliament", hint: "Photos with the same group are filtered together." },
];

function Overview() {
  const { projects, news, events, gallery, settings } = useContent();
  const cards = [
    ["Achievements", projects.length, "/admin/achievements"],
    ["News posts", news.length, "/admin/news"],
    ["Events", events.length, "/admin/events"],
    ["Gallery photos", gallery.length, "/admin/gallery"],
  ];
  return (
    <div>
      <div className="admin-head"><div><h1>Welcome back</h1><p className="admin-small">Changes appear on the public site straight away.</p></div></div>
      <div className="admin-cards">
        {cards.map(([label, n, to]) => (
          <NavLink key={label} to={to} className="admin-stat"><strong>{n}</strong><span>{label}</span></NavLink>
        ))}
      </div>
      <div className="admin-panel">
        <h2>How it works</h2>
        <ul className="admin-small steps">
          <li><b>Achievements</b> feed both the Achievements page and the rotating carousel on the Home page. Add one here and it shows in both.</li>
          <li><b>Site pages</b> edits the headline numbers, the About text, the manifesto and contact details for {settings.name}.</li>
          <li><b>Messages</b> shows everything sent through the Contact form.</li>
        </ul>
        <a className="admin-btn" href="/" target="_blank" rel="noopener noreferrer">Open the public site</a>
      </div>
    </div>
  );
}

function Dashboard({ user, onSignOut }) {
  const [unread, setUnread] = useState(0);

  useEffect(
    () =>
      onSnapshot(collection(db, "messages"), (snap) =>
        setUnread(snap.docs.filter((d) => !d.data().read).length)
      ),
    []
  );

  const links = [
    ["/admin", "Overview", true],
    ["/admin/achievements", "Achievements"],
    ["/admin/pages", "Site pages"],
    ["/admin/news", "News"],
    ["/admin/events", "Events"],
    ["/admin/gallery", "Gallery"],
    ["/admin/messages", "Messages"],
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">Admin</div>
        <nav aria-label="Admin">
          {links.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} className="admin-nav">
              {label}
              {label === "Messages" && unread > 0 && <span className="badge">{unread}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <span className="admin-small">{user.email}</span>
          <button className="admin-btn" onClick={onSignOut}>Sign out</button>
        </div>
      </aside>
      <section className="admin-main">
        <Routes>
          <Route index element={<Overview />} />
          <Route
            path="achievements"
            element={
              <Crud
                name="projects"
                title="Achievements"
                intro="Shown on the Achievements page and in the Home page carousel. The first nine appear on Home."
                singular="achievement"
                fields={projectFields}
                sortable
                samples={SAMPLE_PROJECTS}
                describe={(p) => ({ title: p.title, sub: [p.category, p.ward, p.year].filter(Boolean).join(" · "), image: p.image })}
              />
            }
          />
          <Route path="pages" element={<SiteEditor />} />
          <Route
            path="news"
            element={
              <Crud name="news" title="News" singular="news post" fields={newsFields} samples={SAMPLE_NEWS}
                describe={(n) => ({ title: n.title, sub: [dateParts(n.date).full, n.tag].filter(Boolean).join(" · "), image: n.image })} />
            }
          />
          <Route
            path="events"
            element={
              <Crud name="events" title="Events" singular="event" fields={eventFields} samples={SAMPLE_EVENTS}
                describe={(e) => ({ title: e.title, sub: [dateParts(e.date).full, e.venue].filter(Boolean).join(" · ") })} />
            }
          />
          <Route
            path="gallery"
            element={
              <Crud name="gallery" title="Gallery" singular="photo" fields={galleryFields} sortable samples={SAMPLE_GALLERY}
                describe={(g) => ({ title: g.caption || "Untitled photo", sub: g.category, image: g.image })} />
            }
          />
          <Route path="messages" element={<Messages />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </section>
    </div>
  );
}

export default Dashboard;
