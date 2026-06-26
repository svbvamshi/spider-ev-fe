/**
 * build-blog.mjs
 *
 * Reads markdown files from content/blog/, parses frontmatter + body,
 * and outputs JSON consumed by the React app and the sitemap/prerender scripts.
 *
 * Outputs:
 *   - src/data/blog-posts.json         (metadata array for listing page + sitemap)
 *   - src/data/blog-content/<slug>.json (per-post { meta, html } for detail page)
 *
 * Zero runtime dependencies beyond gray-matter and marked (devDependencies).
 * Run: node scripts/build-blog.mjs
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content", "blog");
const DATA_DIR = join(ROOT, "src", "data");
const CONTENT_OUT_DIR = join(DATA_DIR, "blog-content");

// Ensure output directories exist
mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(CONTENT_OUT_DIR, { recursive: true });

// Configure marked for clean HTML output
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Read all markdown files
const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

if (files.length === 0) {
  console.log("No blog posts found in content/blog/");
  writeFileSync(join(DATA_DIR, "blog-posts.json"), "[]", "utf-8");
  process.exit(0);
}

const posts = [];

for (const file of files) {
  const raw = readFileSync(join(CONTENT_DIR, file), "utf-8");
  const { data: frontmatter, content } = matter(raw);

  // Validate required fields
  const required = ["title", "slug", "description", "date", "author", "category", "image"];
  const missing = required.filter((field) => !frontmatter[field]);
  if (missing.length > 0) {
    console.warn(`  ⚠ Skipping ${file}: missing fields: ${missing.join(", ")}`);
    continue;
  }

  // Convert markdown to HTML
  const html = marked(content);

  // Build metadata object
  const meta = {
    title: frontmatter.title,
    slug: frontmatter.slug,
    description: frontmatter.description,
    date: frontmatter.date,
    author: frontmatter.author,
    category: frontmatter.category,
    readTime: frontmatter.readTime || "",
    image: frontmatter.image,
    published: frontmatter.published !== false, // default true
  };

  posts.push(meta);

  // Write per-post content file
  writeFileSync(
    join(CONTENT_OUT_DIR, `${frontmatter.slug}.json`),
    JSON.stringify({ meta, html }, null, 2),
    "utf-8"
  );

  console.log(`  ✓ ${frontmatter.slug}`);
}

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write metadata index
writeFileSync(join(DATA_DIR, "blog-posts.json"), JSON.stringify(posts, null, 2), "utf-8");

console.log(`\nProcessed ${posts.length} blog posts → src/data/`);
