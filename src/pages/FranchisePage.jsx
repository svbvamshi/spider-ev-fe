import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import { getServiceSchema, getBreadcrumbSchema } from "../seo/schemas";

// ─── Assets ──────────────────────────────────────────────────────────────────
import acChargerImg from "../assets/home/AcCharger.jpeg";
import dcChargerImg from "../assets/home/DcCharger.png";
import webinarImg from "../assets/home/heroImage2.jpeg";

// Brand partner logos
import tataLogo from "../assets/brand-logos/Tata-Motors.png";
import railwayLogo from "../assets/brand-logos/Indian-Railway.png";
import metroLogo from "../assets/brand-logos/Delhi-Metro.png";
import amazonLogo from "../assets/brand-logos/Amazon.png";
import flipkartLogo from "../assets/brand-logos/flipkart.png";
import bpclLogo from "../assets/brand-logos/BPCL.png";

// ─── Animation variants — match ChargeZone's Webflow-style scroll animations ─
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const vp = { once: true, amount: 0.15 };

// ─── Data ─────────────────────────────────────────────────────────────────────

const networkStats = [
  { num: "500+",        label: "Charging Points Across India" },
  { num: "24×7",       label: "Support with 98% Network Uptime" },
  { num: "Solar+BESS", label: "Options for High-End Sites" },
];

const whyCards = [
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: "Turnkey EV Infrastructure",
    desc: "From site survey and equipment supply to installation and commissioning — SpiderEV handles it all end-to-end. Zero operational headaches.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: "24×7 Support & 98% Uptime",
    desc: "Round-the-clock technical support with remote monitoring via Spider Connect CPMS ensures your station stays revenue-generating at all times.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    title: "Live Revenue Dashboard",
    desc: "Track sessions, revenue, and uptime in real time from our Spider Connect CMS — complete visibility into your investment performance.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    title: "Brand & Marketing Support",
    desc: "Leverage SpiderEV's brand presence, app listings, Google Maps integration, and national marketing campaigns from day one.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: "Predictable Long-Term ROI",
    desc: "Our revenue-sharing model and India's growing EV adoption deliver predictable, compounding returns across a 3–5 year investment horizon.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: "Own Part of India's EV Grid",
    desc: "India needs 4 lakh+ chargers by 2030. With SpiderEV, you don't just believe in the future — you own a piece of it and profit from it.",
  },
];

const investmentModels = [
  {
    name: "Fast Charging Station",
    tagline: "The perfect entry point into EV infrastructure",
    investment: "Starting ₹30 Lakhs*",
    image: acChargerImg,
    specs: [
      { label: "Charger Options", value: "30, 60, 120 kW DC (Single/Dual Gun)" },
      { label: "Vehicle Type",   value: "4-wheeler passenger EVs (CCS2 compatible)" },
      { label: "Space Needed",   value: "~1,000 sq. ft. (2–3 car parks)" },
      { label: "Power Setup",    value: "Direct grid connection, plug-and-play" },
      { label: "Ideal For",      value: "Highways, office parks, malls, societies" },
    ],
    support: [
      "Spider Connect CMS dashboard access",
      "24×7 technical support",
      "Marketing assistance & app listing",
      "Site survey & EPC works",
    ],
  },
  {
    name: "Super Charging Station",
    tagline: "High-throughput hub for serious investors",
    investment: "Starting ₹1 Crore*",
    image: dcChargerImg,
    badge: "HIGH ROI",
    specs: [
      { label: "Charger Options", value: "240 kW & 360 kW DC" },
      { label: "Scalability",     value: "Up to 1.2 MW with multi-gun setup" },
      { label: "Vehicles",        value: "4-wheelers, e-buses & electric trucks" },
      { label: "Power Setup",     value: "Grid + Solar + BESS integration" },
      { label: "Ideal For",       value: "Highways, transport hubs, city centres" },
    ],
    support: [
      "Central CMS access & analytics",
      "24×7 customer experience team",
      "Marketing & visibility campaigns",
      "Full EPC & DISCOM approvals support",
    ],
  },
];

