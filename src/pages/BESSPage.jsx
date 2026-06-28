import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import { getServiceSchema, getFAQSchema, getBreadcrumbSchema } from "../seo/schemas";
import { bessFaq } from "../data/bessFaq";
import BessHero from "../containers/Bess/BessHero";
import BessIntro from "../containers/Bess/BessIntro";
import BessPillars from "../containers/Bess/BessPillars";
import BessCapacitySelector from "../containers/Bess/BessCapacitySelector";
import BessProductTabs from "../containers/Bess/BessProductTabs";
import BessSpecsTabs from "../containers/Bess/BessSpecsTabs";
import BessComparison from "../containers/Bess/BessComparison";
import BessFeatures from "../containers/Bess/BessFeatures";
import BessAppSection from "../containers/Bess/BessAppSection";
import BessFAQ from "../containers/Bess/BessFAQ";
import BessEnquiry from "../containers/Bess/BessEnquiry";
import BessHowItWorks from "../containers/Bess/BessHowItWorks";

const bessSchema = getServiceSchema({
  name: "BESS — Battery Energy Storage for EV Charging Stations",
  description: "Smart EV charging energy storage solutions with solar powered station setups, renewable charging and battery backup systems in Andhra Pradesh and Telangana.",
  url: "/bess-battery-backup-for-ev-charging-stations",
  serviceType: "Battery Energy Storage System (BESS)",
});
const bessBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "BESS" },
]);
const bessFAQSchema = getFAQSchema(bessFaq);

const BESSPage = () => {
  const [activeSpecProduct, setActiveSpecProduct] = useState("spidervault-3");

  const handleProductSelect = (productId) => {
    setActiveSpecProduct(productId);
    setTimeout(() => {
      document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <PageLayout>
      <Helmet>
        <title>SpiderVault BESS — Battery Energy Storage | AP & TG</title>
        <meta name="description" content="SpiderVault BESS by Spider Energy provides battery energy storage for EV stations, solar projects & industrial backup in Andhra Pradesh & Telangana." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "SpiderVault — Battery Energy Storage System (BESS)",
          "description": "Battery energy storage system for EV charging stations, solar integration and industrial backup in India",
          "brand": {"@type": "Brand", "name": "SpiderEV"},
          "manufacturer": {"@id": "https://spiderenergy.in/#organization"},
          "category": "Energy Storage Systems",
          "offers": {"@type": "Offer", "priceCurrency": "INR", "availability": "https://schema.org/InStock"}
        })}</script>
      </Helmet>
      <SEO schema={bessSchema} schemas={[bessFAQSchema]} breadcrumbs={bessBreadcrumbs} />
      <BessHero />
      <BessIntro />
      <BessPillars />
      <BessHowItWorks />
      <BessCapacitySelector onProductSelect={handleProductSelect} />
      <BessProductTabs onProductSelect={handleProductSelect} />
      <BessSpecsTabs activeProduct={activeSpecProduct} onTabChange={setActiveSpecProduct} />
      <BessComparison />
      <BessFeatures />
      <BessAppSection />
      <BessFAQ />
      <BessEnquiry />
    </PageLayout>
  );
};

export default BESSPage;
