/*
  SAMPLE CONTENT. Everything in [square brackets] is a placeholder.
  Once Firebase is connected, the admin dashboard replaces all of this and
  nothing here needs editing. If Firebase is not connected, the site shows
  this content so you can still preview every page.
*/

export const DEFAULT_SETTINGS = {
  name: "[Candidate Name]",
  county: "[County]",
  slogan: "[Campaign slogan]",
  heroText:
    "[One sentence on what she delivered as Woman Representative, and why she is now running for Governor.]",
  heroImage: "",
  aboutImage: "",
  aboutHeadline: "[A short headline about her story]",
  aboutText:
    "[Two or three sentences: where she is from, her background, her years in public service and her term as Woman Representative.]",
  credentials: ["[Profession / degree]", "[00] years in public service", "[Committee roles]"],
  stats: [
    { value: "[000]", label: "Projects delivered" },
    { value: "[00]", label: "Wards reached" },
    { value: "[0,000]", label: "Women and youth supported" },
    { value: "[00]", label: "Bills and motions sponsored" },
  ],
  manifestoUrl: "",
  pledge: "[A short pledge or slogan in her own words.]",
  pillars: [
    {
      title: "[Pillar one: e.g. Health]",
      text: "[One paragraph on the problem and her approach.]",
      commitments: ["[Commitment one]", "[Commitment two]", "[Commitment three]"],
      targetValue: "[00%]",
      targetLabel: "[Measurable goal]",
      targetYear: "[Year]",
    },
    {
      title: "[Pillar two: e.g. Jobs and youth]",
      text: "[One paragraph on the problem and her approach.]",
      commitments: ["[Commitment one]", "[Commitment two]", "[Commitment three]"],
      targetValue: "[0,000]",
      targetLabel: "[Measurable goal]",
      targetYear: "[Year]",
    },
    {
      title: "[Pillar three: e.g. Water and roads]",
      text: "[One paragraph on the problem and her approach.]",
      commitments: ["[Commitment one]", "[Commitment two]", "[Commitment three]"],
      targetValue: "[00]",
      targetLabel: "[Measurable goal]",
      targetYear: "[Year]",
    },
  ],
  first100: [
    { day: "[00]", text: "[First action]" },
    { day: "[00]", text: "[Second action]" },
    { day: "[00]", text: "[Third action]" },
    { day: "[00]", text: "[Fourth action]" },
  ],
  contact: {
    address: "[Office address], [Town]",
    phone: "",
    email: "",
    hours: "[Opening hours]",
  },
  socials: { facebook: "", x: "", instagram: "", youtube: "" },
};

export const CATEGORIES = ["Health", "Education", "Women and youth", "Water and infrastructure", "Legislation", "Other"];

export const SAMPLE_PROJECTS = [
  ["Health", "[Project name]", "[Ward], [Sub-county]", "[Year]", "[e.g. number of people served]"],
  ["Education", "[Project name]", "[Ward], [Sub-county]", "[Year]", "[e.g. bursaries awarded]"],
  ["Women and youth", "[Project name]", "[Ward], [Sub-county]", "[Year]", "[e.g. groups funded]"],
  ["Water and infrastructure", "[Project name]", "[Ward], [Sub-county]", "[Year]", "[e.g. households connected]"],
  ["Legislation", "[Bill or motion name]", "National Assembly", "[Year]", "[Its status]"],
].map(([category, title, ward, year, result], i) => ({
  id: `sample-${i}`,
  category,
  title,
  ward,
  year,
  result,
  summary: "[Two lines on what was built or passed, and who benefited.]",
  image: "",
  order: i,
}));

export const SAMPLE_NEWS = [0, 1, 2].map((i) => ({
  id: `sample-news-${i}`,
  title: "[News headline goes here]",
  date: "",
  tag: ["Press release", "Media", "Campaign update"][i],
  summary: "[Two-line summary.]",
  image: "",
}));

export const SAMPLE_EVENTS = [
  { id: "sample-event-0", title: "[Town hall: event title]", date: "", venue: "[Venue], [Town]", time: "[Time]" },
  { id: "sample-event-1", title: "[Women's forum: event title]", date: "", venue: "[Venue], [Town]", time: "[Time]" },
];

export const SAMPLE_GALLERY = Array.from({ length: 7 }, (_, i) => ({
  id: `sample-gallery-${i}`,
  image: "",
  caption: "[Photo caption]",
  category: ["Projects", "Community", "Parliament"][i % 3],
}));
