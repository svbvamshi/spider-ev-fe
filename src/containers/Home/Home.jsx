import Navbar from "../../components/layout/Navbar";
import PageContainer from "../../components/layout/PageContainer";
import HeroSection from "./HeroSection";
import BrandArchitectureSection from "./BrandArchitectureSection";
import StatsSection from "./StatsSection";
import ChargersSection from "./ChargersSection";
import ChargingSolutionsSection from "./ChargingSolutionsSection";
import BrandsSection from "./BrandsSection";
import AppSection from "./AppSection";
import CitiesSection from "./CitiesSection";
import Footer from "../../components/layout/Footer";
import WhatsAppFloat from "../../components/ui/WhatsAppFloat";

const Home = () => {
  return (
    <PageContainer>
      <Navbar />
      <HeroSection />
      <BrandArchitectureSection />
      <StatsSection />
      <ChargersSection />
      <ChargingSolutionsSection />
      <BrandsSection />
      <AppSection />
      <CitiesSection />
      <Footer />
      <WhatsAppFloat />
    </PageContainer>
  );
};

export default Home;
