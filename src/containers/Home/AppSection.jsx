import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "../../utils/animationConfig";
import spiderConnectImg from "../../assets/home/SpiderConnect.webp";
import spiderAppImg from "../../assets/home/SpiderApp.webp";

const platformCards = [
  {
    title: "Spider Connect",
    description:
      "Keep your chargers at your command. Easily monitor, schedule, and adjust power usage remotely from any device.",
    imageUrl: spiderConnectImg,
    href: "/cpms-ev-charging-point-management-system",
  },
  {
    title: "Spider App",
    description:
      "Charging your EV is as easy as Scan, Charge, Pay-a seamless experience that lets you power up quickly and pay effortlessly.",
    imageUrl: spiderAppImg,
    href: "/ev-charging-station-app",
  },
];

const AppSection = () => {
  return (
    <section className="w-full bg-[#252E89] py-14 lg:py-20">
      <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-9"
        >
          {platformCards.map((card) => (
            <motion.article key={card.title} variants={fadeUp} className="text-center">
              <div className="bg-[#F2F2F2] p-4 rounded-xl">
                <div className="aspect-[16/9] overflow-hidden rounded-sm">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h3 className="mt-7 text-xl lg:text-3xl leading-tight font-semibold text-secondary">
                {card.title}
              </h3>

              <p className="mt-4 text-white text-sm sm:text-md lg:text-lg leading-[1.5] max-w-[92%] mx-auto font-medium">
                {card.description}
              </p>

              <Link
                to={card.href}
                className="mt-2 inline-block text-white text-sm sm:text-sm lg:text-lg font-medium underline underline-offset-4 hover:text-white/90 transition-colors"
              >
                know more
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AppSection;
