import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../../components/layout/PageLayout";
import HeroBanner from "../../components/ui/HeroBanner";
import AppStoreButtons from "../../components/ui/AppStoreButtons";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import appImg from "../../assets/home/SpiderApp.webp";
import heroBg from "../../assets/home/hero-bg.webp";
import SEO from "../../components/SEO";
import { getSoftwareAppSchema, getBreadcrumbSchema } from "../../seo/schemas";

const appFeatures = [
  { icon: "📍", title: "Locate Stations", desc: "Find EV charging stations near you on an interactive map." },
  { icon: "🗺️", title: "Route Planning", desc: "Plan routes with charger stops built in — never run out of charge." },
  { icon: "🟢", title: "Live Availability", desc: "Real-time station availability — see which chargers are free before you arrive." },
  { icon: "⚡", title: "Session Tracking", desc: "Monitor your charging session live — power, time, and cost in real time." },
  { icon: "💳", title: "Easy Payment", desc: "Pay seamlessly via UPI, credit/debit cards, and digital wallets." },
  { icon: "🌐", title: "9 Languages", desc: "Available in 9 regional Indian languages for a truly local experience." },
  { icon: "🚗", title: "EV Filters", desc: "Customizable filters by EV type, charger power, and connector standard." },
  { icon: "⏰", title: "Schedule Charging", desc: "Reserve a charging slot in advance and schedule your session remotely." },
  { icon: "📊", title: "Live Power Monitor", desc: "Track live power usage and energy consumed per session." },
];

const appSchema = getSoftwareAppSchema({
  name: "SpiderEV Charging App",
  description: "Find nearby EV charging stations, start sessions, pay digitally and track charging history across India",
  url: "/ev-charging-station-app",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Android, iOS",
});
const breadcrumbSchema = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in/" },
  { name: "SpiderEV App" },
]);

const SpiderEVAppPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>EV Charging Station App in Andhra Pradesh & Telangana</title>
        <meta name="description" content="Discover a Smart EV Charging App in Andhra Pradesh and Telangana to Locate Nearby Stations, Access Charging Networks and Manage Your EV Charging Anytime, Anywhere." />
      </Helmet>
      <SEO schema={appSchema} breadcrumbs={breadcrumbSchema} />
      <HeroBanner
        title="EV Charging Station App in Andhra Pradesh & Telangana"
        subtitle="Find EV charging stations near you. A seamless experience that lets you power up quickly and pay effortlessly."
        bgImage={appImg}
      />

      {/* App Intro */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">Mobile App</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Your EV Charging Companion
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                The SpiderEV app puts the entire SpiderEV charging network at your fingertips.
                From discovering stations to completing payment — everything happens in the app,
                making EV ownership in India simpler than ever.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                Available in 9 regional languages, with support for all major payment methods and
                every EV type — SpiderEV App is built for Bharat.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <AppStoreButtons />
              </motion.div>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img loading="lazy" src={appImg} alt="SpiderEV App" className="w-full h-[420px] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">Everything You Need to Charge</motion.h2>
          </motion.div>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {appFeatures.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4"
              >
                <div className="text-3xl flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="relative overflow-hidden py-16 sm:py-20 text-center" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">Download SpiderEV App Today</motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 mb-10 max-w-xl mx-auto">
              Join thousands of EV drivers across India who charge smarter with the SpiderEV app.
            </motion.p>
            <motion.div variants={fadeUp} className="flex justify-center">
              <AppStoreButtons />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SpiderEVAppPage;
