import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import AppDownloadCTA from "../components/ui/AppDownloadCTA";
import { getProductSchema, getBreadcrumbSchema } from "../seo/schemas";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import acImg from "../assets/home/AcCharger.webp";
import dcImg from "../assets/home/DcCharger.webp";
import heroBg from "../assets/home/hero-bg.webp";
import sparkDcImg from "../assets/chargers/spark.webp";
import surgeDcImg from "../assets/chargers/surge.webp";
import ultraDcImg from "../assets/chargers/ultra.webp";

// Per-product image overrides (DC only; AC all use acImg)
const productImages = {
  "spider-spark": sparkDcImg,
  "spider-ultra": ultraDcImg,
  "spider-surge": surgeDcImg,
};

const productData = {
  ac: {
    "spider-mini": {
      name: "Spider Mini",
      tagline: "Compact single-phase AC charger built for all-weather home use",
      power: "3.3 kW",
      connector: "IEC 60309 Socket (Heavy Duty)",
      inputVoltage: "180 – 300 V AC, Single Phase",
      operatingVoltage: "220 – 240 V AC",
      outputCurrent: "16 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-lite": {
      name: "Spider Lite",
      tagline: "Smart single-phase charger with free installation and app monitoring",
      power: "3.3 kW",
      connector: "IEC 60309 Socket (Heavy Duty)",
      inputVoltage: "180 – 300 V AC, Single Phase",
      operatingVoltage: "220 – 240 V AC",
      outputCurrent: "16 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-smart": {
      name: "Spider Smart",
      tagline: "7.4 kW Type 2 charger with smart app control and dynamic load management",
      power: "7.4 kW",
      connector: "Type 2 (IEC 62196)",
      inputVoltage: "210 – 280 V AC, Single Phase",
      operatingVoltage: "220 – 260 V AC",
      outputCurrent: "32 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-blaze": {
      name: "Spider Blaze",
      tagline: "22 kW three-phase AC charger for fleets and commercial installations",
      power: "22 kW",
      connector: "Type 2 (IEC 62196)",
      inputVoltage: "400 – 460 V AC, Three Phase",
      operatingVoltage: "410 – 450 V AC",
      outputCurrent: "32 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-strike": {
      name: "Spider Strike",
      tagline: "40 kW high-power three-phase AC charger for commercial fleets",
      power: "40 kW",
      connector: "Type 2 (IEC 62196)",
      inputVoltage: "400 – 460 V AC, Three Phase",
      operatingVoltage: "410 – 450 V AC",
      outputCurrent: "55 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-dash": {
      name: "Spider Dash",
      tagline: "80 kW dual-gun three-phase AC charger for high-throughput commercial sites",
      power: "80 kW",
      connector: "Type 2 (IEC 62196)",
      inputVoltage: "400 – 460 V AC, Three Phase",
      operatingVoltage: "410 – 450 V AC",
      outputCurrent: "55 A per Gun",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
  },
  dc: {
    "spider-base": {
      name: "Spider Base",
      tagline: "3–12 kW modular DC charger with IS 17017-2-6 connector for light EVs",
      power: "3 – 12 kW",
      connector: "Type 6 (IS 17017-2-6)",
      inputVoltage: "230 V AC, Single Phase",
      operatingVoltage: "—",
      outputVoltage: "20 – 120 V DC",
      outputCurrent: "0 – 100 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-spark": {
      name: "Spider Spark",
      tagline: "60 kW DC fast charger with CCS2 / CHAdeMO for public and commercial charging",
      power: "60 kW",
      connector: "CCS2 / CHAdeMO",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 150 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-fast": {
      name: "Spider Fast",
      tagline: "30 kW rapid DC charger with CCS2 / CHAdeMO for 4-wheeler public charging",
      power: "30 kW",
      connector: "CCS2 / CHAdeMO",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 100 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-falcon": {
      name: "Spider Falcon",
      tagline: "60 kW high-speed CCS2 DC charger for public networks and commercial hubs",
      power: "60 kW",
      connector: "CCS2",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 100 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-hulk": {
      name: "Spider Hulk",
      tagline: "240 kW ultra-rapid DC charger — the peak of SpiderEV's charging technology",
      power: "240 kW",
      connector: "CCS2 / CHAdeMO",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 350 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-ultra": {
      name: "Spider Ultra",
      tagline: "120 kW high-speed DC charger for public networks, fleets, and commercial hubs",
      power: "120 kW",
      connector: "CCS2 / CHAdeMO",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 200 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-surge": {
      name: "Spider Surge",
      tagline: "180 kW rapid DC charger delivering powerful charge for highways and depots",
      power: "180 kW",
      connector: "CCS2 / CHAdeMO",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 250 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      features: [
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
  },
};

const specRows = (product) => [
  ["Power Output",       product.power],
  ["Connector Type",     product.connector],
  ["Input Voltage",      product.inputVoltage],
  ["Operating Voltage",  product.operatingVoltage],
  ...(product.outputVoltage ? [["DC Output Voltage", product.outputVoltage]] : []),
  ["Output Current",     product.outputCurrent],
  ["Protection Rating",  product.ipRating],
  ["Certifications",     product.certifications],
  ["OCPP Version",       product.ocpp],
].filter(([, val]) => val && val !== "—");

const ProductDetailPage = () => {
  const { category, productId } = useParams();
  const catData = productData[category];
  const product = catData ? catData[productId] : null;
  const productImg = (category === "dc" && productImages[productId]) ? productImages[productId] : (category === "ac" ? acImg : dcImg);

  if (!product) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to={`${category === "ac" ? "/electric-vehicle-ev-ac-charger" : "/electric-vehicle-ev-dc-charger"}`} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold">
            Back to {category === "ac" ? "AC" : "DC"} Chargers
          </Link>
        </div>
      </PageLayout>
    );
  }

  const typeLabel = category === "ac" ? "AC EV Charger" : "DC Fast EV Charger";
  const productSchema = getProductSchema(product, category, productId);
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "https://spiderenergy.in" },
    {
      name: category === "ac" ? "AC Chargers" : "DC Chargers",
      url: `https://spiderenergy.in/${category === "ac" ? "electric-vehicle-ev-ac-charger" : "electric-vehicle-ev-dc-charger"}`,
    },
    { name: product.name },
  ]);

  return (
    <PageLayout>
      <Helmet>
        <title>{product.name} — {product.power} {typeLabel} | SpiderEV</title>
        <meta name="description" content={product.tagline} />
      </Helmet>
      <SEO schema={productSchema} breadcrumbs={breadcrumbs} />
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">
                {category === "ac" ? "AC Charger" : "DC Fast Charger"}
              </motion.span>
              <motion.h1 variants={fadeUp} className="mt-3 text-4xl sm:text-5xl font-bold text-white">
                {product.name} — {product.power} {typeLabel}
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-4 text-white/80 text-xl">{product.tagline}</motion.p>
              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                <span className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold">{product.power}</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">{product.ocpp}</span>
              </motion.div>
              <motion.button variants={fadeUp} className="mt-8 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Download Datasheet (PDF)
              </motion.button>
            </motion.div>
            <motion.div
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              className="flex justify-center"
            >
              <div className="bg-white/10 rounded-2xl p-10">
                <img loading="lazy" src={productImg} alt={product.name} className="h-64 object-contain" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specs + Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Specs */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</motion.h2>
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                {specRows(product).map(([label, value], i) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    className={`flex ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <div className="w-44 px-5 py-3.5 text-sm font-semibold text-gray-600 border-r border-gray-100 flex-shrink-0">{label}</div>
                    <div className="px-5 py-3.5 text-sm text-gray-900">{value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <div>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="text-2xl font-bold text-gray-900 mb-6"
              >
                Key Features
              </motion.h2>
              <motion.div
                variants={staggerFast}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="grid grid-cols-2 gap-4"
              >
                {product.features.map((feature) => (
                  <motion.div
                    key={feature}
                    variants={scaleUp}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-4"
                  >
                    <span className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-800">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="py-10 bg-gray-50 text-center"
      >
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <Link
            to={`${category === "ac" ? "/electric-vehicle-ev-ac-charger" : "/electric-vehicle-ev-dc-charger"}`}
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            ← View All {category === "ac" ? "AC" : "DC"} Chargers
          </Link>
        </div>
      </motion.section>

      <AppDownloadCTA />
    </PageLayout>
  );
};

export default ProductDetailPage;
