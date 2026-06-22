import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";

const chargerTypes = [
  { label: "DC 60 kW", power: 60, guns: 1, totalCost: 2800000 },
  { label: "DC 120 kW", power: 120, guns: 2, totalCost: 4000000 },
  { label: "DC 240 kW", power: 240, guns: 2, totalCost: 6500000 },
  { label: "DC 240 kW × 4 Guns", power: 240, guns: 4, totalCost: 7500000 },
];

const SliderInput = ({ label, min, max, value, onChange, prefix = "", suffix = "", step = 1 }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <span className="text-primary font-bold text-sm">
        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}{suffix}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-primary"
    />
    <div className="flex justify-between text-xs text-gray-400 mt-1">
      <span>{prefix}{min.toLocaleString("en-IN")}{suffix}</span>
      <span>{prefix}{max.toLocaleString("en-IN")}{suffix}</span>
    </div>
  </div>
);

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

const ROIPage = () => {
  const [chargerIdx, setChargerIdx] = useState(0);
  const [hoursPerDay, setHoursPerDay] = useState(12);
  const [tariff, setTariff] = useState(20);
  const [elecCost, setElecCost] = useState(8);
  const [expensePerKwh, setExpensePerKwh] = useState(2);
  const [subsidy, setSubsidy] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pdfForm, setPdfForm] = useState({ name: "", phone: "" });

  const charger = chargerTypes[chargerIdx];

  const results = useMemo(() => {
    const effectivePower = charger.power * charger.guns;
    const annualKwh = effectivePower * hoursPerDay * 365;
    const annualRevenue = annualKwh * tariff;
    const annualElec = annualKwh * elecCost;
    const annualOpex = annualKwh * expensePerKwh;
    const annualExpense = annualElec + annualOpex;
    const annualProfit = annualRevenue - annualExpense;
    const totalInvestment = charger.totalCost - subsidy;
    const paybackYears = totalInvestment / annualProfit;
    const roi = (annualProfit / totalInvestment) * 100;
    const monthlyRevenue = annualRevenue / 12;
    const monthlyProfit = annualProfit / 12;
    const recovery = Math.min((annualProfit / totalInvestment) * 100, 100);

    const cumulativeProfits = [1, 2, 3, 4, 5].map((yr) => annualProfit * yr - totalInvestment);

    return { annualRevenue, annualExpense, annualProfit, totalInvestment, paybackYears, roi, monthlyRevenue, monthlyProfit, recovery, cumulativeProfits };
  }, [charger, hoursPerDay, tariff, elecCost, expensePerKwh, subsidy]);

  return (
    <PageLayout>
      <Helmet>
        <title>EV Charging Station ROI Calculator in Andhra Pradesh & Telangana</title>
        <meta name="description" content="Find Best Estimate EV Charging Business Profits in Andhra Pradesh and Telangana Using Smart Revenue and ROI Calculators for Accurate Charging Station Investment Planning." />
      </Helmet>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            EV Charging Station ROI Calculator in Andhra Pradesh & Telangana
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Model your investment returns from EV charging infrastructure. Adjust parameters and get real-time profit projections.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Charger Type */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Investment Setup</h3>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Charger Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {chargerTypes.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setChargerIdx(i)}
                      className={`p-3 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-colors text-left ${chargerIdx === i ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}
                    >
                      <div>{c.label}</div>
                      <div className="text-xs font-normal text-gray-400 mt-0.5">Total: {fmt(c.totalCost)}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">Power Output</div>
                  <div className="font-bold text-gray-900">{charger.power} kW</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500">No. of Guns</div>
                  <div className="font-bold text-gray-900">{charger.guns}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Government Subsidy</label>
                <input
                  type="number"
                  min={0}
                  max={300000}
                  value={subsidy}
                  onChange={(e) => setSubsidy(Number(e.target.value))}
                  placeholder="Enter subsidy amount (₹)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Operations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <h3 className="font-bold text-gray-900">Operations</h3>
              <SliderInput label="Charger Operating Hours/Day" min={1} max={24} value={hoursPerDay} onChange={setHoursPerDay} suffix=" hrs" />
              <SliderInput label="Charging Tariff" min={10} max={35} value={tariff} onChange={setTariff} prefix="₹" suffix="/kWh" />
              <SliderInput label="Electricity Cost" min={5} max={15} value={elecCost} onChange={setElecCost} prefix="₹" suffix="/kWh" />
              <SliderInput label="Other Expenses" min={1} max={5} value={expensePerKwh} onChange={setExpensePerKwh} prefix="₹" suffix="/kWh" />
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="bg-primary rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-white mb-5">Real-Time Results</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Annual ROI", value: `${results.roi.toFixed(1)}%`, accent: true },
                  { label: "Payback Period", value: `${results.paybackYears.toFixed(1)} yrs`, accent: false },
                  { label: "Monthly Net Profit", value: fmt(results.monthlyProfit), accent: false },
                  { label: "Monthly Revenue", value: fmt(results.monthlyRevenue), accent: false },
                ].map((m) => (
                  <div key={m.label} className="bg-white/10 rounded-xl p-4">
                    <div className="text-white/60 text-xs mb-1">{m.label}</div>
                    <div className={`text-xl font-extrabold ${m.accent ? "text-secondary" : "text-white"}`}>{m.value}</div>
                  </div>
                ))}
              </div>
              {/* Recovery bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-white/70 mb-1.5">
                  <span>Investment Recovery</span>
                  <span>{results.recovery.toFixed(0)}%/yr</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-secondary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(results.recovery, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Annual Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5">Annual Financial Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Investment", value: fmt(results.totalInvestment), bold: true },
                  { label: "Annual Gross Revenue", value: fmt(results.annualRevenue), color: "text-secondary" },
                  { label: "Annual Expenses", value: fmt(results.annualExpense), color: "text-red-500" },
                  { label: "Annual Net Profit", value: fmt(results.annualProfit), bold: true, color: "text-primary" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className={`text-sm ${r.bold ? "font-bold text-gray-900" : "text-gray-600"}`}>{r.label}</span>
                    <span className={`font-bold text-sm ${r.color || "text-gray-900"}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5-Year Cumulative */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5">5-Year Cumulative Earnings (After Investment)</h3>
              <div className="flex justify-between gap-2">
                {results.cumulativeProfits.map((val, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className={`text-sm font-bold ${val >= 0 ? "text-secondary" : "text-red-500"}`}>
                      {val >= 0 ? "+" : ""}{fmt(val)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Year {i + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Download */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-secondary text-white py-4 rounded-2xl font-bold hover:bg-secondary/90 transition-colors text-lg"
            >
              📄 Download ROI Report (PDF)
            </button>

            <Link
              to="/ev-charging-station-franchise"
              className="block w-full text-center bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-colors"
            >
              Get Started with SpiderEV →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* PDF Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Download ROI Report</h3>
              <p className="text-gray-500 text-sm mb-6">Enter your details to receive a personalized PDF report.</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={pdfForm.name}
                  onChange={(e) => setPdfForm({ ...pdfForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={pdfForm.phone}
                  onChange={(e) => setPdfForm({ ...pdfForm, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  Generate & Download PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default ROIPage;
