import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../../components/layout/PageLayout";
import HeroBanner from "../../components/ui/HeroBanner";
import SpiderConnectCTA from "../../components/ui/SpiderConnectCTA";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import fleetImg from "../../assets/solutions/FleetCharging.webp";
import dcImg from "../../assets/home/DcCharger.webp";
import SEO from "../../components/SEO";
import { getServiceSchema, getFAQSchema, getBreadcrumbSchema } from "../../seo/schemas";

const vehicles = [
  { label: "Electric Buses", icon: "🚌", desc: "High-power charging depots for city bus fleets, state transport corporations, and private bus operators." },
  { label: "Logistics & Delivery Vehicles", icon: "🚛", desc: "Fast charging for last-mile delivery vans, logistics trucks, and e-commerce fulfillment fleets." },
  { label: "Commercial EV Fleets", icon: "🚐", desc: "Dedicated depot charging for corporate fleets, ride-hailing platforms, and commercial vehicle operators." },
];

const featuredProducts = [
  { name: "Spider Hulk", power: "120 kW", id: "spider-hulk", desc: "Dual-gun DC charger for simultaneous high-power charging of large commercial vehicles." },
  { name: "Spider Ultra", power: "240 kW", id: "spider-ultra", desc: "India's most powerful charger — 4-gun system for ultra-rapid fleet depot charging." },
];

const serviceSchema = getServiceSchema({
  name: "Heavy Duty EV Charging Stations",
  description: "High-power EV charging infrastructure for electric trucks, buses and fleet depots in AP & Telangana",
  url: "/heavy-duty-ev-charging-station",
  serviceType: "Heavy Duty EV Charging",
});
const breadcrumbSchema = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in/" },
  { name: "Heavy Duty Charging" },
]);
const faqSchema = getFAQSchema([
  { question: "What power capacity is needed for heavy-duty EV charging?", answer: "Heavy-duty EVs like buses and trucks require 120-240 kW DC fast chargers. SpiderEV's Spider Ultra (120 kW), Spider Surge (180 kW), and Spider Hulk (240 kW) are designed for fleet and depot operations." },
  { question: "Can heavy-duty chargers handle multiple vehicles simultaneously?", answer: "Yes. SpiderEV's depot solutions support multiple charging points with intelligent load management to optimise power distribution across vehicles charging simultaneously." },
  { question: "What is depot charging and how does it work?", answer: "Depot charging is scheduled overnight or during idle periods for fleet vehicles. SpiderEV's CPMS enables automated scheduling, priority queuing, and fleet management integration for buses and commercial vehicles." },
]);

const HeavyVehiclesPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Heavy Duty EV Charging for Buses & Trucks | AP & TG</title>
        <meta name="description" content="Spider Energy Provides Heavy Duty EV Charging Stations in AP & Telangana for Trucks, Buses & Fleets, with EV Charging Infrastructure & Electric Vehicle Charging Solutions." />
      </Helmet>
      <SEO schema={serviceSchema} schemas={[faqSchema]} breadcrumbs={breadcrumbSchema} />
      <HeroBanner
        title="Heavy Duty EV Charging Stations for Buses, Trucks & Fleets in AP & TG"
        subtitle="Electrify your heavy-duty fleet with powerful charging systems built for optimal performance, rapid charging, and maximum efficiency."
        bgImage={fleetImg}
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
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">Fleet & Heavy Vehicles</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Built for India's Electric Commercial Revolution
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                India's commercial vehicle sector is rapidly electrifying. From electric buses to
                last-mile delivery fleets, operators need charging infrastructure that matches the
                scale, power, and reliability demands of heavy-duty operations.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                SpiderEV's heavy vehicle charging solutions deliver up to 240 kW of DC fast charging
                power — capable of charging multiple vehicles simultaneously, managed centrally via
                Spider Connect for maximum uptime and efficiency.
              </motion.p>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img loading="lazy" src={fleetImg} alt="Fleet Charging" className="w-full h-80 object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vehicles Served */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Vehicles We Charge</motion.h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-3 gap-8"
          >
            {vehicles.map((v) => (
              <motion.div
                key={v.label}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.label}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Recommended Chargers</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-3">Our most powerful DC chargers — built for heavy-duty demands.</motion.p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          >
            {featuredProducts.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex gap-6 items-start"
              >
                <img loading="lazy" src={dcImg} alt={p.name} className="h-24 object-contain flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                    <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">{p.power}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
                  <Link to={`/products/dc/${p.id}`} className="text-primary font-semibold text-sm hover:underline">View Specs →</Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SpiderConnectCTA />
    </PageLayout>
  );
};

export default HeavyVehiclesPage;
