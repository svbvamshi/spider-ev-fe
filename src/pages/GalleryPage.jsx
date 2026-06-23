import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import { fadeUp, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.webp";

const galleryCategories = ["All", "Installations", "Products", "Events", "Partnerships"];

const galleryItems = [
  { id: 1, category: "Installations", label: "DC Fast Charger — Vadodara Station", caption: "60 kW DC installation at commercial complex" },
  { id: 2, category: "Products", label: "Spider Smart AC Charger", caption: "7.4 kW home charger — elegant design" },
  { id: 3, category: "Events", label: "EV India Expo 2025", caption: "SpiderEV booth at EV India Expo, Delhi" },
  { id: 4, category: "Partnerships", label: "India Post MoU Signing", caption: "Strategic partnership with India Post" },
  { id: 5, category: "Installations", label: "Highway Charging Hub — NH48", caption: "120 kW DC charging hub on NH-48" },
  { id: 6, category: "Products", label: "Spider Ultra — 240 kW", caption: "Flagship DC charger product shoot" },
  { id: 7, category: "Events", label: "SpiderEV Franchise Launch", caption: "Franchise model launch event, Mumbai" },
  { id: 8, category: "Installations", label: "Community Charging — Vadodara Society", caption: "AC chargers at residential complex" },
  { id: 9, category: "Partnerships", label: "Delhi Metro Partnership", caption: "Charger installation at metro parking" },
  { id: 10, category: "Products", label: "Spider Hulk — 120 kW", caption: "Heavy-vehicle DC charger" },
  { id: 11, category: "Installations", label: "Fleet Depot — Logistics Partner", caption: "Depot charging for electric fleet" },
  { id: 12, category: "Events", label: "Customer Training — SpiderEV App", caption: "App training session for franchise partners" },
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState(null);

  const filtered = activeCategory === "All" ? galleryItems : galleryItems.filter((g) => g.category === activeCategory);

  return (
    <PageLayout>
      <Helmet>
        <title>EV Charging Station Gallery | SpiderEV</title>
        <meta name="description" content="Browse SpiderEV's gallery of EV charging installations, products, events and partnerships across Andhra Pradesh and Telangana." />
      </Helmet>
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-bold text-white"
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-white/80 text-lg"
          >
            Our installations, products, events, and partnerships.
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          {/* Filter */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-wrap gap-2 mb-10"
          >
            {galleryCategories.map((c) => (
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

          {/* Grid */}
          <motion.div
            key={activeCategory}
            variants={staggerFast}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((item) => (
              <motion.button
                key={item.id}
                variants={scaleUp}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                onClick={() => setLightboxItem(item)}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-400 group-hover:text-gray-500 transition-colors">
                    <div className="text-3xl mb-1">🖼️</div>
                    <p className="text-xs px-2 leading-tight">{item.label}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-3">
                    <p className="text-white text-xs font-medium leading-tight">{item.caption}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-100 h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-5xl mb-2">🖼️</div>
                  <p className="text-sm">{lightboxItem.label}</p>
                </div>
              </div>
              <div className="p-5">
                <span className="text-secondary text-xs font-semibold uppercase tracking-wider">{lightboxItem.category}</span>
                <h3 className="text-gray-900 font-bold mt-1">{lightboxItem.label}</h3>
                <p className="text-gray-500 text-sm mt-1">{lightboxItem.caption}</p>
                <button onClick={() => setLightboxItem(null)} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
                  Close ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default GalleryPage;
