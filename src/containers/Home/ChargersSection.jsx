import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "../../utils/animationConfig";
import acChargerImg from "../../assets/home/AcCharger.webp";
import dcChargerImg from "../../assets/home/heroImage2.webp";

const chargerCards = [
  {
    tag: "Home Charging",
    title: "Charge Smarter at Home",
    points: [
      "Easy installation for apartments & villas",
      "Safe, reliable daily charging",
      "Compatible with all EVs",
    ],
    imageUrl: acChargerImg,
    href: "/electric-vehicle-ev-ac-charger",
    cta: "Explore AC Chargers",
    darkImage: false,
  },
  {
    tag: "Commercial Charging",
    title: "Build a Revenue-Generating EV Hub",
    points: [
      "Ultra-fast charging for high footfall locations",
      "Designed for businesses & fleet operators",
      "Maximize ROI with every charge",
    ],
    imageUrl: dcChargerImg,
    href: "/electric-vehicle-ev-dc-charger",
    cta: "Explore DC Chargers",
    darkImage: true,
  },
];

const stats = [
  "Installed Across Multiple Cities",
  "Trusted by Businesses & Property Owners",
  "Scalable EV Infrastructure Solutions",
];

const ChargersSection = () => {
  return (
    <section className="w-full bg-[#EEF1F6] py-16 lg:py-20">
      <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {chargerCards.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Image with overlaid tag + title */}
              <div className="relative overflow-hidden">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/40" />

                {/* Tag badge */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm text-gray-700 border border-white/60">
                  {card.tag}
                </span>

                {/* Title on image */}
                <h3
                  className={`absolute bottom-5 left-5 right-5 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight ${
                    card.darkImage ? "text-white" : "text-white"
                  } drop-shadow-md`}
                >
                  {card.title}
                </h3>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 px-6 pt-6 pb-7 gap-5">
                {/* Bullet points */}
                <ul className="flex flex-col gap-3">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center">
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          className="w-5 h-5"
                          
                        >
                          <circle cx="10" cy="10" r="10" fill="#4CAF45" fillOpacity="0.12" />
                          <path
                            d="M5.5 10.5l3 3 6-6"
                            stroke="#4CAF45"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-sm sm:text-[15px] text-gray-700 leading-snug">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to={card.href}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-white text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
                >
                  {card.cta}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-4 h-4"
                  >
                    <path
                      d="M4 10h12M11 5l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ChargersSection;
