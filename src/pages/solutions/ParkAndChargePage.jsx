import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../../components/layout/PageLayout";
import HeroBanner from "../../components/ui/HeroBanner";
import SpiderConnectCTA from "../../components/ui/SpiderConnectCTA";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import parkImg from "../../assets/solutions/ParkAndCharge.webp";
import SEO from "../../components/SEO";
import { getServiceSchema, getBreadcrumbSchema } from "../../seo/schemas";

const benefits = [
  { icon: "🚗", title: "Attract EV Drivers", desc: "Increase footfall and customer dwell time by offering reliable EV charging at your property. EV owners actively seek out charging-enabled destinations." },
  { icon: "📊", title: "Real-Time Monitoring", desc: "Track usage, revenue, and charger health in real time via Spider Connect — our cloud-based CPMS platform accessible from any device." },
  { icon: "💰", title: "Boost Revenue", desc: "Generate a new revenue stream by charging customers for energy used. Set custom tariffs and manage billing effortlessly through our platform." },
];

const customers = ["Malls", "Hotels", "Office Parks", "Restaurants", "Hospitals", "Airports"];

const pageSchema = getServiceSchema({
  name: "Park and Charge EV Stations",
  description: "Spider Energy provides park and charge electric vehicle stations in Andhra Pradesh and Telangana with easy installation and best parking solutions for EVs.",
  url: "/park-and-charge-electric-vehicle-ev-charging-station",
  serviceType: "Park and Charge EV Infrastructure",
});
const pageBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "Solutions", url: "https://spiderenergy.in/park-and-charge-electric-vehicle-ev-charging-station" },
  { name: "Park & Charge" },
]);

const ParkAndChargePage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Park and Charge EV Stations in Telangana & Andhra Pradesh</title>
        <meta name="description" content="Spider Energy Provides Top Park & Charge Electric Vehicle Stations in Andhra Pradesh(AP) and Telangana(TG), with Easy Installation & Best Parking Solutions for EVs." />
      </Helmet>
      <SEO schema={pageSchema} breadcrumbs={pageBreadcrumbs} />
      <HeroBanner
        title="Park and Charge EV Stations in Telangana & Andhra Pradesh"
        subtitle="Give your customers the gift of convenient EV charging while they shop, dine, or work."
        bgImage={parkImg}
      />

      {/* Problem / Solution */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">The Opportunity</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Turn Every Location Into a Charging Hub
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                EV adoption is accelerating — and drivers are choosing destinations that power their journey.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                Transform your property into a high-demand charging destination. Drive premium EV footfall,
                increase customer dwell time, and unlock recurring revenue — all built on Spider EV's
                high-performance charging and intelligent software, delivering uptime, real-time monitoring,
                and seamless operations at scale.
              </motion.p>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img loading="lazy" src={parkImg} alt="Park & Charge" className="w-full h-80 object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">Why Park & Charge?</motion.h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-3 gap-8"
          >
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
                <p className="text-gray-600 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Target Customers */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 mb-4">Who Is This For?</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-600 mb-10 max-w-xl mx-auto">
              Park & Charge is perfect for any commercial property with a parking area.
            </motion.p>
            <motion.div variants={staggerFast} className="flex flex-wrap justify-center gap-4">
              {customers.map((c) => (
                <motion.span
                  key={c}
                  variants={scaleUp}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm cursor-default"
                >
                  {c}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SpiderConnectCTA />
    </PageLayout>
  );
};

export default ParkAndChargePage;
