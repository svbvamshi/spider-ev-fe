import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../../components/layout/PageLayout";
import HeroBanner from "../../components/ui/HeroBanner";
import AppDownloadCTA from "../../components/ui/AppDownloadCTA";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import connectImg from "../../assets/home/SpiderConnect.webp";
import heroBg from "../../assets/home/hero-bg.webp";
import SEO from "../../components/SEO";
import { getSoftwareAppSchema, getBreadcrumbSchema } from "../../seo/schemas";

const features = [
  { icon: "📍", title: "Locate Stations", desc: "Find nearby charging stations on an interactive map — real-time availability and directions." },
  { icon: "☁️", title: "Cloud Connected", desc: "Connect charge points to the cloud in 2 simple steps — no complex setup required." },
  { icon: "🖥️", title: "Single Dashboard", desc: "Manage your entire charger network from a single screen, anywhere in the world." },
  { icon: "🔒", title: "Data Privacy", desc: "Global compliance standards — your data and your customers' data is always secure." },
  { icon: "👤", title: "Customer Activity", desc: "Monitor customer charging sessions, usage patterns, and revenue in real time." },
  { icon: "📈", title: "Analytics", desc: "Real-time analytics and reporting to optimize your charging network performance." },
];

const steps = [
  { num: "01", title: "Connect Your Chargers", desc: "Link your SpiderEV chargers to the Spider Connect platform in just 2 steps — plug in, configure network, done." },
  { num: "02", title: "Monitor From Anywhere", desc: "Access the Spider Connect dashboard from any device with internet — desktop, tablet, or mobile. Real-time status, alerts, and usage data." },
  { num: "03", title: "Manage & Optimize", desc: "Set custom tariffs, manage schedules, control power usage, and receive maintenance alerts — all from one intelligent platform." },
];

const cpmsSchema = getSoftwareAppSchema({
  name: "SpiderConnect CPMS",
  description: "Cloud-based Charging Point Management System for monitoring, controlling and managing EV charging networks across India",
  url: "/cpms-ev-charging-point-management-system",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Android, iOS",
});
const breadcrumbSchema = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in/" },
  { name: "SpiderConnect CPMS" },
]);

const SpiderConnectPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>EV Charging Management System in Andhra Pradesh & Telangana</title>
        <meta name="description" content="Explore Smart EV Charging Solutions in Andhra Pradesh and Telangana with Advanced Platforms and Efficient Network Management for Seamless Charging Operations." />
      </Helmet>
      <SEO schema={cpmsSchema} breadcrumbs={breadcrumbSchema} />
      <HeroBanner
        title="EV Charging Management System in Andhra Pradesh & Telangana"
        subtitle="An advanced cloud-based platform to deploy, manage, and expand your EV charging network from anywhere."
        bgImage={connectImg}
      />

      {/* Product Description */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">CPMS Platform</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Take Full Control of Your Charging Network
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                Spider Connect is an advanced cloud-based platform that empowers operators to deploy,
                manage, and expand their EV charging network with complete visibility and control —
                your EV charger operating system.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                Whether you manage 1 charger or 1,000, Spider Connect scales with your business.
                It continuously learns from usage trends, customer feedback, and network data to
                deliver smarter, more efficient charging management over time.
              </motion.p>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img loading="lazy" src={connectImg} alt="Spider Connect Dashboard" className="w-full h-80 object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">Everything in One Platform</motion.h2>
          </motion.div>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white">How It Works</motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 mt-3">Get up and running in minutes — not days.</motion.p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((s) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="text-center"
              >
                <motion.div
                  variants={scaleUp}
                  className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5"
                >
                  <span className="text-2xl font-extrabold text-white">{s.num}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/70 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AppDownloadCTA />
    </PageLayout>
  );
};

export default SpiderConnectPage;
