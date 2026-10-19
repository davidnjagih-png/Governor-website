import { useEffect, useRef, useState } from "react";

/*
  Counts up to a value like "20+" or "1,200" when it scrolls into view.
  Falls back to the plain text for reduced motion or anything non-numeric.
*/
function CountUp({ value, duration = 1600 }) {
  const text = String(value);
  const match = text.match(/^(\D*)([\d,.]+)(.*)$/);
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !match || reduce) return;

    const [, prefix, digits, suffix] = match;
    const target = parseFloat(digits.replace(/,/g, ""));
    if (Number.isNaN(target)) return;

    const decimals = (digits.split(".")[1] || "").length;
    const useCommas = digits.includes(",");
    const format = (n) => {
      const fixed = n.toFixed(decimals);
      return prefix + (useCommas ? Number(fixed).toLocaleString("en-US", { minimumFractionDigits: decimals }) : fixed) + suffix;
    };

    let frame;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out
          setDisplay(format(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration]);

  return <span ref={ref}>{display}</span>;
}

export default CountUp;
