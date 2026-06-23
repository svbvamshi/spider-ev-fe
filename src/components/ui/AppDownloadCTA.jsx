import { motion } from "framer-motion";
import { fadeRight, fadeUp, staggerContainer, viewport } from "../../utils/animationConfig";
import AppStoreButtons from "./AppStoreButtons";
import appImg from "../../assets/home/SpiderApp.webp";
import heroBg from "../../assets/home/hero-bg.webp";

const AppDownloadCTA = () => (
  <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="absolute inset-0 bg-primary/80" />
    <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Mobile App
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-2 text-3xl sm:text-4xl font-bold text-white leading-tight">
            SpiderEV App
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/80 leading-relaxed">
            Charging your EV is as easy as Scan, Charge, Pay — a seamless experience that lets you power
            up quickly and pay effortlessly.
          </motion.p>
          <motion.ul variants={staggerContainer} className="mt-6 space-y-2">
            {["Locate charging stations", "Charging session tracking", "Payment integration"].map((f) => (
              <motion.li key={f} variants={fadeUp} className="flex items-center gap-3 text-white/80">
                <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
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
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <img loading="lazy" src={appImg} alt="SpiderEV App" className="w-full h-52 sm:h-60 lg:h-72 object-cover" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default AppDownloadCTA;
