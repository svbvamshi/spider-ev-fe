import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../../components/layout/PageLayout";
import HeroBanner from "../../components/ui/HeroBanner";
import SpiderConnectCTA from "../../components/ui/SpiderConnectCTA";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerFast, viewport } from "../../utils/animationConfig";
import workplaceImg from "../../assets/solutions/WorkplaceCharging.webp";
import heroBg from "../../assets/home/hero-bg.webp";
import SEO from "../../components/SEO";
import { getServiceSchema, getBreadcrumbSchema } from "../../seo/schemas";

const epcPhases = [
  {
    letter: "E", title: "Engineering", color: "bg-primary",
    points: ["Site evaluation and traffic analysis", "Electrical infrastructure assessment", "Load calculation and design", "Layout planning and parking optimization", "ROI modeling and financial planning"],
  },
  {
    letter: "P", title: "Procurement", color: "bg-secondary",
    points: ["Charger selection and specification", "BIS/CE certified equipment sourcing", "Cable, switchgear, and panel procurement", "Quality assurance and testing", "Logistics and delivery management"],
  },
  {
    letter: "C", title: "Construction", color: "bg-primary",
    points: ["Civil and electrical works", "Charger installation and mounting", "Network connectivity setup", "Spider Connect integration", "Testing, commissioning, and handover"],
  },
];

const processSteps = [
  { num: 1, title: "Site Evaluation", desc: "Traffic analysis, proximity assessment, electrical infrastructure review, and ROI modeling." },
  { num: 2, title: "Community Consultation", desc: "Working with property owners, local authorities, and residents to align on plan and permits." },
  { num: 3, title: "Design & Layout", desc: "Entry/exit planning, parking bay layout, and electrical design optimized for your site." },
  { num: 4, title: "Equipment Procurement", desc: "Sourcing certified SpiderEV chargers, cables, panels, and all required components." },
  { num: 5, title: "Installation", desc: "Civil works, electrical installation, charger mounting, and network integration." },
  { num: 6, title: "Handover & Support", desc: "Commissioning, testing, staff training, and ongoing O&M support by SpiderEV." },
];

const whyPoints = [
  "End-to-end accountability — single vendor, no gaps",
  "30+ years of parent company expertise in power electronics",
  "BIS and industry standard compliance on all equipment",
  "Spider Connect integration from day one",
  "Presence in 15+ cities for installation and maintenance",
  "5,000+ chargers deployed across India",
];

const serviceSchema = getServiceSchema({
  name: "EV Charging Station EPC Services",
  description: "End-to-end EPC services for EV charging station installation — site survey, design, construction and commissioning in AP & Telangana",
  url: "/ev-charging-epc-services",
  serviceType: "EV Station EPC & Installation",
});
const breadcrumbSchema = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in/" },
  { name: "EPC Services" },
]);

const EPCWorksPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>EV Station EPC & Installation Services | AP & TG</title>
        <meta name="description" content="We provides EV charging station installation in Andhra Pradesh & Telangana with EPC services, construction support & infrastructure solutions for commercial and public spaces." />
      </Helmet>
      <SEO schema={serviceSchema} breadcrumbs={breadcrumbSchema} />
      <HeroBanner
        title="End-to-End EV Charging Station EPC & Installation Services Across AP & TG"
        subtitle="Engineering, Procurement, and Construction — end-to-end EV charging solutions designed, procured, and installed by our expert team."
        bgImage={workplaceImg}
      />

      {/* EPC Breakdown */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Approach</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">End-to-End EPC Delivery</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-4 max-w-2xl mx-auto">
              From the first site survey to final handover, SpiderEV manages every aspect of your
              EV charging infrastructure project.
            </motion.p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid md:grid-cols-3 gap-8"
          >
            {epcPhases.map((phase) => (
              <motion.div
                key={phase.letter}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <div className={`${phase.color} px-8 py-6 flex items-center gap-4`}>
                  <span className="text-5xl font-extrabold text-white/30">{phase.letter}</span>
                  <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {phase.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-gray-700 text-sm">
                        <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-3xl font-bold text-gray-900 text-center mb-12"
          >
            Our EPC Process
          </motion.h2>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {processSteps.map((s) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4"
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{String(s.num).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why SpiderEV + Form */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Why Choose SpiderEV for EPC?
              </motion.h2>
              <motion.ul variants={staggerFast} className="mt-8 space-y-4">
                {whyPoints.map((point) => (
                  <motion.li key={point} variants={fadeUp} className="flex items-start gap-3 text-white/80">
                    <span className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {point}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Get a Free Site Assessment</h3>
              <form className="space-y-4">
                {["Your Name", "Company / Property Name", "Email Address", "Phone Number"].map((placeholder) => (
                  <input
                    key={placeholder}
                    type="text"
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                ))}
                <textarea
                  placeholder="Tell us about your project..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                />
                <button className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                  Request Assessment
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <SpiderConnectCTA />
    </PageLayout>
  );
};

export default EPCWorksPage;
