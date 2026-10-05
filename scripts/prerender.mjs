/**
 * prerender.mjs
 *
 * Runs after `vite build`. For every route it:
 *  - Injects the correct <title>, <meta name="description">, Open Graph tags,
 *    and <link rel="canonical"> into dist/index.html
 *  - Injects JSON-LD structured data (Organization + page-specific schemas)
 *  - Injects enriched no-JavaScript fallback content (H1, H2s, body text, nav)
 *  - Writes the result to dist/<route>/index.html
 *
 * This ensures crawlers that don't run JavaScript (social media bots, Bing,
 * SEO audit tools, Ctrl+U) receive correct meta tags in the raw HTML.
 *
 * Blog posts are discovered automatically from src/data/blog-posts.json.
 *
 * Zero extra npm dependencies — plain Node.js fs only.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
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

function findBuiltAsset(prefix) {
  const assetsDir = join(distDir, "assets");
  if (!existsSync(assetsDir)) return null;
  const match = readdirSync(assetsDir).find(
    (file) => file.startsWith(`${prefix}-`) && /\.(?:avif|jpe?g|png|webp)$/i.test(file),
  );
  return match ? `${BASE_URL}/assets/${match}` : null;
}

function productImage(category, productId) {
  const dedicated = {
    "spider-spark": "spark",
    "spider-ultra": "ultra",
    "spider-surge": "surge",
  };
  const prefix = dedicated[productId] || (category === "ac" ? "AcCharger" : "DcCharger");
  return findBuiltAsset(prefix) || OG_IMAGE;
}

// Organization JSON-LD injected into every pre-rendered page (for non-JS crawlers)
const ORG_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Spider Energy",
      "legalName": "Spider Energy",
      "alternateName": ["SpiderEV", "Spider Green Energy Solutions"],
      "url": `${BASE_URL}/`,
      "logo": { "@type": "ImageObject", "@id": `${BASE_URL}/#logo`, "url": `${BASE_URL}/spider-ev-logo.png`, "width": 417, "height": 188, "caption": "Spider Energy logo" },
      "image": { "@id": `${BASE_URL}/#logo` },
      "description": "Spider Energy manufactures and deploys connected EV charging infrastructure across India, with a focus on Telangana and Andhra Pradesh.",
      "address": { "@type": "PostalAddress", "streetAddress": "T-Hub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" },
      "contactPoint": [{ "@type": "ContactPoint", "telephone": "+91-9997776080", "contactType": "sales", "email": "connect@spiderenergy.in", "availableLanguage": ["English", "Hindi", "Telugu"], "areaServed": "IN" }],
      "email": "connect@spiderenergy.in",
      "sameAs": ["https://www.instagram.com/spider.ev/", "https://in.linkedin.com/company/spider-green-energy-solutions"],
      "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }, { "@type": "Country", "name": "India" }],
      "brand": [{ "@id": `${BASE_URL}/#brand-spiderev` }],
      "knowsAbout": ["EV charging stations", "AC EV chargers", "DC fast chargers", "OCPP CPMS"]
    },
    {
      "@type": "Brand", "@id": `${BASE_URL}/#brand-spiderev`, "name": "SpiderEV",
      "url": `${BASE_URL}/spiderev`, "logo": `${BASE_URL}/spider-ev-logo.png`,
      "description": "SpiderEV is Spider Energy's EV charging product line, covering AC and DC chargers, SpiderConnect CPMS, and the SpiderEV charging app.",
      "parentOrganization": { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Spider Energy",
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "inLanguage": "en-IN"
    },
    {
      "@type": ["LocalBusiness", "Electrician"], "@id": `${BASE_URL}/#localbusiness`, "name": "Spider Energy",
      "url": `${BASE_URL}/`, "image": { "@id": `${BASE_URL}/#logo` }, "telephone": "+91-9997776080",
      "email": "connect@spiderenergy.in", "priceRange": "₹₹",
      "address": { "@type": "PostalAddress", "streetAddress": "T-Hub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" },
      "geo": { "@type": "GeoCoordinates", "latitude": 17.4435, "longitude": 78.3772 },
      "parentOrganization": { "@id": `${BASE_URL}/#organization` },
      "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": "09:00", "closes": "18:00" }]
    }
  ]
});

// Product schema helper for pre-rendered product pages
function buildProductSchema({ name, description, power, connector, category, productId, chargerType }) {
  const url = `${BASE_URL}/products/${category}/${productId}`;
  const sku = `SE-${category.toUpperCase()}-${productId.replace(/^spider-/, "").toUpperCase()}-${power.replace(/[^0-9.]/g, "")}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/products/${category}/${productId}#product`,
    "name": name,
    "description": description,
    "sku": sku,
    "mpn": sku,
    "brand": { "@id": `${BASE_URL}/#brand-spiderev` },
    "manufacturer": { "@id": `${BASE_URL}/#organization` },
    "category": `EV Charger > ${chargerType}`,
    "url": url,
    "image": productImage(category, productId),
    "offers": { "@type": "Offer", "url": url, "priceCurrency": "INR", "availability": "https://schema.org/InStock", "itemCondition": "https://schema.org/NewCondition", "seller": { "@id": `${BASE_URL}/#organization` }, "areaServed": "IN" },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Power Output", "value": power },
      { "@type": "PropertyValue", "name": "Connector", "value": connector },
      { "@type": "PropertyValue", "name": "Certification", "value": "BIS, IP67, OCPP 1.6J" },
    ],
  };
}

function absoluteImageUrl(image) {
  if (!image) return OG_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  return `${BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

function buildMeta({ path, title, description, ogImage, ogType, lcpImage }) {
  const url = `${BASE_URL}${path}`;
  const image = ogImage ? absoluteImageUrl(ogImage) : OG_IMAGE;
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
    lcpImage ? `  <link rel="preload" as="image" href="${absoluteImageUrl(lcpImage)}" fetchpriority="high" />` : null,
    `  <link rel="canonical" href="${url}" />`,
  ].filter(Boolean).join("\n");
}

function buildJsonLd(route) {
  // Always include Organization schema
  let scripts = `  <script type="application/ld+json">${ORG_JSONLD}</script>`;

  // Add page-specific schema(s) if provided
  if (route.schema && !isSitewideEntity(route.schema)) {
    scripts += `\n  <script type="application/ld+json">${JSON.stringify(route.schema)}</script>`;
  }
  if (route.schemas) {
    for (const s of route.schemas.filter((schema) => !isSitewideEntity(schema))) {
      scripts += `\n  <script type="application/ld+json">${JSON.stringify(s)}</script>`;
    }
  }

  const hasBreadcrumb = [route.schema, ...(route.schemas || [])].some((schema) => schema?.["@type"] === "BreadcrumbList");
  if (route.path !== "/" && !hasBreadcrumb) {
    scripts += `\n  <script type="application/ld+json">${JSON.stringify(buildBreadcrumbSchema(route))}</script>`;
  }

  if (route.path === "/electric-vehicle-ev-ac-charger" || route.path === "/electric-vehicle-ev-dc-charger") {
    scripts += `\n  <script type="application/ld+json">${JSON.stringify(buildCollectionSchema(route.path))}</script>`;
  }

  return scripts;
}

function isSitewideEntity(schema) {
  const types = Array.isArray(schema?.["@type"]) ? schema["@type"] : [schema?.["@type"]];
  return types.includes("Organization") || types.includes("LocalBusiness") || schema?.["@id"] === `${BASE_URL}/#localbusiness`;
}

function buildBreadcrumbSchema(route) {
  const items = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/` }];
  const productMatch = route.path.match(/^\/products\/(ac|dc)\/([^/]+)$/);
  if (productMatch) {
    const [, category] = productMatch;
    items.push({ "@type": "ListItem", "position": 2, "name": "SpiderEV", "item": `${BASE_URL}/spiderev` });
    items.push({ "@type": "ListItem", "position": 3, "name": category === "ac" ? "AC EV Chargers" : "DC Fast Chargers", "item": `${BASE_URL}/${category === "ac" ? "electric-vehicle-ev-ac-charger" : "electric-vehicle-ev-dc-charger"}` });
    items.push({ "@type": "ListItem", "position": 4, "name": route.title.split("—")[0].trim(), "item": `${BASE_URL}${route.path}` });
  } else {
    items.push({ "@type": "ListItem", "position": 2, "name": route.title.split(/[|—]/)[0].trim(), "item": `${BASE_URL}${route.path}` });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${BASE_URL}${route.path}#breadcrumb`, "itemListElement": items };
}

function buildCollectionSchema(path) {
  const isAc = path.includes("-ac-");
  const products = isAc
    ? [["spider-mini", "Spider Mini 3.3 kW"], ["spider-lite", "Spider Lite 3.3 kW"], ["spider-smart", "Spider Smart 7.4 kW"], ["spider-blaze", "Spider Blaze 22 kW"], ["spider-strike", "Spider Strike 40 kW"], ["spider-dash", "Spider Dash 80 kW"]]
    : [["spider-base", "Spider Base 3-12 kW"], ["spider-fast", "Spider Fast 30 kW"], ["spider-spark", "Spider Spark 60 kW"], ["spider-falcon", "Spider Falcon 60 kW"], ["spider-ultra", "Spider Ultra 120 kW"], ["spider-surge", "Spider Surge 180 kW"], ["spider-hulk", "Spider Hulk 240 kW"]];
  const category = isAc ? "ac" : "dc";
  return {
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${BASE_URL}${path}#collection`,
    "name": isAc ? "AC EV Chargers | SpiderEV" : "DC Fast EV Chargers | SpiderEV", "url": `${BASE_URL}${path}`,
    "isPartOf": { "@id": `${BASE_URL}/#website` }, "about": { "@id": `${BASE_URL}/#brand-spiderev` },
    "mainEntity": { "@type": "ItemList", "numberOfItems": products.length, "itemListElement": products.map(([slug, name], index) => ({ "@type": "ListItem", "position": index + 1, "name": name, "url": `${BASE_URL}/products/${category}/${slug}` })) }
  };
}

// Internal navigation links injected into pre-rendered HTML for crawlers
const NAV_LINKS = [
  { href: "/spiderev", text: "SpiderEV" },
  // Product categories
  { href: "/electric-vehicle-ev-ac-charger", text: "AC Chargers" },
  { href: "/electric-vehicle-ev-dc-charger", text: "DC Chargers" },
  // AC product detail pages
  { href: "/products/ac/spider-mini", text: "Spider Mini 3.3 kW" },
  { href: "/products/ac/spider-lite", text: "Spider Lite 3.3 kW" },
  { href: "/products/ac/spider-smart", text: "Spider Smart 7.4 kW" },
  { href: "/products/ac/spider-blaze", text: "Spider Blaze 22 kW" },
  { href: "/products/ac/spider-strike", text: "Spider Strike 40 kW" },
  { href: "/products/ac/spider-dash", text: "Spider Dash 80 kW" },
  // DC product detail pages
  { href: "/products/dc/spider-base", text: "Spider Base 3-12 kW" },
  { href: "/products/dc/spider-fast", text: "Spider Fast 30 kW" },
  { href: "/products/dc/spider-spark", text: "Spider Spark 60 kW" },
  { href: "/products/dc/spider-falcon", text: "Spider Falcon 60 kW" },
  { href: "/products/dc/spider-ultra", text: "Spider Ultra 120 kW" },
  { href: "/products/dc/spider-surge", text: "Spider Surge 180 kW" },
  { href: "/products/dc/spider-hulk", text: "Spider Hulk 240 kW" },
  // Solutions
  { href: "/park-and-charge-electric-vehicle-ev-charging-station", text: "Park & Charge" },
  { href: "/community-ev-charging-stations", text: "Community Charging" },
  { href: "/public-ev-charging-stations", text: "Public Charging" },
  { href: "/heavy-duty-ev-charging-station", text: "Heavy Duty Charging" },
  { href: "/cpms-ev-charging-point-management-system", text: "CPMS" },
  { href: "/ev-charging-station-app", text: "SpiderEV App" },
  { href: "/ev-charging-epc-services", text: "EPC Services" },
  // Company
  { href: "/about-us", text: "About Us" },
  { href: "/contact-us", text: "Contact Us" },
  // Standalone
  { href: "/ev-charging-station-franchise", text: "Franchise" },
  { href: "/ev-charging-station-roi-calculator", text: "ROI Calculator" },
  { href: "/ev-charging-station-locator", text: "Station Locator" },
  { href: "/har-ghar", text: "Har Ghar Charger" },
  { href: "/partner-with-us", text: "Partner With Us" },
  // Content
  { href: "/news", text: "News" },
  { href: "/blog", text: "Blog" },
  { href: "/gallery", text: "Gallery" },
  { href: "/guides/ac-vs-dc-ev-charger-india", text: "AC vs DC Guide" },
  { href: "/guides/home-ev-charger-buying-guide-telangana-andhra", text: "Home EV Charger Guide" },
  { href: "/privacy-policy", text: "Privacy Policy" },
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

  // For the /blog listing page, also add links to individual blog posts
  if (path === "/blog") {
    const blogPostsPath = join(ROOT, "src", "data", "blog-posts.json");
    if (existsSync(blogPostsPath)) {
      const posts = JSON.parse(readFileSync(blogPostsPath, "utf-8")).filter(p => p.published);
      html += `<section><h2>All Articles</h2><ul>`;
      for (const post of posts) {
        html += `<li><a href="/blog/${post.slug}">${e(post.title)}</a></li>`;
      }
      html += `</ul></section>`;
    }
  }

  html += `<nav>${links}</nav>`;
  return html;
}

function inject(template, meta, jsonLd, noscrollContent) {
  // A legitimate no-JavaScript fallback avoids hidden crawler-only content.
  // JavaScript users receive the React-rendered page in #root.
  const fallbackContent = `<noscript><main>${noscrollContent}</main></noscript>`;

  return template
    .replace(/<title>[^<]*<\/title>/, "")
    .replace(/<link rel="canonical"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="description"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="keywords"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="robots"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta property="og:[^"]*"[^>]*\/?>[\s]*/g, "")
    .replace(/<meta name="twitter:[^"]*"[^>]*\/?>[\s]*/g, "")
    .replace("</head>", `${meta}\n${jsonLd}\n</head>`)
    .replace(
      /<div id="root">[\s\S]*?(?=<!-- Google Analytics)/,
      `<div id="root"></div>${fallbackContent}\n    `,
    );
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
    { question: "How much does an EV charging franchise cost with SpiderEV in India?", answer: "Investment depends on the charger mix, electrical work, site layout and agreed operating scope. Share the city, address and available load for a site-specific model rather than relying on a generic investment band." },
    { question: "What support does SpiderEV provide to franchise partners?", answer: "Hardware, SpiderConnect access, training, commissioning, approvals support and ongoing service are confirmed in the commercial proposal for the specific site." },
    { question: "How long does it take to break even on an EV charging franchise?", answer: "Payback depends on traffic, tariff, charger utilisation, operating costs and the final project scope. Use the ROI calculator as a starting point and review every assumption with Spider Energy." },
    { question: "Do I need prior experience to run an EV charging franchise?", answer: "Prior charging experience is not required to enquire. The training and operating support included in the final package are confirmed with sales before commitment." },
  ],
  "/har-ghar": [
    { question: "What is the Har Ghar Charger initiative?", answer: "Har Ghar Charger is SpiderEV's initiative to make home EV charging accessible to every Indian household. Install a home charger, charge your own EV, and optionally earn by sharing it with neighbours through the SpiderEV app." },
    { question: "Can I earn money from my home EV charger?", answer: "Yes. Through the SpiderEV app, you can share your home charger with nearby EV owners when you're not using it and earn per-session revenue with automatic billing." },
    { question: "What home charger models are available under this initiative?", answer: "The program primarily uses Spider Mini (3.3 kW) and Spider Lite (3.3 kW) AC chargers — compact, affordable single-phase chargers that work with any standard home electrical connection." },
  ],
};

