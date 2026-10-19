import { useEffect } from "react";
import { useContent } from "../lib/contentContext";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");

function setMeta(selector, attr, name, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/* Updates the tab title and search/share tags when the page changes.
   The build step also writes these into each page's HTML for crawlers. */
function Seo({ title, description, path = "/", noindex = false }) {
  const { settings } = useContent();
  useEffect(() => {
    const full = title ? `${title} | ${settings.name}` : `${settings.name} for Governor, ${settings.county}`;
    document.title = full;
    setMeta('meta[name="description"]', "name", "description", description || settings.heroText);
    setMeta('meta[property="og:title"]', "property", "og:title", full);
    setMeta('meta[property="og:description"]', "property", "og:description", description || settings.heroText);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    if (SITE_URL) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = SITE_URL + path;
    }
  }, [title, description, path, noindex, settings]);
  return null;
}

export default Seo;
