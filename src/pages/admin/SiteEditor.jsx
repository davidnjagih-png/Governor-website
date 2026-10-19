import { useState } from "react";
import { useContent } from "../../lib/contentContext";
import { saveSettings } from "../../lib/store";
import ImageField from "./ImageField";

const lines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

function Field({ label, hint, wide, children }) {
  return (
    <label className={`admin-field ${wide ? "wide" : ""}`}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="admin-small">{hint}</span>}
    </label>
  );
}

function Editor({ initial }) {
  const [s, setS] = useState(() => structuredClone(initial));
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key, value) => setS((cur) => ({ ...cur, [key]: value }));
  const setIn = (group, key, value) => setS((cur) => ({ ...cur, [group]: { ...cur[group], [key]: value } }));
  const setListItem = (group, i, key, value) =>
    setS((cur) => ({ ...cur, [group]: cur[group].map((it, n) => (n === i ? { ...it, [key]: value } : it)) }));

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      await saveSettings(s);
      setStatus("Saved. The public site is updated.");
    } catch {
      setStatus("Could not save. Check your connection and sign-in.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSave}>
      <div className="admin-head sticky">
        <div><h1>Site pages</h1><p className="admin-small">Numbers, About, manifesto and contact details.</p></div>
        <div className="admin-actions">
          {status && <span className="admin-ok" role="status">{status}</span>}
          <button className="admin-btn primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save all changes"}</button>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Candidate</h2>
        <div className="admin-grid">
          <Field label="Name"><input value={s.name} onChange={(e) => set("name", e.target.value)} maxLength={80} /></Field>
          <Field label="County"><input value={s.county} onChange={(e) => set("county", e.target.value)} maxLength={60} /></Field>
          <Field label="Campaign slogan" wide><input value={s.slogan} onChange={(e) => set("slogan", e.target.value)} maxLength={120} /></Field>
          <Field label="Home page opening sentence" wide hint="Shown under the main headline and on the Vision page."><textarea rows={3} value={s.heroText} onChange={(e) => set("heroText", e.target.value)} maxLength={400} /></Field>
          <ImageField label="Main portrait (Home page)" value={s.heroImage} onChange={(v) => set("heroImage", v)} maxSide={1100} />
        </div>
      </div>

      <div className="admin-panel">
        <h2>Headline numbers</h2>
        <p className="admin-small">Shown on Home and Achievements. Numbers such as 120 or 1,200+ count up when scrolled into view.</p>
        <div className="admin-grid">
          {s.stats.map((st, i) => (
            <div className="admin-pair" key={i}>
              <Field label={`Number ${i + 1}`}><input value={st.value} onChange={(e) => setListItem("stats", i, "value", e.target.value)} maxLength={20} /></Field>
              <Field label="Label"><input value={st.label} onChange={(e) => setListItem("stats", i, "label", e.target.value)} maxLength={60} /></Field>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        <h2>About her</h2>
        <div className="admin-grid">
          <Field label="Headline" wide><input value={s.aboutHeadline} onChange={(e) => set("aboutHeadline", e.target.value)} maxLength={140} /></Field>
          <Field label="Short story" wide><textarea rows={5} value={s.aboutText} onChange={(e) => set("aboutText", e.target.value)} maxLength={900} /></Field>
          <Field label="Credential tags" wide hint="One per line."><textarea rows={4} value={s.credentials.join("\n")} onChange={(e) => set("credentials", lines(e.target.value))} /></Field>
          <ImageField label="About photo" value={s.aboutImage} onChange={(v) => set("aboutImage", v)} maxSide={800} />
        </div>
      </div>

      <div className="admin-panel">
        <h2>Vision and manifesto</h2>
        {s.pillars.map((p, i) => (
          <fieldset className="admin-fieldset" key={i}>
            <legend>Priority {i + 1}</legend>
            <div className="admin-grid">
              <Field label="Title" wide><input value={p.title} onChange={(e) => setListItem("pillars", i, "title", e.target.value)} maxLength={80} /></Field>
              <Field label="Description" wide><textarea rows={3} value={p.text} onChange={(e) => setListItem("pillars", i, "text", e.target.value)} maxLength={600} /></Field>
              <Field label="Commitments" wide hint="One per line."><textarea rows={4} value={p.commitments.join("\n")} onChange={(e) => setListItem("pillars", i, "commitments", lines(e.target.value))} /></Field>
              <Field label="Target number"><input value={p.targetValue} onChange={(e) => setListItem("pillars", i, "targetValue", e.target.value)} maxLength={20} /></Field>
              <Field label="Target label"><input value={p.targetLabel} onChange={(e) => setListItem("pillars", i, "targetLabel", e.target.value)} maxLength={80} /></Field>
              <Field label="Target year"><input value={p.targetYear} onChange={(e) => setListItem("pillars", i, "targetYear", e.target.value)} maxLength={10} /></Field>
            </div>
            <button type="button" className="admin-btn danger" onClick={() => set("pillars", s.pillars.filter((_, n) => n !== i))}>Remove priority</button>
          </fieldset>
        ))}
        {s.pillars.length < 6 && (
          <button type="button" className="admin-btn" onClick={() => set("pillars", [...s.pillars, { title: "", text: "", commitments: [], targetValue: "", targetLabel: "", targetYear: "" }])}>+ Add priority</button>
        )}

        <h3 className="admin-sub">First 100 days</h3>
        <div className="admin-grid">
          {s.first100.map((st, i) => (
            <div className="admin-pair" key={i}>
              <Field label="Day"><input value={st.day} onChange={(e) => setListItem("first100", i, "day", e.target.value)} maxLength={6} /></Field>
              <Field label="Action"><input value={st.text} onChange={(e) => setListItem("first100", i, "text", e.target.value)} maxLength={120} /></Field>
            </div>
          ))}
        </div>
        <div className="admin-grid">
          <Field label="Closing pledge" wide><input value={s.pledge} onChange={(e) => set("pledge", e.target.value)} maxLength={200} /></Field>
          <Field label="Full manifesto PDF link" wide hint="Optional. Paste a link to the PDF; the download button appears when this is filled."><input type="url" value={s.manifestoUrl} onChange={(e) => set("manifestoUrl", e.target.value)} /></Field>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Contact and social links</h2>
        <div className="admin-grid">
          <Field label="Office address" wide><input value={s.contact.address} onChange={(e) => setIn("contact", "address", e.target.value)} maxLength={160} /></Field>
          <Field label="Phone"><input value={s.contact.phone} onChange={(e) => setIn("contact", "phone", e.target.value)} maxLength={40} /></Field>
          <Field label="Email"><input type="email" value={s.contact.email} onChange={(e) => setIn("contact", "email", e.target.value)} maxLength={120} /></Field>
          <Field label="Opening hours" wide><input value={s.contact.hours} onChange={(e) => setIn("contact", "hours", e.target.value)} maxLength={120} /></Field>
          {["facebook", "x", "instagram", "youtube"].map((k) => (
            <Field key={k} label={`${k === "x" ? "X" : k[0].toUpperCase() + k.slice(1)} link`} hint="Leave empty to hide the icon.">
              <input type="url" value={s.socials[k]} onChange={(e) => setIn("socials", k, e.target.value)} />
            </Field>
          ))}
        </div>
      </div>
    </form>
  );
}

function SiteEditor() {
  const { settings, ready } = useContent();
  if (!ready) return <p className="admin-small">Loading...</p>;
  return <Editor initial={settings} />;
}

export default SiteEditor;
