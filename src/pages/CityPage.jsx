import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import HeroBanner from "../components/ui/HeroBanner";
import Accordion from "../components/ui/Accordion";
import heroBg from "../assets/home/hero-bg.webp";
import { getBreadcrumbSchema, getFAQSchema, getServiceSchema } from "../seo/schemas";

const cities = {
  hyderabad: {
    name: "Hyderabad",
    title: "EV Chargers in Hyderabad | Spider Energy (SpiderEV)",
    description: "Spider Energy supplies SpiderEV AC & DC chargers in Hyderabad, Telangana. Installation, franchise and CPMS support. Call +91-9997776080.",
    proof: "Spider Energy operates from T-Hub, Raidurgam, Hyderabad, and supplies SpiderEV chargers across Telangana.",
    marketContext: "Hyderabad combines apartment communities, technology campuses, commercial destinations, delivery fleets and inter-city traffic. Those uses do not share one charging pattern. A residential bay may have an eight-hour window, while a fleet vehicle may need to return to service between shifts.",
    sitePlanning: "For Hyderabad sites, start with the sanctioned load and the parking arrangement. High-rise properties should confirm the cable path from the distribution point to the assigned bay. Commercial sites should record weekday and weekend dwell time separately before choosing AC bays or a DC charger.",
    localNote: "The sales and engineering discussion is coordinated from Spider Energy's T-Hub office in Raidurgam. This is the company address; it is not presented as a public charging forecourt.",
  },
  vijayawada: {
    name: "Vijayawada",
    title: "EV Chargers in Vijayawada | Spider Energy (SpiderEV)",
    description: "Spider Energy supplies SpiderEV AC & DC chargers in Vijayawada, Andhra Pradesh. Installation, franchise and CPMS support. Call +91-9997776080.",
    proof: "Spider Energy serves Vijayawada from its T-Hub headquarters in Hyderabad, with sales coverage across Andhra Pradesh.",
    marketContext: "Vijayawada serves local commuters, commercial traffic and movement along major Andhra Pradesh corridors. Home charging, destination charging and corridor DC charging therefore need separate assumptions about dwell time and vehicle mix.",
    sitePlanning: "A Vijayawada proposal should identify whether the site serves residents, visitors, taxis, delivery vehicles or through-traffic. Confirm the incoming supply, parking access and operating hours before selecting charger power. Public access also requires a plan for signage, payment, support and bay enforcement.",
    localNote: "Spider Energy supports Vijayawada enquiries from Hyderabad and does not claim a separate local storefront. Site survey timing and installation scope are confirmed after the address and electrical information are reviewed.",
  },
  visakhapatnam: {
    name: "Visakhapatnam",
    title: "EV Chargers in Visakhapatnam | Spider Energy (SpiderEV)",
    description: "Spider Energy supplies SpiderEV AC & DC chargers in Visakhapatnam, Andhra Pradesh. Installation, franchise and CPMS support. Call +91-9997776080.",
    proof: "Spider Energy serves Visakhapatnam from its T-Hub headquarters in Hyderabad, with sales coverage across Andhra Pradesh.",
    marketContext: "Visakhapatnam includes dense residential areas, workplaces, logistics activity and coastal travel. Coastal exposure, parking layout and the mix of private and commercial vehicles should be considered alongside charger speed.",
    sitePlanning: "For Visakhapatnam, the site review should document outdoor exposure, drainage, cable protection and the electrical room as well as vehicle demand. A fleet or public location should also identify simultaneous charging expectations instead of sizing from daily energy alone.",
    localNote: "Spider Energy supports Visakhapatnam enquiries from its Hyderabad headquarters. No local storefront or guaranteed installation timeline is implied; both are confirmed for the specific project.",
  },
};

