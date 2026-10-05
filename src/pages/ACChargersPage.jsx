import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import HeroBanner from "../components/ui/HeroBanner";
import Accordion from "../components/ui/Accordion";
import AppDownloadCTA from "../components/ui/AppDownloadCTA";
import { getFAQSchema, getCollectionPageSchema, getBreadcrumbSchema } from "../seo/schemas";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import acChargerImg from "../assets/home/AcCharger.webp";

const acProducts = [
  { id: "spider-mini",   name: "Spider Mini",   power: "3.3 kW", connector: "IEC 60309",  phase: "Single Phase", current: "16 A",      ocpp: true },
  { id: "spider-lite",   name: "Spider Lite",   power: "3.3 kW", connector: "IEC 60309",  phase: "Single Phase", current: "16 A",      ocpp: true },
  { id: "spider-smart",  name: "Spider Smart",  power: "7.4 kW", connector: "Type 2",     phase: "Single Phase", current: "32 A",      ocpp: true },
  { id: "spider-blaze",  name: "Spider Blaze",  power: "22 kW",  connector: "Type 2",     phase: "Three Phase",  current: "32 A",      ocpp: true },
  { id: "spider-strike", name: "Spider Strike", power: "40 kW",  connector: "Type 2",     phase: "Three Phase",  current: "55 A",      ocpp: true },
  { id: "spider-dash",   name: "Spider Dash",   power: "80 kW",  connector: "Dual Type 2", phase: "Three Phase", current: "55 A/gun",  ocpp: true },
];

const faqItems = [
  {
    question: "What are the different types of AC charging?",
    answer: "AC charging comes in two main levels: Level 1 (standard household socket, 3.3 kW) and Level 2 (dedicated EV charger, 7.4–22 kW+). Level 1 is ideal for overnight home charging of 2 & 3 wheelers, while Level 2 chargers are faster and suitable for 4-wheelers and commercial installations. SpiderEV offers a full range of AC chargers from 3.3 kW to 80 kW.",
  },
  {
    question: "What plug connectors are used by Indian electric cars?",
    answer: "In India, the most commonly used AC connector is the Bharat AC-001 (Type 1 / J1772) for 2 & 3 wheelers, and Type 2 (IEC 62196) for 4-wheelers. All SpiderEV AC chargers come with connectors compliant with Indian standards (BIS certified), ensuring compatibility with all major EV brands in India.",
  },
  {
    question: "Do I get support for maintaining my AC charging station?",
    answer: "Yes. SpiderEV provides end-to-end support — from installation and commissioning to ongoing maintenance. Our service network covers 15+ cities across India. All chargers are monitored remotely via the Spider Connect CPMS platform, enabling proactive issue detection and resolution.",
  },
];

const ProductCard = ({ product }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
  >
    <div className="bg-gray-50 p-5 sm:p-8 flex items-center justify-center h-40 sm:h-52">
      <img loading="lazy" decoding="async" width="1536" height="1024" src={acChargerImg} alt={`${product.name} ${product.power} AC EV charger by SpiderEV`} className="h-full w-auto object-contain" />
    </div>
    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
        <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">{product.power}</span>
      </div>
      <div className="flex flex-col gap-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
          {product.connector} · {product.phase}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
          Output: {product.current}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
          OCPP · IP67 · All-Weather Rated
        </div>
      </div>
      <div className="mt-auto">
        <Link
          to={`/products/ac/${product.id}`}
          className="block w-full text-center border-2 border-primary text-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors text-sm"
        >
          Know More
        </Link>
      </div>
    </div>
  </motion.div>
);

const acProductList = [
  { name: "Spider Mini — 3.3 kW AC EV Charger", url: "/products/ac/spider-mini" },
  { name: "Spider Lite — 3.3 kW AC EV Charger", url: "/products/ac/spider-lite" },
  { name: "Spider Smart — 7.4 kW AC EV Charger", url: "/products/ac/spider-smart" },
  { name: "Spider Blaze — 22 kW AC EV Charger", url: "/products/ac/spider-blaze" },
  { name: "Spider Strike — 40 kW AC EV Charger", url: "/products/ac/spider-strike" },
  { name: "Spider Dash — 80 kW AC EV Charger", url: "/products/ac/spider-dash" },
];

