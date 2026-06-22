/**
 * prerender.mjs
 *
 * Runs after `vite build`. For every route it:
 *  - Injects the correct <title>, <meta name="description">, Open Graph tags,
 *    and <link rel="canonical"> into dist/index.html
 *  - Writes the result to dist/<route>/index.html
 *
 * This ensures crawlers that don't run JavaScript (social media bots, Bing,
 * SEO audit tools, Ctrl+U) receive correct meta tags in the raw HTML.
 *
 * Zero extra npm dependencies — plain Node.js fs only.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const BASE_URL = "https://www.spiderenergy.in";

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

function buildMeta({ path, title, description }) {
  const url = `${BASE_URL}${path}`;
  return [
    `  <title>${e(title)}</title>`,
    `  <meta name="description" content="${e(description)}" />`,
    `  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `  <meta property="og:title" content="${e(title)}" />`,
    `  <meta property="og:description" content="${e(description)}" />`,
    `  <meta property="og:url" content="${url}" />`,
    `  <meta property="og:type" content="website" />`,
    `  <meta property="og:site_name" content="Spider Energy" />`,
    `  <meta property="og:image" content="${OG_IMAGE}" />`,
    `  <meta property="og:image:width" content="1200" />`,
    `  <meta property="og:image:height" content="630" />`,
    `  <meta property="og:locale" content="en_IN" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${e(title)}" />`,
    `  <meta name="twitter:description" content="${e(description)}" />`,
    `  <meta name="twitter:image" content="${OG_IMAGE}" />`,
    `  <link rel="canonical" href="${url}" />`,
    `  <script type="application/ld+json">${ORG_JSONLD}</script>`,
  ].join("\n");
}

function inject(template, meta) {
  return template
    .replace(/<title>[^<]*<\/title>/, "")
    .replace("</head>", `${meta}\n</head>`);
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

// ─── Route definitions ───────────────────────────────────────────────────────

const routes = [
  // Home
  {
    path: "/",
    title: "Electric Vehicle Charging Station in Telangana & Andhra Pradesh",
    description: "Spider Energy is a Trusted EV Charging Company in Andhra Pradesh (AP) & Telangana (TG), Offering Fast and Reliable EV Charging Solutions for a Sustainable Future.",
  },

  // Products
  {
    path: "/electric-vehicle-ev-ac-charger",
    title: "Electric Vehicle AC Charging Station in Telangana & Andhra Pradesh",
    description: "Explore the Best EV AC Charging Stations in Andhra Pradesh (AP) and Telangana (TG) for Efficient Home EV Charging and Reliable Electric Car Charger Solutions.",
  },
  {
    path: "/electric-vehicle-ev-dc-charger",
    title: "DC Fast EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Explore top DC Fast Electric Vehicle Chargers in Andhra Pradesh (AP) & Telangana (TG). Spider Energy Provides Reliable and Smart EV Charging Solutions for Vehicles.",
  },

  // AC product detail pages
  {
    path: "/products/ac/spider-mini",
    title: "Spider Mini — 3.3 kW AC EV Charger | SpiderEV",
    description: "Compact single-phase 3.3 kW AC EV home charger with IP67 protection, RFID authentication and all-weather durability for homes in Andhra Pradesh and Telangana.",
  },
  {
    path: "/products/ac/spider-lite",
    title: "Spider Lite — 3.3 kW AC EV Charger with Free Installation | SpiderEV",
    description: "Smart 3.3 kW single-phase AC EV charger with free installation, app monitoring and RFID authentication. Ideal for home EV charging in India.",
  },
  {
    path: "/products/ac/spider-smart",
    title: "Spider Smart — 7.4 kW Type 2 AC EV Charger | SpiderEV",
    description: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management. Perfect for home and commercial EV charging in Andhra Pradesh & Telangana.",
  },
  {
    path: "/products/ac/spider-blaze",
    title: "Spider Blaze — 22 kW Three-Phase AC EV Charger | SpiderEV",
    description: "22 kW three-phase AC EV charger for fleet and commercial EV charging installations across Andhra Pradesh and Telangana. OCPP 1.6J, IP67 rated.",
  },
  {
    path: "/products/ac/spider-strike",
    title: "Spider Strike — 40 kW Three-Phase AC EV Charger | SpiderEV",
    description: "40 kW high-power three-phase AC EV charger for commercial fleet charging. BIS certified, OCPP 1.6J, IP67 protection for all-weather operation.",
  },
  {
    path: "/products/ac/spider-dash",
    title: "Spider Dash — 80 kW Dual-Gun AC EV Charger | SpiderEV",
    description: "80 kW dual-gun three-phase AC EV charger for high-throughput commercial sites. Simultaneously charge two vehicles at 55 A per gun.",
  },

  // DC product detail pages
  {
    path: "/products/dc/spider-base",
    title: "Spider Base — 3–12 kW DC EV Charger for Light EVs | SpiderEV",
    description: "Modular 3–12 kW DC EV charger with IS 17017-2-6 connector for 2-wheelers and light EVs. BIS certified, OCPP 1.6J, IP67 rated.",
  },
  {
    path: "/products/dc/spider-fast",
    title: "Spider Fast — 30 kW DC Fast EV Charger | SpiderEV",
    description: "30 kW rapid DC fast EV charger with CCS2 and CHAdeMO connectors for public 4-wheeler charging in Andhra Pradesh and Telangana.",
  },
  {
    path: "/products/dc/spider-spark",
    title: "Spider Spark — 60 kW DC Fast EV Charger | SpiderEV",
    description: "60 kW DC fast EV charger with CCS2 and CHAdeMO connectors for public and commercial charging stations in Andhra Pradesh & Telangana.",
  },
  {
    path: "/products/dc/spider-falcon",
    title: "Spider Falcon — 60 kW CCS2 DC Fast EV Charger | SpiderEV",
    description: "60 kW high-speed CCS2 DC fast EV charger for public charging networks and commercial hubs. IP67 rated, OCPP 1.6J compliant.",
  },
  {
    path: "/products/dc/spider-ultra",
    title: "Spider Ultra — 120 kW DC Fast EV Charger | SpiderEV",
    description: "120 kW high-speed DC fast EV charger with CCS2 and CHAdeMO for public networks, fleets and commercial hubs in Andhra Pradesh & Telangana.",
  },
  {
    path: "/products/dc/spider-surge",
    title: "Spider Surge — 180 kW DC Fast EV Charger | SpiderEV",
    description: "180 kW rapid DC fast EV charger delivering powerful charging for highways, depots and fleet operators in Andhra Pradesh and Telangana.",
  },
  {
    path: "/products/dc/spider-hulk",
    title: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger | SpiderEV",
    description: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications.",
  },

  // Solutions
  {
    path: "/park-and-charge-electric-vehicle-ev-charging-station",
    title: "Park and Charge EV Stations in Telangana & Andhra Pradesh",
    description: "Spider Energy Provides Top Park & Charge Electric Vehicle Stations in Andhra Pradesh (AP) and Telangana (TG), with Easy Installation & Best Parking Solutions for EVs.",
  },
  {
    path: "/community-ev-charging-stations",
    title: "Community EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Spider Energy Provides Community EV Charging Stations in Andhra Pradesh (AP) & Telangana (TG) for Apartments and Housing Societies with Residential Charging Solutions.",
  },
  {
    path: "/public-ev-charging-stations",
    title: "Public EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Spider Energy offers Public EV Charging Stations in Andhra Pradesh and Telangana, Delivering Fast Charging for Cars with a Strong & Connected EV Charging Network.",
  },
  {
    path: "/heavy-duty-ev-charging-station",
    title: "Heavy Duty EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Spider Energy Provides Heavy Duty EV Charging Stations in AP & Telangana for Trucks, Buses & Fleets, with EV Charging Infrastructure & Electric Vehicle Charging Solutions.",
  },
  {
    path: "/cpms-ev-charging-point-management-system",
    title: "EV Charging Management System in Andhra Pradesh & Telangana",
    description: "Explore Smart EV Charging Solutions in Andhra Pradesh and Telangana with Advanced Platforms and Efficient Network Management for Seamless Charging Operations.",
  },
  {
    path: "/ev-charging-station-app",
    title: "EV Charging Station App in Andhra Pradesh & Telangana",
    description: "Discover a Smart EV Charging App in Andhra Pradesh and Telangana to Locate Nearby Stations, Access Charging Networks and Manage Your EV Charging Anytime, Anywhere.",
  },
  {
    path: "/ev-charging-epc-services",
    title: "EV Charging Station Installation Service in Telangana & Andhra Pradesh",
    description: "We provides EV charging station installation in Andhra Pradesh & Telangana with EPC services, construction support & infrastructure solutions for commercial and public spaces.",
  },

  // Company
  {
    path: "/about-us",
    title: "EV Charger Manufacturing Company in Telangana & Andhra Pradesh",
    description: "Discover EV Charging Systems Manufacturers in Andhra Pradesh and Telangana Offering Electric Car Chargers, EV Home Charger Installation & EV Charging Equipment.",
  },
  {
    path: "/contact-us",
    title: "EV Charging Station Installation Contact in Telangana & Andhra Pradesh",
    description: "Contact Our EV Charging Experts in Andhra Pradesh and Telangana for Fast EV Charging Installation Support, Station Enquiries and Reliable Helpline Assistance.",
  },

  // Standalone
  {
    path: "/ev-charging-station-franchise",
    title: "EV Charging Station Franchise in Telangana & Andhra Pradesh",
    description: "Start your EV Charging Franchise in Andhra Pradesh and Telangana with Dealership Support, Profitable Franchise Setup Plans and Trusted Franchise Company Guidance.",
  },
  {
    path: "/ev-charging-station-roi-calculator",
    title: "EV Charging Station ROI Calculator in Andhra Pradesh & Telangana",
    description: "Find Best Estimate EV Charging Business Profits in Andhra Pradesh and Telangana Using Smart Revenue and ROI Calculators for Accurate Charging Station Investment Planning.",
  },
  {
    path: "/bess-battery-backup-for-ev-charging-stations",
    title: "BESS EV Charging Station Solution in Andhra Pradesh & Telangana",
    description: "Explore Smart EV Charging Energy Storage Solutions in Andhra Pradesh and Telangana with Solar Powered Station Setups, Renewable Charging & Battery Backup Systems.",
  },
  {
    path: "/ev-charging-station-locator",
    title: "EV Charging Station Locator in Andhra Pradesh & Telangana",
    description: "Find Nearby EV Fast Charging Stations in Andhra Pradesh and Telangana using a Smart EV Charge Zone Locator and Real-time EV Charging Locator Tools.",
  },

  // Other
  {
    path: "/news",
    title: "Latest EV Charging News in Andhra Pradesh & Telangana",
    description: "Stay updated with the latest electric vehicle charging news, EV infrastructure trends and technology insights across Andhra Pradesh and Telangana.",
  },
  {
    path: "/blog",
    title: "EV Charging Blog — Tips, Guides & News | SpiderEV",
    description: "Read the latest EV charging guides, industry news and business insights from SpiderEV — your expert resource for electric vehicle charging in India.",
  },
  {
    path: "/gallery",
    title: "EV Charging Station Gallery | SpiderEV",
    description: "Browse SpiderEV's gallery of EV charging installations, products, events and partnerships across Andhra Pradesh and Telangana.",
  },
  {
    path: "/har-ghar",
    title: "Har Ghar Charger — Home EV Charging for Every Indian | SpiderEV",
    description: "SpiderEV's Har Ghar Charger initiative brings affordable home EV charging to every Indian household. Register your interest and earn from your own charging station.",
  },
  {
    path: "/partner-withus",
    title: "Partner With SpiderEV — EV Charging Opportunities in India",
    description: "Partner with SpiderEV as a site owner, fleet operator, fuel station or real estate developer. Build India's EV charging future together.",
  },
];

// ─── Run ─────────────────────────────────────────────────────────────────────

const template = readFileSync(join(distDir, "index.html"), "utf-8");

let count = 0;
for (const route of routes) {
  const meta = buildMeta(route);
  const html = inject(template, meta);
  write(html, route.path);
  count++;
  console.log(`  ✓ ${route.path}`);
}

console.log(`\nPre-rendered ${count} routes into dist/`);