export default function CityPage({ city }) {
  const data = cities[city];
  if (!data) return null;

  const path = `/ev-chargers-${city}`;
  const faqs = [
    { question: `Which home EV chargers are available in ${data.name}?`, answer: "Spider Mini and Spider Lite provide 3.3 kW charging. Spider Smart provides 7.4 kW charging. The suitable model depends on the vehicle, parking supply and available electrical load." },
    { question: "Do SpiderEV chargers support OCPP?", answer: "SpiderEV's listed connected chargers use OCPP 1.6J and can be managed through SpiderConnect CPMS." },
    { question: `How do I plan an EV charging site in ${data.name}?`, answer: "Start with the site address, available power, vehicle mix and expected dwell time. Spider Energy can then recommend AC or DC hardware and the appropriate CPMS setup. Timelines depend on the site and approvals." },
  ];
  const schema = getServiceSchema({ name: `EV charger supply and installation in ${data.name}`, description: data.description, url: path, serviceType: "EV charger supply and installation" });
  const breadcrumbs = getBreadcrumbSchema([{ name: "Home", url: "/" }, { name: `EV Chargers in ${data.name}`, url: path }]);

  return (
    <PageLayout>
      <Helmet><title>{data.title}</title><meta name="description" content={data.description} /></Helmet>
      <SEO schema={schema} schemas={[getFAQSchema(faqs)]} breadcrumbs={breadcrumbs} title={data.title} description={data.description} />
      <HeroBanner title={`EV Chargers & Charging Stations in ${data.name}`} subtitle={data.proof} bgImage={heroBg} />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900">Why {data.name} fleets and homeowners choose SpiderEV</h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">{data.proof} We size home AC wallboxes and commercial DC sites by reviewing the load first, then selecting the charger, and adding SpiderConnect CPMS when a site operates multiple charging points.</p>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{data.marketContext}</p>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <article className="rounded-2xl border border-gray-100 p-7 shadow-sm">
              <h2 className="text-2xl font-bold">Home AC options</h2>
              <p className="mt-3 text-gray-600">Spider Mini and Spider Lite offer 3.3 kW charging for overnight top-ups. Spider Smart offers 7.4 kW where the vehicle, wiring and available load support it.</p>
              <Link className="inline-block mt-5 font-semibold text-primary" to="/electric-vehicle-ev-ac-charger">View AC chargers →</Link>
            </article>
            <article className="rounded-2xl border border-gray-100 p-7 shadow-sm">
              <h2 className="text-2xl font-bold">Public and fleet DC options</h2>
              <p className="mt-3 text-gray-600">SpiderEV DC chargers serve public sites, fleets and corridor locations. Charger power and connector choice depend on vehicles, dwell time and the site's sanctioned load.</p>
              <Link className="inline-block mt-5 font-semibold text-primary" to="/electric-vehicle-ev-dc-charger">View DC chargers →</Link>
            </article>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <article className="rounded-2xl border border-gray-100 p-7 shadow-sm"><h2 className="text-2xl font-bold">Plan the electrical connection first</h2><p className="mt-3 text-gray-600 leading-relaxed">{data.sitePlanning}</p><p className="mt-3 text-gray-600 leading-relaxed">The assessment should record phase, sanctioned load, earthing, cable distance, protection, number of bays and the vehicle connectors. A charger recommendation without those inputs is only a catalogue comparison.</p></article>
            <article className="rounded-2xl border border-gray-100 p-7 shadow-sm"><h2 className="text-2xl font-bold">Use SpiderConnect when the site becomes a network</h2><p className="mt-3 text-gray-600 leading-relaxed">A single private charger may need simple access control. A workplace, fleet or public location usually needs visibility across sessions and charger status. SpiderConnect provides the management layer for supported OCPP-connected SpiderEV chargers. Confirm billing, user access and reporting requirements during site planning.</p></article>
          </div>

          <section className="mt-12"><h2 className="text-3xl font-bold">What to send for a {data.name} site review</h2><p className="mt-4 text-gray-600 leading-relaxed">Share the complete address, property type, parking layout, vehicle models, expected daily sessions, dwell time, available electrical load and photographs of the proposed cable route. For a fleet, add route schedules and the number of vehicles that return together. For public charging, add operating hours and whether the site already has staff or security.</p><p className="mt-4 text-gray-600 leading-relaxed">{data.localNote}</p></section>

          <div className="mt-12 rounded-2xl bg-gray-50 p-7">
            <h2 className="text-2xl font-bold">Service and sales contact for {data.name}</h2>
            <p className="mt-3 text-gray-600">For a site survey, call <a className="font-semibold text-primary" href="tel:+919997776080">+91-9997776080</a> or share the site details through the contact page.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link className="bg-primary text-white px-5 py-3 rounded-xl font-semibold" to="/contact-us">Request survey</Link>
              <Link className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold" to="/ev-charging-station-franchise">Franchise enquiry</Link>
              <Link className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold" to="/spiderev">About SpiderEV</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50"><div className="max-w-3xl mx-auto px-4"><h2 className="text-3xl font-bold text-center mb-8">Frequently asked questions</h2><Accordion items={faqs} /></div></section>
    </PageLayout>
  );
}