const webinarExpect = [
  "End-to-end walkthrough of owning a SpiderEV Franchise",
  "Exclusive insights on expected ROI by franchise experts",
  "Strategic guidance on investment models & site selection",
  "Live Q&A with our EV and business development specialists",
];

const brandPartners = [
  { src: tataLogo,    name: "Tata Motors" },
  { src: railwayLogo, name: "Indian Railway" },
  { src: metroLogo,   name: "Delhi Metro" },
  { src: amazonLogo,  name: "Amazon" },
  { src: flipkartLogo,name: "Flipkart" },
  { src: bpclLogo,    name: "BPCL" },
];

const faqItems = [
  { question: "What are the investment options and who is this for?",
    answer: "We offer two models: Fast Charging (₹30L+) for passenger EVs, and Super Charging (₹1Cr+) for high-throughput sites. Ideal for landowners, retail entrepreneurs, and institutional investors." },
  { question: "What kind of space and power connection do I need?",
    answer: "Fast Charging: ~1,000 sq. ft. with 50–150 kVA sanctioned load. Super Charging: larger footprint for commercial EVs with 250–1200 kVA load. We assist with site layout, DISCOM approvals, and Solar + BESS integration." },
  { question: "How much can I earn and what's the ROI timeline?",
    answer: "Typical ROI is 2–4 years for Fast Charging and 3–5 years for Super Charging. Earnings depend on location, footfall, and tariff. Live revenue tracking available via Spider Connect CMS." },
  { question: "How does SpiderEV support me after setup?",
    answer: "End-to-end installation, 24×7 tech support, marketing campaigns, Spider Connect software, remote monitoring, and on-site service through our maintenance network." },
  { question: "I have land but no power connection — can I still start?",
    answer: "Yes. SpiderEV's EPC team will assess your site and arrange the power connection as part of the project, including all DISCOM approvals." },
  { question: "What is the setup timeline?",
    answer: "From agreement to commissioning: 12–20 weeks for Fast Charging, 20–24 weeks for Super Charging, subject to permits and grid readiness." },
  { question: "Why choose SpiderEV over others?",
    answer: "SpiderEV is vertically integrated — we manufacture chargers, operate our own software (Spider Connect), and deploy our own stations. No third-party dependencies means better pricing, faster resolution, and higher uptime." },
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

const franchiseSchema = getServiceSchema({
  name: "EV Charging Station Franchise",
  description: "Start your EV charging franchise in Andhra Pradesh and Telangana with dealership support, profitable franchise setup plans and trusted franchise company guidance.",
  url: "/ev-charging-station-franchise",
  serviceType: "EV Charging Franchise Opportunity",
});
const franchiseBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://www.spiderenergy.in" },
  { name: "Franchise" },
]);

// ─── Small shared components ───────────────────────────────────────────────────

const CheckIcon = ({ cls = "w-3.5 h-3.5" }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowIcon = ({ cls = "w-4 h-4" }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ─── ChargeZone-style accordion (border-bottom dividers, no boxes per item) ───
const FaqItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left gap-4 group"
    >
      <span className={`font-semibold text-base transition-colors ${isOpen ? "text-primary" : "text-gray-900 group-hover:text-primary"}`}>
        {question}
      </span>
      <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${isOpen ? "bg-primary border-primary" : "border-gray-200 group-hover:border-primary"}`}>
        <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-45 text-white" : "text-gray-400 group-hover:text-primary"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="pb-5 text-gray-500 leading-relaxed pr-12">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FaqSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {faqItems.map((item, i) => (
        <FaqItem
          key={i}
          question={item.question}
          answer={item.answer}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
};

// ─── Multi-step franchise form ─────────────────────────────────────────────────
const PillBtn = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
      active ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary bg-white"
    }`}
  >
    {children}
  </button>
);

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white placeholder-gray-400";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