// ─── Route definitions ───────────────────────────────────────────────────────

const routes = [
  // Home
  {
    path: "/",
    title: "Spider Energy | EV Charger Manufacturer in Telangana & AP",
    description: "Spider Energy builds SpiderEV chargers in Hyderabad for Telangana, Andhra Pradesh and India. Explore AC, DC, CPMS and franchise solutions.",
    keywords: "EV charger manufacturer Telangana, EV charging station AP, electric vehicle charger India, AC DC charger Hyderabad, SpiderEV India",
    subtopics: ["Spider Energy - EV Charging from Hyderabad", "SpiderEV charging products", "AC & DC EV Chargers for Every Need - Home to Highway", "SpiderConnect CPMS & SpiderEV App", "Serving Telangana & Andhra Pradesh", "Get in touch"],
    bodyText: "Spider Energy designs and manufactures EV charging hardware in India, with headquarters at T-Hub, Raidurgam, Hyderabad. SpiderEV covers chargers, SpiderConnect CPMS and the driver app. The SpiderEV range runs from 3.3 kW home AC chargers to 240 kW ultra-rapid DC fast chargers.",
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Spider Energy",
        "url": BASE_URL,
        "telephone": "+91-9997776080",
        "email": "connect@spiderenergy.in",
        "address": { "@type": "PostalAddress", "streetAddress": "T-Hub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" },
        "geo": { "@type": "GeoCoordinates", "latitude": "17.4435", "longitude": "78.3772" },
        "image": `${BASE_URL}/spider-ev-logo.png`,
        "priceRange": "₹₹",
      },
    ],
  },

  {
    path: "/spiderev",
    title: "SpiderEV | EV Chargers, CPMS & App by Spider Energy",
    description: "SpiderEV is Spider Energy's EV charging line: BIS-ready AC & DC chargers, SpiderConnect CPMS and the SpiderEV App for Telangana, AP and India.",
    keywords: "SpiderEV, AC EV chargers, DC fast chargers, SpiderConnect CPMS, SpiderEV app, EV charging India",
    subtopics: ["SpiderEV — EV Charging Hardware, Software & Driver App", "AC EV Chargers for Homes, Workplaces & Fleets", "DC Fast Chargers for Public Networks & Depots", "SpiderConnect Charge Point Management System", "SpiderEV Driver App"],
    bodyText: "SpiderEV is Spider Energy's connected EV charging product line, not a separate company. It includes AC chargers from 3.3 kW to 80 kW, DC fast chargers from 3 kW to 240 kW, SpiderConnect software for monitoring and operating charging networks, and the SpiderEV app for station discovery, charging sessions and digital payments. Charger selection starts with the vehicle connector, daily energy requirement, parking duration and electrical capacity. Homeowners can compare Mini, Lite and Smart; workplaces can review Blaze and Strike; public and fleet sites can start with Fast and scale according to vehicle demand and dwell time. Product pages state the model-specific connector, OCPP capability, ingress protection and certifications. Installation scope is confirmed after reviewing the phase, sanctioned load, cable route, earthing and protection. Spider Energy coordinates sales and service from T-Hub, Raidurgam, Hyderabad, with primary commercial focus in Telangana and Andhra Pradesh.",
    schemas: [
      { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${BASE_URL}/spiderev#collection`, "name": "SpiderEV Charging Products and Software", "url": `${BASE_URL}/spiderev`, "isPartOf": { "@id": `${BASE_URL}/#website` }, "about": { "@id": `${BASE_URL}/#brand-spiderev` }, "mainEntity": { "@type": "ItemList", "numberOfItems": 4, "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "AC EV Chargers", "url": `${BASE_URL}/electric-vehicle-ev-ac-charger` },
        { "@type": "ListItem", "position": 2, "name": "DC Fast Chargers", "url": `${BASE_URL}/electric-vehicle-ev-dc-charger` },
        { "@type": "ListItem", "position": 3, "name": "SpiderConnect CPMS", "url": `${BASE_URL}/cpms-ev-charging-point-management-system` },
        { "@type": "ListItem", "position": 4, "name": "SpiderEV App", "url": `${BASE_URL}/ev-charging-station-app` }
      ] } },
      { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${BASE_URL}/spiderev#faq`, "mainEntity": [
        { "@type": "Question", "name": "What does the SpiderEV product line include?", "acceptedAnswer": { "@type": "Answer", "text": "SpiderEV includes AC and DC chargers, SpiderConnect CPMS, and the SpiderEV app for drivers and charging-station operators." } },
        { "@type": "Question", "name": "Is SpiderEV a different company from Spider Energy?", "acceptedAnswer": { "@type": "Answer", "text": "No. Spider Energy is the parent company, and SpiderEV is its product line for EV chargers, SpiderConnect CPMS and the SpiderEV driver app." } },
        { "@type": "Question", "name": "Where does Spider Energy operate?", "acceptedAnswer": { "@type": "Answer", "text": "Spider Energy is based at T-Hub, Raidurgam, Hyderabad, with primary service coverage across Telangana and Andhra Pradesh." } },
        { "@type": "Question", "name": "Which standards and protocols do SpiderEV chargers support?", "acceptedAnswer": { "@type": "Answer", "text": "The listed connected models use OCPP 1.6J. Connector, BIS and protection specifications vary by model and should be confirmed on the product page and quotation." } },
        { "@type": "Question", "name": "Can I open a SpiderEV charging franchise?", "acceptedAnswer": { "@type": "Answer", "text": "Spider Energy reviews franchise enquiries using the site address, available electrical load, vehicle mix, dwell time and proposed operating model." } }
      ] }
    ],
  },

  // Products
  {
    path: "/electric-vehicle-ev-ac-charger",
    title: "AC EV Chargers 3.3-80 kW | SpiderEV Telangana & AP",
    description: "SpiderEV BIS-oriented AC EV chargers from 3.3 kW to 80 kW for homes, offices and fleets in Andhra Pradesh & Telangana. OCPP 1.6J, IP67.",
    keywords: "AC EV charger, electric vehicle AC charger Hyderabad, home EV charger India, 7.4 kW charger, 22 kW charger, Type 2 EV charger, BIS certified charger, OCPP charger, SpiderEV AC",
    subtopics: ["AC EV Chargers — From 3.3 kW to 80 kW for Homes & Fleets in AP & TG", "SpiderEV AC Charger Range — 3.3 kW to 80 kW", "Home AC EV Chargers — Spider Lite, Mini & Smart", "Commercial & Fleet AC Chargers — Spider Blaze, Strike & Dash", "AC Charger Features — OCPP 1.6J, IP67, RFID, BIS Certified", "Why Choose SpiderEV AC Chargers in Telangana & Andhra Pradesh"],
    bodyText: "SpiderEV AC chargers range from 3.3 kW single-phase home chargers to 80 kW three-phase commercial units. All models feature IP67 weather protection, OCPP 1.6J connectivity, RFID authentication, and BIS certification for safe, reliable EV charging. Our AC charger lineup includes: Spider Mini (3.3 kW) — compact home charger for overnight charging; Spider Lite (3.3 kW) — affordable home charger with free installation and app monitoring; Spider Smart (7.4 kW) — Type 2 charger with dynamic load management for homes and offices; Spider Blaze (22 kW) — three-phase commercial charger for workplaces and fleet parking; Spider Strike (40 kW) — high-power three-phase charger for commercial fleet installations; Spider Dash (80 kW) — dual-gun charger for high-throughput commercial sites charging two vehicles simultaneously. All chargers are manufactured in India, BIS certified, and integrate with SpiderConnect CPMS for remote monitoring, payment processing, and analytics.",
  },
  {
    path: "/electric-vehicle-ev-dc-charger",
    title: "DC Fast EV Chargers 30-240 kW | SpiderEV",
    description: "SpiderEV DC fast chargers from entry 30 kW to 240 kW ultra-rapid for public networks and fleets in AP & Telangana. CCS2 & CHAdeMO.",
    keywords: "DC fast charger, DC EV charger Hyderabad, CCS2 charger India, CHAdeMO charger, 60 kW charger, 120 kW charger, 240 kW charger, highway EV charger, SpiderEV DC",
    subtopics: ["DC Fast EV Chargers — 30 kW to 240 kW for Public Networks in AP & TG", "SpiderEV DC Fast Charger Range — 30 kW to 240 kW", "CCS2 & CHAdeMO — Connector Compatibility for All Indian EVs", "Public Charging Network Use Cases — Highways, Malls & Depots", "Heavy Duty DC Charging — Buses, Trucks & Commercial Fleets", "Why Choose SpiderEV DC Chargers in Telangana & Andhra Pradesh"],
    bodyText: "SpiderEV DC fast chargers deliver 30 kW to 240 kW power output with CCS2 and CHAdeMO connectors. Designed for public charging networks, highways, and fleet depots, our DC chargers provide 20-80% charge in as little as 15 minutes. Our DC charger lineup includes: Spider Base (3-12 kW) — modular DC charger for 2-wheelers and light EVs with IS 17017-2-6 compliance; Spider Fast (30 kW) — rapid DC charger for public 4-wheeler charging with dual connectors; Spider Spark (60 kW) — dual-connector fast charger for commercial stations; Spider Falcon (60 kW) — high-speed CCS2 charger for public networks; Spider Ultra (120 kW) — high-power charger for highways and fleet depots; Spider Surge (180 kW) — rapid charger for high-throughput highway charging; Spider Hulk (240 kW) — India's most powerful ultra-rapid charger for heavy-duty EV applications. All DC chargers feature OCPP 1.6J connectivity, IP67 protection, and integrate with SpiderConnect CPMS for remote monitoring and revenue management.",
  },

  // AC product detail pages
  {
    path: "/products/ac/spider-mini",
    title: "Spider Mini — 3.3 kW Home AC EV Charger | SpiderEV",
    description: "Compact 3.3 kW single-phase AC EV home charger with IP67, RFID and all-weather durability. Best home EV charger in AP & Telangana.",
    keywords: "Spider Mini, 3.3 kW EV charger, home EV charger India, single phase EV charger, compact AC charger, IP67 EV charger, RFID charger, apartment EV charger",
    subtopics: ["Spider Mini — Compact 3.3 kW Single-Phase AC Home EV Charger", "Spider Mini Key Features — 3.3 kW Single-Phase AC Charger", "Who Should Choose the Spider Mini? — Apartments, Homes & Light EVs", "Technical Specifications — IP67, RFID, OCPP 1.6J", "Frequently Asked Questions", "Installation Guide — Spider Mini in Andhra Pradesh & Telangana"],
    bodyText: "The Spider Mini is SpiderEV's most compact home EV charger, purpose-built for Indian apartments and houses running on standard single-phase electrical supply. At 3.3 kW, it plugs into your existing home wiring — no panel upgrades, no three-phase conversion, no civil work. You come home, plug in, and wake up to a full charge. That's the use case it's designed around: overnight top-ups where speed isn't the priority but reliability and simplicity are. For apartment dwellers this matters because a compact wall-mounted unit takes almost no space in a parking bay. The IP67 rating means it handles monsoon exposure, basement humidity, and summer heat without degradation — important when the charger sits in an open parking lot year-round rather than a climate-controlled garage. RFID authentication prevents unauthorised use in shared parking environments, and OCPP 1.6J connectivity lets you monitor sessions remotely via the SpiderEV app without physically checking the charger. The Spider Mini charges all passenger EVs sold in India — Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, BYD Atto 3, Mahindra XUV400, Citroen eC3, and others. A typical 40 kWh battery charges fully in 10-12 hours from empty, which is well within a standard overnight window. For most daily commuters driving 40-60 km, you only need 2-4 hours of nightly charging to replace the day's usage. Installation takes under 2 hours with no structural modifications. SpiderEV's installation team handles site assessment, wiring from your distribution board, and commissioning — the charger is ready to use the same day. Technical Specifications: Power Output 3.3 kW, Connector IEC 60309 (Heavy Duty), Phase single-phase, Protocol OCPP 1.6J, Ingress Protection IP67, Access Control RFID authentication, Monitoring SpiderEV app with remote session tracking, Certification BIS certified, Installation same-day professional setup included.",
    schemas: [
      buildProductSchema({ name: "Spider Mini — 3.3 kW AC Home EV Charger", description: "Compact single-phase 3.3 kW AC EV home charger with IP67, RFID and all-weather durability", power: "3.3 kW", connector: "IEC 60309 (Heavy Duty)", category: "ac", productId: "spider-mini", chargerType: "AC Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "Can I install the Spider Mini in my apartment parking space?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Spider Mini is wall-mounted, compact, and runs on standard single-phase supply — the same connection your apartment already has. No three-phase upgrade or structural modification is needed. IP67 protection means it handles open parking exposure year-round." } },
        { "@type": "Question", "name": "How long does the Spider Mini take to fully charge my EV?", "acceptedAnswer": { "@type": "Answer", "text": "At 3.3 kW, a full charge from empty takes approximately 10-12 hours for a typical 40 kWh battery. For daily commuters driving 40-60 km, you only need 2-4 hours of nightly charging to replace the day's usage — well within an overnight window." } },
        { "@type": "Question", "name": "Is the Spider Mini weatherproof for outdoor installation?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. IP67 rated means it is fully protected against dust ingress and can withstand temporary water immersion. It handles monsoon rain, basement humidity, and Indian summer temperatures without performance degradation." } },
        { "@type": "Question", "name": "Which electric vehicles are compatible with the Spider Mini?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Mini charges all passenger EVs sold in India including Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, BYD Atto 3, Mahindra XUV400, Citroen eC3, and any vehicle with a standard AC charging port." } },
      ] },
    ],
  },
  {
    path: "/products/ac/spider-lite",
    title: "Spider Lite — 3.3 kW AC Home EV Charger | SpiderEV",
    description: "Smart 3.3 kW single-phase AC EV charger with free installation, app monitoring and RFID. Ideal for home EV charging across India.",
    keywords: "Spider Lite, 3.3 kW charger, affordable EV charger, home charger free installation, smart EV charger, app controlled charger, cheapest home EV charger India",
    subtopics: ["Spider Lite — Most Affordable 3.3 kW Home AC EV Charger with Free Installation", "Spider Lite Key Features — 3.3 kW AC Charger with Free Installation", "Why Spider Lite Is India's Most Affordable Home EV Charger", "App Monitoring & RFID Access — Smart Features at an Affordable Price", "Frequently Asked Questions", "Installation Process — Free Setup in Andhra Pradesh & Telangana"],
    bodyText: "The Spider Lite exists to answer the most common question new EV owners ask: what's the cheapest way to charge at home without giving up smart features? At 3.3 kW on single-phase supply, it does the same overnight charging job as the Spider Mini — but bundles free professional installation, app-based monitoring, and scheduled charging into one package at the lowest total cost of ownership in the Indian market. Free installation isn't a marketing gimmick here — it means SpiderEV's team handles the full site visit, wiring from your distribution board to the parking bay, mounting, and commissioning at no additional charge. For a first-time EV owner who doesn't want to coordinate electricians separately, that removes the biggest friction point in getting a home charger operational. The SpiderEV app integration is where the Lite differentiates from basic dumb chargers at the same price point. You get real-time charging status, session history with energy consumed per charge, and most importantly — scheduled charging. If your DISCOM offers time-of-day tariffs (increasingly common in AP and Telangana), you can set the Lite to start charging at midnight when rates drop, saving meaningfully on your monthly electricity bill without remembering to plug in at a specific time. RFID authentication adds security in shared residential settings — apartments where multiple cars park near each other. Only your registered RFID card or phone app can activate the charger, preventing unauthorised use from your electrical connection. Compatible with every passenger EV sold in India. Technical Specifications: Power Output 3.3 kW, Connector IEC 60309 (Heavy Duty), Phase single-phase, Protocol OCPP 1.6J, Ingress Protection IP67, Access Control RFID + SpiderEV app, Smart Features scheduled charging with time-of-day optimisation and remote start/stop, Installation free professional installation included, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Lite — 3.3 kW AC Home EV Charger", description: "Smart 3.3 kW single-phase AC EV charger with free installation, app monitoring and RFID", power: "3.3 kW", connector: "IEC 60309 (Heavy Duty)", category: "ac", productId: "spider-lite", chargerType: "AC Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "What does 'free installation' include with the Spider Lite?", "acceptedAnswer": { "@type": "Answer", "text": "Free installation covers the complete site visit, wiring from your distribution board to the charger location, wall mounting, and commissioning. SpiderEV's certified installation team handles everything — no need to hire an electrician separately." } },
        { "@type": "Question", "name": "What is the difference between Spider Lite and Spider Mini?", "acceptedAnswer": { "@type": "Answer", "text": "Both are 3.3 kW single-phase home chargers. The Spider Lite bundles free professional installation, scheduled charging via the SpiderEV app, and energy consumption analytics — making it the better value for first-time EV owners who want a complete turnkey solution at the lowest total cost." } },
        { "@type": "Question", "name": "Can I schedule the Spider Lite to charge only during off-peak hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The SpiderEV app lets you set charging schedules — useful if your DISCOM offers time-of-day tariffs with cheaper night-rate electricity. The charger starts automatically at your scheduled time without manual intervention." } },
        { "@type": "Question", "name": "Is the Spider Lite compatible with all EVs available in India?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Spider Lite works with every passenger EV sold in India including Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, BYD Atto 3, Mahindra XUV400, and all other models with a standard AC charging inlet." } },
      ] },
    ],
  },
  {
    path: "/products/ac/spider-smart",
    title: "Spider Smart — 7.4 kW Type 2 AC EV Charger | SpiderEV",
    description: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management. Perfect for home and commercial EV charging in Andhra Pradesh & Telangana.",
    keywords: "7.4 kW Type 2 AC EV charger India, smart AC charger AP, Type 2 home charger Telangana, dynamic load EV charger India, Spider Smart",
    subtopics: ["Spider Smart — 7.4 kW Type 2 AC EV Charger", "Spider Smart Key Features — 7.4 kW Type 2 Smart AC Charger", "Dynamic Load Management — Why It Matters for Home EV Charging", "App Control & Remote Monitoring — Smart Charging from Your Phone", "Frequently Asked Questions", "Home vs Commercial Use — Is Spider Smart Right for You?"],
    bodyText: "Spider Smart is for anyone wanting faster than basic home charging but not wanting to upgrade to a three-phase commercial system. It will charge at 7.4 kW with a single-phase Type 2 connector, some 2-3x faster than a regular 3.3 kW home unit – the difference between a full overnight top-up and needing 10+ hours to get the same charge. The dynamic load management is what makes this more than a basic AC charger. It watches the total electrical draw of your home in real time, and when other high-draw appliances come on, it automatically reduces the charging current instead of tripping your main breaker. For Indian homes that run ACs and water heaters on the same panel, that's not a convenience feature – it's what makes 7.4 kW charging possible on typical residential wiring without an electrical upgrade. The companion app provides remote start/stop control, charging session history and scheduling – useful for taking advantage of any time-of-day electricity tariff your DISCOM might offer, since you can set the charger to start once cheaper night-rate power kicks in rather than charging manually at peak rates. Spider Smart works great in smaller commercial environments too — offices with a few employee EVs, to name one — where the RFID authentication enables you to track charger usage without a full commercial CPMS deployment. Technical Specifications: Power Output 7.4 kW, Connector Type 2, Phase single-phase, Protocol OCPP 1.6J, Ingress Protection IP67, Access Control RFID + app authentication, Smart Features dynamic load management with remote app monitoring and control, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Smart — 7.4 kW Type 2 AC EV Charger", description: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management", power: "7.4 kW", connector: "Type 2 (IEC 62196)", category: "ac", productId: "spider-smart", chargerType: "AC Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "How much faster does the Spider Smart charge compared to a basic 3.3 kW charger?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Smart charges at 7.4kW which is around 2-3 times faster than a standard 3.3kW home charger, so will greatly reduce a standard overnight charge time depending on your EV's battery size." } },
        { "@type": "Question", "name": "Do I need an electrical upgrade to install a Spider Smart charger at home?", "acceptedAnswer": { "@type": "Answer", "text": "Most existing single-phase supply homes can handle 7.4 kW charging. Dynamic load management also protects your panel by automatically reducing the charging current when other appliances are using power. Check that the installation site is compatible." } },
        { "@type": "Question", "name": "Can I schedule charging to run during off-peak electricity hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The SpiderEV app also allows you to schedule charging sessions, which is useful if your DISCOM has a time-of-day tariff with cheaper night-rate electricity." } },
        { "@type": "Question", "name": "Is the Spider Smart suitable for small offices, not just homes?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. RFID authentication allows small offices or shared parking areas to track usage per employee without deploying a full commercial charge point management solution." } },
      ] },
    ],
  },
  {
    path: "/products/ac/spider-blaze",
    title: "Spider Blaze — 22 kW Three-Phase AC EV Charger | SpiderEV",
    description: "22 kW three-phase AC EV charger for fleet and commercial EV charging installations across Andhra Pradesh and Telangana. OCPP 1.6J, IP67 rated.",
    keywords: "Spider Blaze, 22 kW EV charger, three phase charger, commercial EV charger, fleet charger, workplace charger, OCPP charger, Type 2 charger India",
    subtopics: ["Spider Blaze — 22 kW Three-Phase AC EV Charger", "Spider Blaze Key Features — 22 kW Three-Phase AC Charger", "Fleet & Commercial Charging — Best Use Cases for Spider Blaze", "Technical Specifications — OCPP 1.6J, IP67, Three-Phase Power", "Frequently Asked Questions", "Spider Blaze vs Spider Strike — Which Commercial AC Charger Is Right for You?"],
    bodyText: "The Spider Blaze sits at the transition point between residential and commercial EV charging. At 22 kW on three-phase power, it charges 6-7 times faster than a home charger — a full battery in 2-3 hours rather than overnight. That speed makes it viable for environments where vehicles park for a limited window: office lots during working hours, hotel parking during a guest's stay, or fleet depots cycling vehicles through charging bays. For workplace charging, the economics are straightforward. An employee arrives at 9 AM, plugs in, and has a full charge by lunch without occupying the charger all day. Multiple vehicles can rotate through a single Spider Blaze across a workday, and dynamic load balancing across multiple units means you can install several chargers without overloading the building's electrical capacity — the system redistributes current based on real-time demand. Fleet operators get the most value from 22 kW AC because many fleet vehicles — delivery vans, corporate sedans, utility vehicles — have long dwell times at base. Rather than investing in expensive DC infrastructure for a fleet that returns to depot every evening, Spider Blaze charges vehicles overnight at a fraction of the per-kWh infrastructure cost while still being fast enough to handle mid-day top-ups if a vehicle returns unexpectedly. OCPP 1.6J connectivity integrates every Spider Blaze into your SpiderConnect CPMS dashboard — track energy consumption per charger, per vehicle, per employee. Set access policies via RFID, enforce charging schedules, and generate billing reports for cost allocation across departments or tenants. Technical Specifications: Power Output 22 kW, Connector Type 2 (IEC 62196), Phase three-phase, Protocol OCPP 1.6J, Ingress Protection IP67, Access Control RFID + app-based authentication, Smart Features dynamic load balancing across multiple units with integrated energy metering, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Blaze — 22 kW Three-Phase AC EV Charger", description: "22 kW three-phase AC EV charger for fleet and commercial EV charging installations", power: "22 kW", connector: "Type 2 (IEC 62196)", category: "ac", productId: "spider-blaze", chargerType: "AC Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "Does the Spider Blaze require three-phase power supply?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Spider Blaze operates on three-phase power to deliver its full 22 kW output. Most commercial buildings, offices, and industrial premises already have three-phase supply. SpiderEV's installation team will assess your site's electrical capacity before installation." } },
        { "@type": "Question", "name": "How many vehicles can one Spider Blaze handle per day?", "acceptedAnswer": { "@type": "Answer", "text": "With a 2-3 hour charge time per vehicle, a single Spider Blaze can fully charge 4-5 vehicles across a standard 10-hour workday. Dynamic load balancing allows multiple units to share available power intelligently if you install more than one." } },
        { "@type": "Question", "name": "Is the Spider Blaze suitable for workplace employee charging?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — it's one of the most common use cases. Employees plug in when they arrive, get a full charge by midday, and the charger becomes available for the next vehicle. RFID access and CPMS integration let you track usage per employee and allocate costs." } },
        { "@type": "Question", "name": "What is the difference between Spider Blaze 22 kW and Spider Strike 40 kW?", "acceptedAnswer": { "@type": "Answer", "text": "Spider Blaze delivers 22 kW for standard commercial environments. Spider Strike doubles the power to 40 kW for high-utilisation fleets needing faster turnaround — taxi depots, logistics companies, and corporate campuses with intensive vehicle rotation." } },
      ] },
    ],
  },
  {
    path: "/products/ac/spider-strike",
    title: "Spider Strike — 40 kW Three-Phase AC EV Charger | SpiderEV",
    description: "40 kW high-power three-phase AC EV charger for commercial fleet charging. BIS certified, OCPP 1.6J, IP67 protection for all-weather operation.",
    keywords: "Spider Strike, 40 kW EV charger, high power AC charger, fleet charging, commercial EV infrastructure, three phase charger India, taxi fleet charger",
    subtopics: ["Spider Strike — 40 kW High-Power Three-Phase AC EV Charger", "Spider Strike Key Features — 40 kW Three-Phase AC EV Charger", "Fleet Charging Use Case — Commercial & Industrial Applications", "Technical Specifications — BIS, OCPP 1.6J, IP67, Three-Phase Power", "Frequently Asked Questions", "Spider Strike vs Spider Blaze — Which AC Charger Is Right for You?"],
    bodyText: "The Spider Strike operates in environments where vehicles can't sit on a charger for hours. At 40 kW three-phase AC, it delivers nearly double the power of a standard 22 kW commercial charger — meaning a full charge in 60-90 minutes rather than 2-3 hours. That difference matters when you're cycling 15-20 vehicles through charging bays across a shift. Taxi and ride-hailing fleets are the primary use case. An electric taxi running Ola/Uber in Hyderabad does 200-250 km per shift. The driver returns to depot, plugs into a Spider Strike, and has a full battery in about an hour — short enough to grab a meal and get back on the road without losing significant earning time. At lower AC power levels, that same charge takes the better part of a shift. Logistics companies with last-mile delivery fleets get similar value. Electric delivery vans returning mid-day for a second run need rapid turnaround, but don't justify the infrastructure cost of DC fast charging when the vehicles are on-site for 60-90 minutes anyway between runs. The Spider Strike fills that gap — fast enough for commercial turnaround, affordable enough to deploy across multiple bays. For corporate campuses running employee shuttle fleets or company pool cars, the Strike handles the morning-to-afternoon recharge cycle that keeps vehicles available throughout working hours. OCPP 1.6J integration with SpiderConnect CPMS gives fleet managers visibility into per-vehicle charging history, bay utilisation rates, and energy costs — data that feeds directly into fleet operation cost modelling. Technical Specifications: Power Output 40 kW, Connector Type 2 (IEC 62196), Phase three-phase, Protocol OCPP 1.6J, Ingress Protection IP67, Access Control RFID + app authentication, Smart Features integrated load balancing with fleet management API and per-vehicle tracking, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Strike — 40 kW Three-Phase AC EV Charger", description: "40 kW high-power three-phase AC EV charger for commercial fleet charging", power: "40 kW", connector: "Type 2 (IEC 62196)", category: "ac", productId: "spider-strike", chargerType: "AC Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "How fast does the Spider Strike charge a typical fleet vehicle?", "acceptedAnswer": { "@type": "Answer", "text": "At 40 kW, the Spider Strike delivers a full charge in approximately 60-90 minutes for most passenger EVs and fleet vehicles — nearly twice as fast as a standard 22 kW commercial charger. This enables multiple vehicles to rotate through charging bays across a single shift." } },
        { "@type": "Question", "name": "Is the Spider Strike suitable for taxi and ride-hailing fleets?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — it's designed for exactly this use case. A taxi doing 200-250 km per shift can fully recharge in about an hour, short enough for a driver break without losing significant earning time. The turnaround speed makes it viable for high-utilisation commercial fleets." } },
        { "@type": "Question", "name": "Why choose Spider Strike over a DC fast charger for fleet operations?", "acceptedAnswer": { "@type": "Answer", "text": "When vehicles are on-site for 60-90 minutes between runs — which is common for delivery fleets and taxi shift changes — 40 kW AC provides adequate charging speed at significantly lower infrastructure and per-kWh costs compared to DC fast charging. DC makes sense only when turnaround must be under 30 minutes." } },
        { "@type": "Question", "name": "Can I manage multiple Spider Strike chargers from a single dashboard?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All Spider Strike units connect via OCPP 1.6J to SpiderConnect CPMS, providing a single dashboard for bay utilisation, per-vehicle charging history, energy costs, and scheduling — essential data for fleet operation cost management." } },
      ] },
    ],
  },
  {
    path: "/products/ac/spider-dash",
    title: "Spider Dash — 80 kW Dual-Gun AC EV Charger | SpiderEV",
    description: "80 kW dual-gun three-phase AC EV charger for high-throughput commercial sites. Simultaneously charge two vehicles at 55 A per gun.",
    keywords: "Spider Dash, 80 kW AC charger, dual gun charger, high throughput charger, commercial EV station, simultaneous charging, mall EV charger",
    subtopics: ["Spider Dash — 80 kW Dual-Gun AC EV Charger for High-Volume Sites", "Spider Dash Key Features — 80 kW Dual-Gun Three-Phase AC Charger", "Dual-Gun Charging — Charge Two EVs Simultaneously", "Ideal Sites — Malls, Corporate Parks & High-Throughput Locations", "Frequently Asked Questions", "Technical Specifications — OCPP 1.6J, IP67, BIS Certified"],
    bodyText: "The Spider Dash is the highest-output AC charger in SpiderEV's range — 80 kW total with dual guns, each delivering 55 A simultaneously. Where other AC chargers handle one vehicle at a time, the Dash processes two in parallel. For high-traffic commercial locations, that difference directly impacts revenue and customer throughput. Shopping malls are the clearest deployment case. A visitor parks for 2-3 hours while shopping. With 40 kW delivered per gun, both vehicles get a substantial charge — 150-200 km of range added — in that dwell window. The dual-gun design means the charger earns from two vehicles simultaneously rather than one vehicle occupying the slot while another driver circles looking for an available point. Intelligent load distribution between guns is automatic. When only one vehicle is connected, it gets the full 80 kW. When both plug in, power splits dynamically based on each vehicle's acceptance rate and state of charge — maximising energy delivered across both sessions rather than applying a fixed 50/50 split that wastes capacity when one vehicle is nearly full. For property managers and commercial real estate operators, the Spider Dash's CPMS integration provides the revenue infrastructure to monetise charging. Integrated payment via RFID, UPI, and the SpiderEV app means you generate per-session revenue from day one. Energy analytics per charger feed into cost allocation for tenants, and real-time availability shows on the SpiderEV app to attract EV-driving visitors to your location over competitors without charging. Corporate parks deploying employee charging benefit from the same dual-gun approach — double the vehicles served per installed unit reduces the total number of chargers needed to cover parking demand. Technical Specifications: Power Output 80 kW total (dual-gun at 55 A each), Connector Type 2 Dual-Gun (IEC 62196), Phase three-phase, Protocol OCPP 1.6J, Ingress Protection IP67, Access Control RFID + UPI + SpiderEV app, Smart Features intelligent power distribution between guns with per-session energy analytics, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Dash — 80 kW Dual-Gun AC EV Charger", description: "80 kW dual-gun three-phase AC EV charger for high-throughput commercial sites", power: "80 kW", connector: "Type 2 Dual-Gun", category: "ac", productId: "spider-dash", chargerType: "AC Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "Can the Spider Dash charge two vehicles at the same time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Spider Dash has dual guns, each delivering 55 A simultaneously. Two vehicles can charge in parallel, with intelligent power distribution automatically optimising output based on each vehicle's state of charge and acceptance rate." } },
        { "@type": "Question", "name": "What happens if only one vehicle is plugged in?", "acceptedAnswer": { "@type": "Answer", "text": "When only one vehicle is connected, it receives the full 80 kW output. Power splits dynamically only when both guns are active — maximising energy delivered rather than applying a fixed split that would waste capacity." } },
        { "@type": "Question", "name": "Is the Spider Dash suitable for shopping malls and commercial properties?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — malls are an ideal deployment. Visitors park for 2-3 hours while shopping, getting 150-200 km of range per session. Integrated payment via RFID, UPI, and app enables the property to earn revenue from every session from day one." } },
        { "@type": "Question", "name": "How does the Spider Dash handle payment and billing?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Dash supports RFID cards, UPI payments, and the SpiderEV mobile app. SpiderConnect CPMS handles automated billing, per-session energy metering, and revenue reporting — making it a turnkey commercial charging solution." } },
      ] },
    ],
  },

  // DC product detail pages
  {
    path: "/products/dc/spider-base",
    title: "Spider Base 3–12 kW DC Charger for 2-Wheelers | SpiderEV",
    description: "Modular 3–12 kW DC EV charger with IS 17017-2-6 for 2-wheelers and light EVs. BIS certified, OCPP 1.6J, IP67 rated in AP & TG.",
    keywords: "Spider Base, 3 kW DC charger, 2 wheeler EV charger, electric scooter charger, light EV charger India, IS 17017, BIS DC charger, Ola Ather charger",
    subtopics: ["Spider Base — 3–12 kW DC EV Charger for Two-Wheelers & Light EVs", "Spider Base Key Features — 3 to 12 kW Modular DC EV Charger", "IS 17017-2-6 Connector — India's Standard for 2-Wheeler Charging", "Ideal Use Cases — Two-Wheeler Fleets, Dealerships & Public Stations", "Frequently Asked Questions", "Technical Specifications — BIS, OCPP 1.6J, IP67, Modular Design"],
    bodyText: "India's EV revolution isn't being led by cars — it's being led by two-wheelers. Over 80% of EV registrations are electric scooters and motorcycles, yet most charging infrastructure focuses on 4-wheeler CCS2/CHAdeMO standards. The Spider Base addresses this gap directly: a modular 3-12 kW DC charger built specifically for the 2-wheeler and light EV market with India's IS 17017-2-6 connector standard. The modular design is the key differentiator. You deploy at 3 kW for a low-traffic residential location, scale to 6 kW as utilisation grows, or go straight to 12 kW for a high-traffic metro station forecourt — all on the same hardware platform. No rip-and-replace, just a power module upgrade. This protects the initial investment while allowing the unit to grow with demand. For electric scooter owners — Ola S1 Pro, Ather 450X, TVS iQube, Bajaj Chetak, Vida V1, and others — the Spider Base delivers meaningful fast charging. A typical 3 kWh scooter battery charges from 20% to 80% in approximately 15-25 minutes at 6 kW, compared to 4-5 hours on the home portable charger that ships with the vehicle. That speed makes the Spider Base viable for on-the-go top-ups near metro stations, markets, office complexes, and residential colonies. E-rickshaw and delivery fleet operators benefit from deploying Spider Base units at staging areas where vehicles queue between trips. Rather than drivers losing 3-4 hours per charge cycle on slow chargers, they can top up during natural break periods and maximise earning hours. Integrated billing via SpiderConnect handles per-session metering and payment collection — making the Spider Base a revenue-generating asset from deployment day. Technical Specifications: Power Output 3-12 kW (modular scaling), Connector GB/T (IS 17017-2-6 compliant), Protocol OCPP 1.6J, Ingress Protection IP67, Access Control RFID + app payment, Design modular power scaling without hardware replacement, Billing integrated per-session metering via SpiderConnect CPMS, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Base — 3-12 kW DC Charger for 2-Wheelers", description: "Modular 3-12 kW DC EV charger with IS 17017-2-6 for 2-wheelers and light EVs", power: "3-12 kW", connector: "GB/T", category: "dc", productId: "spider-base", chargerType: "DC Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "Which electric scooters are compatible with the Spider Base?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Base supports all 2-wheelers using India's IS 17017-2-6 DC charging standard, including Ola S1 Pro, Ather 450X, TVS iQube, Bajaj Chetak, Hero Vida V1, and other electric scooters and motorcycles with DC fast-charge capability." } },
        { "@type": "Question", "name": "How fast does the Spider Base charge an electric scooter?", "acceptedAnswer": { "@type": "Answer", "text": "At 6 kW, a typical 3 kWh electric scooter battery charges from 20% to 80% in approximately 15-25 minutes — significantly faster than the 4-5 hours needed on the portable home charger that ships with most vehicles." } },
        { "@type": "Question", "name": "What does 'modular 3-12 kW' mean?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Base can be deployed at 3 kW and upgraded to 6 kW or 12 kW later by adding power modules — no hardware replacement needed. This lets you start with lower investment and scale as charging demand at your location grows." } },
        { "@type": "Question", "name": "Is the Spider Base suitable for e-rickshaw fleet charging?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. E-rickshaw and delivery fleet operators deploy Spider Base units at staging areas. Vehicles top up during natural break periods between trips, reducing downtime from 3-4 hours per slow charge cycle to quick 20-30 minute sessions." } },
      ] },
    ],
  },
  {
    path: "/products/dc/spider-fast",
    title: "Spider Fast — 30 kW DC Fast EV Charger India | SpiderEV",
    description: "30 kW rapid DC fast EV charger with CCS2 and CHAdeMO connectors for public 4-wheeler charging in Andhra Pradesh and Telangana.",
    keywords: "Spider Fast, 30 kW DC charger, CCS2 charger, CHAdeMO charger India, public EV charger, fast charger AP Telangana, entry level DC charger",
    subtopics: ["Spider Fast — 30 kW DC Fast EV Charger", "Spider Fast Technical Specifications — 30 kW DC Fast Charger", "CCS2 & CHAdeMO — Charging All 4-Wheeler EVs in India", "Why Spider Fast Is the Right Entry-Level DC Charger for India", "Frequently Asked Questions", "Public Charging Use Case — Malls, Offices & Neighbourhood Hubs"],
    bodyText: "The Spider Fast is where DC fast charging becomes accessible for small and medium businesses. At 30 kW with dual CCS2 and CHAdeMO connectors, it gives any fuel station, retail parking lot, or neighbourhood commercial hub the ability to offer meaningful DC fast charging at a fraction of the infrastructure cost of higher-power units. A 40 kWh EV battery goes from 20% to 80% in approximately 45-60 minutes — that aligns perfectly with the dwell time at a restaurant, grocery store, or bank branch. The customer gets a usable charge while completing their errand, and the business earns charging revenue while increasing dwell time and footfall from EV drivers actively seeking charging-enabled locations on their route. From an infrastructure perspective, 30 kW is the sweet spot for locations that don't have — or don't want to invest in — heavy-duty electrical upgrades. The Spider Fast can often deploy on existing commercial electrical supply without transformer upgrades, keeping total project cost manageable for franchise operators and small business owners entering the EV charging market for the first time. Dual connectors ensure every 4-wheeler EV on Indian roads can charge here. CCS2 covers Tata, MG, Hyundai, BYD, Mercedes, BMW, and most new entrants. CHAdeMO serves Nissan Leaf and older imports. One unit, universal compatibility — no customer turned away because of connector mismatch. OCPP 1.6J connectivity and SpiderConnect integration provide the commercial backend: dynamic pricing, payment collection via RFID/UPI/app, real-time charger availability published to the SpiderEV app and Google Maps, remote diagnostics, and revenue reporting. Technical Specifications: Power Output 30 kW, Connectors CCS2 + CHAdeMO (dual), Charging Speed 20-80% in 45-60 min for typical 40 kWh EV, Protocol OCPP 1.6J, Ingress Protection IP67, Payment RFID + UPI + SpiderEV app, Availability published to SpiderEV app and Google Maps, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Fast — 30 kW DC Fast EV Charger", description: "30 kW rapid DC fast EV charger with CCS2 and CHAdeMO connectors for public 4-wheeler charging", power: "30 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-fast", chargerType: "DC Fast Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "How long does the Spider Fast take to charge a typical EV?", "acceptedAnswer": { "@type": "Answer", "text": "At 30 kW, the Spider Fast charges a typical 40 kWh EV battery from 20% to 80% in approximately 45-60 minutes. This aligns with common dwell times at restaurants, retail locations, and commercial hubs." } },
        { "@type": "Question", "name": "Does the Spider Fast need a transformer upgrade to install?", "acceptedAnswer": { "@type": "Answer", "text": "In many cases, no. At 30 kW, the Spider Fast can often deploy on existing commercial electrical supply without requiring a dedicated transformer upgrade — making it the most accessible DC fast charger for small and medium businesses entering the EV charging market." } },
        { "@type": "Question", "name": "Which EVs can charge on the Spider Fast?", "acceptedAnswer": { "@type": "Answer", "text": "The dual CCS2 and CHAdeMO connectors cover every 4-wheeler EV on Indian roads — Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, BYD Atto 3, Nissan Leaf, Mercedes EQS, BMW iX, and all other CCS2/CHAdeMO compatible vehicles." } },
        { "@type": "Question", "name": "Can I earn revenue from the Spider Fast as a business owner?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. SpiderConnect CPMS handles dynamic pricing, automated payment collection via RFID/UPI/app, and revenue reporting. Your charger's real-time availability is also published to the SpiderEV app and Google Maps, driving EV drivers to your location." } },
      ] },
    ],
  },
  {
    path: "/products/dc/spider-spark",
    title: "Spider Spark — 60 kW DC Fast EV Charger | SpiderEV",
    description: "60 kW DC fast EV charger with CCS2 and CHAdeMO connectors for public and commercial charging stations in Andhra Pradesh & Telangana.",
    keywords: "Spider Spark, 60 kW DC charger, dual connector charger, commercial EV charger, public charging station, fast charger India, CCS2 CHAdeMO charger",
    subtopics: ["Spider Spark — 60 kW Dual-Connector DC Fast EV Charger", "Spider Spark Key Features — 60 kW DC Fast Charger with Dual Connectors", "Why Dual Connectors Matter — CCS2 + CHAdeMO for All EVs", "Public & Commercial Use Cases for Spider Spark", "Frequently Asked Questions", "Technical Specifications — OCPP 1.6J, IP67, BIS Certified"],
    bodyText: "The Spider Spark is the workhorse of public EV charging networks — 60 kW with dual CCS2 and CHAdeMO connectors, delivering 20-80% charge in 25-35 minutes for a typical EV. That speed sits in the practical sweet spot: fast enough that drivers are willing to stop specifically to charge, short enough that they don't need to plan their day around the charging stop. For charging network operators, 60 kW dual-connector is the most versatile deployment unit. CCS2 handles the vast majority of new EVs (Tata, MG, Hyundai, BYD, Mercedes, BMW), while CHAdeMO ensures you don't turn away Nissan Leaf owners or older imports. One unit serves the entire Indian EV market without connector limitations — maximising utilisation rate and revenue per charger. Intelligent power sharing between connectors means both ports can charge simultaneously when two vehicles are present, with power distributed based on each vehicle's acceptance rate and charge state. When a single vehicle plugs in, it gets the full 60 kW. This dynamic allocation ensures no wasted capacity regardless of how many vehicles are connected. Commercial deployment sites include fuel station forecourts adding EV charging, standalone charging hubs along urban arterial roads, malls and retail centres where 25-35 minute charge times align with shopping visits, and fleet operators needing mid-route top-up capability for their vehicles. The business case is straightforward: at typical utilisation rates of 6-8 sessions per day, the Spider Spark generates meaningful monthly revenue while providing a service EV drivers actively seek via charging apps and maps. OCPP 1.6J integration with SpiderConnect provides the full commercial stack — dynamic pricing, multi-payment acceptance, real-time availability broadcasting, remote diagnostics, and automated revenue reporting. Technical Specifications: Power Output 60 kW, Connectors CCS2 + CHAdeMO (dual with power sharing), Charging Speed 20-80% in 25-35 min for typical 40 kWh EV, Protocol OCPP 1.6J, Ingress Protection IP67, Payment RFID + UPI + app with dynamic pricing, Power Sharing intelligent distribution between both connectors, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Spark — 60 kW DC Fast EV Charger", description: "60 kW DC fast EV charger with CCS2 and CHAdeMO connectors for public and commercial charging stations", power: "60 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-spark", chargerType: "DC Fast Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "Can the Spider Spark charge two vehicles at the same time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Both CCS2 and CHAdeMO connectors can operate simultaneously with intelligent power sharing. When two vehicles are connected, power is distributed dynamically based on each vehicle's acceptance rate. When only one vehicle is plugged in, it receives the full 60 kW." } },
        { "@type": "Question", "name": "How fast does the Spider Spark charge a Tata Nexon EV?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Spark charges a Tata Nexon EV (40.5 kWh battery) from 20% to 80% in approximately 25-35 minutes at full 60 kW output — fast enough for a quick stop without needing to plan your day around the charge." } },
        { "@type": "Question", "name": "Is 60 kW enough for a public charging station business?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — 60 kW is the most popular power tier for urban public charging. At 6-8 sessions per day with 25-35 minute charges, the Spider Spark generates meaningful revenue while keeping charge times short enough to attract drivers who need a quick top-up." } },
        { "@type": "Question", "name": "What payment methods does the Spider Spark accept?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Spark supports RFID cards, UPI payments, and the SpiderEV mobile app. SpiderConnect CPMS enables dynamic pricing, automated billing, and revenue reporting — providing a complete commercial charging solution." } },
      ] },
    ],
  },
  {
    path: "/products/dc/spider-falcon",
    title: "Spider Falcon — 60 kW CCS2 DC Fast EV Charger | SpiderEV",
    description: "60 kW high-speed CCS2 DC fast EV charger for public charging networks and commercial hubs. IP67 rated, OCPP 1.6J compliant.",
    keywords: "Spider Falcon, 60 kW CCS2 charger, dedicated CCS2 charger, public network charger, high speed EV charger, commercial charger India, single connector DC charger",
    subtopics: ["Spider Falcon — 60 kW CCS2 DC Fast EV Charger", "Spider Falcon Technical Specifications — 60 kW CCS2 DC Fast Charger", "CCS2 Connector — Compatible with All Major 4-Wheeler EVs in India", "Best Use Cases — Public Networks, Malls & Commercial EV Hubs", "Frequently Asked Questions", "IP67 & OCPP 1.6J — Why Spider Falcon Is Built for Indian Conditions"],
    bodyText: "The Spider Falcon takes a different approach from the dual-connector Spider Spark: a single CCS2 connector delivering the full 60 kW to one vehicle with zero power sharing. The reasoning is simple — CCS2 is now the dominant standard for 4-wheeler EVs in India. Every new EV launched by Tata, MG, Hyundai, BYD, Mercedes, BMW, Kia, and Volvo uses CCS2. If your location serves primarily new vehicles and you want maximum charging speed per session, a dedicated CCS2 charger eliminates the engineering compromise of splitting power between two connector types. Without the power-sharing overhead of a dual-connector system, the Falcon delivers consistent 60 kW to every vehicle that plugs in, regardless of whether the adjacent unit is occupied. For multi-charger deployments — a row of 4-6 units at a public hub — this means predictable session times and consistent customer experience. Every driver gets the same 25-35 minute charge, every time. Network operators building out urban charging corridors deploy the Spider Falcon in clusters. The lower unit cost compared to dual-connector models means you can install more units for the same budget — and more units means shorter queues, higher customer satisfaction, and better utilisation curves across the day. For locations that still need CHAdeMO coverage, pair one Spider Spark (dual-connector) with multiple Spider Falcons — the Spark handles the small percentage of CHAdeMO vehicles while the Falcons provide maximum CCS2 throughput. From the operator perspective, the Falcon integrates identically to all SpiderEV DC chargers: OCPP 1.6J to SpiderConnect, dynamic pricing, multi-payment acceptance, real-time availability on mapping apps, and remote diagnostics. The single-connector simplicity also means fewer mechanical components and lower long-term maintenance. Technical Specifications: Power Output 60 kW (dedicated single connector), Connector CCS2, Charging Speed 20-80% in 25-35 min for typical 40 kWh EV, Protocol OCPP 1.6J, Ingress Protection IP67, Payment RFID + UPI + app, Design single CCS2 for maximum per-session throughput, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Falcon — 60 kW CCS2 DC Fast EV Charger", description: "60 kW high-speed CCS2 DC fast EV charger for public charging networks and commercial hubs", power: "60 kW", connector: "CCS2", category: "dc", productId: "spider-falcon", chargerType: "DC Fast Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "What is the difference between Spider Falcon and Spider Spark?", "acceptedAnswer": { "@type": "Answer", "text": "Both deliver 60 kW. The Spider Spark has dual CCS2 + CHAdeMO connectors with power sharing between them. The Spider Falcon has a single dedicated CCS2 connector — delivering full 60 kW to one vehicle without sharing, for maximum per-session speed and lower unit cost." } },
        { "@type": "Question", "name": "Do I still need CHAdeMO if I deploy Spider Falcon chargers?", "acceptedAnswer": { "@type": "Answer", "text": "CCS2 covers the vast majority of new EVs in India. For the small percentage of CHAdeMO vehicles (mainly Nissan Leaf and older imports), pair one Spider Spark dual-connector unit with your Spider Falcon cluster. This gives you CHAdeMO coverage without compromising CCS2 throughput." } },
        { "@type": "Question", "name": "Why choose a single-connector charger over a dual-connector unit?", "acceptedAnswer": { "@type": "Answer", "text": "A dedicated CCS2 connector delivers consistent full-power charging with no sharing compromise, lower unit cost, fewer mechanical components, and reduced maintenance. For multi-unit deployments, you can install more chargers for the same budget — meaning shorter queues and better utilisation." } },
        { "@type": "Question", "name": "Which EVs are compatible with the Spider Falcon?", "acceptedAnswer": { "@type": "Answer", "text": "All CCS2-equipped EVs — including Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, BYD Atto 3, Mercedes EQS, BMW iX, Kia EV6, Volvo XC40 Recharge, and every new 4-wheeler EV launched in India using the CCS2 standard." } },
      ] },
    ],
  },
  {
    path: "/products/dc/spider-ultra",
    title: "Spider Ultra — 120 kW DC Fast EV Charger | SpiderEV",
    description: "120 kW high-speed DC fast EV charger with CCS2 and CHAdeMO for public networks, fleets and commercial hubs in Andhra Pradesh & Telangana.",
    keywords: "Spider Ultra, 120 kW DC charger, high power charger, highway charger, fleet depot charger, ultra fast EV charger India, high speed DC charger",
    subtopics: ["Spider Ultra — 120 kW DC Fast EV Charger", "Spider Ultra Technical Specifications — 120 kW DC Fast Charger", "Dual Connector — CCS2 & CHAdeMO for Maximum EV Compatibility", "Best Use Cases — Public Networks, Commercial Hubs & Highways", "Frequently Asked Questions", "Spider Ultra vs Spider Surge — Choosing the Right High-Power Charger"],
    bodyText: "The Spider Ultra crosses the threshold where DC charging starts to compete with the refuelling experience at a petrol pump. At 120 kW, a typical passenger EV goes from 20% to 80% in 15-25 minutes — roughly the time it takes to use a restroom and grab a coffee at a highway rest stop. That speed fundamentally changes how drivers think about long-distance EV travel: charging becomes a brief pause rather than a planned interruption. Highway corridor operators deploy the Spider Ultra at toll plazas, food courts, and rest areas along national highways where driver dwell time is naturally 15-30 minutes. The charging session completes within the existing stop window, so there's no additional time penalty for driving electric. For the operator, high power means high throughput — each unit can cycle through more vehicles per day compared to 30-60 kW alternatives, directly improving revenue per charger. Active thermal management is critical at this power level in Indian conditions. Summer temperatures exceeding 45°C in AP and Telangana would cause lower-spec chargers to thermally throttle, reducing output and extending charge times. The Spider Ultra's thermal system maintains consistent 120 kW delivery through back-to-back sessions in peak summer heat — performance doesn't degrade whether it's the first session of the day or the twentieth. Fleet depot operations benefit from 120 kW when turnaround windows are tight. Electric buses and commercial vehicles that need to return to service quickly can add significant range in a 20-minute window between routes. The fleet management API integrates charging schedules with dispatch systems, ensuring vehicles are charged and ready when the next run is assigned. Dual CCS2 and CHAdeMO connectors with intelligent power distribution ensure universal compatibility. Technical Specifications: Power Output 120 kW, Connectors CCS2 + CHAdeMO (dual with intelligent distribution), Charging Speed 20-80% in 15-25 min for typical passenger EV, Protocol OCPP 1.6J, Ingress Protection IP67, Thermal Management active cooling for sustained output in 45°C+ conditions, Enclosure heavy-duty industrial grade, Fleet Integration fleet management API with depot scheduling, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Ultra — 120 kW DC Fast EV Charger", description: "120 kW high-speed DC fast EV charger with CCS2 and CHAdeMO for public networks, fleets and commercial hubs", power: "120 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-ultra", chargerType: "DC Fast Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "How fast does the Spider Ultra charge a passenger EV?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Ultra delivers 20% to 80% charge in approximately 15-25 minutes for a typical passenger EV — comparable to the time spent at a highway rest stop for a coffee break. The exact time depends on the vehicle's battery size and maximum charge acceptance rate." } },
        { "@type": "Question", "name": "Does the Spider Ultra maintain full power in extreme heat?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Active thermal management ensures the Spider Ultra sustains 120 kW output consistently even in temperatures exceeding 45°C — critical for deployment in AP and Telangana where summer conditions would cause lesser chargers to thermally throttle and reduce charging speed." } },
        { "@type": "Question", "name": "Is 120 kW suitable for highway charging stations?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — 120 kW is ideal for highway corridors. Charge times of 15-25 minutes align with natural driver rest stops, meaning charging doesn't add extra waiting time to the journey. High throughput (more vehicles per day) also improves the business case for highway operators." } },
        { "@type": "Question", "name": "What is the difference between Spider Ultra 120 kW and Spider Surge 180 kW?", "acceptedAnswer": { "@type": "Answer", "text": "Spider Ultra delivers 120 kW for standard highway and fleet depot use. Spider Surge at 180 kW is designed for the highest-throughput locations — major highway hubs and bus depots — where even faster turnaround directly impacts operational revenue. The Surge also features liquid-cooled cables for sustained high-current delivery." } },
      ] },
    ],
  },
  {
    path: "/products/dc/spider-surge",
    title: "Spider Surge — 180 kW DC Fast EV Charger | SpiderEV",
    description: "180 kW rapid DC fast EV charger delivering powerful charging for highways, depots and fleet operators in Andhra Pradesh and Telangana.",
    keywords: "Spider Surge, 180 kW DC charger, rapid charger, highway EV charger, fleet operator charger, high power charging India, liquid cooled charger",
    subtopics: ["Spider Surge — 180 kW Rapid DC Fast EV Charger", "Spider Surge Technical Specifications — 180 kW Rapid DC Fast Charger", "Highway Charging Use Case — Why 180 kW Is the Highway Standard", "Fleet & Depot Charging — Spider Surge for Commercial Operators", "Frequently Asked Questions", "Spider Surge vs Spider Ultra — Which 100–200 kW Charger Is Right?"],
    bodyText: "The Spider Surge occupies the power tier where EV charging truly matches the convenience of petrol refuelling for long-distance travel. At 180 kW, it adds 200+ km of range in just 15 minutes — enough for most intercity legs between charging stops. A driver on the Hyderabad-Bangalore or Hyderabad-Vijayawada corridor can stop, charge while having a meal, and continue with range to spare. This makes the Surge the backbone unit for national highway charging networks. Liquid-cooled charging cables are what separate the Spider Surge from air-cooled alternatives at this power tier. At 180 kW, cable temperatures would otherwise rise significantly during sessions, forcing thermal throttling that reduces actual delivered power below the rated output. Liquid cooling maintains cable temperature within safe limits regardless of ambient conditions or consecutive sessions — meaning the 10th vehicle of the day charges just as fast as the first. For highway operators, that consistency is what determines customer satisfaction and return business. A charger that advertises 180 kW but regularly throttles to 100 kW due to heat creates frustrated drivers who choose competing stations on their next trip. Bus depot operators and intercity fleet managers deploy the Spider Surge where vehicles need rapid turnaround between routes. An electric bus completing its run can add the range needed for the next route in 20-30 minutes — short enough to keep the vehicle in service without requiring a spare bus to cover the charging gap. This directly reduces the fleet size (and capital expenditure) needed to maintain service frequency. Dual CCS2 and CHAdeMO connectors ensure compatibility with both passenger EVs and commercial vehicles using either standard. OCPP 1.6J integration with SpiderConnect provides centralised management across multi-charger highway installations — monitoring utilisation patterns, scheduling maintenance during low-traffic windows, and optimising pricing based on demand. Technical Specifications: Power Output 180 kW, Connectors CCS2 + CHAdeMO (dual), Charging Speed 200+ km range added in 15 min for compatible vehicles, Cable Cooling liquid-cooled for sustained high-power delivery, Protocol OCPP 1.6J, Ingress Protection IP67, Thermal Management active cooling system for consistent output in all conditions, Fleet Integration depot scheduling API with per-vehicle tracking, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Surge — 180 kW DC Fast EV Charger", description: "180 kW rapid DC fast EV charger delivering powerful charging for highways, depots and fleet operators", power: "180 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-surge", chargerType: "DC Fast Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "How much range does the Spider Surge add in 15 minutes?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Surge adds over 200 km of range in approximately 15 minutes for compatible vehicles — enough for most intercity highway legs between charging stops. Exact range added depends on the vehicle's battery capacity and maximum charge acceptance rate." } },
        { "@type": "Question", "name": "Why does the Spider Surge use liquid-cooled cables?", "acceptedAnswer": { "@type": "Answer", "text": "At 180 kW, cable temperatures rise significantly during charging sessions. Liquid cooling maintains safe cable temperatures regardless of ambient heat or consecutive sessions — ensuring the 10th vehicle of the day charges at the same speed as the first, without thermal throttling." } },
        { "@type": "Question", "name": "Is the Spider Surge suitable for electric bus depots?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Electric buses can add the range needed for their next route in 20-30 minutes, keeping vehicles in service without requiring spare buses to cover charging gaps. The fleet management API integrates with depot scheduling for optimised turnaround." } },
        { "@type": "Question", "name": "What is the difference between Spider Surge 180 kW and Spider Hulk 240 kW?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Surge at 180 kW handles most highway and depot needs effectively. The Spider Hulk at 240 kW with a 4-gun system is designed for the highest-demand installations — major highway hubs charging many vehicles simultaneously, and heavy-duty bus/truck depots where maximum power reduces turnaround to under an hour for full bus charges." } },
      ] },
    ],
  },
  {
    path: "/products/dc/spider-hulk",
    title: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger | SpiderEV",
    description: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications.",
    keywords: "Spider Hulk, 240 kW charger, ultra rapid charger, heavy duty EV charger, bus charger India, truck charger, highway fast charger",
    subtopics: ["Spider Hulk — 240 kW Ultra-Rapid DC Fast EV Charger", "Spider Hulk Technical Specifications — 240 kW DC Fast Charger", "Connector Types — CCS2 & CHAdeMO for All EV Models", "Ideal Use Cases — Highway Hubs, Bus Depots & Large Fleets", "Frequently Asked Questions", "Why Choose Spider Hulk for Heavy-Duty EV Infrastructure in India"],
    bodyText: "The Spider Hulk is designed for the peak of the charging demand curve — electric bus depots, highway fast-charging corridors, and commercial fleets that can't afford long dwell times. A 4-gun system with 240 kW can charge an electric bus to full in under an hour, or add 300+ km of range to a passenger EV in 10-15 minutes. Liquid cooling on the dispensing cables isn't a spec-sheet detail — it's what allows the Hulk to sustain high current draw for back-to-back sessions without thermal throttling. That matters at a depot running multiple vehicles through the same unit across a shift. The Hulk supports both CCS2 and CHAdeMO connectors, meaning it can handle the CCS2 standard used by most passenger EVs in India as well as CHAdeMO-fitted commercial vehicles, without requiring a second unit. OCPP 1.6J by default, with OCPP 2.0 support for operators building newer network management stacks. The fleet management API and SpiderConnect integration enables fleet operators to view charging schedules, per vehicle usage and uptime remotely, useful for depots operating on tight turnaround windows where an offline charger has a direct cost. Technical Specifications: Power Output 240 kW, Connectors CCS2 + CHAdeMO (4-gun system), Charging Speed full bus charge in under 60 minutes and 300+ km passenger EV range in 10-15 min, Protocol OCPP 1.6J and OCPP 2.0 ready, Ingress Protection IP67, Cooling liquid-cooled dispensing cables, Management fleet management API with SpiderConnect CPMS integration and remote firmware updates, Certification BIS certified.",
    schemas: [
      buildProductSchema({ name: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger", description: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications", power: "240 kW", connector: "CCS2, CHAdeMO", category: "dc", productId: "spider-hulk", chargerType: "DC Fast Charger" }),
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        { "@type": "Question", "name": "How fast does the Spider Hulk charge an electric bus?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Hulk can charge an electric bus in under 60 mins to full capacity, and 300+ km of range in 10-15 mins to a passenger EV depending on the vehicle battery and charging acceptance rate." } },
        { "@type": "Question", "name": "What connectors does the Spider Hulk support?", "acceptedAnswer": { "@type": "Answer", "text": "The Spider Hulk comes with 4-guns and supports both CCS2 and CHAdeMO, which means it can cater to most passenger and commercial EVs on the Indian roads without any additional hardware." } },
        { "@type": "Question", "name": "Is the Spider Hulk suitable for highway charging stations?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — the Spider Hulk is designed for highway hubs and depot use with liquid-cooled cables for prolonged high-current sessions at 240 kW, charging multiple vehicles back-to-back through the same unit." } },
        { "@type": "Question", "name": "Does the Spider Hulk integrate with fleet management software?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. It connects to SpiderConnect CPMS and provides a fleet management API to give operators visibility into scheduling, per-vehicle usage and uptime remotely." } },
      ] },
    ],
  },

  // Solutions
  {
    path: "/park-and-charge-electric-vehicle-ev-charging-station",
    title: "Park and Charge EV Stations in Telangana & Andhra Pradesh",
    description: "Park & Charge EV Stations in Andhra Pradesh & Telangana. Easy installation and smart parking-based EV charging solutions by Spider Energy.",
    keywords: "park and charge EV station, parking EV charger, mall EV charging, office EV charging, commercial complex charger, EV charging Hyderabad, parking lot charger",
    subtopics: ["Park & Charge EV Stations for Parking Lots in Telangana & AP", "What Is Park & Charge? — EV Charging Built into Parking", "How Park & Charge Works — From Registration to Revenue", "Best Locations for Park & Charge Stations in AP & Telangana", "Investment & ROI — How Much Can You Earn from Park & Charge?", "Why Choose SpiderEV for Your Park & Charge Setup"],
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
    subtopics: ["Community EV Charging Stations for Apartments & Societies in AP & TG", "What Is Community EV Charging? — Shared Charging for Apartments", "How to Set Up Community EV Charging in Your Housing Society", "RFID Access & App Monitoring — Fair Billing for All Residents", "Investment & Payback — How Societies Benefit from Community Charging", "SpiderEV Community Charging — Live in Hyderabad & AP"],
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
    subtopics: ["Public EV Charging Stations Across Telangana & Andhra Pradesh", "SpiderEV Public Charging Network — Stations Across AP & Telangana", "Fast AC & DC Public Charging — Speeds & Connector Types", "RFID & App-Based Access — How to Use SpiderEV Public Stations", "24/7 Availability & CPMS Monitoring", "How to Find a SpiderEV Public Charging Station Near You"],
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
    subtopics: ["Heavy Duty EV Charging Stations for Buses, Trucks & Fleets in AP & TG", "Heavy Duty EV Charger Specifications — 120 kW to 240 kW DC", "Electric Bus Charging Solutions for Depot & Highway Use", "Commercial Fleet EV Charging — Trucks, Logistics & Last-Mile", "Why Choose SpiderEV for Heavy Duty Charging in AP & Telangana", "CPMS Integration for Fleet Charging Management"],
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
    subtopics: ["CPMS — Smart EV Charge Point Management System for Telangana & AP", "What Is CPMS? — Charge Point Management System Explained", "SpiderConnect CPMS Key Features — Remote Monitoring, RFID, Billing", "OCPP 1.6J & OCPP 2.0 Compliance — Why It Matters for Your Network", "Dynamic Load Management — Reduce Electricity Costs with Smart CPMS", "How SpiderConnect CPMS Manages Your EV Charging Network in Real Time"],
    bodyText: "SpiderConnect is our cloud-based Charging Point Management System. Monitor charger health, manage user access, process payments, configure dynamic pricing, and view analytics from a unified dashboard. SpiderConnect CPMS is compatible with any OCPP 1.6J compliant charger regardless of manufacturer, giving operators the freedom to manage mixed-brand networks from a single platform. Key features include: real-time charger status monitoring with instant fault alerts; remote start/stop, restart, and firmware update capabilities; dynamic pricing based on time-of-day, demand, and occupancy; comprehensive session analytics with revenue reporting; user management with RFID, app, and guest access modes; multi-site dashboard for operators managing stations across cities; API integration with payment gateways, fleet systems, and energy management platforms. SpiderConnect currently manages 5,000+ charge points across India for operators ranging from single-site businesses to national charging networks.",
    schemas: [
      { "@context": "https://schema.org", "@type": "SoftwareApplication", "@id": `${BASE_URL}/cpms-ev-charging-point-management-system#app`, "name": "SpiderConnect CPMS", "description": "Cloud-based Charging Point Management System for monitoring, controlling and managing EV charging networks across India", "url": `${BASE_URL}/cpms-ev-charging-point-management-system`, "applicationCategory": "BusinessApplication", "operatingSystem": "Web, Android, iOS", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }, "brand": { "@id": `${BASE_URL}/#brand-spiderev` }, "provider": { "@id": `${BASE_URL}/#organization` } },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/cpms-ev-charging-point-management-system"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-app",
    title: "EV Charging Station App in Andhra Pradesh & Telangana",
    description: "Smart EV Charging App in AP & Telangana — locate nearby stations, access charging networks and manage your EV charging anytime, anywhere.",
    keywords: "SpiderEV app, EV charging app India, find EV charger app, EV station locator app, charging session app, EV payment app, Android iOS charger app",
    subtopics: ["SpiderEV App — Find & Manage EV Charging Stations in AP & Telangana", "What Can You Do with the SpiderEV App?", "Find Nearby Charging Stations in Telangana & Andhra Pradesh", "Start & Pay for Charging — RFID & App-Based Access", "Download the SpiderEV App — iOS & Android"],
    bodyText: "The SpiderEV mobile app helps EV drivers find nearby charging stations, start sessions remotely, pay digitally, and track charging history. Available on Android and iOS with real-time station availability. Key features include: interactive map with real-time charger availability showing occupied, available, and out-of-service status; one-tap session start with automatic connector detection; multiple payment options including UPI, credit/debit cards, and in-app wallet; detailed session history with energy consumed, cost breakdown, and carbon saved; favourite stations for quick access; route planning with charging stops for long-distance trips; push notifications for session completion and promotional offers; and community features for rating and reviewing stations. The SpiderEV app connects to all SpiderConnect-managed stations across India, giving drivers access to 5,000+ charging points in 15+ cities.",
    schemas: [
      { "@context": "https://schema.org", "@type": "MobileApplication", "@id": `${BASE_URL}/ev-charging-station-app#app`, "name": "SpiderEV Charging App", "description": "Find nearby EV charging stations, start sessions, pay digitally and track charging history across India", "url": `${BASE_URL}/ev-charging-station-app`, "applicationCategory": "UtilitiesApplication", "operatingSystem": "Android, iOS", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }, "brand": { "@id": `${BASE_URL}/#brand-spiderev` }, "provider": { "@id": `${BASE_URL}/#organization` } },
      { "@context": "https://schema.org", "@type": "HowTo", "@id": `${BASE_URL}/ev-charging-station-app#howto`, "name": "How to start a charging session with the SpiderEV App", "description": "Find a station, start an EV charging session, and pay in the SpiderEV app.", "step": [
        { "@type": "HowToStep", "position": 1, "name": "Open the SpiderEV App", "text": "Install the app and sign in to your account." },
        { "@type": "HowToStep", "position": 2, "name": "Locate a station", "text": "Use the station map and live availability filters to choose a compatible charger." },
        { "@type": "HowToStep", "position": 3, "name": "Start and pay", "text": "Select the connector, start the session, monitor charging, and complete digital payment in the app." }
      ] }
    ],
  },
  {
    path: "/ev-charging-epc-services",
    title: "EV Charging Station EPC & Installation Services | AP & TG",
    description: "EV charging station installation in AP & Telangana — EPC services, construction support & infrastructure solutions for commercial and public spaces.",
    keywords: "EV charging EPC, EV station installation, charging station construction, EPC services Hyderabad, DISCOM approval, EV infrastructure setup, turnkey EV station",
    subtopics: ["End-to-End EV Charging Station EPC & Installation Services Across AP & TG", "What Is EPC for EV Charging Stations? — Civil, Electrical & Commissioning", "DISCOM Liaison & Approval — How SpiderEV Handles the Paperwork", "Site Survey & Design — Planning Your EV Charging Infrastructure", "Timeline — How Long Does an EV Charging Station Installation Take?", "EPC Services for Apartments, Malls, Highways & Industrial Sites"],
    bodyText: "Our EPC (Engineering, Procurement, and Construction) team handles every aspect of charging station deployment — from electrical load assessment and civil works to charger mounting, cabling, and final commissioning. SpiderEV's EPC process includes: Engineering — site evaluation, traffic and ROI analysis, electrical infrastructure assessment, load calculation, and layout optimisation for parking and charger placement; Procurement — sourcing BIS/CE certified chargers, switchgear, cables, panels, and all electrical components with quality assurance; Construction — civil works, foundation and mounting, electrical installation, network connectivity setup, SpiderConnect integration, testing, and handover. We manage all regulatory requirements including DISCOM applications, electrical safety certifications, and local authority permits. Typical project timelines are 12-20 weeks from agreement to commissioning. Our parent company brings 30+ years of power electronics expertise, ensuring safe, code-compliant installations. Currently operational across 15+ cities in AP and Telangana with 5,000+ chargers installed.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "EV Charging Station EPC Services", "description": "End-to-end EPC services for EV charging station installation — site survey, design, construction and commissioning in AP & Telangana", "url": `${BASE_URL}/ev-charging-epc-services`, "serviceType": "EV Station EPC & Installation", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/ev-charging-epc-services"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },

  // Company
  {
    path: "/about-us",
    title: "About Spider Energy | EV Charging from Hyderabad",
    description: "Learn how Spider Energy builds SpiderEV chargers for Telangana and Andhra Pradesh. Office: T-Hub, Raidurgam, Hyderabad.",
    keywords: "EV charger manufacturer Telangana, electric vehicle manufacturer AP, BIS certified charger India, SpiderEV company Hyderabad, EVSE manufacturer India",
    subtopics: ["About Spider Energy", "Who we are", "SpiderEV product line", "Where we work", "Contact"],
    bodyText: "Spider Energy is the company and SpiderEV is its EV charging product line. SpiderEV combines AC and DC charging hardware with SpiderConnect CPMS and the SpiderEV driver app. Spider Energy is based at T-Hub, Raidurgam, Hyderabad and primarily serves Telangana and Andhra Pradesh.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Organization", "name": "Spider Energy", "url": BASE_URL, "logo": `${BASE_URL}/spider-ev-logo.png`, "address": { "@type": "PostalAddress", "streetAddress": "T-Hub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "What is the difference between Spider Energy and SpiderEV?", "acceptedAnswer": { "@type": "Answer", "text": "Spider Energy is the parent company, and SpiderEV is its product line for EV chargers, SpiderConnect CPMS and the SpiderEV driver app." } }] },
    ],
  },
  {
    path: "/contact-us",
    title: "Contact SpiderEV — EV Charging Experts in AP & TG India",
    description: "Contact Spider Energy for EV charger installation, franchise enquiries and CPMS support in Andhra Pradesh and Telangana.",
    keywords: "contact Spider Energy, SpiderEV phone number, EV charger enquiry Hyderabad, EV charging support AP, franchise contact, CPMS support",
    subtopics: ["Contact Spider Energy — EV Charging Experts in Telangana & Andhra Pradesh", "Spider Energy Office Location — Hyderabad, Telangana", "Contact Us for EV Charger Installation in AP & Telangana", "Franchise & Partnership Enquiries — Spider Energy India", "SpiderEV Technical Support"],
    bodyText: "Reach Spider Energy for sales enquiries, installation support, franchise information, or technical assistance. Our team is available Monday through Sunday to help you with all your EV charging needs. Office: T-Hub, Raidurgam, Hyderabad, Telangana 500081. Phone: +91-9997776080. Email: connect@spiderenergy.in. We respond to all enquiries within 24 hours. Whether you are a homeowner looking for a home charger, a business wanting workplace charging, a fleet operator needing depot solutions, or an entrepreneur exploring franchise opportunities — our team will guide you through product selection, site assessment, installation planning, and after-sales support across Andhra Pradesh and Telangana.",
  },

  // Standalone
  {
    path: "/ev-charging-station-franchise",
    title: "EV Charging Station Franchise | Spider Energy",
    description: "Partner with Spider Energy for SpiderEV charging franchises in Telangana & Andhra Pradesh. Hardware, CPMS and site-specific planning. Enquire: +91-9997776080.",
    keywords: "EV charging station franchise Telangana, EV franchise business AP, electric vehicle franchise investment India, SpiderEV franchise cost, EV charger dealership Hyderabad",
    subtopics: ["Start Your EV Charging Franchise in Telangana & AP", "Who the franchise is for", "Site-specific hardware and operating scope", "Steps from enquiry to a live site", "ROI calculator and assumption review", "Support and training confirmed by package"],
    bodyText: "Spider Energy franchises SpiderEV charging sites with hardware, SpiderConnect CPMS access and commissioning support. Territories centre on Telangana and Andhra Pradesh first. Bring your site address and power availability so the team can map charger guns and a site-specific payback model. Hardware, CPMS, training and support details are confirmed for the agreed package. Use the ROI calculator as a starting point, then review the assumptions with Spider Energy before making an investment decision.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "EV Charging Station Franchise", "description": "Site-specific SpiderEV charging franchise planning for Andhra Pradesh and Telangana, including hardware, CPMS and commissioning scope.", "url": `${BASE_URL}/ev-charging-station-franchise`, "serviceType": "EV Charging Franchise Opportunity", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": [{ "@type": "State", "name": "Telangana" }, { "@type": "State", "name": "Andhra Pradesh" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/ev-charging-station-franchise"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/ev-charging-station-roi-calculator",
    title: "EV Charging Station ROI Calculator | Telangana & AP",
    description: "Estimate EV charging business profits in AP & Telangana. Smart ROI calculator for accurate charging station investment planning.",
    keywords: "EV charging ROI calculator, EV station profit calculator, charging business investment, EV charging revenue estimate, ROI EV charger India",
    subtopics: ["Calculate Your EV Charging Station ROI & Profits in Telangana & AP", "How to Use the EV Charging Station ROI Calculator", "Key Variables — Units Charged, Tariff, Footfall & Operational Cost", "Expected Payback Period for Different Charger Types in India", "Subsidy Impact — How PM E-Drive & TSREDCO Schemes Affect Your ROI"],
    bodyText: "Use SpiderEV's ROI calculator to estimate your potential earnings from an EV charging station business. Input your investment amount, location type, expected footfall, and electricity tariff to get projected monthly revenue, operating costs, and payback period. The calculator factors in charger utilisation rates based on location type (highway, commercial, residential), electricity costs including demand charges, maintenance expenses, SpiderConnect CPMS subscription, and seasonal demand variations. Typical ROI for EV charging stations in Telangana and Andhra Pradesh ranges from 2-4 years depending on charger power level, location footfall, and pricing strategy. Use this calculator to estimate your potential EV charging station revenue by charger type, expected number of daily sessions and your local electricity tariff. Figures are projections based on typical usage in Telangana and Andhra Pradesh – actual returns depend on location, footfall and local competition. Use this as a planning tool, not a guarantee.",
    schema: { "@context": "https://schema.org", "@type": "WebApplication", "name": "EV Charging Station ROI Calculator", "description": "Calculate EV charging station profits in Telangana & AP. Free ROI calculator for accurate investment planning.", "url": `${BASE_URL}/ev-charging-station-roi-calculator`, "applicationCategory": "FinanceApplication", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" } },
  },
  {
    path: "/ev-charging-station-locator",
    title: "EV Charging Station Locator in Andhra Pradesh & Telangana",
    description: "Find Nearby EV Fast Charging Stations in Andhra Pradesh and Telangana using a Smart EV Charge Zone Locator and Real-time EV Charging Locator Tools.",
    keywords: "EV charging station locator, find EV charger near me, EV station map Hyderabad, charging point locator AP, nearest EV charger Telangana",
    subtopics: ["Find EV Charging Stations Near You in Telangana & Andhra Pradesh", "Find SpiderEV Charging Stations Near You", "Real-Time Station Availability — Check Before You Drive", "Charging Stations Across Hyderabad, Vijayawada & Visakhapatnam", "How to Use the SpiderEV Station Locator App"],
    bodyText: "Find SpiderEV charging stations near you across Andhra Pradesh and Telangana. Our interactive map shows real-time availability of all charger types — AC slow charging (3.3-80 kW) and DC fast charging (30-240 kW). Filter by connector type (CCS2, CHAdeMO, Type 2), power level, and availability status. Get turn-by-turn navigation to any station. View pricing, amenities, and user ratings before you drive. The SpiderEV network spans 15+ cities including Hyderabad, Vijayawada, Vizag, Tirupati, Warangal, and Guntur with 5,000+ active charging points.",
    schema: { "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${BASE_URL}/#localbusiness`, "name": "Spider Energy", "url": BASE_URL, "telephone": "+91-9997776080", "email": "connect@spiderenergy.in", "address": { "@type": "PostalAddress", "streetAddress": "T-Hub, Raidurgam", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "postalCode": "500081", "addressCountry": "IN" }, "geo": { "@type": "GeoCoordinates", "latitude": 17.4435, "longitude": 78.3772 }, "image": `${BASE_URL}/spider-ev-logo.png`, "priceRange": "₹₹" },
  },

  // Other
  {
    path: "/news",
    title: "Latest EV Charging News in Andhra Pradesh & Telangana",
    description: "Stay updated with the latest electric vehicle charging news, EV infrastructure trends and technology insights across Andhra Pradesh and Telangana.",
    keywords: "EV charging news India, electric vehicle news Telangana, SpiderEV updates, EV policy India, charging infrastructure news",
    subtopics: ["Latest EV Charging Industry News & Updates — Spider Energy", "Latest Spider Energy Company News & Product Updates", "EV Charging Policy & Infrastructure News — India 2026", "EV Market Updates — Telangana & Andhra Pradesh"],
    bodyText: "Stay updated with the latest developments in India's EV charging ecosystem. SpiderEV news covers product launches, new station deployments, partnership announcements, government policy updates, and industry analysis. Follow our coverage of EV charging infrastructure growth in Telangana, Andhra Pradesh, and across India.",
  },
  {
    path: "/blog",
    title: "EV Charging Blog — Tips, Guides & Industry News | SpiderEV",
    description: "Read the latest EV charging guides, industry news and business insights from SpiderEV — your expert resource for electric vehicle charging in India.",
    keywords: "EV charging blog, electric vehicle guides India, EV business blog, OCPP guide, AC vs DC charging, EV charging investment guide",
    subtopics: ["SpiderEV Blog — EV Charging Guides, News & Insights for India", "Latest EV Charging Guides & How-To Articles", "EV Charging Industry News — India, AP & Telangana", "Franchise & Business Insights for EV Charging Entrepreneurs"],
    bodyText: "The SpiderEV blog covers electric vehicle charging in India — from choosing the right charger for your home to starting an EV charging business, understanding OCPP protocols, and following industry developments. New articles are published by the Spider Energy team.",
  },
  {
    path: "/gallery",
    title: "Project Gallery | SpiderEV Installations",
    description: "Photos of SpiderEV charger installations across Telangana and Andhra Pradesh. Homes, fleets and public sites.",
    keywords: "SpiderEV installations, Spider Energy projects, EV charger installation photos",
    subtopics: ["Installation Gallery", "Home AC installs", "Public & fleet DC", "Request a similar site survey"],
    bodyText: "Project captions identify the model and city only when confirmed in the project record. Unverified project locations are not published as facts. Contact Spider Energy to request a similar site survey.",
  },
  {
    path: "/har-ghar",
    title: "Har Ghar Charger — Affordable Home EV Charging India",
    description: "Har Ghar Charger — affordable home EV charging for every Indian household. Register and earn from your own EV charging station.",
    keywords: "Har Ghar Charger, home EV charger India, earn from EV charger, affordable home charger, passive income EV charging, SpiderAtHome",
    subtopics: ["Har Ghar Charger — Affordable Home EV Charging for Every Indian Household", "What Is Har Ghar Charger? — SpiderEV's Home EV Initiative", "How to Register for Har Ghar Charger in Telangana & AP", "How Much Can You Earn from Your Home EV Charging Station?", "Who Is Eligible — Apartments, Villas & Independent Homes"],
    bodyText: "Har Ghar Charger makes EV charging accessible to every Indian household. Install a SpiderEV home charger, charge your own vehicle, and earn by sharing it with neighbours through our app-based platform. The initiative works in 3 simple steps: Register your interest with name, location, and property type; our team visits for site verification and charger recommendation; professional installation within 60 days and your station goes live on the SpiderEV app. Investment starts from under ₹8,000 for a compact charger with potential monthly earnings of ₹8,000-₹16,000. Who can apply: homeowners, shop owners, offices, restaurants, small businesses, parking lots, and apartment residents. The program uses Spider Mini (3.3 kW) and Spider Lite (3.3 kW) chargers — compact single-phase units that work with any standard Indian home electrical connection.",
    schemas: [
      { "@context": "https://schema.org", "@type": "Service", "name": "Har Ghar Charger — Home EV Charging for Every Indian", "description": "SpiderEV's Har Ghar Charger initiative brings affordable home EV charging to every Indian household. Register your interest and earn from your own charging station.", "url": `${BASE_URL}/har-ghar`, "serviceType": "Home EV Charging Program", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": "IN" },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": SERVICE_PAGE_FAQS["/har-ghar"].map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } })) },
    ],
  },
  {
    path: "/partner-with-us",
    title: "Partner With SpiderEV — EV Charging Opportunities India",
    description: "Partner with SpiderEV as a site owner, fleet operator, fuel station or real estate developer. Build India's EV charging future together.",
    keywords: "partner SpiderEV, EV charging partnership, site owner EV revenue, fuel station EV charger, real estate EV charging, fleet operator partnership",
    subtopics: ["Partner With SpiderEV — Earn from EV Charging in Telangana & AP", "Who Can Partner with SpiderEV? — Site Owners, Fleets & Developers", "Site Owner Benefits — Earn Passive Income from EV Charging", "Fleet Operator Partnership — Managed Charging for Your Vehicles", "Petroleum & Fuel Station Partners — Add EV to Your Forecourt", "How to Apply — Partner with SpiderEV in Telangana & AP"],
    bodyText: "Partner with Spider Energy to deploy EV charging at your location. Whether you own a fuel station, parking lot, commercial complex, or fleet depot, we have partnership models that generate passive revenue from your existing real estate. Partnership options include: Site Owner — provide space and earn revenue share on every charging session with zero CAPEX; Fleet Partner — dedicated depot charging for your electric fleet with priority access and preferential rates; Fuel Station Partner — add EV charging alongside existing fuel pumps to future-proof your business; Real Estate Developer — integrate EV charging into new residential and commercial projects; Franchise Partner — own and operate a SpiderEV branded charging station with full support. SpiderEV handles hardware, installation, software, maintenance, and customer management. You provide the location. We provide the technology. Revenue starts from day one. Apply now to get a free site assessment and partnership proposal.",
  },

  ...[
    ["hyderabad", "Hyderabad", "Telangana", "Spider Energy operates from T-Hub, Raidurgam, Hyderabad, and supplies SpiderEV chargers across Telangana."],
    ["vijayawada", "Vijayawada", "Andhra Pradesh", "Spider Energy serves Vijayawada from its T-Hub headquarters in Hyderabad, with sales coverage across Andhra Pradesh."],
    ["visakhapatnam", "Visakhapatnam", "Andhra Pradesh", "Spider Energy serves Visakhapatnam from its T-Hub headquarters in Hyderabad, with sales coverage across Andhra Pradesh."],
  ].map(([slug, city, state, proof]) => ({
    path: `/ev-chargers-${slug}`,
    title: `EV Chargers in ${city} | Spider Energy (SpiderEV)`,
    description: `Spider Energy supplies SpiderEV AC & DC chargers in ${city}, ${state}. Installation, franchise and CPMS support. Call +91-9997776080.`,
    keywords: `EV charger ${city}, EV charging station manufacturer ${city}, SpiderEV ${city}`,
    subtopics: [`EV Chargers & Charging Stations in ${city}`, `Home AC options in ${city}`, "Public & fleet DC options", `Service and sales contact for ${city}`, "Frequently asked questions"],
    bodyText: `${proof} Charger selection starts with the available load, vehicle mix and dwell time. Spider Mini, Lite and Smart cover home AC requirements, while the SpiderEV DC range serves public and fleet sites. Timelines depend on the site and approvals.`,
    schema: { "@context": "https://schema.org", "@type": "Service", "name": `EV charger supply and installation in ${city}`, "url": `${BASE_URL}/ev-chargers-${slug}`, "serviceType": "EV charger supply and installation", "provider": { "@id": `${BASE_URL}/#organization` }, "areaServed": { "@type": "City", "name": city } },
  })),
  ...[
    ["ac-vs-dc-ev-charger-india", "AC vs DC EV Chargers in India - Which Do You Need?", "Clear AC vs DC EV charging guide for India. Power ranges, connectors, home vs public use, and which SpiderEV models fit each job.", "AC vs DC EV Chargers in India - A Practical Guide", "AC chargers feed the vehicle's onboard charger, so the car's AC input limit controls the session. DC chargers perform conversion outside the vehicle and supply the battery directly. AC usually fits homes, offices and destinations where vehicles remain parked for hours. DC fits public sites, corridors and fleets where dwell time is short. Check Type 2, CCS2, CHAdeMO or IS 17017-2-6 compatibility before selecting hardware. Compare Spider Mini and Smart for homes, Blaze and Strike for workplaces, Spider Fast and higher-power models for public sites, and Spider Base for supported light-EV fleets. Site design must also account for phase, sanctioned load, cable route, simultaneous sessions, access control and CPMS requirements."],
    ["home-ev-charger-buying-guide-telangana-andhra", "Home EV Charger Guide for Telangana & Andhra Pradesh", "How to choose a home EV charger in TG & AP: 3.3 vs 7.4 kW, single-phase limits, apartment parking, and SpiderEV Mini, Lite and Smart.", "Buying a Home EV Charger in Telangana & Andhra Pradesh", "Start with the vehicle's AC input limit, typical daily distance and overnight parking window. A 3.3 kW charger can theoretically deliver about 26 kWh in eight hours, while 7.4 kW can deliver about 59 kWh before charging losses and vehicle limits. For a 40 kWh battery arriving at 30%, adding 20 kWh may take roughly six to seven hours at 3.3 kW or around three hours at 7.4 kW; these are planning examples, not guarantees. Confirm the assigned parking bay, cable route, metering, phase, sanctioned load, earthing and protection. Compare Spider Mini and Lite at 3.3 kW with Spider Smart at 7.4 kW, then request an electrical assessment before installation."],
  ].map(([slug, title, description, heading, bodyText]) => ({
    path: `/guides/${slug}`,
    title,
    description,
    keywords: heading,
    subtopics: [heading, "Practical decision factors", "SpiderEV options", "Frequently asked questions"],
    bodyText,
    ogType: "article",
    schema: { "@context": "https://schema.org", "@type": "Article", "headline": heading, "description": description, "mainEntityOfPage": `${BASE_URL}/guides/${slug}`, "author": { "@type": "Organization", "name": "Spider Energy" }, "publisher": { "@id": `${BASE_URL}/#organization` }, "inLanguage": "en-IN" },
  })),

  // Legal
  {
    path: "/privacy-policy",
    title: "Privacy Policy | SpiderEV",
    description: "Spider Energy (SpiderEV) Privacy Policy — how we collect, use, store, share and protect your personal information across our website and mobile app.",
    keywords: "SpiderEV privacy policy, Spider Energy privacy, data protection, EV app privacy, personal information policy",
    subtopics: ["Privacy Policy", "Information We Collect", "How We Use Your Information", "How We Share Your Information", "Data Retention & Security", "Your Rights & Choices", "Children's Privacy", "Contact Us"],
    bodyText: "This Privacy Policy explains how Spider Energy (SpiderEV) collects, uses, discloses and safeguards your information when you visit our website, use the SpiderEV mobile application, or use our EV charging products and services. We collect information you provide such as name, email, phone number and address through our forms; account and charging data including session history and payment records processed through our payment partners; location data (with your permission) to show nearby charging stations; and device and usage data for diagnostics and service improvement. We use this information to provide and maintain our services, process payments, respond to enquiries, send service notifications, improve our products, prevent fraud and comply with legal obligations. We do not sell your personal information. We may share it with service providers, charging network and franchise partners, and legal authorities where required. We retain personal information only as long as necessary and protect it with encryption in transit, access controls and secure infrastructure. You have the right to access, correct, update or delete your personal information, withdraw consent for location access or marketing, and request account deletion within the SpiderEV app or by emailing connect@spiderenergy.in. Our services are not directed to children under 18. For questions about this policy, contact Spider Energy at T-Hub, Raidurgam, Hyderabad, Telangana 500081, email connect@spiderenergy.in or phone +91-9997776080.",
  },
];

