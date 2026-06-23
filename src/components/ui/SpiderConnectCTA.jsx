import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeLeft, fadeRight, fadeUp, staggerContainer, viewport } from "../../utils/animationConfig";
import spiderConnectImg from "../../assets/home/SpiderConnect.webp";

const SpiderConnectCTA = () => (
  <section className="bg-gray-50 py-16 sm:py-20">
    <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <img loading="lazy" src={spiderConnectImg} alt="Spider Connect Dashboard" className="w-full h-52 sm:h-60 lg:h-72 object-cover" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Software Platform
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Spider Connect
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
            Keep your chargers at your command, wherever you are. Easily monitor, schedule, and adjust
            power usage remotely from any device with internet access — your EV charger operating system.
          </motion.p>
          <motion.ul variants={staggerContainer} className="mt-6 space-y-2">
            {["Monitor chargers remotely", "Control power usage", "Manage network of chargers"].map((f) => (
              <motion.li key={f} variants={fadeUp} className="flex items-center gap-3 text-gray-700">
                <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {f}
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp}>
            <Link
              to="/cpms-ev-charging-point-management-system"
              className="mt-8 inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Know More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default SpiderConnectCTA;
