import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import HeroBanner from "../components/ui/HeroBanner";
import Accordion from "../components/ui/Accordion";
import SpiderConnectCTA from "../components/ui/SpiderConnectCTA";
import { getFAQSchema, getCollectionPageSchema, getBreadcrumbSchema } from "../seo/schemas";
import { fadeUp, fadeLeft, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import dcChargerImg from "../assets/home/DcCharger.webp";
import sparkDcImg from "../assets/chargers/spark.webp";
import surgeDcImg from "../assets/chargers/surge.webp";
import ultraDcImg from "../assets/chargers/ultra.webp";

const cardImages = {
  "spider-spark": sparkDcImg,
  "spider-ultra": ultraDcImg,
  "spider-surge": surgeDcImg,
};

const dcProducts = [
  { id: "spider-base",   name: "Spider Base",   power: "3–12 kW",   connector: "IS 17017-2-6",         outputVoltage: "20 – 120 V DC",   outputCurrent: "Up to 100 A" },
  { id: "spider-fast",   name: "Spider Fast",   power: "30 kW",     connector: "CCS2 / CHAdeMO",        outputVoltage: "200 – 1000 V DC", outputCurrent: "0 – 100 A" },
  { id: "spider-spark",  name: "Spider Spark",  power: "60 kW",     connector: "CCS2 / CHAdeMO",        outputVoltage: "200 – 1000 V DC", outputCurrent: "0 – 150 A" },
  { id: "spider-falcon", name: "Spider Falcon", power: "60 kW",     connector: "Dual CCS2",             outputVoltage: "200 – 1000 V DC", outputCurrent: "0 – 150 A" },
  { id: "spider-ultra",  name: "Spider Ultra",  power: "120 kW",    connector: "CCS2 / CHAdeMO",        outputVoltage: "200 – 1000 V DC", outputCurrent: "0 – 200 A" },
  { id: "spider-surge",  name: "Spider Surge",  power: "180 kW",    connector: "CCS2 / CHAdeMO",        outputVoltage: "200 – 1000 V DC", outputCurrent: "0 – 250 A" },
  { id: "spider-hulk",   name: "Spider Hulk",   power: "240 kW",    connector: "CCS2 / CHAdeMO",        outputVoltage: "200 – 1000 V DC", outputCurrent: "0 – 350 A" },
  
];

const faqItems = [
  {
    question: "How do DC Fast Chargers work?",
    answer: "DC fast chargers convert AC power from the grid into DC electricity directly, bypassing the car's on-board charger. This allows much higher power levels (15 kW to 240 kW+) to be delivered directly to the battery, resulting in significantly faster charging — often 80% charge in 20–45 minutes.",
  },
  {
    question: "What is the difference between Level 1 and Level 2 DC Chargers?",
    answer: "Lower-power DC chargers (3–15 kW) are suitable for 2-wheelers and smaller EVs. Higher-power DC chargers (30 kW and above) are designed for 4-wheelers, commercial vehicles, buses, and trucks. SpiderEV's DC range spans from the Spider Base (3–12 kW) to the Spider Hulk (240 kW).",
  },
  {
    question: "What DC plug connector types are provided?",
    answer: "SpiderEV DC chargers are equipped with CCS2 for 4-wheelers, CHAdeMO for compatible vehicles, and Bharat DC-001 for Indian 2 & 3 wheelers. All connectors are BIS certified and OCPP 1.6/2.0 compliant.",
  },
];

const ProductCard = ({ product }) => {
  const img = cardImages[product.id] ?? dcChargerImg;
  const dimensions = product.id === "spider-surge"
    ? { width: 1024, height: 1536 }
    : cardImages[product.id]
      ? { width: 853, height: 1280 }
      : { width: 1536, height: 1024 };
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className="bg-gray-50 p-5 sm:p-8 flex items-center justify-center h-40 sm:h-52">
        <img loading="lazy" decoding="async" width={dimensions.width} height={dimensions.height} src={img} alt={`${product.name} ${product.power} DC EV charger by SpiderEV`} className="h-full w-auto object-contain" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-4">
          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">{product.power}</span>
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            {product.connector}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            {product.outputVoltage} · {product.outputCurrent}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            OCPP 1.6J · IP67 · All-Weather Rated
          </div>
        </div>
        <div className="mt-auto">
          <Link
            to={`/products/dc/${product.id}`}
            className="block w-full text-center border-2 border-primary text-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors text-sm"
          >
            Know More
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const dcProductList = [
  { name: "Spider Base — 3-12 kW DC EV Charger", url: "/products/dc/spider-base" },
  { name: "Spider Fast — 30 kW DC Fast Charger", url: "/products/dc/spider-fast" },
  { name: "Spider Spark — 60 kW DC Fast Charger", url: "/products/dc/spider-spark" },
  { name: "Spider Falcon — 60 kW CCS2 DC Charger", url: "/products/dc/spider-falcon" },
  { name: "Spider Ultra — 120 kW DC Fast Charger", url: "/products/dc/spider-ultra" },
  { name: "Spider Surge — 180 kW DC Fast Charger", url: "/products/dc/spider-surge" },
  { name: "Spider Hulk — 240 kW Ultra-Rapid DC Charger", url: "/products/dc/spider-hulk" },
];

const dcFAQSchema = getFAQSchema(faqItems);
const dcCollectionSchema = getCollectionPageSchema({
  name: "DC Fast EV Chargers | SpiderEV",
  description: "SpiderEV DC fast chargers from 3 kW to 240 kW for public networks, highways, and fleet depots.",
  url: "/electric-vehicle-ev-dc-charger",
  items: dcProductList,
});
const dcBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "SpiderEV", url: "/spiderev" },
  { name: "DC Chargers", url: "/electric-vehicle-ev-dc-charger" },
]);

const DCChargersPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>DC Fast EV Chargers 30-240 kW | SpiderEV</title>
        <meta name="description" content="SpiderEV DC fast chargers from entry 30 kW to 240 kW ultra-rapid for public networks and fleets in AP & Telangana. CCS2 & CHAdeMO." />
      </Helmet>
      <SEO
        schema={dcCollectionSchema}
        schemas={[dcFAQSchema]}
        breadcrumbs={dcBreadcrumbs}
        title="DC Fast EV Chargers 30-240 kW | SpiderEV"
        description="SpiderEV DC fast chargers from entry 30 kW to 240 kW ultra-rapid for public networks and fleets in AP & Telangana. CCS2 & CHAdeMO."
        ogImage={dcChargerImg}
      />
      <HeroBanner
        title="DC Fast EV Chargers - 30 kW to 240 kW for Public Networks"
        subtitle="Deliver exceptional power and energy efficiency — rapid charging for personal EVs and heavy-duty vehicles."
        bgImage={dcChargerImg}
      />

      {/* Intro */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex justify-center"
            >
              <div className="bg-gray-50 rounded-2xl p-10">
                <img loading="lazy" decoding="async" width="1536" height="1024" src={dcChargerImg} alt="DC Charger" className="h-56 w-auto object-contain" />
              </div>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">
                Fast Charging
              </motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Highway, public and fleet charging
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                Spider Fast at 30 kW is the starting point for malls and neighbourhood hubs. Spider Ultra, Surge and Hulk serve corridors and depots where shorter charging stops matter. Spider Base is the dedicated 3 kW option for supported two-wheeler charging use cases.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white"><div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap gap-3"><Link to="/spiderev" className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold">About SpiderEV</Link><Link to="/heavy-duty-ev-charging-station" className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold">Heavy-duty charging</Link><Link to="/contact-us" className="bg-primary text-white px-5 py-3 rounded-xl font-semibold">Request a site review</Link></div></section>

      <section className="pb-16 sm:pb-20 bg-white"><div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="text-3xl font-bold text-gray-900">Plan the DC site, not only the charger</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-7">
          <article className="rounded-2xl bg-gray-50 p-7"><h3 className="text-xl font-bold">Light-EV charging</h3><p className="mt-3 text-gray-600 leading-relaxed">Spider Base covers supported two- and three-wheeler use cases using IS 17017-2-6 configurations. Confirm vehicle voltage, connector and fleet schedule before selection. A light-EV depot may value several available connectors and scheduled overnight charging more than one high-power passenger-car charger.</p></article>
          <article className="rounded-2xl bg-gray-50 p-7"><h3 className="text-xl font-bold">Public and corridor sites</h3><p className="mt-3 text-gray-600 leading-relaxed">Start with expected arrivals, connector mix and acceptable waiting time. Spider Fast is the 30 kW entry point; higher-power models reduce dwell time only when the vehicle accepts the rate and the site can supply it. Include bay layout, signage, payment, lighting and customer support in the operating plan.</p></article>
          <article className="rounded-2xl bg-gray-50 p-7"><h3 className="text-xl font-bold">Fleet and depot sites</h3><p className="mt-3 text-gray-600 leading-relaxed">Map when vehicles return, how much energy each route consumes and when each vehicle must leave again. Several scheduled sessions may require load management instead of every gun drawing maximum power simultaneously. Record existing building loads and future fleet growth before finalising the electrical design.</p></article>
        </div>
        <div className="mt-10 rounded-2xl border border-gray-100 p-7"><h2 className="text-2xl font-bold">Information needed for a DC recommendation</h2><ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 text-gray-700">{["Vehicle models and connector inlets", "Daily sessions and dwell time", "Simultaneous charging target", "Sanctioned load and transformer data", "Cable route and parking layout", "Public, fleet or private access", "Tariff and operating hours", "CPMS, payment and reporting needs", "Expansion plan for additional guns"].map(item => <li key={item} className="rounded-xl bg-gray-50 p-4">✓ {item}</li>)}</ul><p className="mt-5 text-gray-600 leading-relaxed">Charging time varies with vehicle capability, battery state, temperature and power sharing. Treat a quoted peak rate as an equipment limit, not a guaranteed session average. The installed proposal should identify the charger, connector, protection, electrical work, commissioning and software scope separately.</p></div>
      </div></section>


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
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Our DC Charger Range</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-2">7 models — from 3 kW to 240 kW</motion.p>
          </motion.div>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {dcProducts.map((product) => (
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
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <Accordion items={faqItems} />
            </motion.div>
          </div>
        </div>
      </section>

      <SpiderConnectCTA />
    </PageLayout>
  );
};

export default DCChargersPage;
