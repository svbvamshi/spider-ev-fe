import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroVid from "../../assets/bess/hero-vid.mp4";

const BessHero = () => {
  const videoRef = useRef(null);
  const [showContent, setShowContent] = useState(false);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fallback: if video can't autoplay or takes too long, show content after 4s
    const fallback = setTimeout(() => setShowContent(true), 4000);

    const handleTimeUpdate = () => {
      const { currentTime, duration } = video;
      // Trigger content at 78% through the video
      if (duration && currentTime >= duration * 0.85) {
        setShowContent(true);
        clearTimeout(fallback);
      }
    };

    const handleEnded = () => {
      setShowContent(true);
      clearTimeout(fallback);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      clearTimeout(fallback);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video — plays once, holds last frame */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVid} type="video/mp4" />
      </video>

      {/* Content — slides in near end of video */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-10 flex flex-col justify-center text-white px-6 sm:px-12 lg:px-20"
          >
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-block border border-white/40 text-white/90 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6"
              >
                Battery Energy Storage Systems
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
              >
                SpiderVault — Battery Energy Storage System (BESS){" "}
                <span className="text-secondary">for EV Stations & Industry</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="mt-6 text-white/80 text-base sm:text-lg leading-relaxed"
              >
                SpiderVault — seamlessly combining inverter, battery, and solar in one intelligent unit.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <button
                  onClick={() => scrollTo("products")}
                  className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg text-base"
                >
                  Explore Products
                </button>
                <button
                  onClick={() => scrollTo("enquiry")}
                  className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors text-base"
                >
                  Enquire Now
                </button>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
            >
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BessHero;