const FranchiseForm = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", mobile: "",
    city: "", state: "", pincode: "", type: "Individual",
    turnover: "", budget: "", landAvailable: "", webinar: "",
  });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const ok1 = form.firstName && form.lastName && form.email && form.mobile && form.city && form.state && form.pincode;
  const ok2 = form.budget && form.landAvailable && form.webinar;

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-14">
        <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-4">
          <CheckIcon cls="w-8 h-8 text-secondary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Thank you!</h3>
        <p className="text-gray-400 text-sm leading-relaxed">Submission received.<br />Our franchise team will reach you within 24 hours.</p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Step bar — starts immediately, no card header */}
      <div className="flex items-center mb-7">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
              s < step ? "bg-secondary text-white" : s === step ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {s < step ? <CheckIcon cls="w-3.5 h-3.5" /> : s}
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-1.5 transition-all ${s < step ? "bg-secondary" : "bg-gray-200"}`} />}
          </div>
        ))}
        <span className="ml-3 text-[11px] text-gray-400 font-medium shrink-0">Step {step}/3</span>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>First Name *</label><input type="text" required placeholder="Ravi" value={form.firstName} onChange={e => f("firstName", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Last Name *</label><input type="text" required placeholder="Kumar" value={form.lastName} onChange={e => f("lastName", e.target.value)} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Email *</label><input type="email" required placeholder="your@email.com" value={form.email} onChange={e => f("email", e.target.value)} className={inputCls} /></div>
            <div>
              <label className={labelCls}>Mobile Number *</label>
              <div className="flex gap-2">
                <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 text-sm text-gray-400 font-medium shrink-0">+91</div>
                <input type="tel" required placeholder="XXXXX XXXXX" value={form.mobile} onChange={e => f("mobile", e.target.value)} className={`${inputCls} flex-1`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>City *</label><input type="text" required placeholder="Your city" value={form.city} onChange={e => f("city", e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>PinCode *</label><input type="text" required maxLength={6} placeholder="6-digit" value={form.pincode} onChange={e => f("pincode", e.target.value.replace(/\D/g, ""))} className={inputCls} /></div>
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <select required value={form.state} onChange={e => f("state", e.target.value)} className={`${inputCls} cursor-pointer`}>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <p className={`${labelCls} mb-2`}>Proceed as *</p>
              <div className="flex gap-2">
                {["Individual", "Business"].map(opt => <PillBtn key={opt} active={form.type === opt} onClick={() => f("type", opt)}>{opt}</PillBtn>)}
              </div>
            </div>
            <button type="button" onClick={() => ok1 && setStep(2)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm mt-1 transition-all ${ok1 ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              Next →
            </button>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} className="space-y-5">
            {form.type === "Business" && (
              <div>
                <p className={`${labelCls} mb-2`}>Business Turnover *</p>
                <div className="flex flex-wrap gap-2">
                  {["₹1L–50L","₹50L–1Cr","₹1Cr–5Cr","₹5Cr+"].map(o => <PillBtn key={o} active={form.turnover === o} onClick={() => f("turnover", o)}>{o}</PillBtn>)}
                </div>
              </div>
            )}
            <div>
              <p className={`${labelCls} mb-2`}>Investment Budget *</p>
              <div className="flex flex-wrap gap-2">
                {["₹30L–₹60L","₹60L–₹1Cr","₹1Cr–₹5Cr","₹5Cr+"].map(o => <PillBtn key={o} active={form.budget === o} onClick={() => f("budget", o)}>{o}</PillBtn>)}
              </div>
            </div>
            <div>
              <p className={`${labelCls} mb-2`}>Land Available? *</p>
              <div className="flex gap-2">{["Yes","No"].map(o => <PillBtn key={o} active={form.landAvailable === o} onClick={() => f("landAvailable", o)}>{o}</PillBtn>)}</div>
            </div>
            <div>
              <p className={`${labelCls} mb-2`}>Interested in Webinar? *</p>
              <div className="flex flex-wrap gap-2">{["Yes, interested","Not right now"].map(o => <PillBtn key={o} active={form.webinar === o} onClick={() => f("webinar", o)}>{o}</PillBtn>)}</div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-all">← Back</button>
              <button type="button" onClick={() => ok2 && setStep(3)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${ok2 ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>Next →</button>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} className="space-y-4">
            <p className={labelCls}>Review Your Details</p>
            <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 text-sm overflow-hidden">
              {[
                ["Name", `${form.firstName} ${form.lastName}`],
                ["Email", form.email],
                ["Mobile", `+91 ${form.mobile}`],
                ["Location", `${form.city}, ${form.state} – ${form.pincode}`],
                ["Type", form.type],
                ["Budget", form.budget],
                ["Land", form.landAvailable],
                ["Webinar", form.webinar],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start gap-4 px-4 py-2.5">
                  <span className="text-gray-400 shrink-0">{k}</span>
                  <span className="font-medium text-gray-800 text-right">{v}</span>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary shrink-0" />
              <span className="text-xs text-gray-400 leading-relaxed">
                I agree to the use of my information for communication, as outlined in SpiderEV's{" "}
                <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.
              </span>
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-all">← Back</button>
              <button type="button" onClick={() => agreed && setSubmitted(true)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${agreed ? "bg-secondary text-white hover:bg-secondary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>Submit ✓</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FranchisePage() {
  return (
    <PageLayout>
      <Helmet>
        <title>EV Charging Station Franchise in Telangana & Andhra Pradesh</title>
        <meta name="description" content="Start your EV Charging Franchise in Andhra Pradesh and Telangana with Dealership Support, Profitable Franchise Setup Plans and Trusted Franchise Company Guidance." />
      </Helmet>
      <SEO schema={franchiseSchema} breadcrumbs={franchiseBreadcrumbs} />

      {/* ═══════════════════════════════════════════
          HERO — dark bg, no badge, white headline
          form card starts directly with step bar
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#0d0e1f" }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left text */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="pt-2 lg:pt-6">
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-white leading-[1.08] mb-5 tracking-tight">
              EV Charging Station Franchise in Telangana & Andhra Pradesh
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/55 text-lg leading-relaxed mb-9 max-w-md">
              Be a franchise partner with SpiderEV — India's growing EV charging network. Starting at just <span className="text-white font-semibold">₹30 Lakhs*</span>
            </motion.p>
            <motion.a variants={fadeUp} href="#register-form"
              className="inline-flex items-center gap-2.5 bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-[15px] hover:bg-secondary/90 transition-all hover:gap-3.5 mb-16">
              Partner With Us <ArrowIcon />
            </motion.a>

            {/* 3 stats with vertical dividers — ChargeZone style */}
            <motion.div variants={fadeUp} className="flex border-t border-white/10 pt-10 gap-0">
              {networkStats.map((s, i) => (
                <div key={s.label} className={`flex-1 ${i > 0 ? "border-l border-white/10 pl-7" : "pr-7"}`}>
                  <div className="text-2xl font-extrabold text-white">{s.num}</div>
                  <div className="text-white/35 text-xs mt-1 leading-snug">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — form card, no heading, step bar starts immediately */}
          <motion.div
            id="register-form"
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:sticky lg:top-24"
          >
            <FranchiseForm />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INDIA IS CHARGING AHEAD
          text left · 2 huge raw stat numbers right
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.span variants={fadeUp} className="text-secondary font-bold text-xs uppercase tracking-widest">Market Opportunity</motion.span>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                India is Charging Ahead.<br />Are you?
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed max-w-md">
                With India targeting 30% EV penetration by 2030, demand for fast, reliable and accessible charging infrastructure is skyrocketing. Now is the perfect time to ride the EV wave — not just as a believer, but as an owner of the future.
              </motion.p>
              <motion.a variants={fadeUp} href="#register-form"
                className="mt-8 inline-flex items-center gap-2 text-primary font-bold text-sm border-b-2 border-primary pb-px hover:opacity-70 transition-opacity">
                Enquire Now <ArrowIcon />
              </motion.a>
            </motion.div>

            {/* 2 huge raw numbers — no card containers */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp} className="space-y-0">
              <motion.div variants={fadeRight} className="pb-10 border-b border-gray-100">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-primary tracking-tight leading-none">₹4,000+cr</div>
                <div className="text-gray-400 text-base mt-4 leading-snug">allocated to EV infra under PM E-Drive Scheme</div>
              </motion.div>
              <motion.div variants={fadeRight} className="pt-10">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-primary tracking-tight leading-none">44%</div>
                <div className="text-gray-400 text-base mt-4 leading-snug">CAGR growth of India's EV market (2020–2027)</div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY PARTNER WITH SPIDEREV — white bg
          open stat strip · watch video CTA · flip cards on white
      ═══════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">

          {/* Section heading — 2 col */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}
            className="grid lg:grid-cols-2 gap-10 items-end mb-14">
            <motion.div variants={fadeLeft}>
              <span className="text-secondary font-bold text-xs uppercase tracking-widest">Why SpiderEV</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Why Partner<br />With SpiderEV?
              </h2>
            </motion.div>
            <motion.div variants={fadeRight}>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-5">
                Our Franchise Model is a turnkey investment opportunity that plugs you directly into India's growing EV charging network — complete with tech, operations, and marketing support for long-term ROI.
              </p>
              {/* Watch video CTA — matches ChargeZone */}
              <a href="#register-form"
                className="inline-flex items-center gap-2.5 text-primary font-bold text-sm group">
                <span className="w-9 h-9 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </span>
                Watch video to know more
              </a>
            </motion.div>
          </motion.div>

          {/* Open 3-stat strip — dividers only, no box */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            className="flex flex-wrap sm:flex-nowrap border-y border-gray-200 py-8 mb-12">
            {networkStats.map((s, i) => (
              <div key={s.label} className={`flex-1 min-w-[140px] text-center py-2 ${i > 0 ? "border-l border-gray-200" : ""}`}>
                <div className="text-3xl font-extrabold text-primary">{s.num}</div>
                <div className="text-gray-400 text-xs mt-1.5 leading-snug max-w-[130px] mx-auto">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Flip feature cards — white front, primary blue back on hover */}
          <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={vp}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyCards.map((w) => (
              <motion.div
                key={w.title}
                variants={fadeUp}
                className="group relative cursor-pointer rounded-2xl overflow-hidden border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                style={{ minHeight: "200px" }}
              >
                {/* Front face */}
                <div className="absolute inset-0 bg-white p-7 flex flex-col gap-4 transition-all duration-300 group-hover:opacity-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {w.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{w.title}</h3>
                </div>
                {/* Back face */}
                <div className="absolute inset-0 bg-primary p-7 flex flex-col justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <h3 className="font-bold text-white text-sm mb-3">{w.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{w.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INVESTMENT PLANS — white bg
          dark card header WITH charger image
          plain spec rows · plain support list
      ═══════════════════════════════════════════ */}
      <section id="investment-models" className="bg-white py-20 sm:py-28">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp} className="text-center mb-14">
            <motion.span variants={fadeUp} className="text-secondary font-bold text-xs uppercase tracking-widest">Investment Plans</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Choose Your Investment Plan.<br className="hidden sm:block" />
              We'll Power the Rest.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Whether you're entering the EV space for the first time or expanding a larger energy portfolio, SpiderEV offers a scalable, high-ROI franchise model built for the future.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}
            className="grid lg:grid-cols-2 gap-8">
            {investmentModels.map((model) => (
              <motion.div key={model.name} variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">

                {/* Dark header with charger image */}
                <div className="bg-gray-900 relative overflow-hidden">
                  {/* Charger image — faded into the dark header */}
                  <div className="relative h-52">
                    <img src={model.image} alt={model.name}
                      className="w-full h-full object-cover object-center"
                      style={{ filter: "brightness(0.45) saturate(0.8)" }} />
                    {/* Bottom gradient so text pops */}
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent" />
                    {/* Overlay text on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-7 pb-6">
                      {model.badge && (
                        <span className="inline-block bg-secondary text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                          {model.badge}
                        </span>
                      )}
                      <h3 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">{model.name}</h3>
                      <p className="text-white/45 text-xs mt-0.5">{model.tagline}</p>
                    </div>
                  </div>
                  {/* Starting at — below image in dark area */}
                  <div className="px-7 py-4 flex items-center gap-3 border-t border-white/10">
                    <span className="text-white/35 text-xs">Starting at</span>
                    <span className="text-white font-extrabold text-lg">{model.investment}</span>
                  </div>
                </div>

                {/* White body */}
                <div className="bg-white px-7 pt-6 pb-7">
                  {/* Specs — plain rows, no divider lines between them */}
                  <div className="space-y-3 mb-6">
                    {model.specs.map((spec) => (
                      <div key={spec.label} className="flex gap-3 text-sm">
                        <span className="text-gray-400 min-w-28 shrink-0">{spec.label}</span>
                        <span className="font-semibold text-gray-800">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Support list — plain, no gray box */}
                  <div className="border-t border-gray-100 pt-5 mb-6">
                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Support Includes</p>
                    <ul className="space-y-2">
                      {model.support.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <span className="w-4 h-4 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                            <CheckIcon cls="w-2.5 h-2.5 text-secondary" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a href="#register-form"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all hover:gap-3">
                    Enquire Now <ArrowIcon />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-center text-gray-300 text-xs mt-6">* Investment amounts are indicative and may vary by site, power load, and location.</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WEBINAR — white bg
          image LEFT · content + checklist RIGHT
          date shown · simple checkmarks
      ═══════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — image */}
            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={vp}
              className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] relative">
              <img src={webinarImg} alt="SpiderEV Franchise Webinar"
                className="w-full h-full object-cover object-center" />
              {/* Subtle overlay for polish */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
            </motion.div>

            {/* Right — content */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/25 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
                Free Webinar
              </motion.div>
              {/* Date — like ChargeZone */}
              <motion.p variants={fadeUp} className="text-gray-400 text-sm font-semibold mb-3">
                Next Session — Coming Soon
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
                Curious, but have questions?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-base leading-relaxed mb-7">
                Join our franchise webinar — discover investment strategies, technology integration, ROI expectations, and financing options. Be a pioneer in India's EV revolution.
              </motion.p>
              <motion.a variants={fadeUp} href="#register-form"
                className="inline-flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all hover:gap-3.5 mb-9">
                Register for the Next Webinar <ArrowIcon />
              </motion.a>

              {/* What to Expect — simple icon + text, no circular border */}
              <motion.div variants={staggerFast} className="space-y-3.5">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">What to Expect</p>
                {webinarExpect.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <CheckIcon cls="w-3 h-3 text-white" />
                    </span>
                    <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BRAND PARTNERS — logo row
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-14 border-y border-gray-100">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            className="text-center text-[11px] font-extrabold text-gray-300 uppercase tracking-[0.2em] mb-10">
            Brand Partners
          </motion.p>
          <motion.div variants={staggerFast} initial="hidden" whileInView="visible" viewport={vp}
            className="grid grid-cols-3 sm:grid-cols-6 gap-8 items-center justify-items-center">
            {brandPartners.map((p) => (
              <motion.div key={p.name} variants={fadeUp}
                whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}>
                <img src={p.src} alt={p.name}
                  className="h-9 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ — full-width single-column accordion
          white bg · border-bottom dividers only
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp} className="text-center mb-12">
            <motion.span variants={fadeUp} className="text-secondary font-bold text-xs uppercase tracking-widest">FAQs</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            className="max-w-3xl mx-auto">
            <FaqSection />
          </motion.div>

          {/* Still have questions CTA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            className="text-center mt-12">
            <p className="text-gray-400 text-sm mb-4">Still have questions?</p>
            <a href="#register-form"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all hover:gap-3">
              Talk to Us <ArrowIcon />
            </a>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vp}
            className="relative rounded-2xl overflow-hidden bg-primary px-8 sm:px-16 py-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-secondary/10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

            <motion.div variants={fadeUp} className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Ready to Own a Piece<br className="hidden sm:block" /> of India's EV Future?
              </h2>
              <p className="text-white/55 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Take your first step today. Our franchise team is ready to guide you through every step of the journey.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#register-form"
                  className="inline-flex items-center gap-2 bg-secondary text-white px-10 py-4 rounded-2xl font-bold text-[15px] hover:bg-secondary/90 transition-all hover:gap-3">
                  Enquire Now <ArrowIcon />
                </a>
                <a href="mailto:connect@spiderenergy.in"
                  className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-10 py-4 rounded-2xl font-semibold text-[15px] hover:border-white hover:bg-white/10 transition-all">
                  connect@spiderenergy.in
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </PageLayout>
  );
}
