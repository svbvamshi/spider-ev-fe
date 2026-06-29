/**
 * prerender.mjs
 *
 * Runs after `vite build`. For every route it:
 *  - Injects the correct <title>, <meta name="description">, Open Graph tags,
 *    and <link rel="canonical"> into dist/index.html
 *  - Injects JSON-LD structured data (Organization + page-specific schemas)
 *  - Injects enriched noscript content (H1, H2s, body text, nav) for crawlers
 *  - Writes the result to dist/<route>/index.html
 *
 * This ensures crawlers that don't run JavaScript (social media bots, Bing,
 * SEO audit tools, Ctrl+U) receive correct meta tags in the raw HTML.
 *
 * Blog posts are discovered automatically from src/data/blog-posts.json.
 *
 * Zero extra npm dependencies — plain Node.js fs only.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const ROOT = join(__dirname, "..");
const BASE_URL = "https://spiderenergy.in";

function e(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

// Organization JSON-LD injected into every pre-rendered page (for non-JS crawlers)
const ORG_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Spider Energy",
      "url": BASE_URL,
      "logo": { "@type": "ImageObject", "url": `${BASE_URL}/spider-ev-logo.png`, "width": 200, "height": 60 },
      "description": "India's trusted EV charging infrastructure company — manufacturing and deploying AC & DC chargers across homes, businesses, and highways.",
      "address": { "@type": "PostalAddress", "streetAddress": "THub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" },
      "contactPoint": [{ "@type": "ContactPoint", "telephone": "+91-9997776080", "contactType": "sales", "availableLanguage": ["English", "Hindi", "Telugu"], "areaServed": "IN" }],
      "email": "connect@spiderenergy.in",
      "sameAs": ["https://www.instagram.com/spider.ev/", "https://in.linkedin.com/company/spider-green-energy-solutions"]
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Spider Energy",
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "inLanguage": "en-IN"
    }
  ]
});

// Product schema helper for pre-rendered product pages
function buildProductSchema({ name, description, power, connector, category, productId, chargerType }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": { "@type": "Brand", "name": "SpiderEV" },
    "manufacturer": { "@type": "Organization", "name": "Spider Energy", "url": BASE_URL },
    "category": `EV Charger > ${chargerType}`,
    "url": `${BASE_URL}/products/${category}/${productId}`,
    "image": `${BASE_URL}/spider-ev-logo.png`,
    "offers": { "@type": "Offer", "availability": "https://schema.org/InStock", "priceCurrency": "INR", "areaServed": "IN" },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Power Output", "value": power },
      { "@type": "PropertyValue", "name": "Connector", "value": connector },
      { "@type": "PropertyValue", "name": "Certification", "value": "BIS, IP67, OCPP 1.6J" },
    ],
  };
}

function buildMeta({ path, title, description, keywords, ogImage, ogType }) {
  const url = `${BASE_URL}${path}`;
  const image = ogImage ? `${BASE_URL}${ogImage}` : OG_IMAGE;
  const type = ogType || "website";
  const kw = keywords || "EV charger, electric vehicle charging station, Spider Energy, SpiderEV";
  return [
    `  <title>${e(title)}</title>`,
    `  <meta name="description" content="${e(description)}" />`,
    `  <meta name="keywords" content="${e(kw)}" />`,
    `  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `  <meta property="og:title" content="${e(title)}" />`,
    `  <meta property="og:description" content="${e(description)}" />`,
    `  <meta property="og:url" content="${url}" />`,
    `  <meta property="og:type" content="${type}" />`,
    `  <meta property="og:site_name" content="Spider Energy" />`,
    `  <meta property="og:image" content="${image}" />`,
    `  <meta property="og:image:width" content="1200" />`,
    `  <meta property="og:image:height" content="630" />`,
    `  <meta property="og:locale" content="en_IN" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${e(title)}" />`,
    `  <meta name="twitter:description" content="${e(description)}" />`,
    `  <meta name="twitter:image" content="${image}" />`,
    `  <link rel="canonical" href="${url}" />`,
  ].join("\n");
}

function buildJsonLd(route) {
  // Always include Organization schema
  let scripts = `  <script type="application/ld+json">${ORG_JSONLD}</script>`;

  // Add page-specific schema(s) if provided
  if (route.schema) {
    scripts += `\n  <script type="application/ld+json">${JSON.stringify(route.schema)}</script>`;
  }
  if (route.schemas) {
    for (const s of route.schemas) {
      scripts += `\n  <script type="application/ld+json">${JSON.stringify(s)}</script>`;
    }
  }

  return scripts;
}

// Internal navigation links injected into pre-rendered HTML for crawlers
const NAV_LINKS = [
  { href: "/electric-vehicle-ev-ac-charger", text: "AC Chargers" },
  { href: "/electric-vehicle-ev-dc-charger", text: "DC Chargers" },
  { href: "/park-and-charge-electric-vehicle-ev-charging-station", text: "Park & Charge" },
  { href: "/community-ev-charging-stations", text: "Community Charging" },
  { href: "/public-ev-charging-stations", text: "Public Charging" },
  { href: "/heavy-duty-ev-charging-station", text: "Heavy Duty Charging" },
  { href: "/cpms-ev-charging-point-management-system", text: "CPMS" },
  { href: "/ev-charging-station-app", text: "SpiderEV App" },
  { href: "/ev-charging-epc-services", text: "EPC Services" },
  { href: "/about-us", text: "About Us" },
  { href: "/contact-us", text: "Contact Us" },
  { href: "/ev-charging-station-franchise", text: "Franchise" },
  { href: "/ev-charging-station-roi-calculator", text: "ROI Calculator" },
  { href: "/bess-battery-backup-for-ev-charging-stations", text: "BESS" },
  { href: "/ev-charging-station-locator", text: "Station Locator" },
  { href: "/news", text: "News" },
  { href: "/blog", text: "Blog" },
];

function buildNoscrollContent(route) {
  const { title, description, subtopics, bodyText, articleHtml, path, schemas } = route;
  const links = NAV_LINKS.map(l => `<a href="${l.href}">${l.text}</a>`).join(" | ");

  // Use first subtopic as H1 (the real page heading), fall back to title
  const h1Text = (subtopics && subtopics.length > 0) ? subtopics[0] : title;
  let html = `<h1>${e(h1Text)}</h1>`;
  html += `<p>${e(description)}</p>`;

  // For blog posts: inject the full article HTML (already rendered from markdown)
  if (articleHtml) {
    html += `<article>${articleHtml}</article>`;
  } else {
    // Add remaining subtopics as H2s (skip first since it's the H1)
    if (subtopics && subtopics.length > 1) {
      html += subtopics.slice(1).map(h2 => `<h2>${e(h2)}</h2>`).join("");
    }

    // Add additional body text for word count
    if (bodyText) {
      html += `<p>${e(bodyText)}</p>`;
    }

    // Add FAQ content from schemas if FAQPage exists (makes FAQ text crawler-visible)
    if (schemas) {
      const faqSchema = schemas.find(s => s["@type"] === "FAQPage");
      if (faqSchema && faqSchema.mainEntity) {
        html += `<section><h2>Frequently Asked Questions</h2>`;
        for (const q of faqSchema.mainEntity) {
          html += `<h3>${e(q.name)}</h3><p>${e(q.acceptedAnswer.text)}</p>`;
        }
        html += `</section>`;
      }
    }

    // Add FAQ content from SERVICE_PAGE_FAQS if applicable (for pages using singular schema)
    if (!schemas && SERVICE_PAGE_FAQS[path]) {
      html += `<section><h2>Frequently Asked Questions</h2>`;
      for (const faq of SERVICE_PAGE_FAQS[path]) {
        html += `<h3>${e(faq.question)}</h3><p>${e(faq.answer)}</p>`;
      }
      html += `</section>`;
    }
  }

  html += `<nav>${links}</nav>`;
  return html;
}

function inject(template, meta, jsonLd, noscrollContent) {
  // Wrap noscroll content in a visually-hidden container that crawlers can read
  // but users never see (prevents FOUC before React hydrates)
  const hiddenContent = `<div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${noscrollContent}</div>`;

  return template
    .replace(/<title>[^<]*<\/title>/, "")
    .replace(/<link rel="canonical"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="description"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="keywords"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="robots"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta property="og:[^"]*"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="twitter:[^"]*"[^>]*\/?>[\s]*/g, "")
    .replace("</head>", `${meta}\n${jsonLd}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${hiddenContent}</div>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${hiddenContent}</div>`);
}

function write(html, path) {
  if (path === "/") {
    writeFileSync(join(distDir, "index.html"), html, "utf-8");
  } else {
    const dir = join(distDir, path.slice(1));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html, "utf-8");
  }
}

// ─── FAQ data for service pages (for FAQPage schema in pre-rendered HTML) ────

