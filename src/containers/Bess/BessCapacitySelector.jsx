import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "../../utils/animationConfig";
import { appliances, getRecommendation } from "../../data/bessAppliances";
import { bessProducts } from "../../data/bessProducts";
import spiderpower3 from "../../assets/bess/spiderpower-3.0.webp";
import spiderpower5 from "../../assets/bess/spiderpower-5.0.webp";
import spiderpower12 from "../../assets/bess/spiderpower-12.0.webp";
import spiderpower20 from "../../assets/bess/spiderpower-20.0-2.webp";

const productImages = {
  "spidervault-3": spiderpower3,
  "spidervault-5": spiderpower5,
  "spidervault-12": spiderpower12,
  "spidervault-20": spiderpower20,
  "spidervault-30": spiderpower20,
  "spidervault-60": spiderpower20,
  "spidervault-120": spiderpower20,
};

// Pre-select lights + fridge + tv so a product is shown on load
const DEFAULT_SELECTED = ["lights", "fridge", "tv"];

// Icon positions (% of container) along a bowl arc
// SVG viewBox 0 0 900 380 · circle center (450, -90) · r=405 · angles 20°→160°
// Each icon: x = 450 + 405·cos(θ), y = -90 + 405·sin(θ), expressed as % of 900 / 380
const ARC_POSITIONS = [
  { x: 92.3, y: 12.9 }, // 20°  – far right
  { x: 86.7, y: 38.2 }, // 35.6°
  { x: 78.3, y: 59.1 }, // 51.1°
  { x: 67.8, y: 74.2 }, // 66.7°
  { x: 56.0, y: 81.9 }, // 82.2°
  { x: 44.0, y: 81.9 }, // 97.8°
  { x: 32.2, y: 74.2 }, // 113.3°
  { x: 21.7, y: 59.1 }, // 128.9°
  { x: 13.4, y: 38.2 }, // 144.4°
  { x:  7.7, y: 12.9 }, // 160° – far left
];

const ApplianceIcon = ({ id }) => {
  const shared = {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round",
    style: { width: "100%", height: "100%" },
  };
  const icons = {
    ac1:            <svg {...shared}><rect x="2" y="6" width="20" height="10" rx="2"/><line x1="6" y1="11" x2="18" y2="11"/><line x1="8" y1="16" x2="8" y2="18"/><line x1="12" y1="16" x2="12" y2="18"/><line x1="16" y1="16" x2="16" y2="18"/></svg>,
    ac2:            <svg {...shared}><rect x="1" y="4" width="22" height="7" rx="2"/><rect x="1" y="13" width="22" height="7" rx="2"/><line x1="5" y1="7.5" x2="19" y2="7.5"/></svg>,
    geyser:         <svg {...shared}><path d="M12 2a5 5 0 015 5v8a5 5 0 01-10 0V7a5 5 0 015-5z"/><path d="M9 10h6"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
    mixer:          <svg {...shared}><path d="M8 3h8l-2 8H10L8 3z"/><line x1="10" y1="11" x2="10" y2="15"/><line x1="14" y1="11" x2="14" y2="15"/><line x1="6" y1="19" x2="18" y2="19"/><line x1="7" y1="15" x2="17" y2="15"/></svg>,
    lights:         <svg {...shared}><path d="M12 2v1M4.22 4.22l.71.71M2 12h1M4.22 19.78l.71-.71M12 22v-1M19.78 19.78l-.71-.71M22 12h-1M19.78 4.22l-.71.71"/><path d="M9 18h6M10 21h4M12 6a6 6 0 016 6c0 2.5-1.5 4.5-3 5.5H9C7.5 16.5 6 14.5 6 12a6 6 0 016-6z"/></svg>,
    tv:             <svg {...shared}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    fridge:         <svg {...shared}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="5" y1="10" x2="19" y2="10"/><line x1="10" y1="6" x2="10" y2="8"/><line x1="10" y1="14" x2="10" y2="17"/></svg>,
    laptop:         <svg {...shared}><rect x="3" y="4" width="18" height="13" rx="2"/><line x1="2" y1="19" x2="22" y2="19"/></svg>,
    lift:           <svg {...shared}><rect x="5" y="2" width="14" height="20" rx="2"/><polyline points="9 8 12 5 15 8"/><polyline points="9 16 12 19 15 16"/></svg>,
    commercial_full:<svg {...shared}><path d="M3 21h18M5 21V7l7-4 7 4v14"/><rect x="9" y="9" width="2" height="3"/><rect x="13" y="9" width="2" height="3"/><rect x="9" y="14" width="2" height="3"/><rect x="13" y="14" width="2" height="3"/></svg>,
  };
  return icons[id] ?? null;
};

