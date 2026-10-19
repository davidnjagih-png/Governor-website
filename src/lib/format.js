export function dateParts(iso) {
  const d = iso ? new Date(`${iso}T00:00:00`) : null;
  if (!d || Number.isNaN(d.getTime())) return { day: "[DD]", month: "[MON]", full: "[Date]" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
  };
}

export function calendarLink(ev) {
  const { full } = dateParts(ev.date);
  if (!ev.date) return null;
  const d = ev.date.replaceAll("-", "");
  const text = encodeURIComponent(ev.title);
  const where = encodeURIComponent(ev.venue || "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${d}/${d}&location=${where}&details=${encodeURIComponent(full)}`;
}