const SERVICE_PAGE_FAQS = {
  "/park-and-charge-electric-vehicle-ev-charging-station": [
    { question: "What is a Park and Charge EV station?", answer: "A Park and Charge EV station combines parking convenience with EV charging, allowing vehicle owners to charge while parked at malls, offices, and commercial complexes." },
    { question: "How much does it cost to set up a Park and Charge station?", answer: "Setup costs depend on the number of chargers, power capacity, and site requirements. SpiderEV offers turnkey packages starting from basic AC setups to high-power DC fast charging stations." },
    { question: "Who manages the station after installation?", answer: "SpiderEV provides full operational support including remote monitoring via SpiderConnect CPMS, payment processing, maintenance, and 24/7 technical support." },
  ],
  "/community-ev-charging-stations": [
    { question: "Can EV chargers be installed in apartment complexes?", answer: "Yes. SpiderEV's community charging solution is designed for apartments and gated societies with shared infrastructure, individual billing, load management, and resident-friendly app access." },
    { question: "How is billing handled for shared community chargers?", answer: "Each user is billed individually based on their consumption through the SpiderEV app. The system supports UPI, cards, and wallet payments with transparent session-wise billing." },
    { question: "What approvals are needed for apartment EV charging?", answer: "Typically you need society management approval and an electrical load assessment. SpiderEV handles DISCOM coordination, electrical planning, and installation as part of our community charging package." },
  ],
  "/public-ev-charging-stations": [
    { question: "How do public EV charging stations generate revenue?", answer: "Public stations earn through per-unit electricity sales with markup, service fees, and advertising partnerships. SpiderEV's CPMS platform enables dynamic pricing and real-time revenue tracking." },
    { question: "What types of chargers are used at public stations?", answer: "Public stations typically use DC fast chargers (30-240 kW) for quick top-ups and AC chargers (7.4-22 kW) for longer-duration destination charging. SpiderEV offers both options." },
    { question: "How long does it take to set up a public charging station?", answer: "From site assessment to commissioning, a typical public charging station takes 12-20 weeks depending on power availability, permits, and civil works required." },
  ],
  "/heavy-duty-ev-charging-station": [
    { question: "What power capacity is needed for heavy-duty EV charging?", answer: "Heavy-duty EVs like buses and trucks require 120-240 kW DC fast chargers. SpiderEV's Spider Ultra (120 kW), Spider Surge (180 kW), and Spider Hulk (240 kW) are designed for fleet and depot operations." },
    { question: "Can heavy-duty chargers handle multiple vehicles simultaneously?", answer: "Yes. SpiderEV's depot solutions support multiple charging points with intelligent load management to optimise power distribution across vehicles charging simultaneously." },
    { question: "What is depot charging and how does it work?", answer: "Depot charging is scheduled overnight or during idle periods for fleet vehicles. SpiderEV's CPMS enables automated scheduling, priority queuing, and fleet management integration for buses and commercial vehicles." },
  ],
  "/cpms-ev-charging-point-management-system": [
    { question: "What is a Charging Point Management System (CPMS)?", answer: "A CPMS is cloud-based software that monitors, manages, and optimises EV charging stations. SpiderConnect CPMS handles remote diagnostics, user access, payment processing, dynamic pricing, and analytics." },
    { question: "Is SpiderConnect CPMS compatible with third-party chargers?", answer: "Yes. SpiderConnect supports OCPP 1.6J protocol, making it compatible with any OCPP-compliant charger regardless of manufacturer." },
    { question: "How does CPMS help station operators earn more?", answer: "CPMS enables dynamic pricing based on demand, time-of-day tariffs, and occupancy. It also reduces downtime through predictive maintenance alerts and remote troubleshooting." },
  ],
  "/ev-charging-epc-services": [
    { question: "What does EPC include for EV charging stations?", answer: "EPC (Engineering, Procurement, Construction) includes site assessment, electrical design, DISCOM approvals, civil works, charger procurement, installation, testing, and commissioning — a complete turnkey solution." },
    { question: "Does SpiderEV handle government permits and approvals?", answer: "Yes. Our EPC team manages all regulatory requirements including DISCOM applications, electrical safety certifications, and local authority permits as part of the project scope." },
    { question: "What is the typical timeline for EV station EPC projects?", answer: "Standard projects take 12-20 weeks from agreement to commissioning. Larger or complex projects may take 20-24 weeks depending on power availability and permit timelines." },
  ],
  "/ev-charging-station-franchise": [
    { question: "What are the investment options and who is this for?", answer: "We offer two models: Fast Charging (₹30L+) for passenger EVs, and Super Charging (₹1Cr+) for high-throughput sites. Ideal for landowners, retail entrepreneurs, and institutional investors." },
    { question: "What kind of space and power connection do I need?", answer: "Fast Charging: ~1,000 sq. ft. with 50–150 kVA sanctioned load. Super Charging: larger footprint for commercial EVs with 250–1200 kVA load. We assist with site layout, DISCOM approvals, and Solar + BESS integration." },
    { question: "How much can I earn and what's the ROI timeline?", answer: "Typical ROI is 2–4 years for Fast Charging and 3–5 years for Super Charging. Earnings depend on location, footfall, and tariff. Live revenue tracking available via Spider Connect CMS." },
  ],
  "/har-ghar": [
    { question: "What is the Har Ghar Charger initiative?", answer: "Har Ghar Charger is SpiderEV's initiative to make home EV charging accessible to every Indian household. Install a home charger, charge your own EV, and optionally earn by sharing it with neighbours through the SpiderEV app." },
    { question: "Can I earn money from my home EV charger?", answer: "Yes. Through the SpiderEV app, you can share your home charger with nearby EV owners when you're not using it and earn per-session revenue with automatic billing." },
    { question: "What home charger models are available under this initiative?", answer: "The program primarily uses Spider Mini (3.3 kW) and Spider Lite (3.3 kW) AC chargers — compact, affordable single-phase chargers that work with any standard home electrical connection." },
  ],
  "/bess-battery-backup-for-ev-charging-stations": [
    { question: "What is SpiderVault and how is it different from a regular inverter?", answer: "SpiderVault is an all-in-one Solar Hybrid Inverter + Battery + BMS. Unlike regular inverters that simply switch between grid and battery, SpiderVault integrates solar charging, a 5th Gen battery management system, and AI cloud monitoring — all automatically managed from one unit." },
    { question: "How long does SpiderVault back up my home?", answer: "It depends on your load. SpiderVault 3.0 backs up 1 AC + geyser + regular appliances for up to 6 hours. SpiderVault 5.0 runs 2 ACs + all home appliances for up to 8 hours. SpiderVault 12.0 handles large homes for up to 12 hours." },
    { question: "Can it connect to my existing solar panels?", answer: "Yes. All SpiderVault models have a built-in MPPT solar charger that directly connects to your rooftop solar system. It stores excess energy during the day for use at night or on cloudy days — no extra inverter or equipment needed." },
  ],
};

// FAQ data for the ev-ready-homes blog post
const EV_READY_HOMES_FAQS = [
  { question: "What does an EV-ready home mean in India?", answer: "An EV-ready home is one that can support electric vehicle charging without it being a daily compromise. It means the home has the electrical planning, load support, space and energy logic to support charging in a safe and convenient manner. In 2026, the concept goes beyond placing a charger in the parking lot. It includes whether the house or flat can handle power load, whether it can charge at the right tariff times, and whether it can later integrate with solar or storage." },
  { question: "Why is BESS becoming important for EV charging?", answer: "Battery Energy Storage Systems (BESS) are becoming important since charging is no longer simply plug-and-play. As electricity pricing becomes more time-sensitive and households want more control over when they use grid power, storage is the missing layer. A BESS can store solar energy, off-peak grid power, or excess power for later use — enabling smarter charging, backup and daily life from the same property." },
  { question: "Why are apartments a bigger challenge than independent homes?", answer: "Apartments add friction because charging is not simply a technical problem but also a governance and space problem. Residents often need to obtain permission, plan the load, get cabling approval, and align parking. Shared meters, basements and common areas can make things feel a lot slower and more emotional than they need to be." },
  { question: "How do time-of-day tariffs change the EV decision?", answer: "Time-of-day tariffs influence the EV decision as charging is now tied to cost timing instead of just energy consumption. Users will naturally seek off-peak windows if electricity is more expensive at certain times. Planning is now part of the EV decision, not just the purchase." },
  { question: "Why is Telangana such a strong market for SpiderEV?", answer: "Telangana is strong for SpiderEV because the state has the policy language, infrastructure intent and urban demand profile that make EV charging a relevant topic. The Telangana Electric Vehicle & Energy Storage Policy 2020-2030 offers incentives for charging infrastructure. Hyderabad and its premium residential and commercial areas give the story a strong lifestyle angle." },
  { question: "What is the advantage of combining solar + storage + EV charging?", answer: "Control is the greatest advantage. Solar alone provides daytime generation. EV charging has to be flexible. Storage bridges the gap between them. Solar + storage + EV charging means you can use energy from the day later, charge on your own schedule, and reduce reliance on grid timing." },
  { question: "Is public EV charging still growing in India?", answer: "Yes. India's public charging points could rise to around 375,000 by 2030 from about 75,000 at the end of 2024 according to IEA projections. Charging is becoming a routine part of infrastructure planning." },
  { question: "How does SpiderEnergy avoid sounding too technical in content?", answer: "The brand focuses on energy in daily life: silence, continuity, convenience, confidence and future-readiness. For SpiderEV, that means charging as a lifestyle layer. For SpiderVault, that means backup as invisible support, not a mechanical drag." },
];

