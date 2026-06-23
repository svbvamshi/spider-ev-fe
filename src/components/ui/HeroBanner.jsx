import { motion } from "framer-motion";
import heroBg from "../../assets/home/hero-bg.webp";

const HeroBanner = ({ title, subtitle, bgImage }) => {
  const bg = bgImage || heroBg;
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mt-4 text-white/80 text-lg max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
