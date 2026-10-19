import { useEffect } from "react";
import "./Motion.css";

/*
  Adds scroll-reveal and 3D-tilt effects without editing every component.
  It looks for the selectors below once the page has loaded, and again
  whenever new cards appear (for example after switching project tabs).

  To animate something new, add its CSS selector to REVEAL or TILT.
  Nothing happens when the visitor prefers reduced motion, and the
  content stays fully visible if JavaScript is off.
*/

// selector -> animation. "stagger" delays siblings one after another.
const REVEAL = [
  [".section-head > *", "up stagger"],
  [".stat", "up stagger"],
  [".about-photo", "left"],
  [".about-text", "right"],
  [".pillar-card", "up stagger"],
  [".grid .project-card", "up stagger"],
  [".carousel", "zoom"],
  [".event-card", "up stagger"],
  [".news-card", "up stagger"],
  [".step-card", "up stagger"],
  [".gallery-item", "zoom stagger"],
  [".timeline-item", "up stagger"],
  [".cta-band .container > *", "up stagger"],
];

// Cards that lean towards the pointer.
const TILT = ".grid .project-card, .pillar-card, .news-card";

const MAX_TILT = 7; // degrees

function addTilt(el) {
  if (el.dataset.tilt) return;
  el.dataset.tilt = "1";
  el.classList.add("tilt");

  const move = (e) => {
    if (e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(x * MAX_TILT * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * MAX_TILT * 2).toFixed(2)}deg`);
  };
  const reset = () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", reset);
}

function Motion() {
  useEffect(() => {
    const root = document.getElementById("main");
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canHover = window.matchMedia("(hover: hover)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-visible");
          // Once the slide-in has finished, let tilting respond quickly.
          if (el.classList.contains("tilt")) {
            setTimeout(() => el.classList.add("tilt-ready"), 1500);
          }
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    const enhance = (scope) => {
      REVEAL.forEach(([selector, kind]) => {
        const [type, stagger] = kind.split(" ");
        scope.querySelectorAll(selector).forEach((el) => {
          // Already shown: leave it alone.
          if (el.classList.contains("is-visible")) return;

          el.dataset.reveal = type;
          el.classList.add("reveal");

          if (stagger && el.parentElement) {
            const index = Array.prototype.indexOf.call(
              el.parentElement.children,
              el
            );
            el.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 70}ms`);
          }

          // Always (re)observe. React's dev mode runs effects twice, and the
          // first observer is thrown away, so skipping marked elements would
          // leave them invisible forever.
          io.observe(el);
        });
      });

      if (canHover) scope.querySelectorAll(TILT).forEach(addTilt);
    };

    enhance(root);

    // Pick up elements added later (search results, filters).
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) =>
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) enhance(node.parentElement || root);
        })
      );
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

export default Motion;
