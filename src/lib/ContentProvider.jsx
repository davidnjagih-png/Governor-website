import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db, isConfigured } from "./firebase";
import { ContentContext } from "./contentContext";
import {
  DEFAULT_SETTINGS,
  SAMPLE_EVENTS,
  SAMPLE_GALLERY,
  SAMPLE_NEWS,
  SAMPLE_PROJECTS,
} from "../data/defaults";

/*
  One place that supplies all site content. Home and Achievements both read
  `projects` from here, so a project added in the dashboard appears on both.

  - Firebase not connected: sample content from src/data/defaults.js.
  - Firebase connected: live data, updated instantly when the admin saves.
*/

function mergeSettings(saved) {
  if (!saved) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    contact: { ...DEFAULT_SETTINGS.contact, ...(saved.contact || {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(saved.socials || {}) },
  };
}

const byOrder = (a, b) =>
  (a.order ?? 9999) - (b.order ?? 9999) || (b.createdAt ?? 0) - (a.createdAt ?? 0);
const byDateAsc = (a, b) => String(a.date || "9999").localeCompare(String(b.date || "9999"));
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));

const SAMPLES = {
  projects: SAMPLE_PROJECTS,
  news: SAMPLE_NEWS,
  events: SAMPLE_EVENTS,
  gallery: SAMPLE_GALLERY,
};

function ContentProvider({ children }) {
  const [live, setLive] = useState({});
  const [saved, setSaved] = useState(null);
  const [ready, setReady] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    const unsubs = Object.keys(SAMPLES).map((name) =>
      onSnapshot(
        collection(db, name),
        (snap) =>
          setLive((prev) => ({
            ...prev,
            [name]: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
          })),
        () => setLive((prev) => ({ ...prev, [name]: [] }))
      )
    );
    unsubs.push(
      onSnapshot(
        doc(db, "settings", "site"),
        (snap) => {
          setSaved(snap.exists() ? snap.data() : null);
          setReady(true);
        },
        () => setReady(true)
      )
    );
    return () => unsubs.forEach((u) => u());
  }, []);

  const value = useMemo(() => {
    const pick = (name, sorter) =>
      [...(isConfigured ? live[name] ?? [] : SAMPLES[name])].sort(sorter);
    return {
      ready,
      isLive: isConfigured,
      settings: mergeSettings(saved),
      projects: pick("projects", byOrder),
      news: pick("news", byDateDesc),
      events: pick("events", byDateAsc),
      gallery: pick("gallery", byOrder),
    };
  }, [live, saved, ready]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export default ContentProvider;
