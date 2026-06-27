import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../../components/layout/PageLayout";
import HeroBanner from "../../components/ui/HeroBanner";
import SpiderConnectCTA from "../../components/ui/SpiderConnectCTA";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import communityImg from "../../assets/solutions/CommunityCharging.webp";
import heroBg from "../../assets/home/hero-bg.webp";
import SEO from "../../components/SEO";
import { getServiceSchema, getBreadcrumbSchema } from "../../seo/schemas";

const pillars = [
  {
    title: "Accessibility",
    desc: "Integrate EV charging seamlessly into your residents' daily lives. Chargers in basements, parking bays, and common areas mean drivers never need to look elsewhere.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Fast & Efficient",
    desc: "SpiderEV deploys the latest AC and DC charging technology — from 3.3 kW home chargers to 22 kW three-phase units — ensuring every resident charges quickly and conveniently.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "App-Enabled",
    desc: "Residents can locate chargers, check availability, reserve a slot, and pay — all through the SpiderEV app. No queues, no confusion, no friction.",
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const serviceSchema = getServiceSchema({
  name: "Community EV Charging Stations",
  description: "Shared EV charging solutions for apartments, housing societies and gated communities in AP & Telangana",
  url: "/community-ev-charging-stations",
  serviceType: "Community EV Charging",
});
const breadcrumbSchema = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in/" },
  { name: "Community Charging" },
]);

const CommunityChargingPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Community EV Charging Stations in Telangana & Andhra Pradesh</title>
        <meta name="description" content="Spider Energy Provides Community EV Charging Stations in Andhra Pradesh (AP) & Telangana(TG) for Apartments and Housing Societies with Residential Charging Solutions." />
      </Helmet>
      <SEO schema={serviceSchema} breadcrumbs={breadcrumbSchema} />
      <HeroBanner
        title="Community EV Charging Stations in Telangana & Andhra Pradesh"
        subtitle="Transform your neighborhood into a vibrant EV-friendly community with convenient on-site charging."
        bgImage={communityImg}
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
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img loading="lazy" src={communityImg} alt="Community Charging" className="w-full h-80 object-cover" />
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">Residential Solutions</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Powering Modern Communities
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                As EV adoption grows, residents expect charging where they live. Spider EV brings reliable,
                accessible charging directly into apartments and gated communities — making EV ownership seamless.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                We go beyond installing chargers. Spider EV designs structured, scalable systems that support
                both cars and two-wheelers, with smart load management to ensure efficient use of shared power.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                Every charger is connected through an integrated platform that enables real-time monitoring,
                seamless access, and automated billing — delivering a smooth experience for residents and
                complete visibility for property managers.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                From planning and installation to ongoing operations, we handle everything — so your community
                gets a future-ready charging network without the complexity.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">Built Around Your Residents</motion.h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-3 gap-8"
          >
            {pillars.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
              >
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    {p.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-6">
              A Greener Community Starts at Home
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
              Every EV charging point installed in a residential community directly reduces fossil fuel
              dependency, lowers carbon emissions, and contributes to India's clean energy targets.
            </motion.p>
            <motion.div variants={staggerFast} className="mt-10 grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { num: "0", label: "Tailpipe Emissions" },
                { num: "↓60%", label: "Fuel Cost Savings" },
                { num: "24/7", label: "Charging Availability" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  variants={scaleUp}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="text-center"
                >
                  <div className="text-4xl font-extrabold text-secondary">{s.num}</div>
                  <div className="text-white/70 text-sm mt-1">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SpiderConnectCTA />
    </PageLayout>
  );
};

export default CommunityChargingPage;
