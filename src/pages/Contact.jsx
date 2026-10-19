import { useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { createElement } from "react";
import Seo from "../components/Seo";
import { useContent } from "../lib/contentContext";
import { isConfigured } from "../lib/firebase";
import { sendMessage } from "../lib/store";

const TOPICS = ["A question or idea", "Volunteering", "Invite her to an event", "Media enquiry"];
const SOCIALS = [
  ["facebook", "Facebook", FaFacebookF],
  ["x", "X", FaXTwitter],
  ["instagram", "Instagram", FaInstagram],
  ["youtube", "YouTube", FaYoutube],
];
const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID;

function Contact() {
  const { settings } = useContent();
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const c = settings.contact;

  async function onSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget; // React clears currentTarget after an await
    const form = new FormData(formEl);
    if (form.get("website")) return; // honeypot: bots fill this in
    const data = {
      name: String(form.get("name")).trim().slice(0, 120),
      email: String(form.get("email")).trim().slice(0, 160),
      ward: String(form.get("ward") || "").trim().slice(0, 120),
      topic: String(form.get("topic")),
      message: String(form.get("message")).trim().slice(0, 3000),
    };
    setState("sending");
    try {
      if (isConfigured) await sendMessage(data);
      if (FORMSPREE) {
        await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
      }
      if (!isConfigured && !FORMSPREE) await new Promise((r) => setTimeout(r, 500)); // preview mode
      formEl.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const socials = SOCIALS.filter(([k]) => settings.socials[k]);

  return (
    <>
      <Seo title="Contact" path="/contact" description={`Send a question, idea or invitation to the ${settings.name} campaign team.`} />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow light">TALK TO THE TEAM</span>
          <h1>Let us <span className="accent">hear you.</span></h1>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <form className="form" onSubmit={onSubmit}>
            <label>Full name<input name="name" required maxLength={120} autoComplete="name" /></label>
            <div className="form-row">
              <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
              <label>Ward or sub-county<input name="ward" maxLength={120} /></label>
            </div>
            <label>I am writing about
              <select name="topic">{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label>Message<textarea name="message" rows={6} required minLength={5} maxLength={3000} /></label>
            <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="btn btn-navy" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Sending..." : "Send message"}
            </button>
            <p className="muted small" role="status" aria-live="polite">
              {state === "sent" && "Thank you. Your message has been sent."}
              {state === "error" && "Sorry, that did not send. Please try again in a moment."}
              {state === "idle" && "We never share your details. No donations are requested on this site."}
            </p>
          </form>
          <aside className="contact-side">
            <div className="card light">
              <h2>Campaign office</h2>
              <p>
                {[c.address, c.phone, c.email, c.hours].filter(Boolean).map((line, i) => <span key={i}>{line}<br /></span>)}
              </p>
            </div>
            {socials.length > 0 && (
              <div className="card yellow">
                <h2>Follow the campaign</h2>
                <div className="socials dark">
                  {socials.map(([k, label, icon]) => (
                    <a key={k} href={settings.socials[k]} target="_blank" rel="noopener noreferrer" aria-label={label}>{createElement(icon)}</a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}

export default Contact;
