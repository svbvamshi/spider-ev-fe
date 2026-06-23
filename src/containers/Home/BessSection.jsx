import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, scaleUp, staggerContainer, staggerFast } from "../../utils/animationConfig";
import img3kw from "../../assets/bess/spiderpower-3.0.webp";
import img5kw from "../../assets/bess/spiderpower-5.0.webp";
import img12kw from "../../assets/bess/spiderpower-12.0.webp";
import img20kw from "../../assets/bess/spiderpower-20.0-2.webp";

const products = [
  {
    name: "SpiderVault 3.0",
    capacity: "3 kWh",
    power: "3 kW",
    bestFor: "1 AC + Regular Appliances",
    img: img3kw,
  },
  {
    name: "SpiderVault 5.0",
    capacity: "5 kWh",
    power: "5.5 kW",
    bestFor: "2 ACs + All Home Appliances",
    img: img5kw,
  },
  {
    name: "SpiderVault 12.0",
    capacity: "12 kWh",
    power: "12 kW",
    bestFor: "Large Homes & Residences",
    img: img12kw,
  },
  {
    name: "SpiderVault 20.0",
    capacity: "20 kWh",
    power: "20 kW",
    bestFor: "Commercial & Industrial Loads",
    img: img20kw,
  },
];

const highlights = [
  { icon: "⚡", label: "10 ms Transfer Time" },
  { icon: "☀️", label: "Solar Hybrid Ready" },
  { icon: "🛡️", label: "5th Gen BMS" },
  { icon: "📶", label: "AI Cloud Connected" },
];

const BessSection = () => {
  return (
    <section className="w-full bg-[#F3F5F8] py-16 lg:py-20">
      <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 lg:mb-14"
        >
          <div>
            <motion.p variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">
              Battery Energy Storage Systems
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2f3236] leading-tight">
              Introducing <span className="text-primary">SpiderVault</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl">
              One intelligent unit — inverter, battery, and solar combined. Power your home or business with clean, reliable energy, round the clock.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="shrink-0">
            <Link
              to="/bess-battery-backup-for-ev-charging-stations"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary/80 transition-colors group"
            >
              Explore All Products
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Cards */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.name}
              variants={scaleUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Product image */}
              <div className="bg-gray-50 flex items-center justify-center px-4 pt-6 pb-2 h-44 sm:h-48">
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-full w-auto object-contain drop-shadow-md"
                  loading="lazy"
                />
              </div>

              {/* Card content */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full self-start mb-3">
                  {product.capacity}
                </span>
                <h3 className="font-bold text-[#2f3236] text-sm sm:text-base leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-3 flex-1">{product.bestFor}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">{product.power}</span>
                  <Link
                    to="/bess-battery-backup-for-ev-charging-stations"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                  >
                    View
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlights strip */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 bg-primary rounded-2xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {highlights.map((item) => (
            <motion.div key={item.label} variants={fadeUp} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white font-semibold text-sm">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link
            to="/bess-battery-backup-for-ev-charging-stations"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Explore SpiderVault
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BessSection;
