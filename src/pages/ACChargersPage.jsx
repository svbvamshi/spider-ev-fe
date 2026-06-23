import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import HeroBanner from "../components/ui/HeroBanner";
import Accordion from "../components/ui/Accordion";
import AppDownloadCTA from "../components/ui/AppDownloadCTA";
import { getFAQSchema, getItemListSchema, getBreadcrumbSchema } from "../seo/schemas";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import acChargerImg from "../assets/home/AcCharger.jpeg";

const acProducts = [
  { id: "spider-mini",   name: "Spider Mini",   power: "3.3 kW", connector: "IEC 60309",  phase: "Single Phase", current: "16 A",      ocpp: true },
  { id: "spider-smart",  name: "Spider Smart",  power: "7.4 kW", connector: "Type 2",     phase: "Single Phase", current: "32 A",      ocpp: true },
  { id: "spider-blaze",  name: "Spider Blaze",  power: "22 kW",  connector: "Type 2",     phase: "Three Phase",  current: "32 A",      ocpp: true },
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
      <img src={acChargerImg} alt={product.name} className="h-full object-contain" />
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
  { name: "Spider Smart — 7.4 kW AC EV Charger", url: "/products/ac/spider-smart" },
  { name: "Spider Blaze — 22 kW AC EV Charger", url: "/products/ac/spider-blaze" },
  { name: "Spider Strike — 40 kW AC EV Charger", url: "/products/ac/spider-strike" },
  { name: "Spider Dash — 80 kW AC EV Charger", url: "/products/ac/spider-dash" },
];

const acFAQSchema = getFAQSchema(faqItems);
const acItemListSchema = getItemListSchema(acProductList, "SpiderEV AC Charger Range");
const acBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "AC Chargers" },
]);

const ACChargersPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Electric Vehicle AC Charging Station in Telangana & Andhra Pradesh</title>
        <meta name="description" content="Explore the Best EV AC Charging Stations in Andhra Pradesh (AP) and Telangana (TG) for Efficient Home EV Charging and Reliable Electric Car Charger Solutions." />
      </Helmet>
      <SEO schema={acFAQSchema} breadcrumbs={acBreadcrumbs} />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(acItemListSchema)}
        </script>
      </Helmet>
      <HeroBanner
        title="Electric Vehicle AC Charging Station in Telangana & Andhra Pradesh"
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
                Attain Charging Control: Take Command of Your Charging Experience
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                Experience unmatched convenience and control with SpiderEV chargers. Whether you opt for
                home installation or prefer to carry one in your EV, the choice is yours. Our AC charger
                lineup is designed to fit every need — from compact 2-wheeler chargers to powerful
                commercial-grade units.
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
                <img src={acChargerImg} alt="AC Charger" className="h-40 sm:h-48 lg:h-56 object-contain" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
            <motion.p variants={fadeUp} className="text-gray-500 mt-2">3 models — from 3.3 kW to 22 kW</motion.p>
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
