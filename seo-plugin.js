import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";

/*
  After the build, writes one HTML file per public page with its own title,
  description, canonical link, share tags and structured data, plus
  sitemap.xml and robots.txt. The admin area is excluded and marked noindex.
  Set VITE_SITE_URL, VITE_CANDIDATE_NAME and VITE_COUNTY in .env.
*/
export default function seoPlugin() {
  let outDir = "dist";
  let env = {};

  return {
    name: "campaign-seo",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      env = loadEnv(config.mode, config.root, "VITE_");
    },
    closeBundle() {
      const site = (env.VITE_SITE_URL || "https://example.com").replace(/\/$/, "");
      const name = env.VITE_CANDIDATE_NAME || "Candidate Name";
      const county = env.VITE_COUNTY || "County";
      const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

      const pages = [
        { route: "/", title: `${name} for Governor, ${county}`, desc: `${name}, former Woman Representative, is running for Governor of ${county}. See what she has delivered and her plan for the county.` },
        { route: "/achievements", title: `Achievements | ${name}`, desc: `Projects, bills and constituency work delivered by ${name} as Woman Representative for ${county}.` },
        { route: "/vision", title: `Vision and Manifesto | ${name}`, desc: `${name}'s plan for ${county}: priorities, measurable targets and the first 100 days.` },
        { route: "/news", title: `News, Events and Gallery | ${name}`, desc: `Latest news, upcoming events and photos from the ${name} campaign.` },
        { route: "/contact", title: `Contact | ${name}`, desc: `Send a question, idea or invitation to the ${name} campaign team.` },
      ];

      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Person", name, jobTitle: `Aspirant Governor, ${county}`, url: site },
          { "@type": "WebSite", name: `${name} for Governor`, url: site },
        ],
      });

      for (const p of pages) {
        const url = site + (p.route === "/" ? "/" : p.route);
        const head = [
          `<title>${esc(p.title)}</title>`,
          `<meta name="description" content="${esc(p.desc)}" />`,
          `<meta name="robots" content="index, follow" />`,
          `<link rel="canonical" href="${url}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:title" content="${esc(p.title)}" />`,
          `<meta property="og:description" content="${esc(p.desc)}" />`,
          `<meta property="og:url" content="${url}" />`,
          `<meta name="twitter:card" content="summary" />`,
          `<script type="application/ld+json">${jsonLd}</script>`,
        ].join("\n    ");
        const html = template.replace(/<title>.*?<\/title>/, head);
        const dir = p.route === "/" ? outDir : path.join(outDir, p.route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      }

      // Admin and unknown paths fall back to the app shell, marked noindex.
      const shell = template.replace(/<title>.*?<\/title>/, `<title>Admin</title>\n    <meta name="robots" content="noindex, nofollow" />`);
      fs.writeFileSync(path.join(outDir, "404.html"), shell);
      fs.mkdirSync(path.join(outDir, "admin"), { recursive: true });
      fs.writeFileSync(path.join(outDir, "admin", "index.html"), shell);

      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
          .map((p) => `  <url><loc>${site}${p.route === "/" ? "/" : p.route}</loc><lastmod>${today}</lastmod></url>`)
          .join("\n")}\n</urlset>\n`
      );
      fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`);
    },
  };
}
