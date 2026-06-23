import { motion } from "framer-motion";
import { fadeUp, scaleUp, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import { bessFeatures } from "../../data/bessFeatures";
import heroBg from "../../assets/home/hero-bg.webp";

const BessFeatures = () => (
  <section
    className="relative overflow-hidden py-16 sm:py-20"
    style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
  >
    <div className="absolute inset-0 bg-primary/85" />
    <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="text-center mb-12"
      >
        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white">
          Built for India. <span className="text-secondary">Built to Last.</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-white/70 mt-3 max-w-xl mx-auto">
          Every SpiderVault unit is engineered with features that matter most in real Indian conditions.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {bessFeatures.map((f) => (
          <motion.div
            key={f.id}
            variants={scaleUp}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl p-6 text-center transition-all cursor-default"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <div className="text-white font-bold text-sm leading-snug mb-1">{f.label}</div>
            <div className="text-white/60 text-xs">{f.description}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BessFeatures;