// ─── Blog post keywords (derived from slug + category for SEO) ──────────────

const BLOG_KEYWORDS = {
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
  const consolidatedBlogSlugs = new Set(["ac-vs-dc-ev-charging", "best-home-ev-chargers-popular-models-telangana-andhra-pradesh-2026"]);
  const publishedBlogPosts = blogPosts.filter((post) => post.published && !consolidatedBlogSlugs.has(post.slug));
  const blogRoute = routes.find((route) => route.path === "/blog");
  if (blogRoute) {
    blogRoute.schemas = [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${BASE_URL}/blog#blog`,
        "name": "SpiderEV Blog",
        "description": blogRoute.description,
        "url": `${BASE_URL}/blog`,
        "publisher": { "@id": `${BASE_URL}/#organization` },
        "inLanguage": "en-IN",
        "blogPost": publishedBlogPosts.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${BASE_URL}/blog/${post.slug}#article`,
          "headline": post.title,
          "url": `${BASE_URL}/blog/${post.slug}`,
          "datePublished": post.date,
          "image": absoluteImageUrl(post.image),
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        ],
      },
    ];
  }
  for (const post of blogPosts) {
    if (!post.published || consolidatedBlogSlugs.has(post.slug)) continue;

    // Read full article HTML from blog-content JSON
    let articleHtml = "";
    const contentPath = join(BLOG_CONTENT_DIR, `${post.slug}.json`);
    if (existsSync(contentPath)) {
      try {
        const contentData = JSON.parse(readFileSync(contentPath, "utf-8"));
        articleHtml = contentData.html || "";
        articleHtml += `<aside><h2>Continue with SpiderEV</h2><p>SpiderEV is Spider Energy's EV charging product line, covering AC and DC chargers, SpiderConnect CPMS and the SpiderEV driver app.</p><p><a href="/products/ac/spider-smart">Spider Smart home charger</a> · <a href="/products/dc/spider-fast">Spider Fast DC charger</a> · <a href="/spiderev">Explore SpiderEV</a></p></aside>`;
      } catch (err) {
        console.warn(`  ⚠ Could not read blog content for ${post.slug}: ${err.message}`);
      }
    }

    const blogSchemas = [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${BASE_URL}/blog/${post.slug}#article`,
        "headline": post.title,
        "description": post.description,
        "image": absoluteImageUrl(post.image),
        "datePublished": post.date,
        "dateModified": post.modifiedDate || post.date,
        "author": { "@type": "Person", "name": post.author },
        "publisher": { "@id": `${BASE_URL}/#organization` },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
        "url": `${BASE_URL}/blog/${post.slug}`,
        "articleSection": post.category,
        ...((post.tags || []).length > 0 ? { "keywords": post.tags.join(", ") } : {}),
        "inLanguage": "en-IN",
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
  console.log(`  Added ${publishedBlogPosts.length} blog post routes`);
}

// ─── Run ─────────────────────────────────────────────────────────────────────

const template = readFileSync(join(distDir, "index.html"), "utf-8");

let count = 0;
for (const route of routes) {
  const productMatch = route.path.match(/^\/products\/(ac|dc)\/([^/]+)$/);
  if (productMatch) {
    if (!route.ogImage) route.ogImage = `/og/products/${productMatch[2]}.jpg`;
    route.lcpImage = productImage(productMatch[1], productMatch[2]);
  }
  if (route.path === "/") route.lcpImage = findBuiltAsset("heroImage1");
  if (route.path === "/spiderev" && !route.ogImage) route.ogImage = productImage("dc", "spider-fast");
  const meta = buildMeta(route);
  const jsonLd = buildJsonLd(route);
  const noscrollContent = buildNoscrollContent(route);
  const html = inject(template, meta, jsonLd, noscrollContent);
  write(html, route.path);
  count++;
  console.log(`  ✓ ${route.path}`);
}

// ─── Pre-render redirect pages (so static crawlers get a redirect, not a 404) ─

const redirects = [
  { from: "/spider-ev", to: `${BASE_URL}/spiderev` },
  { from: "/blog/ac-vs-dc-ev-charging", to: `${BASE_URL}/guides/ac-vs-dc-ev-charger-india` },
  { from: "/blog/best-home-ev-chargers-popular-models-telangana-andhra-pradesh-2026", to: `${BASE_URL}/guides/home-ev-charger-buying-guide-telangana-andhra` },
  { from: "/ac-ev-chargers", to: `${BASE_URL}/electric-vehicle-ev-ac-charger` },
  { from: "/dc-ev-chargers", to: `${BASE_URL}/electric-vehicle-ev-dc-charger` },
  { from: "/partner-withus", to: `${BASE_URL}/partner-with-us` },
  { from: "/policies", to: `${BASE_URL}/privacy-policy` },
  { from: "/cpms-charge-point-management-system", to: `${BASE_URL}/cpms-ev-charging-point-management-system` },
  { from: "/products/ac-chargers", to: `${BASE_URL}/electric-vehicle-ev-ac-charger` },
  { from: "/products/dc-chargers", to: `${BASE_URL}/electric-vehicle-ev-dc-charger` },
  { from: "/solutions/park-and-charge", to: `${BASE_URL}/park-and-charge-electric-vehicle-ev-charging-station` },
  { from: "/solutions/community-charging", to: `${BASE_URL}/community-ev-charging-stations` },
  { from: "/solutions/public-charging", to: `${BASE_URL}/public-ev-charging-stations` },
  { from: "/solutions/heavy-vehicles", to: `${BASE_URL}/heavy-duty-ev-charging-station` },
  { from: "/solutions/spider-connect", to: `${BASE_URL}/cpms-ev-charging-point-management-system` },
  { from: "/solutions/spiderev-app", to: `${BASE_URL}/ev-charging-station-app` },
  { from: "/solutions/epc-works", to: `${BASE_URL}/ev-charging-epc-services` },
  { from: "/company/about", to: `${BASE_URL}/about-us` },
  { from: "/company/contact", to: `${BASE_URL}/contact-us` },
  { from: "/franchise", to: `${BASE_URL}/ev-charging-station-franchise` },
  { from: "/roi", to: `${BASE_URL}/ev-charging-station-roi-calculator` },
  { from: "/charge-locator", to: `${BASE_URL}/ev-charging-station-locator` },
];

for (const { from, to } of redirects) {
  const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${to}" />
  <link rel="canonical" href="${to}" />
  <title>Redirecting…</title>
</head>
<body>
  <p>This page has moved. <a href="${to}">Click here</a> if you are not redirected.</p>
</body>
</html>`;
  const redirectDir = join(distDir, from);
  mkdirSync(redirectDir, { recursive: true });
  writeFileSync(join(redirectDir, "index.html"), redirectHtml, "utf-8");
  console.log(`  ↳ redirect: ${from} → ${to}`);
}

const notFoundHtml = `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Page Not Found | Spider Energy</title>
</head>
<body>
  <main><h1>Page not found</h1><p>The requested page does not exist.</p><a href="/">Go to the Spider Energy homepage</a></main>
</body>
</html>`;
writeFileSync(join(distDir, "404.html"), notFoundHtml, "utf-8");

console.log(`\nPre-rendered ${count} routes + ${redirects.length} redirects + 404 page into dist/`);
