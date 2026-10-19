import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProjectCard from "./ProjectCard";

/* Rotating project cards. Pause button + pause on hover; no autoplay for
   visitors who prefer reduced motion. */
function ProjectCarousel({ projects }) {
  const swiperRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toggle = () => {
    const s = swiperRef.current;
    if (!s) return;
    if (playing) s.autoplay.stop();
    else s.autoplay.start();
    setPlaying(!playing);
  };

  if (!projects.length) {
    return <p className="empty">Projects will appear here soon.</p>;
  }

  return (
    <div className="carousel reveal-target">
      <div className="carousel-controls">
        <button type="button" className="round-btn" aria-label="Previous project" onClick={() => swiperRef.current?.slidePrev()}>
          &larr;
        </button>
        <button type="button" className="round-btn is-dark" aria-label="Next project" onClick={() => swiperRef.current?.slideNext()}>
          &rarr;
        </button>
      </div>
      <Swiper
        modules={[Autoplay, Pagination, Keyboard, A11y, Navigation]}
        onSwiper={(s) => (swiperRef.current = s)}
        slidesPerView={1}
        spaceBetween={24}
        breakpoints={{ 700: { slidesPerView: 2 }, 1050: { slidesPerView: 3 } }}
        loop={projects.length > 3}
        autoplay={reduce ? false : { delay: 3600, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
      >
        {projects.map((p) => (
          <SwiperSlide key={p.id}>
            <ProjectCard project={p} />
          </SwiperSlide>
        ))}
      </Swiper>
      {!reduce && (
        <button type="button" className="pause-btn" onClick={toggle}>
          {playing ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}

export default ProjectCarousel;