const shortLabel = {
  ac1: "1 AC", ac2: "2 ACs", geyser: "Geyser", mixer: "Mixer",
  lights: "Lights", tv: "TV", fridge: "Fridge", laptop: "Laptop",
  lift: "Lift", commercial_full: "Office",
};

const BessCapacitySelector = ({ onProductSelect }) => {
  const [selected, setSelected] = useState(DEFAULT_SELECTED);

  const totalWatts = selected.reduce((sum, id) => {
    const a = appliances.find((x) => x.id === id);
    return sum + (a ? a.watts : 0);
  }, 0);

  const recommendedId = getRecommendation(totalWatts);
  const product = bessProducts.find((p) => p.id === recommendedId);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const totalDisplay =
    totalWatts >= 1000
      ? `${(totalWatts / 1000).toFixed(1)} kW`
      : `${totalWatts} W`;

  return (
    <section
      id="capacity"
      className="relative overflow-hidden py-12 sm:py-16"
      style={{ background: "linear-gradient(180deg, #04080f 0%, #060c1c 60%, #04080f 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 58%, rgba(76,175,69,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-300 mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Heading ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-secondary font-semibold text-xs uppercase tracking-widest"
          >
            Find Your Model
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-white"
          >
            Capacity as Per Your Needs
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-white/40 text-sm max-w-md mx-auto">
            Select the appliances you want to power and we'll recommend the right SpiderVault
          </motion.p>
        </motion.div>

        {/* ── Capacity + product name bar ── */}
        <div className="flex items-center justify-center gap-4 mb-4 min-h-14">
          <AnimatePresence mode="wait">
            {product ? (
              <motion.div
                key={product.id + "-header"}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <span
                  className="font-extrabold tabular-nums"
                  style={{ fontSize: "clamp(2rem,5vw,3.25rem)", color: "rgb(76,175,69)" }}
                >
                  {product.capacity}
                </span>
                <div className="w-px h-8 bg-white/15 hidden sm:block" />
                <div className="hidden sm:block">
                  <div className="text-white font-semibold text-base leading-tight">{product.name}</div>
                  <div className="text-white/40 text-xs mt-0.5">Load: {totalDisplay}</div>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="empty-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/30 text-sm"
              >
                Select appliances to get a recommendation
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── Arc stage ── */}
        {/* paddingBottom maintains 900:380 aspect ratio */}
        <div className="relative w-full" style={{ paddingBottom: "42.2%" }}>

          {/* SVG arc line */}
          <svg
            viewBox="0 0 900 380"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: "visible" }}
          >
            <defs>
              <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Subtle base line */}
            <path
              d="M 831 49 A 405 405 0 0 0 69 49"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          </svg>

          {/* Product image — upper center of arc */}
          <div
            className="absolute"
            style={{ left: "28%", right: "28%", top: 0, bottom: "28%" }}
          >
            <AnimatePresence mode="wait">
              {product ? (
                <motion.div
                  key={product.id}
                  className="relative w-full h-full flex items-end justify-center"
                  initial={{ opacity: 0, scale: 0.88, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: -8 }}
                  transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Radial glow behind product */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 65% at 50% 75%, rgba(76,175,69,0.14) 0%, transparent 70%)",
                    }}
                  />
                  <img
                    src={productImages[product.id]}
                    alt={product.name}
                    className="relative w-full h-full object-contain pb-1"
                    style={{
                      filter:
                        "drop-shadow(0 24px 60px rgba(0,0,0,0.75)) drop-shadow(0 0 28px rgba(76,175,69,0.18))",
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty-img"
                  className="w-full h-full flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.6}
                    className="w-14 h-14 text-white/8"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Load badge — floats between product bottom and center icons */}
          <div
            className="absolute sm:hidden"
            style={{ left: "50%", top: "76%", transform: "translate(-50%, -50%)" }}
          >
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="text-white/35 text-[10px]">Load</span>
              <span className="text-secondary font-bold text-xs tabular-nums">{totalDisplay}</span>
              {selected.length > 0 && (
                <button
                  onClick={() => setSelected([])}
                  className="text-white/25 hover:text-white/60 transition-colors"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Appliance icons along the arc */}
          {appliances.map((app, i) => {
            const pos = ARC_POSITIONS[i];
            const isOn = selected.includes(app.id);

            return (
              <button
                key={app.id}
                onClick={() => toggle(app.id)}
                className="absolute flex flex-col items-center transition-transform duration-200 hover:scale-[1.14] active:scale-[0.92]"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  gap: "clamp(2px, 0.4vw, 5px)",
                }}
              >
                {/* Circle */}
                <div
                  className="rounded-full border flex items-center justify-center transition-all duration-300"
                  style={{
                    width: "clamp(26px, 4.2vw, 48px)",
                    height: "clamp(26px, 4.2vw, 48px)",
                    padding: "clamp(5px, 0.9vw, 11px)",
                    background: isOn
                      ? "rgba(76,175,69,0.22)"
                      : "rgba(255,255,255,0.05)",
                    borderColor: isOn
                      ? "rgba(76,175,69,0.65)"
                      : "rgba(255,255,255,0.12)",
                    boxShadow: isOn
                      ? "0 0 18px rgba(76,175,69,0.3), inset 0 0 10px rgba(76,175,69,0.1)"
                      : "none",
                    color: isOn ? "rgb(76,175,69)" : "rgba(255,255,255,0.42)",
                  }}
                >
                  <ApplianceIcon id={app.id} />
                </div>
                {/* Label */}
                <span
                  className="font-medium text-center leading-none transition-colors duration-300"
                  style={{
                    fontSize: "clamp(6px, 0.78vw, 9px)",
                    color: isOn ? "rgba(76,175,69,0.85)" : "rgba(255,255,255,0.28)",
                  }}
                >
                  {shortLabel[app.id]}
                </span>
              </button>
            );
          })}
        </div>
        {/* ── end arc stage ── */}

        {/* ── Stats + CTAs below arc ── */}
        <div className="mt-2 max-w-sm mx-auto">
          <AnimatePresence>
            {product ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Clear + load — desktop only (mobile has badge inside arc) */}
                <div className="hidden sm:flex items-center justify-center gap-2 mb-4">
                  <div
                    className="flex items-center gap-2 rounded-full px-4 py-1.5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <span className="text-white/35 text-xs">Total load</span>
                    <div className="w-px h-3 bg-white/15" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={totalDisplay}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="text-secondary font-bold text-sm tabular-nums"
                        style={{ minWidth: "52px", textAlign: "center" }}
                      >
                        {totalDisplay}
                      </motion.span>
                    </AnimatePresence>
                    {selected.length > 0 && (
                      <button
                        onClick={() => setSelected([])}
                        className="text-white/22 hover:text-white/60 transition-colors"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div
                  className="flex justify-center gap-6 sm:gap-10 py-4 rounded-2xl mb-4"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {[
                    { label: "Power", value: product.ratedPower },
                    { label: "Backup", value: product.backupTime },
                    { label: "Efficiency", value: product.efficiency },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-widest">
                        {s.label}
                      </div>
                      <div className="text-white font-bold text-xs sm:text-sm mt-1">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex gap-3">
                  <button
                    onClick={() => scrollTo("enquiry")}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{
                      background: "rgb(76,175,69)",
                      boxShadow: "0 4px 24px rgba(76,175,69,0.22)",
                    }}
                  >
                    Enquire Now
                  </button>
                  <button
                    onClick={() => onProductSelect(product.id)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.13)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  >
                    View Full Specs
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/22 text-xs py-6"
              >
                Tap any appliance icon to get started
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default BessCapacitySelector;
