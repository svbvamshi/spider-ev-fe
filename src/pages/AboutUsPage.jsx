import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import HeroBanner from "../components/ui/HeroBanner";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.png";
import SEO from "../components/SEO";
import { organizationSchema, getBreadcrumbSchema } from "../seo/schemas";
import spiderEvLogo from "../assets/home/spider-ev-logo.png";
import tataMotorsLogo from "../assets/brand-logos/Tata-Motors.png";
import indianRailwayLogo from "../assets/brand-logos/Indian-Railway.png";
import delhiMetroLogo from "../assets/brand-logos/Delhi-Metro.png";
import amazonLogo from "../assets/brand-logos/Amazon.png";
import flipkartLogo from "../assets/brand-logos/flipkart.png";
import bpclLogo from "../assets/brand-logos/BPCL.png";

const stats = [
  { num: "30+", label: "Years of expertise in power electronics" },
  { num: "15+", label: "Cities covered by installation and maintenance" },
  { num: "5K+", label: "AC & DC chargers deployed across India" },
];

const partners = [
  { name: "Tata Motors", logo: tataMotorsLogo },
  { name: "Indian Railways", logo: indianRailwayLogo },
  { name: "Delhi Metro", logo: delhiMetroLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Flipkart", logo: flipkartLogo },
  { name: "BPCL", logo: bpclLogo },
];

const aboutBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "About Us" },
]);

const AboutUsPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>EV Charger Manufacturing Company in Telangana & Andhra Pradesh</title>
        <meta name="description" content="Discover EV Charging Systems Manufacturers in Andhra Pradesh and Telangana Offering Electric Car Chargers, EV Home Charger Installation & EV Charging Equipment." />
      </Helmet>
      <SEO schema={organizationSchema} breadcrumbs={aboutBreadcrumbs} />
      <HeroBanner
        title="EV Charger Manufacturing Company in Telangana & Andhra Pradesh"
        bgImage={heroBg}
      />

      {/* Company Story */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Story</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Charging the Future, One Connection at a Time
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                At SpiderEV, we aren't just keeping up with the electric vehicle revolution — we're leading it.
                Backed by 30 years of expertise in power electronics, SpiderEV is shaping the EV landscape
                in India with innovation, precision, and an eye on the future.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                From homes to highways, our EV charging solutions are designed to empower a cleaner,
                smarter, and more connected tomorrow. We are a vertically integrated manufacturer —
                designing, manufacturing, deploying, and managing every aspect of EV charging infrastructure.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                Our team has built India's largest charging networks, partnering with India Post, Indian
                Railways, Delhi Metro, Tata Motors, and 20+ other industry leaders to accelerate the
                transition to electric mobility.
              </motion.p>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="bg-gray-50 rounded-2xl p-10 flex items-center justify-center"
            >
              <img
                src={spiderEvLogo}
                alt="SpiderEV"
                className="max-h-32 w-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden py-16" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-3 gap-8 text-center"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={scaleUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="text-5xl font-extrabold text-secondary">{s.num}</div>
                <div className="text-white/70 text-sm mt-2 max-w-[160px] mx-auto">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeLeft} className="bg-primary rounded-2xl p-10">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">
                "To be the most sought after Charging Partner in the country — completely annihilating
                charge anxiety through innovative solutions that empower every EV driver, business,
                and community across India."
              </p>
            </motion.div>
            <motion.div variants={fadeRight} className="bg-gray-50 rounded-2xl p-10 border border-gray-100">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                "To be India's no.1 fully vertically integrated charging company — from manufacturing
                to being the Charge Point Operator. We envision a future where every Indian can charge
                their EV as easily as they charge their phone."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Trusted by Industry Leaders</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-3">Partnering with India's most recognized brands and institutions.</motion.p>
          </motion.div>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6"
          >
            {partners.map((p) => (
              <motion.div
                key={p.name}
                variants={scaleUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                className="bg-white border border-gray-100 rounded-xl p-5 w-[160px] h-[90px] flex items-center justify-center shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutUsPage;
