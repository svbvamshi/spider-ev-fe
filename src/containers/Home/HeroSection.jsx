import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "../../assets/home/hero-bg.webp";
import heroImage1 from "../../assets/home/heroImage1.webp";
import heroImage2 from "../../assets/home/heroImage2.webp";
import heroImage3 from "../../assets/home/heroImage3.webp";


const AUTO_SLIDE_INTERVAL_MS = 8000;

const heroSlides = [
  {
    preTitle: "Powering India's EV Revolution",
    accent: "#LEAD",
    title: "THE CHARGE",
    subtitlePrefix: "Ultra-Fast",
    subtitleAccent: "EV Charging Infrastructure",
    subtitleSuffix: "for Businesses That Want to Lead the Future",
    cta: "Partner With Us",
    ctaHref: "/partner-withus",
    image: heroImage1,
  },
  {
    preTitle: "",
    accent: "#AglaLeader",
    title: "Spider",
    subtitlePrefix: "India's",
    subtitleAccent: "Fastest Growing",
    subtitleSuffix: "EV Charging Infrastructure Network",
    cta: "Explore Solutions",
    ctaHref: "/park-and-charge-electric-vehicle-ev-charging-station",
    image: heroImage2,
  },
  {
    preTitle: "Future-ready infrastructure",
    accent: "#SwitchTo",
    title: "SPIDER",
    subtitlePrefix: "Be Part of",
    subtitleAccent: "India's",
    subtitleSuffix: "Rapidly Expanding EV Charging Network.",
    cta: "Get Started",
    ctaHref: "/contact-us",
    image: heroImage3,
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeSlide = heroSlides[currentSlide];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden min-h-[100vh] flex items-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
      </div>

      <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center min-h-screen lg:min-h-[80vh]">
          {/* Left Side - Hero Image (Carousel) */}
          <motion.div
            key={`hero-image-${currentSlide}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={activeSlide.image}
                alt="Spider EV Hero"
                className="w-full aspect-[4/3] object-cover rounded-3xl"
              />
            </div>
          </motion.div>

          {/* Right Side - Content (Carousel) */}
          <motion.div
            key={`hero-content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center lg:text-right"
          >
            {/* Hashtag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block"
            >
              <span className="text-white text-sm sm:text-base lg:text-lg tracking-wider">
                {activeSlide.preTitle}
              </span> 
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold italic text-white leading-[1.2]"
            >
              <span className="text-secondary">{activeSlide.accent}</span>
              <br />
              <span className="text-white">{activeSlide.title}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 font-semibold text-lg lg:text-2xl text-white leading-[1.6]"
            >
              {activeSlide.subtitlePrefix} <span className="text-secondary">{activeSlide.subtitleAccent}</span>
              <br /> {activeSlide.subtitleSuffix}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Link
                to={activeSlide.ctaHref}
                className="inline-block bg-white text-primary px-8 py-3 rounded-md text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                {activeSlide.cta}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-2 space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-1 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white w-8" : "bg-white/30"
              }`}
              aria-label={`Go to hero slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
