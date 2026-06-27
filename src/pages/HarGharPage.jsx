import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import { fadeUp, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import acImg from "../assets/home/AcCharger.webp";
import heroBg from "../assets/home/hero-bg.webp";
import SEO from "../components/SEO";
import { getServiceSchema, getBreadcrumbSchema } from "../seo/schemas";

const steps = [
  { num: "01", title: "Register Your Interest", desc: "Fill out our quick form — name, location, and property type. No technical knowledge needed." },
  { num: "02", title: "Site Verification", desc: "Our team visits your property to assess electrical capacity and recommend the best charger for your space." },
  { num: "03", title: "Installation & Go Live", desc: "We install a compact SpiderEV charger at your location. Your station goes live on the SpiderEV app and you start earning." },
];

const harGharSchema = getServiceSchema({
  name: "Har Ghar Charger — Home EV Charging for Every Indian",
  description: "SpiderEV's Har Ghar Charger initiative brings affordable home EV charging to every Indian household. Register your interest and earn from your own charging station.",
  url: "/har-ghar",
  serviceType: "Home EV Charging Program",
});
const harGharBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "Har Ghar Charger" },
]);

const HarGharPage = () => {
  const [form, setForm] = useState({ name: "", phone: "", city: "", type: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageLayout>
      <Helmet>
        <title>Har Ghar Charger — Affordable Home EV Charging India</title>
        <meta name="description" content="Har Ghar Charger — affordable home EV charging for every Indian household. Register and earn from your own EV charging station." />
      </Helmet>
      <SEO schema={harGharSchema} breadcrumbs={harGharBreadcrumbs} />
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="inline-block bg-secondary/20 text-secondary text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-wider">
              SpiderAtHome Initiative
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
              Earn ₹8,000 – ₹16,000/Month from Your Own EV Charging Point
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-white/80 text-xl max-w-2xl mx-auto">
              Install a compact SpiderEV charger at your home, shop, or small business — and earn
              passive income every time someone charges their EV.
            </motion.p>
            <motion.a variants={fadeUp} href="#apply" className="mt-8 inline-block bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-secondary/90 transition-colors">
              Apply Now — It's Free
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* What is SpiderAtHome */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">The Initiative</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                What is SpiderAtHome?
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-600 text-lg leading-relaxed">
                SpiderAtHome is SpiderEV's grassroots initiative to deploy EV charging infrastructure
                at the neighborhood level. We partner with homeowners, shop owners, and small businesses
                to install compact EV chargers — creating a dense, convenient charging network while
                generating passive income for our hosts.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
                With an investment of under ₹8,000 for a compact charger, you can start earning from
                EV charging in your locality — no technical knowledge required.
              </motion.p>
              <motion.div
                variants={staggerFast}
                className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {[
                  { num: "₹8K", label: "Min Investment" },
                  { num: "₹16K", label: "Max Monthly Income" },
                  { num: "60", label: "Days to Go Live" },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    variants={scaleUp}
                    whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                    className="text-center bg-gray-50 rounded-xl p-4"
                  >
                    <div className="text-2xl font-extrabold text-primary">{s.num}</div>
                    <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex justify-center"
            >
              <div className="bg-gray-50 rounded-2xl p-10">
                <img loading="lazy" src={acImg} alt="SpiderEV Charger" className="h-64 object-contain" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">How It Works</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mt-3">Simple 3-step process to start earning from EV charging.</motion.p>
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
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-extrabold text-white">{s.num}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 mb-4">Who Can Apply?</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 mb-10 max-w-xl mx-auto">
              Anyone with a property and a basic power connection can host a SpiderEV charger.
            </motion.p>
            <motion.div variants={staggerFast} className="flex flex-wrap justify-center gap-4">
              {["Homeowners", "Shop Owners", "Offices", "Restaurants", "Small Businesses", "Parking Lots", "Apartments"].map((t) => (
                <motion.div
                  key={t}
                  variants={scaleUp}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  className="bg-primary/10 text-primary font-semibold px-6 py-3 rounded-full text-sm"
                >
                  {t}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="relative overflow-hidden py-16 sm:py-20" id="apply" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-[600px] mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white">Register Your Interest</motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 mt-3">Fill out the form and our team will contact you within 24 hours.</motion.p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Received!</h3>
                <p className="text-gray-500">Our team will call you within 24 hours to discuss next steps.</p>
              </motion.div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                {[
                  { name: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
                  { name: "phone", label: "Mobile Number", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { name: "city", label: "City / Location", type: "text", placeholder: "Your city" },
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white"
                  >
                    <option value="">Select property type</option>
                    <option>Home</option>
                    <option>Shop / Store</option>
                    <option>Office</option>
                    <option>Restaurant</option>
                    <option>Parking Lot</option>
                    <option>Other</option>
                  </select>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors text-lg">
                  Submit Application
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HarGharPage;