const acFAQSchema = getFAQSchema(faqItems);
const acCollectionSchema = getCollectionPageSchema({
  name: "AC EV Chargers | SpiderEV",
  description: "SpiderEV AC chargers from 3.3 kW to 80 kW for homes, offices, and commercial fleets.",
  url: "/electric-vehicle-ev-ac-charger",
  items: acProductList,
});
const acBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "SpiderEV", url: "/spiderev" },
  { name: "AC Chargers", url: "/electric-vehicle-ev-ac-charger" },
]);

const ACChargersPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>AC EV Chargers 3.3-80 kW | SpiderEV Telangana & AP</title>
        <meta name="description" content="SpiderEV BIS-oriented AC EV chargers from 3.3 kW to 80 kW for homes, offices and fleets in Andhra Pradesh & Telangana. OCPP 1.6J, IP67." />
      </Helmet>
      <SEO
        schema={acCollectionSchema}
        schemas={[acFAQSchema]}
        breadcrumbs={acBreadcrumbs}
        title="AC EV Chargers 3.3-80 kW | SpiderEV Telangana & AP"
        description="SpiderEV BIS-oriented AC EV chargers from 3.3 kW to 80 kW for homes, offices and fleets in Andhra Pradesh & Telangana. OCPP 1.6J, IP67."
        ogImage={acChargerImg}
      />
      <HeroBanner
        title="AC EV Chargers - 3.3 kW to 80 kW for Homes & Fleets"
        subtitle="From compact home chargers to high-power commercial units — engineered for India."
        bgImage={acChargerImg}
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
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">
                Home & Commercial
              </motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Home, workplace and fleet charging
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                SpiderEV AC chargers start at 3.3 kW for apartment parking and climb to 80 kW dual-gun units for busy depots. The listed connected models use OCPP 1.6J so SpiderConnect can manage them on the same network. Compare Mini, Lite and Smart for homes; Blaze, Strike and Dash serve workplace and fleet use cases.
              </motion.p>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex justify-center"
            >
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-10">
                <img loading="lazy" decoding="async" width="1536" height="1024" src={acChargerImg} alt="AC Charger" className="h-40 sm:h-48 lg:h-56 w-auto object-contain" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Compare the SpiderEV AC range</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-3xl text-left border-collapse">
              <thead><tr className="bg-primary text-white"><th className="p-4">Model</th><th className="p-4">Power</th><th className="p-4">Connector</th><th className="p-4">Supply</th><th className="p-4">Typical starting point</th></tr></thead>
              <tbody>{acProducts.map((product) => <tr key={product.id} className="border-b border-gray-100 last:border-0"><th className="p-4"><Link to={`/products/ac/${product.id}`} className="text-primary hover:underline">{product.name}</Link></th><td className="p-4">{product.power}</td><td className="p-4">{product.connector}</td><td className="p-4">{product.phase}</td><td className="p-4 text-gray-600">{product.power === "3.3 kW" ? "Overnight home charging" : product.power === "7.4 kW" ? "Faster home wallbox" : product.power === "22 kW" ? "Workplace and destination charging" : "Commercial and fleet charging"}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500">Final charging speed is limited by the vehicle&apos;s onboard charger and the electrical supply available at the site.</p>
        </div>
      </section>

      <section className="pb-16 bg-white"><div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap gap-3"><Link to="/spiderev" className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold">About SpiderEV</Link><Link to="/guides/home-ev-charger-buying-guide-telangana-andhra" className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold">Home charger buying guide</Link><Link to="/contact-us" className="bg-primary text-white px-5 py-3 rounded-xl font-semibold">Request quote</Link></div></section>

      {/* Product Grid */}
      <section className="pb-16 sm:pb-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mb-10 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Our AC Charger Range</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-2">6 models — from 3.3 kW to 80 kW</motion.p>
          </motion.div>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {acProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="text-3xl font-bold text-gray-900 mb-10 text-center"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <Accordion items={faqItems} />
            </motion.div>
          </div>
        </div>
      </section>

      <AppDownloadCTA />
    </PageLayout>
  );
};

export default ACChargersPage;
