import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import parkAndChargeImg from "../../assets/solutions/ParkAndCharge.webp";
import communityChargingImg from "../../assets/solutions/CommunityCharging.webp";
import publicChargingImg from "../../assets/solutions/PublicCharging.webp";
import fleetChargingImg from "../../assets/solutions/FleetCharging.webp";
import destinationChargingImg from "../../assets/solutions/Destination Charging.webp";
import highwayChargingImg from "../../assets/solutions/HighwayCharging.webp";
import workplaceChargingImg from "../../assets/solutions/WorkplaceCharging.webp";

const AUTO_SLIDE_INTERVAL_MS = 5500;

const chargingSlides = [
  {
    title: "Park & Charge",
    description:
      "Turn your business into a go-to destination with reliable, easy-to-use charging stations that attract and retain EV drivers.",
    imageUrl: parkAndChargeImg,
    href: "/park-and-charge-electric-vehicle-ev-charging-station",
  },
  {
    title: "Community Charging",
    description:
      "Transform your neighborhood into a vibrant EV-friendly community with convenient, on-site charging.",
    imageUrl: communityChargingImg,
    href: "/community-ev-charging-stations",
  },
  {
    title: "Public Charging",
    description:
      "Deliver dependable service with our Charger Management System, ensuring effortless integration and seamless reliability.",
    imageUrl: publicChargingImg,
    href: "/public-ev-charging-stations",
  },
  {
    title: "Fleet Charging",
    description:
      "Support your commercial fleet with high-uptime charging infrastructure built for daily heavy usage.",
    imageUrl: fleetChargingImg,
    href: "/heavy-duty-ev-charging-station",
  },
  {
    title: "Destination Charging",
    description:
      "Add premium EV charging to malls, hotels, and campuses for longer stays and better customer experience.",
    imageUrl: destinationChargingImg,
    href: "/park-and-charge-electric-vehicle-ev-charging-station",
  },
  {
    title: "Highway Charging",
    description:
      "Keep long-distance drivers moving with strategically placed charging hubs on major highway routes.",
    imageUrl: highwayChargingImg,
    href: "/ev-charging-station-locator",
  },
  {
    title: "Workplace Charging",
    description:
      "Enable employees and visitors to charge reliably at office campuses with smart energy management.",
    imageUrl: workplaceChargingImg,
    href: "/ev-charging-epc-services",
  },
];

const ChargingSolutionsSection = () => {
  const viewportRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(3);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [trackIndex, setTrackIndex] = useState(chargingSlides.length);

  const allSlides = useMemo(
    () => [...chargingSlides, ...chargingSlides, ...chargingSlides],
    []
  );

  const updateLayout = useCallback(() => {
    const width = viewportRef.current?.offsetWidth ?? 0;
    setViewportWidth(width);

    if (window.innerWidth < 768) {
      setVisibleCards(1);
      return;
    }

    if (window.innerWidth < 1024) {
      setVisibleCards(2);
      return;
    }

    setVisibleCards(3);
  }, []);

  const nextSlide = useCallback(() => {
    setIsAnimating(true);
    setTrackIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsAnimating(true);
    setTrackIndex((prev) => prev - 1);
  }, []);

  const handleSlideAnimationComplete = () => {
    if (trackIndex >= chargingSlides.length * 2) {
      setIsAnimating(false);
      setTrackIndex((prev) => prev - chargingSlides.length);
      return;
    }

    if (trackIndex < chargingSlides.length) {
      setIsAnimating(false);
      setTrackIndex((prev) => prev + chargingSlides.length);
      return;
    }
  };

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [updateLayout]);

  useEffect(() => {
    const intervalId = window.setInterval(nextSlide, AUTO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [nextSlide]);

  useEffect(() => {
    if (!isAnimating) {
      const rafId = window.requestAnimationFrame(() => setIsAnimating(true));
      return () => window.cancelAnimationFrame(rafId);
    }
  }, [isAnimating]);

  const cardWidth = visibleCards > 0 ? viewportWidth / visibleCards : 0;

  return (
    <section className="w-full bg-[#252E89] py-16 lg:py-20 overflow-hidden">
      <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 mb-10 lg:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
            Charging Solutions
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              type="button"
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              type="button"
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={viewportRef} className="overflow-hidden">
          <motion.div
            animate={{ x: -(trackIndex * cardWidth) }}
            transition={
              isAnimating
                ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0 }
            }
            onAnimationComplete={handleSlideAnimationComplete}
            className="flex -mx-3"
          >
            {allSlides.map((slide, index) => (
              <article
                key={`${slide.title}-${index}`}
                className="px-3 shrink-0"
                style={{ width: `${cardWidth}px` }}
              >
                <div className="relative rounded-3xl overflow-hidden min-h-60 sm:min-h-70 lg:min-h-90 group">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/40 transition-colors" />

                  <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6 text-white">
                    <h3 className="text-secondary text-lg lg:text-xl leading-tight font-semibold">
                      {slide.title}
                    </h3>
                    <p className="mt-2 text-base lg:text-md leading-[1.12] text-white/95 max-w-[95%]">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.href}
                      className="mt-3 inline-block text-secondary text-sm lg:text-md font-semibold hover:text-secondary/80 transition-colors"
                    >
                      know more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChargingSolutionsSection;
