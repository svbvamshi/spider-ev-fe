import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import { fadeUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.png";

/**
 * Blog post data.
 * Each post has an `image` field for the OG image shown when shared on social media.
 * When a blog detail page is built, pass `post.image` as the `ogImage` prop to <SEO />.
 * For now, the listing page uses the default logo-based OG image.
 */
const blogPosts = [
  { id: 1, category: "Technology", title: "How EV Chargers Work: A Complete Guide for Indian EV Owners", date: "28 Feb 2026", readTime: "8 min read", excerpt: "From AC home chargers to 240 kW DC ultra-rapid stations — understand the technology behind every charge.", slug: "how-ev-chargers-work", image: "/blog/how-ev-chargers-work.jpg" },
  { id: 2, category: "Business", title: "How to Start an EV Charging Business in India — 2026 Guide", date: "15 Feb 2026", readTime: "12 min read", excerpt: "Step-by-step guide to launching a profitable EV charging station — from site selection to software management.", slug: "start-ev-charging-business-india", image: "/blog/start-ev-charging-business-india.jpg" },
  { id: 3, category: "Technology", title: "AC vs DC Charging: Which is Right for Your EV?", date: "01 Feb 2026", readTime: "6 min read", excerpt: "Comparing Level 1, Level 2, and DC fast charging — speeds, costs, and the best use cases for Indian EV drivers.", slug: "ac-vs-dc-ev-charging", image: "/blog/ac-vs-dc-ev-charging.jpg" },
  { id: 4, category: "Infrastructure", title: "India's EV Charging Infrastructure: Where We Are and Where We're Headed", date: "20 Jan 2026", readTime: "10 min read", excerpt: "India needs 400,000+ charging stations by 2030. Analyzing the current state, policy landscape, and private sector opportunities.", slug: "india-ev-charging-infrastructure-2026", image: "/blog/india-ev-charging-infrastructure-2026.jpg" },
  { id: 5, category: "Business", title: "EV Charging Franchise: The Complete Investment Guide", date: "10 Jan 2026", readTime: "15 min read", excerpt: "ROI calculations, investment tiers, timeline, and everything you need to know before investing in an EV charging franchise in India.", slug: "ev-charging-franchise-investment-guide", image: "/blog/ev-charging-franchise-investment-guide.jpg" },
  { id: 6, category: "Technology", title: "What is OCPP and Why Does It Matter for EV Charging?", date: "01 Jan 2026", readTime: "7 min read", excerpt: "Open Charge Point Protocol explained — why it ensures interoperability and what to look for when buying EV chargers.", slug: "what-is-ocpp-ev-charging", image: "/blog/what-is-ocpp-ev-charging.jpg" },
];

const BlogCard = ({ post }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
  >
    <div className="bg-gray-50 h-48 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-3xl mb-1">📝</div>
        <p className="text-xs">Blog Image</p>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-secondary text-xs font-semibold uppercase tracking-wider">{post.category}</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-400 text-xs">{post.readTime}</span>
      </div>
      <h3 className="text-gray-900 font-bold leading-snug mb-3 flex-1">{post.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-gray-400 text-xs">{post.date}</span>
        <a href={`/blog/${post.slug}`} className="text-primary text-sm font-semibold hover:underline">Read More →</a>
      </div>
    </div>
  </motion.div>
);

const BlogPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>EV Charging Blog — Tips, Guides &amp; News | SpiderEV</title>
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
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogPage;
