import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import { fadeUp, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.png";

const categories = ["All", "Partnerships", "Awards", "Product Launches", "Government", "Expansions"];

/**
 * News items data.
 * Each item has an `image` field for the OG image shown when shared on social media.
 * When a news detail page is built, pass `item.image` as the `ogImage` prop to <SEO />.
 */
const newsItems = [
  { id: 1, category: "Partnerships", title: "SpiderEV partners with India Post to deploy EV chargers at 500+ post offices across India", date: "15/01/2026", url: "#", image: "/news/spiderev-india-post-partnership.jpg" },
  { id: 2, category: "Product Launches", title: "SpiderEV launches Spider Ultra — India's first 240 kW DC ultra-rapid charger", date: "20/12/2025", url: "#", image: "/news/spider-ultra-launch.jpg" },
  { id: 3, category: "Government", title: "SpiderEV selected as preferred charging infrastructure partner under FAME II scheme", date: "10/12/2025", url: "#", image: "/news/fame-ii-partnership.jpg" },
  { id: 4, category: "Expansions", title: "SpiderEV expands network to 15 new cities with 200 new charging stations", date: "01/12/2025", url: "#", image: "/news/network-expansion.jpg" },
  { id: 5, category: "Awards", title: "SpiderEV wins 'Best EV Charging Infrastructure Company 2025' at EV India Awards", date: "15/11/2025", url: "#", image: "/news/ev-india-awards-2025.jpg" },
  { id: 6, category: "Partnerships", title: "SpiderEV signs MoU with Hyderabad Metro Rail for charging stations at 40 metro stations", date: "05/11/2025", url: "#", image: "/news/hyderabad-metro-mou.jpg" },
  { id: 7, category: "Product Launches", title: "SpiderEV App crosses 100,000 downloads — now available in 9 regional languages", date: "20/10/2025", url: "#", image: "/news/app-100k-downloads.jpg" },
  { id: 8, category: "Government", title: "SpiderEV completes installation of 500 DC chargers along NH-48 under government mandate", date: "10/10/2025", url: "#", image: "/news/nh48-charger-installation.jpg" },
];

const NewsCard = ({ item }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
  >
    <div className="bg-gray-50 h-48 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-3xl mb-1">📰</div>
        <p className="text-xs">News Image</p>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <span className="text-secondary text-xs font-semibold uppercase tracking-wider mb-2">{item.category}</span>
      <h3 className="text-gray-900 font-semibold text-sm leading-snug flex-1 mb-4">{item.title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-xs">{item.date}</span>
        <a href={item.url} className="text-primary text-xs font-semibold hover:underline">Know More →</a>
      </div>
    </div>
  </motion.div>
);

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? newsItems : newsItems.filter((n) => n.category === activeCategory);

  return (
    <PageLayout>
      <Helmet>
        <title>Latest EV Charging News in Andhra Pradesh & Telangana</title>
        <meta name="description" content="Stay updated with the latest electric vehicle charging news, EV infrastructure trends and technology insights across Andhra Pradesh and Telangana." />
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
            In the News
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-white/80 text-lg"
          >
            SpiderEV press coverage, partnerships, and announcements.
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          {/* Category Filter */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((c) => (
              <motion.button
                key={c}
                variants={scaleUp}
                onClick={() => setActiveCategory(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === c ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"}`}
              >
                {c}
              </motion.button>
            ))}
          </motion.div>

          {/* News Grid */}
          <motion.div
            key={activeCategory}
            variants={staggerFast}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NewsPage;
