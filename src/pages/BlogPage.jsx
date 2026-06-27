import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import { fadeUp, staggerFast, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.webp";
import allBlogPosts from "../data/blog-posts.json";

// Filter published posts and sort by date descending
const publishedPosts = allBlogPosts
  .filter((post) => post.published)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const BlogCard = ({ post }) => {
  const [imgError, setImgError] = useState(false);

  return (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
  >
    <div className="bg-gray-50 h-48 overflow-hidden">
      {!imgError ? (
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="text-center px-4">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-xs text-gray-400 font-medium">{post.category}</p>
          </div>
        </div>
      )}
    </div>
    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-secondary text-xs font-semibold uppercase tracking-wider">{post.category}</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-400 text-xs">{post.readTime}</span>
      </div>
      <h3 className="text-gray-900 font-bold leading-snug mb-3 flex-1">{post.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-gray-400 text-xs">{post.date}</span>
        <Link to={`/blog/${post.slug}`} className="text-primary text-sm font-semibold hover:underline">Read More →</Link>
      </div>
    </div>
  </motion.div>
  );
};

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag") || "";

  // Filter by tag if present
  const blogPosts = activeTag
    ? publishedPosts.filter((p) => (p.tags || []).includes(activeTag))
    : publishedPosts;

  return (
    <PageLayout>
      <Helmet>
        <title>{activeTag ? `${activeTag} — SpiderEV Blog` : "EV Charging Blog — Tips, Guides & News | SpiderEV"}</title>
        <meta name="description" content="Read the latest EV charging guides, industry news and business insights from SpiderEV — your expert resource for electric vehicle charging in India." />
      </Helmet>
      <SEO />{/* Uses default logo OG image for listing page */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-bold text-white"
          >
            SpiderEV Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-white/80 text-lg"
          >
            EV charging insights, guides, and industry analysis.
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          {/* Active tag filter indicator */}
          {activeTag && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gray-600 text-sm">Filtered by:</span>
              <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">#{activeTag}</span>
              <button
                onClick={() => setSearchParams({})}
                className="text-gray-400 hover:text-gray-600 text-sm underline"
              >
                Clear filter
              </button>
            </div>
          )}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </motion.div>
          {blogPosts.length === 0 && (
            <p className="text-center text-gray-500 py-12">No posts found for this tag.</p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogPage;
