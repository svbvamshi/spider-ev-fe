import { motion } from "framer-motion";
import { fadeLeft, fadeUp, staggerContainer, viewport } from "../../utils/animationConfig";
import AppStoreButtons from "../../components/ui/AppStoreButtons";
import heroBg from "../../assets/home/hero-bg.webp";

const features = [
  "Real-time battery monitoring",
  "Solar input tracking",
  "Energy usage analytics",
  "Smart automation & alerts",
  "Remote scheduling",
  "AI-powered insights",
];

const checkIcon = (
  <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const BessAppSection = () => (
  <section
    className="relative overflow-hidden py-16 sm:py-20"
    style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
  >
    <div className="absolute inset-0 bg-primary/85" />
    <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}>
          <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Monitor & Control
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-2 text-3xl sm:text-4xl font-bold text-white leading-tight">
            Power at Your Fingertips
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/80 leading-relaxed">
            Track your SpiderVault battery level, solar input, and energy usage in real time — from anywhere.
            Set alerts, schedule charging, and let AI optimize your power automatically.
          </motion.p>
          <motion.ul variants={staggerContainer} className="mt-6 space-y-2">
            {features.map((f) => (
              <motion.li key={f} variants={fadeUp} className="flex items-center gap-3 text-white/80">
                <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  {checkIcon}
                </span>
                {f}
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp} className="mt-8">
            <AppStoreButtons />
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="hidden lg:flex rounded-2xl bg-white/10 border border-white/20 min-h-[340px] items-center justify-center"
        >
          <div className="text-center text-white/40">
            <div className="text-6xl mb-3">📱</div>
            <p className="text-sm">Spider Connect App</p>
            <p className="text-xs mt-1 text-white/30">App mockup coming soon</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default BessAppSection;