// ─── Route definitions ───────────────────────────────────────────────────────

const routes = [
  // Home
  {
    path: "/",
    title: "EV Charging Station Manufacturer | Telangana & AP",
    description: "Spider Energy — Trusted EV Charging Company in Andhra Pradesh & Telangana. Fast, reliable AC & DC charging solutions for a sustainable future.",
    keywords: "EV charger manufacturer Telangana, EV charging station Hyderabad, electric vehicle charger Andhra Pradesh, AC DC charger India, Spider Energy, SpiderEV, EV infrastructure AP TG",
    subtopics: ["India's Most Trusted EV Charger Manufacturer in Telangana & Andhra Pradesh", "EV Charging Solutions", "Franchise Opportunities"],
    bodyText: "Spider Energy manufactures and deploys electric vehicle charging infrastructure across India. From 3.3 kW home chargers to 240 kW highway fast chargers, we provide end-to-end EV charging solutions including hardware, software (CPMS), installation, and maintenance services.",
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Spider Energy",
      "url": BASE_URL,
      "telephone": "+91-9997776080",
      "email": "connect@spiderenergy.in",
      "address": { "@type": "PostalAddress", "streetAddress": "THub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" },
      "geo": { "@type": "GeoCoordinates", "latitude": "17.4435", "longitude": "78.3772" },
      "image": `${BASE_URL}/spider-ev-logo.png`,
      "priceRange": "$$",
    },
  },

  // Products
  {
    path: "/electric-vehicle-ev-ac-charger",
    title: "AC EV Chargers in Telangana & Andhra Pradesh | SpiderEV",
    description: "SpiderEV BIS-certified AC EV chargers from 3.3 kW to 80 kW for homes, offices and commercial fleet charging in AP & Telangana. OCPP 1.6J, IP67, RFID enabled.",
    keywords: "AC EV charger, electric vehicle AC charger Hyderabad, home EV charger India, 7.4 kW charger, 22 kW charger, Type 2 EV charger, BIS certified charger, OCPP charger, SpiderEV AC",
    subtopics: ["AC EV Chargers — From 3.3 kW to 80 kW for Homes & Fleets in AP & TG", "Features & Specifications", "Why Choose SpiderEV AC Chargers", "Models: Spider Mini, Spider Lite, Spider Smart, Spider Blaze, Spider Strike, Spider Dash"],
    bodyText: "SpiderEV AC chargers range from 3.3 kW single-phase home chargers to 80 kW three-phase commercial units. All models feature IP67 weather protection, OCPP 1.6J connectivity, RFID authentication, and BIS certification for safe, reliable EV charging. Our AC charger lineup includes: Spider Mini (3.3 kW) — compact home charger for overnight charging; Spider Lite (3.3 kW) — affordable home charger with free installation and app monitoring; Spider Smart (7.4 kW) — Type 2 charger with dynamic load management for homes and offices; Spider Blaze (22 kW) — three-phase commercial charger for workplaces and fleet parking; Spider Strike (40 kW) — high-power three-phase charger for commercial fleet installations; Spider Dash (80 kW) — dual-gun charger for high-throughput commercial sites charging two vehicles simultaneously. All chargers are manufactured in India, BIS certified, and integrate with SpiderConnect CPMS for remote monitoring, payment processing, and analytics.",
  },
  {
    path: "/electric-vehicle-ev-dc-charger",
    title: "DC Fast EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Top DC Fast EV Chargers in Andhra Pradesh & Telangana. Spider Energy provides reliable CCS2 & CHAdeMO fast charging for all electric vehicles.",
    keywords: "DC fast charger, DC EV charger Hyderabad, CCS2 charger India, CHAdeMO charger, 60 kW charger, 120 kW charger, 240 kW charger, highway EV charger, SpiderEV DC",
    subtopics: ["DC Fast Charger Range", "CCS2 & CHAdeMO Support", "Commercial & Highway Charging", "Models: Spider Base, Spider Fast, Spider Spark, Spider Falcon, Spider Ultra, Spider Surge, Spider Hulk"],
    bodyText: "SpiderEV DC fast chargers deliver 30 kW to 240 kW power output with CCS2 and CHAdeMO connectors. Designed for public charging networks, highways, and fleet depots, our DC chargers provide 20-80% charge in as little as 15 minutes. Our DC charger lineup includes: Spider Base (3-12 kW) — modular DC charger for 2-wheelers and light EVs with IS 17017-2-6 compliance; Spider Fast (30 kW) — rapid DC charger for public 4-wheeler charging with dual connectors; Spider Spark (60 kW) — dual-connector fast charger for commercial stations; Spider Falcon (60 kW) — high-speed CCS2 charger for public networks; Spider Ultra (120 kW) — high-power charger for highways and fleet depots; Spider Surge (180 kW) — rapid charger for high-throughput highway charging; Spider Hulk (240 kW) — India's most powerful ultra-rapid charger for heavy-duty EV applications. All DC chargers feature OCPP 1.6J connectivity, IP67 protection, and integrate with SpiderConnect CPMS for remote monitoring and revenue management.",
  },

  // AC product detail pages
  {
    path: "/products/ac/spider-mini",
    title: "Spider Mini — 3.3 kW Home AC EV Charger | SpiderEV",
    description: "Compact single-phase 3.3 kW AC EV home charger with IP67, RFID and all-weather durability for homes in AP & Telangana.",
    keywords: "Spider Mini, 3.3 kW EV charger, home EV charger India, single phase EV charger, compact AC charger, IP67 EV charger, RFID charger",
    subtopics: ["Spider Mini — Compact 3.3 kW Single-Phase AC Home EV Charger", "Key Features", "Technical Specifications"],
    bodyText: "The Spider Mini is SpiderEV's most compact home EV charger, delivering 3.3 kW of single-phase AC charging. Designed for Indian homes with standard electrical connections, it features IP67 weather protection for outdoor installation, RFID authentication for secure access, and OCPP 1.6J connectivity for remote monitoring via SpiderConnect. Ideal for overnight charging of all passenger EVs including Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, and BYD Atto 3. Installation takes under 2 hours with no structural modifications needed.",
    schema: buildProductSchema({ name: "Spider Mini — 3.3 kW AC Home EV Charger", description: "Compact single-phase 3.3 kW AC EV home charger with IP67, RFID and all-weather durability", power: "3.3 kW", connector: "IEC 60309 (Heavy Duty)", category: "ac", productId: "spider-mini", chargerType: "AC Charger" }),
  },
  {
    path: "/products/ac/spider-lite",
    title: "Spider Lite — 3.3 kW AC Home EV Charger | SpiderEV",
    description: "Smart 3.3 kW single-phase AC EV charger with free installation, app monitoring and RFID. Ideal for home EV charging across India.",
    keywords: "Spider Lite, 3.3 kW charger, affordable EV charger, home charger free installation, smart EV charger, app controlled charger",
    subtopics: ["Spider Lite — Most Affordable 3.3 kW Home AC EV Charger with Free Installation", "Key Features", "Technical Specifications"],
    bodyText: "The Spider Lite is India's most affordable smart home EV charger at 3.3 kW. It comes with free professional installation, mobile app monitoring for real-time charging status, RFID-based authentication, and scheduled charging to optimise electricity costs. Compatible with all EVs sold in India. The Spider Lite connects to your home Wi-Fi and integrates with the SpiderEV app for session tracking, energy consumption analytics, and remote start/stop control. BIS certified with IP67 all-weather protection.",
    schema: buildProductSchema({ name: "Spider Lite — 3.3 kW AC Home EV Charger", description: "Smart 3.3 kW single-phase AC EV charger with free installation, app monitoring and RFID", power: "3.3 kW", connector: "IEC 60309 (Heavy Duty)", category: "ac", productId: "spider-lite", chargerType: "AC Charger" }),
  },
  {
    path: "/products/ac/spider-smart",
    title: "Spider Smart — 7.4 kW Type 2 AC EV Charger | SpiderEV",
    description: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management. Perfect for home and commercial EV charging in Andhra Pradesh & Telangana.",
    keywords: "Spider Smart, 7.4 kW EV charger, Type 2 charger India, dynamic load management, smart charger, commercial AC charger",
    subtopics: ["Spider Smart — 7.4 kW Type 2 AC EV Charger", "Key Features", "Technical Specifications", "Dynamic Load Management"],
    bodyText: "The Spider Smart delivers 7.4 kW of Type 2 AC charging with intelligent load management. It automatically adjusts charging power based on your home or office electricity load, preventing circuit overloads. Features include app-based scheduling, energy metering, RFID access control, and OCPP 1.6J cloud connectivity. Charges a typical EV (40 kWh battery) from 20% to 100% in approximately 6-7 hours. Ideal for homes with higher power availability and small offices wanting dedicated EV charging for employees.",
    schema: buildProductSchema({ name: "Spider Smart — 7.4 kW Type 2 AC EV Charger", description: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management", power: "7.4 kW", connector: "Type 2 (IEC 62196)", category: "ac", productId: "spider-smart", chargerType: "AC Charger" }),
  },
  {
    path: "/products/ac/spider-blaze",
    title: "Spider Blaze — 22 kW Three-Phase AC EV Charger | SpiderEV",
    description: "22 kW three-phase AC EV charger for fleet and commercial EV charging installations across Andhra Pradesh and Telangana. OCPP 1.6J, IP67 rated.",
    keywords: "Spider Blaze, 22 kW EV charger, three phase charger, commercial EV charger, fleet charger, workplace charger, OCPP charger",
    subtopics: ["Spider Blaze — 22 kW Three-Phase AC EV Charger", "Key Features", "Technical Specifications", "Commercial Applications"],
    bodyText: "The Spider Blaze is a 22 kW three-phase AC charger designed for commercial and fleet charging environments. It delivers full-speed Type 2 charging for vehicles that support 22 kW AC input, reducing charge times to approximately 2-3 hours for a typical EV. Built for workplace parking lots, fleet depots, and commercial premises, the Spider Blaze features OCPP 1.6J connectivity for centralised management, IP67 outdoor protection, dynamic load balancing across multiple units, RFID and app-based authentication, and integrated energy metering for billing.",
    schema: buildProductSchema({ name: "Spider Blaze — 22 kW Three-Phase AC EV Charger", description: "22 kW three-phase AC EV charger for fleet and commercial EV charging installations", power: "22 kW", connector: "Type 2 (IEC 62196)", category: "ac", productId: "spider-blaze", chargerType: "AC Charger" }),
  },
  {
    path: "/products/ac/spider-strike",
    title: "Spider Strike — 40 kW Three-Phase AC EV Charger | SpiderEV",
    description: "40 kW high-power three-phase AC EV charger for commercial fleet charging. BIS certified, OCPP 1.6J, IP67 protection for all-weather operation.",
    keywords: "Spider Strike, 40 kW EV charger, high power AC charger, fleet charging, commercial EV infrastructure, three phase charger India",
    subtopics: ["Spider Strike — 40 kW Three-Phase AC EV Charger", "Key Features", "Technical Specifications", "Fleet & Commercial Use"],
    bodyText: "The Spider Strike is SpiderEV's 40 kW high-power three-phase AC charger, engineered for demanding commercial fleet charging operations. It supports simultaneous high-current delivery for rapid AC charging of fleet vehicles, reducing turnaround time significantly. BIS certified with IP67 all-weather protection, OCPP 1.6J cloud connectivity, RFID + app-based user management, and integrated load balancing. Ideal for taxi and ride-hailing fleets, corporate campuses, logistics companies, and high-utilisation commercial parking facilities.",
    schema: buildProductSchema({ name: "Spider Strike — 40 kW Three-Phase AC EV Charger", description: "40 kW high-power three-phase AC EV charger for commercial fleet charging", power: "40 kW", connector: "Type 2 (IEC 62196)", category: "ac", productId: "spider-strike", chargerType: "AC Charger" }),
  },
  {
    path: "/products/ac/spider-dash",
    title: "Spider Dash — 80 kW Dual-Gun AC EV Charger | SpiderEV",
    description: "80 kW dual-gun three-phase AC EV charger for high-throughput commercial sites. Simultaneously charge two vehicles at 55 A per gun.",
    keywords: "Spider Dash, 80 kW AC charger, dual gun charger, high throughput charger, commercial EV station, simultaneous charging",
    subtopics: ["Spider Dash — 80 kW Dual-Gun AC EV Charger", "Key Features", "Technical Specifications", "High-Throughput Charging"],
    bodyText: "The Spider Dash is SpiderEV's flagship AC charger — an 80 kW dual-gun three-phase unit that charges two vehicles simultaneously at 55 A per gun. Designed for high-throughput commercial environments like shopping malls, office complexes, and parking garages where multiple EVs need efficient charging during working hours. Features include intelligent load distribution between both guns, OCPP 1.6J integration with SpiderConnect CPMS, IP67 protection for outdoor deployment, integrated payment processing via RFID and mobile app, and real-time energy analytics per session.",
    schema: buildProductSchema({ name: "Spider Dash — 80 kW Dual-Gun AC EV Charger", description: "80 kW dual-gun three-phase AC EV charger for high-throughput commercial sites", power: "80 kW", connector: "Type 2 Dual-Gun", category: "ac", productId: "spider-dash", chargerType: "AC Charger" }),
  },

  // DC product detail pages
  {
    path: "/products/dc/spider-base",
    title: "Spider Base 3–12 kW DC Charger for 2-Wheelers | SpiderEV",
    description: "Modular 3–12 kW DC EV charger with IS 17017-2-6 for 2-wheelers and light EVs. BIS certified, OCPP 1.6J, IP67 rated.",
    keywords: "Spider Base, 3 kW DC charger, 2 wheeler EV charger, electric scooter charger, light EV charger India, IS 17017, BIS DC charger",
    subtopics: ["Spider Base — 3–12 kW DC EV Charger for Two-Wheelers & Light EVs", "Key Features", "Technical Specifications"],
    bodyText: "The Spider Base is a modular 3-12 kW DC charger purpose-built for India's booming 2-wheeler and light EV market. Compliant with IS 17017-2-6 standards, it supports electric scooters like Ola S1 Pro, Ather 450X, TVS iQube, and Bajaj Chetak along with e-rickshaws and light commercial EVs. Features include BIS certification, OCPP 1.6J cloud connectivity, IP67 weather protection, modular power scaling from 3 kW to 12 kW, and integrated billing via SpiderConnect. Ideal for public charging spots near metro stations, markets, and residential areas.",
    schema: buildProductSchema({ name: "Spider Base — 3-12 kW DC Charger for 2-Wheelers", description: "Modular 3-12 kW DC EV charger with IS 17017-2-6 for 2-wheelers and light EVs", power: "3-12 kW", connector: "GB/T", category: "dc", productId: "spider-base", chargerType: "DC Charger" }),
  },
  {
    path: "/products/dc/spider-fast",
    title: "Spider Fast — 30 kW DC Fast EV Charger | SpiderEV",
    description: "30 kW rapid DC fast EV charger with CCS2 and CHAdeMO connectors for public 4-wheeler charging in Andhra Pradesh and Telangana.",
    keywords: "Spider Fast, 30 kW DC charger, CCS2 charger, CHAdeMO charger India, public EV charger, fast charger AP Telangana",
    subtopics: ["Spider Fast — 30 kW DC Fast EV Charger", "Key Features", "Technical Specifications", "Connector Types"],
    bodyText: "The Spider Fast is a 30 kW DC fast charger with dual CCS2 and CHAdeMO connectors for public 4-wheeler EV charging. It charges a typical 40 kWh EV battery from 20% to 80% in approximately 45-60 minutes. Designed for public locations like fuel stations, retail parking, and office complexes. Features include IP67 outdoor protection, OCPP 1.6J connectivity, integrated payment via RFID/UPI/app, real-time availability on the SpiderEV app, and remote diagnostics. A cost-effective entry point for businesses wanting to offer DC fast charging.",
    schema: buildProductSchema({ name: "Spider Fast — 30 kW DC Fast EV Charger", description: "30 kW rapid DC fast EV charger with CCS2 and CHAdeMO connectors for public 4-wheeler charging", power: "30 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-fast", chargerType: "DC Fast Charger" }),
  },
  {
    path: "/products/dc/spider-spark",
    title: "Spider Spark — 60 kW DC Fast EV Charger | SpiderEV",
    description: "60 kW DC fast EV charger with CCS2 and CHAdeMO connectors for public and commercial charging stations in Andhra Pradesh & Telangana.",
    keywords: "Spider Spark, 60 kW DC charger, dual connector charger, commercial EV charger, public charging station, fast charger India",
    subtopics: ["Spider Spark — 60 kW Dual-Connector DC Fast EV Charger", "Key Features", "Technical Specifications"],
    bodyText: "The Spider Spark delivers 60 kW DC fast charging with both CCS2 and CHAdeMO connectors, serving virtually all 4-wheeler EVs on Indian roads. Charges a 40 kWh battery from 20% to 80% in approximately 25-35 minutes. Built for public charging stations, commercial hubs, and high-traffic locations. Features intelligent power sharing between connectors, OCPP 1.6J cloud management, IP67 protection, integrated energy metering, and multiple payment options. Ideal for businesses wanting a versatile DC fast charger that serves both CCS2 and CHAdeMO vehicles simultaneously.",
    schema: buildProductSchema({ name: "Spider Spark — 60 kW DC Fast EV Charger", description: "60 kW DC fast EV charger with CCS2 and CHAdeMO connectors for public and commercial charging stations", power: "60 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-spark", chargerType: "DC Fast Charger" }),
  },
  {
    path: "/products/dc/spider-falcon",
    title: "Spider Falcon — 60 kW CCS2 DC Fast EV Charger | SpiderEV",
    description: "60 kW high-speed CCS2 DC fast EV charger for public charging networks and commercial hubs. IP67 rated, OCPP 1.6J compliant.",
    keywords: "Spider Falcon, 60 kW CCS2 charger, dedicated CCS2 charger, public network charger, high speed EV charger, commercial charger India",
    subtopics: ["Spider Falcon — 60 kW CCS2 DC Fast EV Charger", "Key Features", "Technical Specifications"],
    bodyText: "The Spider Falcon is a dedicated 60 kW CCS2 DC fast charger optimised for maximum throughput on India's most common EV connector standard. With full 60 kW delivered to a single CCS2 vehicle, it provides the fastest possible charge for cars like Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, and BYD Atto 3. Features include OCPP 1.6J connectivity, IP67 protection, integrated RFID and app payment, automatic connector detection, and SpiderConnect CPMS integration for remote monitoring and dynamic pricing.",
    schema: buildProductSchema({ name: "Spider Falcon — 60 kW CCS2 DC Fast EV Charger", description: "60 kW high-speed CCS2 DC fast EV charger for public charging networks and commercial hubs", power: "60 kW", connector: "CCS2", category: "dc", productId: "spider-falcon", chargerType: "DC Fast Charger" }),
  },
  {
    path: "/products/dc/spider-ultra",
    title: "Spider Ultra — 120 kW DC Fast EV Charger | SpiderEV",
    description: "120 kW high-speed DC fast EV charger with CCS2 and CHAdeMO for public networks, fleets and commercial hubs in Andhra Pradesh & Telangana.",
    keywords: "Spider Ultra, 120 kW DC charger, high power charger, highway charger, fleet depot charger, ultra fast EV charger India",
    subtopics: ["Spider Ultra — 120 kW DC Fast EV Charger", "Key Features", "Technical Specifications", "Highway & Fleet Applications"],
    bodyText: "The Spider Ultra is a 120 kW DC fast charger designed for highway corridors and fleet depot operations. It delivers 20% to 80% charge in approximately 15-25 minutes for most passenger EVs, making it ideal for highway rest stops and transit charging. Dual CCS2 and CHAdeMO connectors with intelligent power distribution. Features include heavy-duty industrial enclosure, OCPP 1.6J management, IP67 protection, active thermal management for consistent performance in Indian summers, integrated payment processing, and fleet management API integration for depot scheduling.",
    schema: buildProductSchema({ name: "Spider Ultra — 120 kW DC Fast EV Charger", description: "120 kW high-speed DC fast EV charger with CCS2 and CHAdeMO for public networks, fleets and commercial hubs", power: "120 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-ultra", chargerType: "DC Fast Charger" }),
  },
  {
    path: "/products/dc/spider-surge",
    title: "Spider Surge — 180 kW DC Fast EV Charger | SpiderEV",
    description: "180 kW rapid DC fast EV charger delivering powerful charging for highways, depots and fleet operators in Andhra Pradesh and Telangana.",
    keywords: "Spider Surge, 180 kW DC charger, rapid charger, highway EV charger, fleet operator charger, high power charging India",
    subtopics: ["Spider Surge — 180 kW DC Fast EV Charger", "Key Features", "Technical Specifications", "Highway & Depot Deployment"],
    bodyText: "The Spider Surge delivers 180 kW of DC fast charging power for highway and depot applications where minimal downtime is critical. Capable of adding 200+ km of range in just 15 minutes for compatible vehicles. Designed for national highway charging corridors, bus depots, and fleet hubs. Features include liquid-cooled cable for sustained high-power delivery, dual CCS2/CHAdeMO connectors, OCPP 1.6J connectivity, IP67 protection, active thermal management, and remote diagnostics via SpiderConnect CPMS.",
    schema: buildProductSchema({ name: "Spider Surge — 180 kW DC Fast EV Charger", description: "180 kW rapid DC fast EV charger delivering powerful charging for highways, depots and fleet operators", power: "180 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-surge", chargerType: "DC Fast Charger" }),
  },
  {
    path: "/products/dc/spider-hulk",
    title: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger | SpiderEV",
    description: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications.",
    keywords: "Spider Hulk, 240 kW charger, ultra rapid charger, heavy duty EV charger, bus charger India, truck charger, highway fast charger",
    subtopics: ["Spider Hulk — 240 kW Ultra-Rapid DC Fast EV Charger", "Key Features", "Technical Specifications", "Heavy-Duty & Highway Applications"],
    bodyText: "The Spider Hulk is SpiderEV's most powerful charger at 240 kW — designed for heavy-duty electric buses, trucks, and ultra-rapid highway charging. It delivers a full charge for electric buses in under 60 minutes and adds 300+ km range to passenger EVs in just 10-15 minutes. 4-gun system for simultaneous charging of multiple vehicles. Features include liquid-cooled dispensing cables, advanced thermal management for 24/7 operation, OCPP 1.6J + OCPP 2.0 ready, IP67 protection, fleet management API, automated scheduling via SpiderConnect CPMS, and remote firmware updates.",
    schema: buildProductSchema({ name: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger", description: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications", power: "240 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-hulk", chargerType: "DC Fast Charger" }),
  },

  // Solutions
  {
    path: "/park-and-charge-electric-vehicle-ev-charging-station",
    title: "Park and Charge EV Stations in Telangana & Andhra Pradesh",
    description: "Park & Charge EV Stations in Andhra Pradesh & Telangana. Easy installation and smart parking-based EV charging solutions by Spider Energy.",
    keywords: "park and charge EV station, parking EV charger, mall EV charging, office EV charging, commercial complex charger, EV charging Hyderabad, parking lot charger",
    subtopics: ["Park & Charge Solutions", "How It Works", "Benefits for Site Owners", "Revenue Model", "Supported Locations"],
    bodyText: "Transform your parking space into a revenue-generating EV charging hub. Spider Energy's Park & Charge solution covers site assessment, charger installation, software integration, and ongoing maintenance for malls, offices, and commercial complexes. Our turnkey solution includes: comprehensive site evaluation and traffic analysis; charger selection based on dwell time and vehicle profiles; electrical infrastructure assessment and DISCOM coordination; professional installation with minimal disruption; SpiderConnect CPMS integration for automated billing, payment processing, and real-time monitoring; ongoing maintenance and 24/7 remote support. Park & Charge is ideal for shopping malls, corporate offices, co-working spaces, hospitals, hotels, and any commercial property with dedicated parking. Site owners earn passive revenue from every charging session while increasing property value and attracting EV-driving customers.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Park and Charge EV Stations", "description": "Smart parking-based EV charging solutions for malls, offices and commercial complexes in AP & Telangana", "url": `${BASE_URL}/park-and-charge-electric-vehicle-ev-charging-station`, "serviceType": "EV Charging Station Installation", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/park-and-charge-electric-vehicle-ev-charging-station"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/community-ev-charging-stations",
    title: "Community EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Community EV Charging Stations in Andhra Pradesh & Telangana for apartments and housing societies. Shared residential charging solutions.",
    keywords: "community EV charging, apartment EV charger, housing society charger, shared EV charger, residential EV charging India, gated community charger Hyderabad",
    subtopics: ["Apartment & Society Charging", "Shared Charging Infrastructure", "Billing & Management", "Load Management", "Resident App Access"],
    bodyText: "Enable EV charging in your apartment complex or gated community. Our community charging solution supports shared usage with individual billing, load management, and resident-friendly mobile app access. SpiderEV's community charging addresses the unique challenges of multi-dwelling units: shared electrical infrastructure, multiple stakeholders, parking allocation, and fair billing. Our solution includes intelligent load management that prevents circuit overloads by distributing power across active chargers, per-user billing through the SpiderEV app with UPI/card/wallet payment options, RFID-based authentication for secure resident-only access, real-time usage tracking for society management, and DISCOM coordination for power infrastructure upgrades. Suitable for apartments with 50+ units, gated villa communities, senior living complexes, and co-operative housing societies across Hyderabad, Vizag, and other cities in AP and Telangana.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Community EV Charging Stations", "description": "Shared EV charging solutions for apartments, housing societies and gated communities in AP & Telangana", "url": `${BASE_URL}/community-ev-charging-stations`, "serviceType": "Community EV Charging", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/community-ev-charging-stations"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/public-ev-charging-stations",
    title: "Public EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Public EV Charging Stations in Andhra Pradesh & Telangana. Fast charging for cars with a strong, connected EV charging network by Spider Energy.",
    keywords: "public EV charging station, public fast charger, EV charging network AP, charging station Telangana, fuel station EV charger, retail EV charging",
    subtopics: ["Public Charging Network", "Fast Charging Stations", "Network Coverage", "Revenue Model", "Station Management"],
    bodyText: "Build a public EV charging network with SpiderEV's turnkey solutions. From AC destination chargers to DC fast chargers, we provide the complete infrastructure for fuel stations, retail locations, and public parking areas. SpiderEV's public charging network solution includes site selection advisory based on traffic data and EV density, a mix of AC (7.4-80 kW) and DC (30-240 kW) chargers based on location type, complete EPC services including civil works and electrical infrastructure, SpiderConnect CPMS for remote operations and dynamic pricing, SpiderEV app listing for driver discovery, and payment integration supporting UPI, credit/debit cards, RFID, and wallets. Revenue model supports operator-owned, revenue-share, and CAPEX-free deployment options. Currently operational across 15+ cities in Telangana and Andhra Pradesh with 5,000+ chargers deployed.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Public EV Charging Stations", "description": "Public EV fast charging network for cars across fuel stations, retail locations and parking areas in AP & Telangana", "url": `${BASE_URL}/public-ev-charging-stations`, "serviceType": "Public EV Charging Network", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/public-ev-charging-stations"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/heavy-duty-ev-charging-station",
    title: "Heavy Duty EV Charging for Buses & Trucks | AP & TG",
    description: "Heavy Duty EV Charging Stations in AP & Telangana for trucks, buses & fleets. High-power EV charging infrastructure by Spider Energy.",
    keywords: "heavy duty EV charger, electric bus charger, truck EV charger, fleet depot charger, 120 kW charger, 240 kW charger, TSRTC charger, APSRTC charger",
    subtopics: ["Heavy Duty EV Charging Stations for Buses, Trucks & Fleets in AP & TG", "High-Power DC Charging", "Depot Management", "Fleet Scheduling", "Power Infrastructure"],
    bodyText: "Power your electric bus fleet and heavy-duty vehicles with SpiderEV's high-capacity DC charging solutions. Our 120-240 kW chargers are designed for depot operations with fleet management integration and scheduled charging. Heavy-duty EV charging requires specialised infrastructure: high-power electrical connections (250-1200 kVA), reinforced mounting for large cable assemblies, active thermal management for continuous operation, and fleet-aware scheduling software. SpiderEV provides all of this through our Spider Ultra (120 kW), Spider Surge (180 kW), and Spider Hulk (240 kW) chargers combined with SpiderConnect CPMS fleet management module. Features include automated overnight scheduling that optimises electricity costs, priority queuing for vehicles needed first in the morning, predictive maintenance alerts to prevent fleet downtime, and integration with fleet management APIs. Deployed at bus depots, logistics hubs, and commercial fleet facilities across Telangana and Andhra Pradesh.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Heavy Duty EV Charging Stations", "description": "High-power EV charging infrastructure for electric trucks, buses and fleet depots in AP & Telangana", "url": `${BASE_URL}/heavy-duty-ev-charging-station`, "serviceType": "Heavy Duty EV Charging", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/heavy-duty-ev-charging-station"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/cpms-ev-charging-point-management-system",
    title: "EV Charging Management System in Andhra Pradesh & Telangana",
    description: "Explore Smart EV Charging Solutions in Andhra Pradesh and Telangana with Advanced Platforms and Efficient Network Management for Seamless Charging Operations.",
    keywords: "CPMS, charging point management system, EV charger software, OCPP platform, EV station management, SpiderConnect, remote charger monitoring",
    subtopics: ["SpiderConnect CPMS", "Remote Monitoring & Control", "Revenue Management", "OCPP Compatibility", "Analytics & Reporting"],
    bodyText: "SpiderConnect is our cloud-based Charging Point Management System. Monitor charger health, manage user access, process payments, configure dynamic pricing, and view analytics from a unified dashboard. SpiderConnect CPMS is compatible with any OCPP 1.6J compliant charger regardless of manufacturer, giving operators the freedom to manage mixed-brand networks from a single platform. Key features include: real-time charger status monitoring with instant fault alerts; remote start/stop, restart, and firmware update capabilities; dynamic pricing based on time-of-day, demand, and occupancy; comprehensive session analytics with revenue reporting; user management with RFID, app, and guest access modes; multi-site dashboard for operators managing stations across cities; API integration with payment gateways, fleet systems, and energy management platforms. SpiderConnect currently manages 5,000+ charge points across India for operators ranging from single-site businesses to national charging networks.",
    schemas: [
      { "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "SpiderConnect CPMS", "description": "Cloud-based Charging Point Management System for monitoring, controlling and managing EV charging networks across India", "url": `${BASE_URL}/cpms-ev-charging-point-management-system`, "applicationCategory": "BusinessApplication", "operatingSystem": "Web, Android, iOS", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }, "provider": { "@id": `${BASE_URL}/#organization` } },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/cpms-ev-charging-point-management-system"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-app",
    title: "EV Charging Station App in Andhra Pradesh & Telangana",
    description: "Smart EV Charging App in AP & Telangana — locate nearby stations, access charging networks and manage your EV charging anytime, anywhere.",
    keywords: "SpiderEV app, EV charging app India, find EV charger app, EV station locator app, charging session app, EV payment app, Android iOS charger app",
    subtopics: ["Find Nearby Chargers", "Start & Pay via App", "Charging History & Wallet", "Real-Time Availability", "Route Planning"],
    bodyText: "The SpiderEV mobile app helps EV drivers find nearby charging stations, start sessions remotely, pay digitally, and track charging history. Available on Android and iOS with real-time station availability. Key features include: interactive map with real-time charger availability showing occupied, available, and out-of-service status; one-tap session start with automatic connector detection; multiple payment options including UPI, credit/debit cards, and in-app wallet; detailed session history with energy consumed, cost breakdown, and carbon saved; favourite stations for quick access; route planning with charging stops for long-distance trips; push notifications for session completion and promotional offers; and community features for rating and reviewing stations. The SpiderEV app connects to all SpiderConnect-managed stations across India, giving drivers access to 5,000+ charging points in 15+ cities.",
    schema: { "@context": "https://schema.org", "@type": "MobileApplication", "name": "SpiderEV Charging App", "description": "Find nearby EV charging stations, start sessions, pay digitally and track charging history across India", "url": `${BASE_URL}/ev-charging-station-app`, "applicationCategory": "UtilitiesApplication", "operatingSystem": "Android, iOS", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }, "provider": { "@id": `${BASE_URL}/#organization` } },
  },
  {
    path: "/ev-charging-epc-services",
    title: "EV Station EPC & Installation Services | AP & TG",
    description: "EV charging station installation in AP & Telangana — EPC services, construction support & infrastructure solutions for commercial and public spaces.",
    keywords: "EV charging EPC, EV station installation, charging station construction, EPC services Hyderabad, DISCOM approval, EV infrastructure setup, turnkey EV station",
    subtopics: ["End-to-End EV Charging Station EPC & Installation Services Across AP & TG", "Site Survey & Design", "Installation & Commissioning", "DISCOM & Permits", "Post-Installation Support"],
    bodyText: "Our EPC (Engineering, Procurement, and Construction) team handles every aspect of charging station deployment — from electrical load assessment and civil works to charger mounting, cabling, and final commissioning. SpiderEV's EPC process includes: Engineering — site evaluation, traffic and ROI analysis, electrical infrastructure assessment, load calculation, and layout optimisation for parking and charger placement; Procurement — sourcing BIS/CE certified chargers, switchgear, cables, panels, and all electrical components with quality assurance; Construction — civil works, foundation and mounting, electrical installation, network connectivity setup, SpiderConnect integration, testing, and handover. We manage all regulatory requirements including DISCOM applications, electrical safety certifications, and local authority permits. Typical project timelines are 12-20 weeks from agreement to commissioning. Our parent company brings 30+ years of power electronics expertise, ensuring safe, code-compliant installations. Currently operational across 15+ cities in AP and Telangana with 5,000+ chargers installed.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "EV Charging Station EPC Services", "description": "End-to-end EPC services for EV charging station installation — site survey, design, construction and commissioning in AP & Telangana", "url": `${BASE_URL}/ev-charging-epc-services`, "serviceType": "EV Station EPC & Installation", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/ev-charging-epc-services"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },

  // Company
  {
    path: "/about-us",
    title: "EV Charger Manufacturer in Telangana & AP | SpiderEV",
    description: "EV Charging Systems Manufacturer in Andhra Pradesh & Telangana. Electric car chargers, home charger installation & charging equipment.",
    keywords: "Spider Energy about, EV charger manufacturer India, SpiderEV company, T-Hub Hyderabad, EV charging company Telangana, charger OEM India",
    subtopics: ["About Spider Energy — EV Charger Manufacturer in Telangana & Andhra Pradesh", "Manufacturing Capabilities", "Our Team", "Milestones & Achievements"],
    bodyText: "Spider Energy is headquartered at T-Hub, Hyderabad — India's largest innovation hub. We design, manufacture, and deploy EV charging solutions spanning the full power spectrum from 3.3 kW to 240 kW, serving homes, businesses, and highways. Founded with a mission to accelerate India's EV transition, Spider Energy brings 30+ years of parent company expertise in power electronics and energy systems. Our product portfolio includes 6 AC charger models and 7 DC charger models, SpiderConnect CPMS cloud platform, SpiderVault BESS (Battery Energy Storage System), and end-to-end EPC services. Key milestones: 5,000+ chargers deployed, presence across 15+ cities, partnerships with major fleet operators and real estate developers, and a franchise network enabling entrepreneurs to join India's EV charging revolution. BIS certified manufacturing with rigorous quality control ensures every SpiderEV product meets international safety and performance standards.",
  },
  {
    path: "/contact-us",
    title: "Contact SpiderEV | EV Charging Experts in AP & TG",
    description: "Contact Spider Energy for EV charger installation, franchise enquiries, CPMS support or SpiderVault BESS consultation in Andhra Pradesh & Telangana.",
    keywords: "contact Spider Energy, SpiderEV phone number, EV charger enquiry Hyderabad, EV charging support AP, franchise contact, CPMS support",
    subtopics: ["Contact Spider Energy — EV Charging Experts in Telangana & Andhra Pradesh", "Office Location", "Support Hours", "How to Reach Us"],
    bodyText: "Reach Spider Energy for sales enquiries, installation support, franchise information, or technical assistance. Our team is available Monday through Sunday to help you with all your EV charging needs. Office: T-Hub, Raidurgam, Hyderabad, Telangana 500081. Phone: +91-9997776080. Email: connect@spiderenergy.in. We respond to all enquiries within 24 hours. Whether you are a homeowner looking for a home charger, a business wanting workplace charging, a fleet operator needing depot solutions, or an entrepreneur exploring franchise opportunities — our team will guide you through product selection, site assessment, installation planning, and after-sales support across Andhra Pradesh and Telangana.",
  },

  // Standalone
  {
    path: "/ev-charging-station-franchise",
    title: "EV Charging Station Franchise in Telangana & Andhra Pradesh",
    description: "Start your EV Charging Franchise in AP & Telangana — dealership support, profitable setup plans and trusted franchise guidance by SpiderEV.",
    keywords: "EV charging franchise, EV station franchise India, SpiderEV franchise, charging station business, EV franchise investment, franchise opportunity Hyderabad",
    subtopics: ["Start Your EV Charging Franchise in Telangana & AP", "Investment & ROI", "How to Apply", "Franchise Models", "Support & Training"],
    bodyText: "Join India's EV charging revolution with a SpiderEV franchise. We provide hardware, software, installation, branding, and ongoing support. Multiple investment tiers available with payback periods of 2-4 years. Franchise Models: Fast Charging (₹30L+ investment) for passenger EV charging at retail locations, fuel stations, and commercial areas; Super Charging (₹1Cr+ investment) for high-throughput sites serving both passenger and commercial EVs. What you get: SpiderEV hardware (AC and DC chargers), SpiderConnect CPMS software license, professional EPC installation, site branding and signage, SpiderEV app listing for driver discovery, revenue tracking dashboard, staff training, and ongoing maintenance support. Space requirements: Fast Charging needs approximately 1,000 sq. ft. with 50-150 kVA sanctioned load; Super Charging requires larger footprint with 250-1200 kVA load. Typical ROI is 2-4 years for Fast Charging and 3-5 years for Super Charging. SpiderEV handles DISCOM approvals and assists with solar + BESS integration for reduced operating costs.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "EV Charging Station Franchise", "description": "Start your EV charging franchise in Andhra Pradesh and Telangana with dealership support, profitable franchise setup plans and trusted franchise company guidance.", "url": `${BASE_URL}/ev-charging-station-franchise`, "serviceType": "EV Charging Franchise Opportunity", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/ev-charging-station-franchise"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-roi-calculator",
    title: "EV Charging ROI Calculator | AP & TG | SpiderEV",
    description: "Estimate EV charging business profits in AP & Telangana. Smart ROI calculator for accurate charging station investment planning.",
    keywords: "EV charging ROI calculator, EV station profit calculator, charging business investment, EV charging revenue estimate, ROI EV charger India",
    subtopics: ["Calculate Your EV Charging Station ROI & Profits in Telangana & AP", "Revenue Projections", "Investment Planning", "Cost Breakdown"],
    bodyText: "Use SpiderEV's ROI calculator to estimate your potential earnings from an EV charging station business. Input your investment amount, location type, expected footfall, and electricity tariff to get projected monthly revenue, operating costs, and payback period. The calculator factors in charger utilisation rates based on location type (highway, commercial, residential), electricity costs including demand charges, maintenance expenses, SpiderConnect CPMS subscription, and seasonal demand variations. Typical ROI for EV charging stations in Telangana and Andhra Pradesh ranges from 2-4 years depending on charger power level, location footfall, and pricing strategy.",
    schema: { "@context": "https://schema.org", "@type": "WebApplication", "name": "EV Charging Station ROI Calculator", "description": "Calculate EV charging station profits in Telangana & AP. Free ROI calculator for accurate investment planning.", "url": `${BASE_URL}/ev-charging-station-roi-calculator`, "applicationCategory": "FinanceApplication", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" } },
  },
  {
    path: "/bess-battery-backup-for-ev-charging-stations",
    title: "SpiderVault BESS — Battery Energy Storage | AP & TG",
    description: "SpiderVault BESS by Spider Energy provides battery energy storage for EV stations, solar projects & industrial backup in Andhra Pradesh & Telangana.",
    keywords: "SpiderVault BESS, battery energy storage, EV station battery backup, solar storage India, hybrid inverter, home battery backup Hyderabad, grid independence",
    subtopics: ["SpiderVault — Battery Energy Storage System (BESS) for EV Stations & Industry", "Solar + EV Charging", "Grid Independence", "Product Range", "Use Cases"],
    bodyText: "Combine Battery Energy Storage Systems (BESS) with your EV charging station to reduce demand charges, enable solar integration, and ensure uninterrupted charging even during grid outages. SpiderVault is an all-in-one Solar Hybrid Inverter + Battery + BMS unit that integrates solar charging, a 5th generation battery management system, and AI cloud monitoring — all managed from a single unit. Product range: SpiderVault 3.0 — backs up 1 AC + geyser + regular appliances for up to 6 hours, ideal for apartments and small homes; SpiderVault 5.0 — runs 2 ACs + all home appliances for up to 8 hours, perfect for villas and medium homes; SpiderVault 12.0 — handles large homes and small businesses for up to 12 hours of backup. All models feature built-in MPPT solar charger for direct rooftop solar connection, storing excess daytime energy for nighttime use. For EV charging stations, BESS reduces peak demand charges by 40-60%, enables solar-powered charging, and provides uninterrupted service during grid outages — critical for maintaining uptime and customer satisfaction.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "BESS — Battery Energy Storage for EV Charging Stations", "description": "Smart EV charging energy storage solutions with solar powered station setups, renewable charging and battery backup systems in Andhra Pradesh and Telangana.", "url": `${BASE_URL}/bess-battery-backup-for-ev-charging-stations`, "serviceType": "Battery Energy Storage System (BESS)", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/bess-battery-backup-for-ev-charging-stations"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-locator",
    title: "EV Charging Station Locator in Andhra Pradesh & Telangana",
    description: "Find Nearby EV Fast Charging Stations in Andhra Pradesh and Telangana using a Smart EV Charge Zone Locator and Real-time EV Charging Locator Tools.",
    keywords: "EV charging station locator, find EV charger near me, EV station map Hyderabad, charging point locator AP, nearest EV charger Telangana",
    subtopics: ["Find Charging Stations", "Real-Time Availability", "Navigation", "Filter by Charger Type"],
    bodyText: "Find SpiderEV charging stations near you across Andhra Pradesh and Telangana. Our interactive map shows real-time availability of all charger types — AC slow charging (3.3-80 kW) and DC fast charging (30-240 kW). Filter by connector type (CCS2, CHAdeMO, Type 2), power level, and availability status. Get turn-by-turn navigation to any station. View pricing, amenities, and user ratings before you drive. The SpiderEV network spans 15+ cities including Hyderabad, Vijayawada, Vizag, Tirupati, Warangal, and Guntur with 5,000+ active charging points.",
    schema: { "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${BASE_URL}/#localbusiness`, "name": "Spider Energy", "url": BASE_URL, "telephone": "+91-9997776080", "email": "connect@spiderenergy.in", "address": { "@type": "PostalAddress", "streetAddress": "THub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" }, "geo": { "@type": "GeoCoordinates", "latitude": "17.4435", "longitude": "78.3772" }, "image": `${BASE_URL}/spider-ev-logo.png`, "priceRange": "$$" },
  },

  // Other
  {
    path: "/news",
    title: "Latest EV Charging News in Andhra Pradesh & Telangana",
    description: "Stay updated with the latest electric vehicle charging news, EV infrastructure trends and technology insights across Andhra Pradesh and Telangana.",
    keywords: "EV charging news India, electric vehicle news Telangana, SpiderEV updates, EV policy India, charging infrastructure news",
    subtopics: ["Latest EV Charging Industry News & Updates", "SpiderEV Updates", "EV Policy & Trends"],
    bodyText: "Stay updated with the latest developments in India's EV charging ecosystem. SpiderEV news covers product launches, new station deployments, partnership announcements, government policy updates, and industry analysis. Follow our coverage of EV charging infrastructure growth in Telangana, Andhra Pradesh, and across India.",
  },
  {
    path: "/blog",
    title: "EV Charging Blog — Tips, Guides & News | SpiderEV",
    description: "Read the latest EV charging guides, industry news and business insights from SpiderEV — your expert resource for electric vehicle charging in India.",
    keywords: "EV charging blog, electric vehicle guides India, EV business blog, OCPP guide, AC vs DC charging, EV charging investment guide",
    subtopics: ["EV Charging Guides", "Business Insights", "Technology Explained", "Investment Guides"],
    bodyText: "The SpiderEV blog covers everything about electric vehicle charging in India — from choosing the right charger for your home to starting an EV charging business, understanding OCPP protocols, and industry analysis. Featured topics include: How EV Chargers Work — understanding AC, DC, and ultra-rapid charging technology; AC vs DC Charging — speed, cost, and use case comparison; Starting an EV Charging Business — step-by-step guide with ROI calculations; EV Charging Franchise Investment — costs, returns, and how to get started; What is OCPP — the open protocol that enables charger interoperability; EV-Ready Homes — smart charging, solar, and BESS integration for Indian homes. New articles published weekly by the Spider Energy team.",
  },
  {
    path: "/gallery",
    title: "SpiderEV Gallery | EV Charger Installations in India",
    description: "Browse SpiderEV's gallery of EV charging installations, products, events and partnerships across Andhra Pradesh and Telangana.",
    keywords: "SpiderEV gallery, EV charger installation photos, charging station images, SpiderEV events, EV infrastructure India photos",
    subtopics: ["SpiderEV Gallery — EV Charger Installations Across Telangana & Andhra Pradesh", "Products", "Events", "Installations"],
    bodyText: "Browse our gallery showcasing SpiderEV charger installations at malls, corporate offices, highways, and residential communities across Telangana and Andhra Pradesh. See our product range from the compact Spider Mini home charger to the powerful Spider Hulk 240 kW heavy-duty charger in real-world deployments. Also featuring event coverage from industry conferences, partner meets, and product launch events.",
  },
  {
    path: "/har-ghar",
    title: "Har Ghar Charger — Affordable Home EV Charging India",
    description: "Har Ghar Charger — affordable home EV charging for every Indian household. Register and earn from your own EV charging station.",
    keywords: "Har Ghar Charger, home EV charger India, earn from EV charger, affordable home charger, passive income EV charging, SpiderAtHome",
    subtopics: ["Har Ghar Charger Initiative", "How It Works", "Register Now", "Earning Potential", "Who Can Apply"],
    bodyText: "Har Ghar Charger makes EV charging accessible to every Indian household. Install a SpiderEV home charger, charge your own vehicle, and earn by sharing it with neighbours through our app-based platform. The initiative works in 3 simple steps: Register your interest with name, location, and property type; our team visits for site verification and charger recommendation; professional installation within 60 days and your station goes live on the SpiderEV app. Investment starts from under ₹8,000 for a compact charger with potential monthly earnings of ₹8,000-₹16,000. Who can apply: homeowners, shop owners, offices, restaurants, small businesses, parking lots, and apartment residents. The program uses Spider Mini (3.3 kW) and Spider Lite (3.3 kW) chargers — compact single-phase units that work with any standard Indian home electrical connection.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Har Ghar Charger — Home EV Charging for Every Indian", "description": "SpiderEV's Har Ghar Charger initiative brings affordable home EV charging to every Indian household. Register your interest and earn from your own charging station.", "url": `${BASE_URL}/har-ghar`, "serviceType": "Home EV Charging Program", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": "IN" },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/har-ghar"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/partner-withus",
    title: "Partner With SpiderEV — EV Charging Opportunities India",
    description: "Partner with SpiderEV as a site owner, fleet operator, fuel station or real estate developer. Build India's EV charging future together.",
    keywords: "partner SpiderEV, EV charging partnership, site owner EV revenue, fuel station EV charger, real estate EV charging, fleet operator partnership",
    subtopics: ["Partner With SpiderEV — Earn from EV Charging in Telangana & AP", "Site Owner Benefits", "Apply to Partner", "Partnership Models", "Who Can Partner"],
    bodyText: "Partner with Spider Energy to deploy EV charging at your location. Whether you own a fuel station, parking lot, commercial complex, or fleet depot, we have partnership models that generate passive revenue from your existing real estate. Partnership options include: Site Owner — provide space and earn revenue share on every charging session with zero CAPEX; Fleet Partner — dedicated depot charging for your electric fleet with priority access and preferential rates; Fuel Station Partner — add EV charging alongside existing fuel pumps to future-proof your business; Real Estate Developer — integrate EV charging into new residential and commercial projects; Franchise Partner — own and operate a SpiderEV branded charging station with full support. SpiderEV handles hardware, installation, software, maintenance, and customer management. You provide the location. We provide the technology. Revenue starts from day one. Apply now to get a free site assessment and partnership proposal.",
  },
];

// ─── Blog post keywords (derived from slug + category for SEO) ──────────────

const BLOG_KEYWORDS = {
  "ev-ready-homes-india-smart-charging-bess-2026": "EV ready homes India, smart charging home, BESS home India, solar EV charging, home energy storage, SpiderVault, EV charging 2026",
  "how-ev-chargers-work": "how EV chargers work, AC vs DC charging explained, EV charger technology, Level 1 Level 2 Level 3, EVSE India, charging connector types",
  "start-ev-charging-business-india": "start EV charging business India, EV station business plan, DISCOM approval EV charger, EV charging revenue model, charging station startup",
  "ac-vs-dc-ev-charging": "AC vs DC EV charging, fast charging vs slow charging, CCS2 vs Type 2, which EV charger to buy, charging speed comparison India",
  "india-ev-charging-infrastructure-2026": "India EV charging infrastructure, EV policy 2026, charging station growth India, FAME subsidy, EV market India",
  "ev-charging-franchise-investment-guide": "EV charging franchise India, franchise investment ROI, EV station franchise cost, SpiderEV franchise, charging business opportunity",
  "what-is-ocpp-ev-charging": "OCPP protocol, Open Charge Point Protocol, OCPP 1.6J, EV charger interoperability, CPMS OCPP, charger communication protocol",
};

// ─── Dynamically add blog post routes ────────────────────────────────────────

const BLOG_DATA_PATH = join(ROOT, "src", "data", "blog-posts.json");
const BLOG_CONTENT_DIR = join(ROOT, "src", "data", "blog-content");
if (existsSync(BLOG_DATA_PATH)) {
  const blogPosts = JSON.parse(readFileSync(BLOG_DATA_PATH, "utf-8"));
  for (const post of blogPosts) {
    if (!post.published) continue;

    // Read full article HTML from blog-content JSON
    let articleHtml = "";
    const contentPath = join(BLOG_CONTENT_DIR, `${post.slug}.json`);
    if (existsSync(contentPath)) {
      try {
        const contentData = JSON.parse(readFileSync(contentPath, "utf-8"));
        articleHtml = contentData.html || "";
      } catch (err) {
        console.warn(`  ⚠ Could not read blog content for ${post.slug}: ${err.message}`);
      }
    }

    const blogSchemas = [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": `${BASE_URL}${post.image}`,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": { "@type": "Person", "name": post.author },
        "publisher": { "@id": `${BASE_URL}/#organization` },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
        "articleSection": post.category,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.title },
        ],
      },
    ];

    // Add FAQPage schema for blog posts with FAQ sections
    if (post.slug === "ev-ready-homes-india-smart-charging-bess-2026") {
      blogSchemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": EV_READY_HOMES_FAQS.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })),
      });
    }

    routes.push({
      path: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      keywords: BLOG_KEYWORDS[post.slug] || `${post.category}, EV charging India, SpiderEV blog, electric vehicle, ${post.title.split(/[—:|]/)[0].trim()}`,
      ogImage: post.image,
      ogType: "article",
      subtopics: [],
      bodyText: post.description,
      articleHtml, // full article HTML for crawler-visible content
      schemas: blogSchemas,
    });
  }
  console.log(`  Added ${blogPosts.filter(p => p.published).length} blog post routes`);
}

// ─── Run ─────────────────────────────────────────────────────────────────────

const template = readFileSync(join(distDir, "index.html"), "utf-8");

let count = 0;
for (const route of routes) {
  const meta = buildMeta(route);
  const jsonLd = buildJsonLd(route);
  const noscrollContent = buildNoscrollContent(route);
  const html = inject(template, meta, jsonLd, noscrollContent);
  write(html, route.path);
  count++;
  console.log(`  ✓ ${route.path}`);
}

console.log(`\nPre-rendered ${count} routes into dist/`);
