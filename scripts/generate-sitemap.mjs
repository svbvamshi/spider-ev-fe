/**
 * generate-sitemap.mjs
 *
 * Generates sitemap.xml at build time from:
 *   1. Static route definitions (all known pages)
 *   2. Blog posts discovered from src/data/blog-posts.json
 *
 * Run after vite build: node scripts/generate-sitemap.mjs
 * Output: dist/sitemap.xml
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST_DIR = join(ROOT, "dist");
const BLOG_DATA = join(ROOT, "src", "data", "blog-posts.json");
const BASE_URL = "https://spiderenergy.in";

// Today's date in YYYY-MM-DD format for lastmod
const TODAY = new Date().toISOString().split("T")[0];

// ─── Static Routes ──────────────────────────────────────────────────────────

const staticRoutes = [
  // Home
  { path: "/", priority: "1.0", changefreq: "weekly" },

  // Products: AC Chargers
  { path: "/electric-vehicle-ev-ac-charger", priority: "0.9", changefreq: "monthly" },
  { path: "/products/ac/spider-mini", priority: "0.8", changefreq: "monthly" },
  { path: "/products/ac/spider-lite", priority: "0.8", changefreq: "monthly" },
  { path: "/products/ac/spider-smart", priority: "0.8", changefreq: "monthly" },
  { path: "/products/ac/spider-blaze", priority: "0.8", changefreq: "monthly" },
  { path: "/products/ac/spider-strike", priority: "0.8", changefreq: "monthly" },
  { path: "/products/ac/spider-dash", priority: "0.8", changefreq: "monthly" },

  // Products: DC Chargers
  { path: "/electric-vehicle-ev-dc-charger", priority: "0.9", changefreq: "monthly" },
  { path: "/products/dc/spider-base", priority: "0.8", changefreq: "monthly" },
  { path: "/products/dc/spider-fast", priority: "0.8", changefreq: "monthly" },
  { path: "/products/dc/spider-spark", priority: "0.8", changefreq: "monthly" },
  { path: "/products/dc/spider-falcon", priority: "0.8", changefreq: "monthly" },
  { path: "/products/dc/spider-ultra", priority: "0.8", changefreq: "monthly" },
  { path: "/products/dc/spider-surge", priority: "0.8", changefreq: "monthly" },
  { path: "/products/dc/spider-hulk", priority: "0.8", changefreq: "monthly" },

  // Solutions
  { path: "/park-and-charge-electric-vehicle-ev-charging-station", priority: "0.8", changefreq: "monthly" },
  { path: "/community-ev-charging-stations", priority: "0.8", changefreq: "monthly" },
  { path: "/public-ev-charging-stations", priority: "0.8", changefreq: "monthly" },
  { path: "/heavy-duty-ev-charging-station", priority: "0.8", changefreq: "monthly" },
  { path: "/cpms-ev-charging-point-management-system", priority: "0.8", changefreq: "monthly" },
  { path: "/ev-charging-station-app", priority: "0.8", changefreq: "monthly" },
  { path: "/ev-charging-epc-services", priority: "0.8", changefreq: "monthly" },

  // Company
  { path: "/about-us", priority: "0.7", changefreq: "monthly" },
  { path: "/contact-us", priority: "0.7", changefreq: "monthly" },

  // Standalone
  { path: "/ev-charging-station-franchise", priority: "0.8", changefreq: "monthly" },
  { path: "/bess-battery-backup-for-ev-charging-stations", priority: "0.8", changefreq: "monthly" },
  { path: "/ev-charging-station-roi-calculator", priority: "0.7", changefreq: "monthly" },
  { path: "/ev-charging-station-locator", priority: "0.7", changefreq: "weekly" },
  { path: "/har-ghar", priority: "0.7", changefreq: "monthly" },
  { path: "/partner-withus", priority: "0.7", changefreq: "monthly" },

  // Content
  { path: "/news", priority: "0.6", changefreq: "weekly" },
  { path: "/blog", priority: "0.6", changefreq: "weekly" },
  { path: "/gallery", priority: "0.5", changefreq: "monthly" },
];

// ─── Blog Posts ─────────────────────────────────────────────────────────────

let blogRoutes = [];

if (existsSync(BLOG_DATA)) {
  const blogPosts = JSON.parse(readFileSync(BLOG_DATA, "utf-8"));
  blogRoutes = blogPosts
    .filter((post) => post.published)
    .map((post) => ({
      path: `/blog/${post.slug}`,
      priority: "0.6",
      changefreq: "monthly",
      lastmod: post.date,
    }));
}

// ─── Generate XML ───────────────────────────────────────────────────────────

function buildUrlEntry({ path, priority, changefreq, lastmod }) {
  const loc = `${BASE_URL}${path}`;
  const mod = lastmod || TODAY;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const allRoutes = [...staticRoutes, ...blogRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${allRoutes.map(buildUrlEntry).join("\n\n")}

</urlset>
`;

writeFileSync(join(DIST_DIR, "sitemap.xml"), xml, "utf-8");
console.log(`Generated sitemap.xml with ${allRoutes.length} URLs (${staticRoutes.length} static + ${blogRoutes.length} blog)`);
