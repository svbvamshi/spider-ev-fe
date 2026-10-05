import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import { getBreadcrumbSchema } from "../seo/schemas";
import heroBg from "../assets/home/hero-bg.webp";

const galleryBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in/" },
  { name: "Gallery" },
]);

const GalleryPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Project Gallery | SpiderEV Installations</title>
        <meta name="description" content="Photos of SpiderEV charger installations across Telangana and Andhra Pradesh. Homes, fleets and public sites." />
      </Helmet>
      <SEO
        breadcrumbs={galleryBreadcrumbs}
        title="Project Gallery | SpiderEV Installations"
        description="Photos of SpiderEV charger installations across Telangana and Andhra Pradesh. Homes, fleets and public sites."
      />
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-bold text-white"
          >
            Installation Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-white/80 text-lg"
          >
            Home charging, public and fleet infrastructure projects.
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-gray-100 p-8 sm:p-10 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">Verified project gallery in preparation</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">We publish an installation only after its project record confirms the photograph, charger model and location. Unverified stock images and invented city captions have been removed from this page.</p>
            <p className="mt-3 text-gray-600 leading-relaxed">The next gallery update will group confirmed work into home AC and public or fleet DC installations. Until those records are approved, contact the site team for relevant references.</p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Request a similar site survey</h2>
          <p className="mt-3 text-gray-600">Share your location, available load and vehicle mix with Spider Energy.</p>
          <Link to="/contact-us" className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-xl font-semibold">Contact the site team</Link>
        </div>
      </section>

    </PageLayout>
  );
};

export default GalleryPage;
