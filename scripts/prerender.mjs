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

  // Add page-specific schema if provided
  if (route.schema) {
    scripts += `\n  <script type="application/ld+json">${JSON.stringify(route.schema)}</script>`;
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

  let html = `<h1>${e(title)}</h1>`;
  html += `<p>${e(description)}</p>`;

  // For blog posts: inject the full article HTML (already rendered from markdown)
  if (articleHtml) {
    html += `<article>${articleHtml}</article>`;
  } else {
    // Add H2 subtopics for richer content
    if (subtopics && subtopics.length > 0) {
      html += subtopics.map(h2 => `<h2>${e(h2)}</h2>`).join("");
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

// ─── Route definitions ───────────────────────────────────────────────────────

const routes = [
  // Home
  {
    path: "/",
    title: "Electric Vehicle Charging Station in Telangana & Andhra Pradesh",
    description: "Spider Energy — Trusted EV Charging Company in Andhra Pradesh & Telangana. Fast, reliable AC & DC charging solutions for a sustainable future.",
    subtopics: ["AC & DC EV Chargers", "EV Charging Solutions", "Franchise Opportunities"],
    bodyText: "Spider Energy manufactures and deploys electric vehicle charging infrastructure across India. From 3.3 kW home chargers to 240 kW highway fast chargers, we provide end-to-end EV charging solutions including hardware, software (CPMS), installation, and maintenance services.",
  },

  // Products
  {
    path: "/electric-vehicle-ev-ac-charger",
    title: "Electric Vehicle AC Charging Station in Telangana & Andhra Pradesh",
    description: "Explore the Best EV AC Charging Stations in Andhra Pradesh (AP) and Telangana (TG) for Efficient Home EV Charging and Reliable Electric Car Charger Solutions.",
    subtopics: ["AC Charger Models", "Features & Specifications", "Why Choose SpiderEV AC Chargers"],
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
    title: "Spider Mini — 3.3 kW AC EV Charger | SpiderEV",
    description: "Compact single-phase 3.3 kW AC EV home charger with IP67 protection, RFID authentication and all-weather durability for homes in Andhra Pradesh and Telangana.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/ac/spider-lite",
    title: "Spider Lite — 3.3 kW AC EV Charger with Free Installation | SpiderEV",
    description: "Smart 3.3 kW single-phase AC EV charger with free installation, app monitoring and RFID authentication. Ideal for home EV charging in India.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/ac/spider-smart",
    title: "Spider Smart — 7.4 kW Type 2 AC EV Charger | SpiderEV",
    description: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management. Perfect for home and commercial EV charging in Andhra Pradesh & Telangana.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/ac/spider-blaze",
    title: "Spider Blaze — 22 kW Three-Phase AC EV Charger | SpiderEV",
    description: "22 kW three-phase AC EV charger for fleet and commercial EV charging installations across Andhra Pradesh and Telangana. OCPP 1.6J, IP67 rated.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/ac/spider-strike",
    title: "Spider Strike — 40 kW Three-Phase AC EV Charger | SpiderEV",
    description: "40 kW high-power three-phase AC EV charger for commercial fleet charging. BIS certified, OCPP 1.6J, IP67 protection for all-weather operation.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/ac/spider-dash",
    title: "Spider Dash — 80 kW Dual-Gun AC EV Charger | SpiderEV",
    description: "80 kW dual-gun three-phase AC EV charger for high-throughput commercial sites. Simultaneously charge two vehicles at 55 A per gun.",
    subtopics: ["Technical Specifications", "Key Features"],
  },

  // DC product detail pages
  {
    path: "/products/dc/spider-base",
    title: "Spider Base — 3-12 kW DC EV Charger for Light EVs | SpiderEV",
    description: "Modular 3-12 kW DC EV charger with IS 17017-2-6 connector for 2-wheelers and light EVs. BIS certified, OCPP 1.6J, IP67 rated.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/dc/spider-fast",
    title: "Spider Fast — 30 kW DC Fast EV Charger | SpiderEV",
    description: "30 kW rapid DC fast EV charger with CCS2 and CHAdeMO connectors for public 4-wheeler charging in Andhra Pradesh and Telangana.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/dc/spider-spark",
    title: "Spider Spark — 60 kW DC Fast EV Charger | SpiderEV",
    description: "60 kW DC fast EV charger with CCS2 and CHAdeMO connectors for public and commercial charging stations in Andhra Pradesh & Telangana.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/dc/spider-falcon",
    title: "Spider Falcon — 60 kW CCS2 DC Fast EV Charger | SpiderEV",
    description: "60 kW high-speed CCS2 DC fast EV charger for public charging networks and commercial hubs. IP67 rated, OCPP 1.6J compliant.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/dc/spider-ultra",
    title: "Spider Ultra — 120 kW DC Fast EV Charger | SpiderEV",
    description: "120 kW high-speed DC fast EV charger with CCS2 and CHAdeMO for public networks, fleets and commercial hubs in Andhra Pradesh & Telangana.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/dc/spider-surge",
    title: "Spider Surge — 180 kW DC Fast EV Charger | SpiderEV",
    description: "180 kW rapid DC fast EV charger delivering powerful charging for highways, depots and fleet operators in Andhra Pradesh and Telangana.",
    subtopics: ["Technical Specifications", "Key Features"],
  },
  {
    path: "/products/dc/spider-hulk",
    title: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger | SpiderEV",
    description: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications.",
    subtopics: ["Technical Specifications", "Key Features"],
  },

  // Solutions
  {
    path: "/park-and-charge-electric-vehicle-ev-charging-station",
    title: "Park and Charge EV Stations in Telangana & Andhra Pradesh",
    description: "Park & Charge EV Stations in Andhra Pradesh & Telangana. Easy installation and smart parking-based EV charging solutions by Spider Energy.",
    subtopics: ["Park & Charge Solutions", "How It Works", "Benefits for Site Owners"],
    bodyText: "Transform your parking space into a revenue-generating EV charging hub. Spider Energy's Park & Charge solution covers site assessment, charger installation, software integration, and ongoing maintenance for malls, offices, and commercial complexes.",
  },
  {
    path: "/community-ev-charging-stations",
    title: "Community EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Community EV Charging Stations in Andhra Pradesh & Telangana for apartments and housing societies. Shared residential charging solutions.",
    subtopics: ["Apartment & Society Charging", "Shared Charging Infrastructure", "Billing & Management"],
    bodyText: "Enable EV charging in your apartment complex or gated community. Our community charging solution supports shared usage with individual billing, load management, and resident-friendly mobile app access.",
  },
  {
    path: "/public-ev-charging-stations",
    title: "Public EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Public EV Charging Stations in Andhra Pradesh & Telangana. Fast charging for cars with a strong, connected EV charging network by Spider Energy.",
    subtopics: ["Public Charging Network", "Fast Charging Stations", "Network Coverage"],
    bodyText: "Build a public EV charging network with SpiderEV's turnkey solutions. From AC destination chargers to DC fast chargers, we provide the complete infrastructure for fuel stations, retail locations, and public parking areas.",
  },
  {
    path: "/heavy-duty-ev-charging-station",
    title: "Heavy Duty EV Charging Stations in Telangana & Andhra Pradesh",
    description: "Heavy Duty EV Charging Stations in AP & Telangana for trucks, buses & fleets. High-power EV charging infrastructure by Spider Energy.",
    subtopics: ["Fleet & Bus Depot Charging", "High-Power DC Charging", "Depot Management"],
    bodyText: "Power your electric bus fleet and heavy-duty vehicles with SpiderEV's high-capacity DC charging solutions. Our 120-240 kW chargers are designed for depot operations with fleet management integration and scheduled charging.",
  },
  {
    path: "/cpms-ev-charging-point-management-system",
    title: "EV Charging Management System in Andhra Pradesh & Telangana",
    description: "Explore Smart EV Charging Solutions in Andhra Pradesh and Telangana with Advanced Platforms and Efficient Network Management for Seamless Charging Operations.",
    subtopics: ["SpiderConnect CPMS", "Remote Monitoring & Control", "Revenue Management"],
    bodyText: "SpiderConnect is our cloud-based Charging Point Management System. Monitor charger health, manage user access, process payments, configure dynamic pricing, and view analytics from a unified dashboard.",
  },
  {
    path: "/ev-charging-station-app",
    title: "EV Charging Station App in Andhra Pradesh & Telangana",
    description: "Smart EV Charging App in AP & Telangana — locate nearby stations, access charging networks and manage your EV charging anytime, anywhere.",
    subtopics: ["Find Nearby Chargers", "Start & Pay via App", "Charging History & Wallet"],
    bodyText: "The SpiderEV mobile app helps EV drivers find nearby charging stations, start sessions remotely, pay digitally, and track charging history. Available on Android and iOS with real-time station availability.",
  },
  {
    path: "/ev-charging-epc-services",
    title: "EV Charging Station Installation Service in Telangana & Andhra Pradesh",
    description: "EV charging station installation in AP & Telangana — EPC services, construction support & infrastructure solutions for commercial and public spaces.",
    subtopics: ["End-to-End EPC Services", "Site Survey & Design", "Installation & Commissioning"],
    bodyText: "Our EPC (Engineering, Procurement, and Construction) team handles every aspect of charging station deployment — from electrical load assessment and civil works to charger mounting, cabling, and final commissioning.",
  },

  // Company
  {
    path: "/about-us",
    title: "EV Charger Manufacturing Company in Telangana & Andhra Pradesh",
    description: "EV Charging Systems Manufacturer in Andhra Pradesh & Telangana. Electric car chargers, home charger installation & charging equipment.",
    subtopics: ["Our Mission", "Manufacturing Capabilities", "Our Team"],
    bodyText: "Spider Energy is headquartered at T-Hub, Hyderabad — India's largest innovation hub. We design, manufacture, and deploy EV charging solutions spanning the full power spectrum from 3.3 kW to 240 kW, serving homes, businesses, and highways.",
  },
  {
    path: "/contact-us",
    title: "EV Charging Station Installation Contact in Telangana & Andhra Pradesh",
    description: "Contact Our EV Charging Experts in Andhra Pradesh and Telangana for Fast EV Charging Installation Support, Station Enquiries and Reliable Helpline Assistance.",
    subtopics: ["Get In Touch", "Office Location", "Support Hours"],
    bodyText: "Reach Spider Energy for sales enquiries, installation support, franchise information, or technical assistance. Our team is available Monday through Sunday to help you with all your EV charging needs.",
  },

  // Standalone
  {
    path: "/ev-charging-station-franchise",
    title: "EV Charging Station Franchise in Telangana & Andhra Pradesh",
    description: "Start your EV Charging Franchise in AP & Telangana — dealership support, profitable setup plans and trusted franchise guidance by SpiderEV.",
    subtopics: ["Franchise Models", "Investment & ROI", "How to Apply"],
    bodyText: "Join India's EV charging revolution with a SpiderEV franchise. We provide hardware, software, installation, branding, and ongoing support. Multiple investment tiers available with payback periods of 2-4 years.",
  },
  {
    path: "/ev-charging-station-roi-calculator",
    title: "EV Charging Station ROI Calculator in Andhra Pradesh & Telangana",
    description: "Estimate EV charging business profits in AP & Telangana. Smart ROI calculator for accurate charging station investment planning.",
    subtopics: ["Calculate Your ROI", "Revenue Projections", "Investment Planning"],
  },
  {
    path: "/bess-battery-backup-for-ev-charging-stations",
    title: "BESS EV Charging Station Solution in Andhra Pradesh & Telangana",
    description: "Smart EV Charging Energy Storage in Andhra Pradesh & Telangana — solar-powered stations, renewable charging & battery backup systems.",
    subtopics: ["Battery Energy Storage", "Solar + EV Charging", "Grid Independence"],
    bodyText: "Combine Battery Energy Storage Systems (BESS) with your EV charging station to reduce demand charges, enable solar integration, and ensure uninterrupted charging even during grid outages.",
  },
  {
    path: "/ev-charging-station-locator",
    title: "EV Charging Station Locator in Andhra Pradesh & Telangana",
    description: "Find Nearby EV Fast Charging Stations in Andhra Pradesh and Telangana using a Smart EV Charge Zone Locator and Real-time EV Charging Locator Tools.",
    subtopics: ["Find Charging Stations", "Real-Time Availability", "Navigation"],
  },

  // Other
  {
    path: "/news",
    title: "Latest EV Charging News in Andhra Pradesh & Telangana",
    description: "Stay updated with the latest electric vehicle charging news, EV infrastructure trends and technology insights across Andhra Pradesh and Telangana.",
    subtopics: ["Industry News", "SpiderEV Updates", "EV Policy & Trends"],
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
    title: "EV Charging Station Gallery | SpiderEV",
    description: "Browse SpiderEV's gallery of EV charging installations, products, events and partnerships across Andhra Pradesh and Telangana.",
    subtopics: ["Installations", "Products", "Events"],
  },
  {
    path: "/har-ghar",
    title: "Har Ghar Charger — Home EV Charging for Every Indian | SpiderEV",
    description: "Har Ghar Charger — affordable home EV charging for every Indian household. Register your interest and earn from your own charging station.",
    subtopics: ["Har Ghar Charger Initiative", "How It Works", "Register Now"],
    bodyText: "Har Ghar Charger makes EV charging accessible to every Indian household. Install a SpiderEV home charger, charge your own vehicle, and earn by sharing it with neighbours through our app-based platform.",
  },
  {
    path: "/partner-withus",
    title: "Partner With SpiderEV — EV Charging Opportunities in India",
    description: "Partner with SpiderEV as a site owner, fleet operator, fuel station or real estate developer. Build India's EV charging future together.",
    subtopics: ["Partnership Models", "Site Owner Benefits", "Apply to Partner"],
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

    routes.push({
      path: `/blog/${post.slug}`,
      title: `${post.title} | SpiderEV Blog`,
      description: post.description,
      ogImage: post.image,
      ogType: "article",
      subtopics: [],
      bodyText: post.description,
      articleHtml, // full article HTML for crawler-visible content
      schema: {
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
