import { Link } from "react-router-dom";

export default function BrandArchitectureSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          <p className="text-secondary font-semibold uppercase tracking-wider text-sm">Our brands</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Spider Energy and SpiderEV</h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Spider Energy is the parent company, headquartered at T-Hub, Raidurgam, Hyderabad. SpiderEV is its EV charging product line, covering AC and DC chargers, SpiderConnect CPMS and the SpiderEV driver app. SpiderEV is not a separate company.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 p-7 shadow-sm mt-9 max-w-3xl">
          <h3 className="text-2xl font-bold text-gray-900">SpiderEV</h3>
          <p className="mt-3 text-gray-600 leading-relaxed">AC and DC charging hardware, SpiderConnect network management software and the driver app for homes, fleets, public sites and charge point operators.</p>
          <Link to="/spiderev" className="inline-block mt-5 font-semibold text-primary">Explore SpiderEV →</Link>
        </div>
      </div>
    </section>
  );
}
