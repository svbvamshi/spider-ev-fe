import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../../components/layout/PageLayout";
import HeroBanner from "../../components/ui/HeroBanner";
import SpiderConnectCTA from "../../components/ui/SpiderConnectCTA";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import publicImg from "../../assets/solutions/PublicCharging.webp";
import highwayImg from "../../assets/solutions/HighwayCharging.webp";
import SEO from "../../components/SEO";
import { getServiceSchema, getBreadcrumbSchema } from "../../seo/schemas";

const useCases = [
  { title: "City Charging Hubs", desc: "Multi-charger stations in commercial zones, government parking, and civic centers for daily urban EV users.", icon: "🏙️" },
  { title: "Highway Corridors", desc: "Fast DC charging stations along national highways, expressways, and inter-city routes to eliminate range anxiety.", icon: "🛣️" },
  { title: "Commercial Spaces", desc: "Malls, fuel stations, and transport hubs equipped with public EV charging for high-footfall locations.", icon: "🏪" },
];

const features = [
  "Real-time charger status monitoring",
  "Remote diagnostics and fault alerts",
  "Revenue and usage analytics",
  "Dynamic pricing and tariff management",
  "OCPI-compliant for network roaming",
  "Automated maintenance scheduling",
];

const pageSchema = getServiceSchema({
  name: "Public EV Charging Stations",
  description: "Spider Energy offers public EV charging stations across Andhra Pradesh and Telangana, delivering fast charging for cars with a strong and connected EV charging network.",
  url: "/public-ev-charging-stations",
  serviceType: "Public EV Charging Infrastructure",
});
const pageBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "Solutions", url: "https://spiderenergy.in/public-ev-charging-stations" },
  { name: "Public Charging" },
]);

const PublicChargingPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Public EV Charging Stations in Telangana & Andhra Pradesh</title>
        <meta name="description" content="Spider Energy offers Public EV Charging Stations in Andhra Pradesh and Telangana, Delivering Fast Charging for Cars with a Strong & Connected EV Charging Network." />
      </Helmet>
      <SEO schema={pageSchema} breadcrumbs={pageBreadcrumbs} />
      <HeroBanner
        title="Public EV Charging Stations in Telangana & Andhra Pradesh"
        subtitle="Deliver dependable service with our Charger Management System, ensuring seamless reliability for cities and highways."
        bgImage={highwayImg}
      />

      {/* Intro */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">Public Infrastructure</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Powering India's EV Network — At Scale
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                India's EV future demands infrastructure that is reliable, accessible, and built to scale.
                Spider EV partners with governments, highways, fuel stations, and commercial hubs to deploy
                high-performance public charging networks where they're needed most.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                From site identification to deployment and operations, Spider EV manages the complete
                lifecycle of public charging infrastructure. With integrated software and real-time monitoring
                via Spider Connect, every station is optimized for performance — ensuring your network runs
                24/7 with minimal downtime.
              </motion.p>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img loading="lazy" src={publicImg} alt="Public Charging" className="w-full h-80 object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Where We Deploy</motion.h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-3 gap-8"
          >
            {useCases.map((u) => (
              <motion.div
                key={u.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <div className="text-4xl mb-4">{u.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{u.title}</h3>
                <p className="text-gray-600 leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CPMS Integration */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img loading="lazy" src={publicImg} alt="Highway Charging" className="w-full h-80 object-cover" />
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">Technology</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold text-gray-900 leading-tight">
                Spider Connect Powers Your Public Network
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 leading-relaxed">
                Every SpiderEV public charging station is connected to Spider Connect — our cloud-based
                Charge Point Management System (CPMS).
              </motion.p>
              <motion.ul variants={staggerFast} className="mt-6 space-y-3">
                {features.map((f) => (
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
            </motion.div>
          </div>
        </div>
      </section>

      <SpiderConnectCTA />
    </PageLayout>
  );
};

export default PublicChargingPage;
