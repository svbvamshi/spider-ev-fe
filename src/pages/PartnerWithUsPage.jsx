import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.webp";

const partnerTypes = [
  { icon: "🏗️", title: "Site / Property Owners", desc: "Have land or property? Host a SpiderEV charging station and earn passive income with zero operational hassle." },
  { icon: "🚛", title: "Fleet Operators", desc: "Electrify your fleet with dedicated depot charging solutions — cost-effective, managed, and integrated with Spider Connect." },
  { icon: "⛽", title: "Fuel Station Operators", desc: "Add EV charging to your fuel station and future-proof your business as India transitions to electric mobility." },
  { icon: "🏢", title: "Real Estate Developers", desc: "Integrate EV charging infrastructure into your residential and commercial projects from the design stage." },
];

const whyPoints = [
  "30+ years of parent company expertise in power electronics",
  "5,000+ chargers already deployed across India",
  "End-to-end support — from EPC to ongoing maintenance",
  "Spider Connect CPMS for remote management",
  "Presence in 15+ cities with growing network",
  "BIS certified products — industry-grade quality",
  "Transparent revenue sharing model",
  "Dedicated partner support team",
];

const PartnerWithUsPage = () => {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageLayout>
      <Helmet>
        <title>Partner With SpiderEV — EV Charging Opportunities in India</title>
        <meta name="description" content="Partner with SpiderEV as a site owner, fleet operator, fuel station or real estate developer. Build India's EV charging future together." />
      </Helmet>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
              Partner With SpiderEV — Build India's EV Future Together
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 text-white/80 text-xl max-w-xl">
              Become a SpiderEV partner and tap into India's thriving EV industry with our profitable,
              fully managed business model.
            </motion.p>
            <motion.a variants={fadeUp} href="#partner-form" className="mt-8 inline-block bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-secondary/90 transition-colors">
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900">Who We Partner With</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-3">Multiple partnership models tailored to your business type.</motion.p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {partnerTypes.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-gray-50 rounded-2xl p-7 border border-gray-100 text-center"
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Why Partner With SpiderEV?
              </motion.h2>
              <motion.ul variants={staggerFast} className="mt-8 space-y-4">
                {whyPoints.map((p) => (
                  <motion.li key={p} variants={fadeUp} className="flex items-start gap-3 text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {p}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="bg-primary rounded-2xl p-10 text-white text-center"
            >
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-2xl font-bold mb-4">Ready to Partner?</h3>
              <p className="text-white/80 leading-relaxed">
                Fill out our partnership enquiry form and our business development team will reach out
                within 24 hours to discuss the best model for your needs.
              </p>
              <a href="#partner-form" className="mt-6 inline-block bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors">
                Start Conversation
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-16 sm:py-20 bg-white" id="partner-form">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">Partnership Enquiry</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-3">Tell us about your business and we'll find the right model for you.</motion.p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8"
          >
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Received!</h3>
                <p className="text-gray-500">Our partnership team will contact you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                {[
                  { name: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                  { name: "company", label: "Company / Organization", type: "text", placeholder: "Company name" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                  { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      value={form[f.name]}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Partnership Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white"
                  >
                    <option value="">Select partnership type</option>
                    <option>Site / Property Owner</option>
                    <option>Fleet Operator</option>
                    <option>Fuel Station Operator</option>
                    <option>Real Estate Developer</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us more about your property, fleet, or business..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors text-lg">
                  Submit Enquiry
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PartnerWithUsPage;
