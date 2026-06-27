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

function buildMeta({ path, title, description, ogImage, ogType }) {
  const url = `${BASE_URL}${path}`;
  const image = ogImage ? `${BASE_URL}${ogImage}` : OG_IMAGE;
  const type = ogType || "website";
  return [
    `  <title>${e(title)}</title>`,
    `  <meta name="description" content="${e(description)}" />`,
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
  const { title, description, subtopics, bodyText, articleHtml } = route;
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
    subtopics: ["AC EV Chargers — From 3.3 kW to 80 kW for Homes & Fleets in AP & TG", "Features & Specifications", "Why Choose SpiderEV AC Chargers"],
    bodyText: "SpiderEV AC chargers range from 3.3 kW single-phase home chargers to 80 kW three-phase commercial units. All models feature IP67 weather protection, OCPP 1.6J connectivity, RFID authentication, and BIS certification for safe, reliable EV charging.",
  },
  {
    path: "/electric-vehicle-ev-dc-charger",
    title: "DC Fast EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Top DC Fast EV Chargers in Andhra Pradesh & Telangana. Spider Energy provides reliable CCS2 & CHAdeMO fast charging for all electric vehicles.",
    subtopics: ["DC Fast Charger Range", "CCS2 & CHAdeMO Support", "Commercial & Highway Charging"],
    bodyText: "SpiderEV DC fast chargers deliver 30 kW to 240 kW power output with CCS2 and CHAdeMO connectors. Designed for public charging networks, highways, and fleet depots, our DC chargers provide 20-80% charge in as little as 15 minutes.",
  },

  // AC product detail pages
  {
    path: "/products/ac/spider-mini",
    title: "Spider Mini — 3.3 kW Home AC EV Charger | SpiderEV",
    description: "Compact single-phase 3.3 kW AC EV home charger with IP67, RFID and all-weather durability for homes in AP & Telangana.",
    subtopics: ["Spider Mini — Compact 3.3 kW Single-Phase AC Home EV Charger", "Key Features"],
  },
  {
    path: "/products/ac/spider-lite",
    title: "Spider Lite — 3.3 kW AC Home EV Charger | SpiderEV",
    description: "Smart 3.3 kW single-phase AC EV charger with free installation, app monitoring and RFID. Ideal for home EV charging across India.",
    subtopics: ["Spider Lite — Most Affordable 3.3 kW Home AC EV Charger with Free Installation", "Key Features"],
  },
  {
    path: "/products/ac/spider-smart",
    title: "Spider Smart — 7.4 kW Type 2 AC EV Charger | SpiderEV",
    description: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management. Perfect for home and commercial EV charging in Andhra Pradesh & Telangana.",
    subtopics: ["Spider Smart — 7.4 kW Type 2 AC EV Charger", "Key Features"],
  },
  {
    path: "/products/ac/spider-blaze",
    title: "Spider Blaze — 22 kW Three-Phase AC EV Charger | SpiderEV",
    description: "22 kW three-phase AC EV charger for fleet and commercial EV charging installations across Andhra Pradesh and Telangana. OCPP 1.6J, IP67 rated.",
    subtopics: ["Spider Blaze — 22 kW Three-Phase AC EV Charger", "Key Features"],
  },
  {
    path: "/products/ac/spider-strike",
    title: "Spider Strike — 40 kW Three-Phase AC EV Charger | SpiderEV",
    description: "40 kW high-power three-phase AC EV charger for commercial fleet charging. BIS certified, OCPP 1.6J, IP67 protection for all-weather operation.",
    subtopics: ["Spider Strike — 40 kW Three-Phase AC EV Charger", "Key Features"],
  },
  {
    path: "/products/ac/spider-dash",
    title: "Spider Dash — 80 kW Dual-Gun AC EV Charger | SpiderEV",
    description: "80 kW dual-gun three-phase AC EV charger for high-throughput commercial sites. Simultaneously charge two vehicles at 55 A per gun.",
    subtopics: ["Spider Dash — 80 kW Dual-Gun AC EV Charger", "Key Features"],
  },

  // DC product detail pages
  {
    path: "/products/dc/spider-base",
    title: "Spider Base 3–12 kW DC Charger for 2-Wheelers | SpiderEV",
    description: "Modular 3–12 kW DC EV charger with IS 17017-2-6 for 2-wheelers and light EVs. BIS certified, OCPP 1.6J, IP67 rated.",
    subtopics: ["Spider Base — 3–12 kW DC EV Charger for Two-Wheelers & Light EVs", "Key Features"],
  },
  {
    path: "/products/dc/spider-fast",
    title: "Spider Fast — 30 kW DC Fast EV Charger | SpiderEV",
    description: "30 kW rapid DC fast EV charger with CCS2 and CHAdeMO connectors for public 4-wheeler charging in Andhra Pradesh and Telangana.",
    subtopics: ["Spider Fast — 30 kW DC Fast EV Charger", "Key Features"],
  },
  {
    path: "/products/dc/spider-spark",
    title: "Spider Spark — 60 kW DC Fast EV Charger | SpiderEV",
    description: "60 kW DC fast EV charger with CCS2 and CHAdeMO connectors for public and commercial charging stations in Andhra Pradesh & Telangana.",
    subtopics: ["Spider Spark — 60 kW Dual-Connector DC Fast EV Charger", "Key Features"],
  },
  {
    path: "/products/dc/spider-falcon",
    title: "Spider Falcon — 60 kW CCS2 DC Fast EV Charger | SpiderEV",
    description: "60 kW high-speed CCS2 DC fast EV charger for public charging networks and commercial hubs. IP67 rated, OCPP 1.6J compliant.",
    subtopics: ["Spider Falcon — 60 kW CCS2 DC Fast EV Charger", "Key Features"],
  },
  {
    path: "/products/dc/spider-ultra",
    title: "Spider Ultra — 120 kW DC Fast EV Charger | SpiderEV",
    description: "120 kW high-speed DC fast EV charger with CCS2 and CHAdeMO for public networks, fleets and commercial hubs in Andhra Pradesh & Telangana.",
    subtopics: ["Spider Ultra — 120 kW DC Fast EV Charger", "Key Features"],
  },
  {
    path: "/products/dc/spider-surge",
    title: "Spider Surge — 180 kW DC Fast EV Charger | SpiderEV",
    description: "180 kW rapid DC fast EV charger delivering powerful charging for highways, depots and fleet operators in Andhra Pradesh and Telangana.",
    subtopics: ["Spider Surge — 180 kW DC Fast EV Charger", "Key Features"],
  },
  {
    path: "/products/dc/spider-hulk",
    title: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger | SpiderEV",
    description: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications.",
    subtopics: ["Spider Hulk — 240 kW Ultra-Rapid DC Fast EV Charger", "Key Features"],
  },

  // Solutions
  {
    path: "/park-and-charge-electric-vehicle-ev-charging-station",
    title: "Park and Charge EV Stations in Telangana & Andhra Pradesh",
    description: "Park & Charge EV Stations in Andhra Pradesh & Telangana. Easy installation and smart parking-based EV charging solutions by Spider Energy.",
    subtopics: ["Park & Charge Solutions", "How It Works", "Benefits for Site Owners"],
    bodyText: "Transform your parking space into a revenue-generating EV charging hub. Spider Energy's Park & Charge solution covers site assessment, charger installation, software integration, and ongoing maintenance for malls, offices, and commercial complexes.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Park and Charge EV Stations", "description": "Smart parking-based EV charging solutions for malls, offices and commercial complexes in AP & Telangana", "url": `${BASE_URL}/park-and-charge-electric-vehicle-ev-charging-station`, "serviceType": "EV Charging Station Installation", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/park-and-charge-electric-vehicle-ev-charging-station"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/community-ev-charging-stations",
    title: "Community EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Community EV Charging Stations in Andhra Pradesh & Telangana for apartments and housing societies. Shared residential charging solutions.",
    subtopics: ["Apartment & Society Charging", "Shared Charging Infrastructure", "Billing & Management"],
    bodyText: "Enable EV charging in your apartment complex or gated community. Our community charging solution supports shared usage with individual billing, load management, and resident-friendly mobile app access.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Community EV Charging Stations", "description": "Shared EV charging solutions for apartments, housing societies and gated communities in AP & Telangana", "url": `${BASE_URL}/community-ev-charging-stations`, "serviceType": "Community EV Charging", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/community-ev-charging-stations"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/public-ev-charging-stations",
    title: "Public EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Public EV Charging Stations in Andhra Pradesh & Telangana. Fast charging for cars with a strong, connected EV charging network by Spider Energy.",
    subtopics: ["Public Charging Network", "Fast Charging Stations", "Network Coverage"],
    bodyText: "Build a public EV charging network with SpiderEV's turnkey solutions. From AC destination chargers to DC fast chargers, we provide the complete infrastructure for fuel stations, retail locations, and public parking areas.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Public EV Charging Stations", "description": "Public EV fast charging network for cars across fuel stations, retail locations and parking areas in AP & Telangana", "url": `${BASE_URL}/public-ev-charging-stations`, "serviceType": "Public EV Charging Network", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/public-ev-charging-stations"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/heavy-duty-ev-charging-station",
    title: "Heavy Duty EV Charging for Buses & Trucks | AP & TG",
    description: "Heavy Duty EV Charging Stations in AP & Telangana for trucks, buses & fleets. High-power EV charging infrastructure by Spider Energy.",
    subtopics: ["Heavy Duty EV Charging Stations for Buses, Trucks & Fleets in AP & TG", "High-Power DC Charging", "Depot Management"],
    bodyText: "Power your electric bus fleet and heavy-duty vehicles with SpiderEV's high-capacity DC charging solutions. Our 120-240 kW chargers are designed for depot operations with fleet management integration and scheduled charging.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Heavy Duty EV Charging Stations", "description": "High-power EV charging infrastructure for electric trucks, buses and fleet depots in AP & Telangana", "url": `${BASE_URL}/heavy-duty-ev-charging-station`, "serviceType": "Heavy Duty EV Charging", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/heavy-duty-ev-charging-station"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/cpms-ev-charging-point-management-system",
    title: "EV Charging Management System in Andhra Pradesh & Telangana",
    description: "Explore Smart EV Charging Solutions in Andhra Pradesh and Telangana with Advanced Platforms and Efficient Network Management for Seamless Charging Operations.",
    subtopics: ["SpiderConnect CPMS", "Remote Monitoring & Control", "Revenue Management"],
    bodyText: "SpiderConnect is our cloud-based Charging Point Management System. Monitor charger health, manage user access, process payments, configure dynamic pricing, and view analytics from a unified dashboard.",
    schemas: [
      { "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "SpiderConnect CPMS", "description": "Cloud-based Charging Point Management System for monitoring, controlling and managing EV charging networks across India", "url": `${BASE_URL}/cpms-ev-charging-point-management-system`, "applicationCategory": "BusinessApplication", "operatingSystem": "Web, Android, iOS", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }, "provider": { "@id": `${BASE_URL}/#organization` } },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/cpms-ev-charging-point-management-system"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-app",
    title: "EV Charging Station App in Andhra Pradesh & Telangana",
    description: "Smart EV Charging App in AP & Telangana — locate nearby stations, access charging networks and manage your EV charging anytime, anywhere.",
    subtopics: ["Find Nearby Chargers", "Start & Pay via App", "Charging History & Wallet"],
    bodyText: "The SpiderEV mobile app helps EV drivers find nearby charging stations, start sessions remotely, pay digitally, and track charging history. Available on Android and iOS with real-time station availability.",
    schema: { "@context": "https://schema.org", "@type": "MobileApplication", "name": "SpiderEV Charging App", "description": "Find nearby EV charging stations, start sessions, pay digitally and track charging history across India", "url": `${BASE_URL}/ev-charging-station-app`, "applicationCategory": "UtilitiesApplication", "operatingSystem": "Android, iOS", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }, "provider": { "@id": `${BASE_URL}/#organization` } },
  },
  {
    path: "/ev-charging-epc-services",
    title: "EV Station EPC & Installation Services | AP & TG",
    description: "EV charging station installation in AP & Telangana — EPC services, construction support & infrastructure solutions for commercial and public spaces.",
    subtopics: ["End-to-End EV Charging Station EPC & Installation Services Across AP & TG", "Site Survey & Design", "Installation & Commissioning"],
    bodyText: "Our EPC (Engineering, Procurement, and Construction) team handles every aspect of charging station deployment — from electrical load assessment and civil works to charger mounting, cabling, and final commissioning.",
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
    subtopics: ["About Spider Energy — EV Charger Manufacturer in Telangana & Andhra Pradesh", "Manufacturing Capabilities", "Our Team"],
    bodyText: "Spider Energy is headquartered at T-Hub, Hyderabad — India's largest innovation hub. We design, manufacture, and deploy EV charging solutions spanning the full power spectrum from 3.3 kW to 240 kW, serving homes, businesses, and highways.",
  },
  {
    path: "/contact-us",
    title: "Contact SpiderEV | EV Charging Experts in AP & TG",
    description: "Contact Spider Energy for EV charger installation, franchise enquiries, CPMS support or SpiderVault BESS consultation in Andhra Pradesh & Telangana.",
    subtopics: ["Contact Spider Energy — EV Charging Experts in Telangana & Andhra Pradesh", "Office Location", "Support Hours"],
    bodyText: "Reach Spider Energy for sales enquiries, installation support, franchise information, or technical assistance. Our team is available Monday through Sunday to help you with all your EV charging needs.",
  },

  // Standalone
  {
    path: "/ev-charging-station-franchise",
    title: "EV Charging Station Franchise in Telangana & Andhra Pradesh",
    description: "Start your EV Charging Franchise in AP & Telangana — dealership support, profitable setup plans and trusted franchise guidance by SpiderEV.",
    subtopics: ["Start Your EV Charging Franchise in Telangana & AP", "Investment & ROI", "How to Apply"],
    bodyText: "Join India's EV charging revolution with a SpiderEV franchise. We provide hardware, software, installation, branding, and ongoing support. Multiple investment tiers available with payback periods of 2-4 years.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "EV Charging Station Franchise", "description": "Start your EV charging franchise in Andhra Pradesh and Telangana with dealership support, profitable franchise setup plans and trusted franchise company guidance.", "url": `${BASE_URL}/ev-charging-station-franchise`, "serviceType": "EV Charging Franchise Opportunity", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/ev-charging-station-franchise"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-roi-calculator",
    title: "EV Charging ROI Calculator | AP & TG | SpiderEV",
    description: "Estimate EV charging business profits in AP & Telangana. Smart ROI calculator for accurate charging station investment planning.",
    subtopics: ["Calculate Your EV Charging Station ROI & Profits in Telangana & AP", "Revenue Projections", "Investment Planning"],
  },
  {
    path: "/bess-battery-backup-for-ev-charging-stations",
    title: "SpiderVault BESS — Battery Energy Storage | AP & TG",
    description: "SpiderVault BESS by Spider Energy provides battery energy storage for EV stations, solar projects & industrial backup in Andhra Pradesh & Telangana.",
    subtopics: ["SpiderVault — Battery Energy Storage System (BESS) for EV Stations & Industry", "Solar + EV Charging", "Grid Independence"],
    bodyText: "Combine Battery Energy Storage Systems (BESS) with your EV charging station to reduce demand charges, enable solar integration, and ensure uninterrupted charging even during grid outages.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "BESS — Battery Energy Storage for EV Charging Stations", "description": "Smart EV charging energy storage solutions with solar powered station setups, renewable charging and battery backup systems in Andhra Pradesh and Telangana.", "url": `${BASE_URL}/bess-battery-backup-for-ev-charging-stations`, "serviceType": "Battery Energy Storage System (BESS)", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/bess-battery-backup-for-ev-charging-stations"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-locator",
    title: "EV Charging Station Locator in Andhra Pradesh & Telangana",
    description: "Find Nearby EV Fast Charging Stations in Andhra Pradesh and Telangana using a Smart EV Charge Zone Locator and Real-time EV Charging Locator Tools.",
    subtopics: ["Find Charging Stations", "Real-Time Availability", "Navigation"],
    schema: { "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${BASE_URL}/#localbusiness`, "name": "Spider Energy", "url": BASE_URL, "telephone": "+91-9997776080", "email": "connect@spiderenergy.in", "address": { "@type": "PostalAddress", "streetAddress": "THub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" }, "geo": { "@type": "GeoCoordinates", "latitude": "17.4435", "longitude": "78.3772" }, "image": `${BASE_URL}/spider-ev-logo.png`, "priceRange": "$$" },
  },

  // Other
  {
    path: "/news",
    title: "Latest EV Charging News in Andhra Pradesh & Telangana",
    description: "Stay updated with the latest electric vehicle charging news, EV infrastructure trends and technology insights across Andhra Pradesh and Telangana.",
    subtopics: ["Latest EV Charging Industry News & Updates", "SpiderEV Updates", "EV Policy & Trends"],
  },
  {
    path: "/blog",
    title: "EV Charging Blog — Tips, Guides & News | SpiderEV",
    description: "Read the latest EV charging guides, industry news and business insights from SpiderEV — your expert resource for electric vehicle charging in India.",
    subtopics: ["EV Charging Guides", "Business Insights", "Technology Explained"],
    bodyText: "The SpiderEV blog covers everything about electric vehicle charging in India — from choosing the right charger for your home to starting an EV charging business, understanding OCPP protocols, and industry analysis.",
  },
  {
    path: "/gallery",
    title: "SpiderEV Gallery | EV Charger Installations in India",
    description: "Browse SpiderEV's gallery of EV charging installations, products, events and partnerships across Andhra Pradesh and Telangana.",
    subtopics: ["SpiderEV Gallery — EV Charger Installations Across Telangana & Andhra Pradesh", "Products", "Events"],
  },
  {
    path: "/har-ghar",
    title: "Har Ghar Charger — Affordable Home EV Charging India",
    description: "Har Ghar Charger — affordable home EV charging for every Indian household. Register and earn from your own EV charging station.",
    subtopics: ["Har Ghar Charger Initiative", "How It Works", "Register Now"],
    bodyText: "Har Ghar Charger makes EV charging accessible to every Indian household. Install a SpiderEV home charger, charge your own vehicle, and earn by sharing it with neighbours through our app-based platform.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Har Ghar Charger — Home EV Charging for Every Indian", "description": "SpiderEV's Har Ghar Charger initiative brings affordable home EV charging to every Indian household. Register your interest and earn from your own charging station.", "url": `${BASE_URL}/har-ghar`, "serviceType": "Home EV Charging Program", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": "IN" },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/har-ghar"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/partner-withus",
    title: "Partner With SpiderEV — EV Charging Opportunities India",
    description: "Partner with SpiderEV as a site owner, fleet operator, fuel station or real estate developer. Build India's EV charging future together.",
    subtopics: ["Partner With SpiderEV — Earn from EV Charging in Telangana & AP", "Site Owner Benefits", "Apply to Partner"],
    bodyText: "Partner with Spider Energy to deploy EV charging at your location. Whether you own a fuel station, parking lot, commercial complex, or fleet depot, we have partnership models that generate passive revenue from your existing real estate.",
  },
];

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
