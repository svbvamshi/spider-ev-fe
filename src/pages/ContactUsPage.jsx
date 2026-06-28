import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.webp";
import SEO from "../components/SEO";
import { localBusinessSchema, getBreadcrumbSchema } from "../seo/schemas";

const contactDetails = [
  { icon: "✉️", label: "Email", value: "connect@spiderenergy.in", href: "mailto:connect@spiderenergy.in" },
  { icon: "💬", label: "WhatsApp", value: "+91 9997776080", href: "https://wa.me/919997776080" },
  { icon: "📍", label: "Address", value: "THub, Raidurgam, Hyderabad, India" },
  { icon: "🕐", label: "Support Hours", value: "Mon–Sun: 24x7" },
];

const contactBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "Contact Us" },
]);

const ContactUsPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageLayout>
      <Helmet>
        <title>Contact SpiderEV | EV Charging Experts in AP & TG</title>
        <meta name="description" content="Contact Spider Energy for EV charger installation, franchise enquiries, CPMS support or SpiderVault BESS consultation in Andhra Pradesh & Telangana." />
      </Helmet>
      <SEO schema={localBusinessSchema} breadcrumbs={contactBreadcrumbs} />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-bold text-white"
          >
            Contact Spider Energy — EV Charging Experts in Telangana & Andhra Pradesh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mt-4 text-white/80 text-xl max-w-xl"
          >
            Have a question or want to partner with us? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-secondary/10 border border-secondary rounded-2xl p-8 text-center"
                >
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Our team will get back to you within 24–48 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                  {[
                    { name: "name", label: "Full Name", type: "text", placeholder: "Enter your full name" },
                    { name: "email", label: "Email Address", type: "email", placeholder: "Enter your email" },
                    { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {f.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={f.type}
                        required
                        value={form[f.name]}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-lg">
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Details */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</motion.h2>
              <motion.div variants={staggerFast} className="space-y-6 mb-10">
                {contactDetails.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">{item.label}</div>
                      {item.href
                        ? <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary font-semibold mt-0.5 hover:underline block">{item.value}</a>
                        : <div className="text-gray-900 font-semibold mt-0.5">{item.value}</div>
                      }
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              {/* <motion.div
                variants={fadeUp}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-64 bg-gray-50 flex items-center justify-center"
              >
                <div className="text-center text-gray-400">
                  <div className="text-3xl mb-2">🗺️</div>
                  <p className="text-sm">Google Maps Embed</p>
                  <p className="text-xs mt-1">Replace with iframe embed from Google Maps</p>
                </div>
              </motion.div> */}
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactUsPage;
