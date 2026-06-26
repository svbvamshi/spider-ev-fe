import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Critical — loaded eagerly (home page, above-fold)
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";

// Lazy-loaded pages (only fetched when navigated to — reduces initial bundle)
const ACChargersPage = lazy(() => import("../pages/ACChargersPage"));
const DCChargersPage = lazy(() => import("../pages/DCChargersPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));

const ParkAndChargePage = lazy(() => import("../pages/solutions/ParkAndChargePage"));
const CommunityChargingPage = lazy(() => import("../pages/solutions/CommunityChargingPage"));
const PublicChargingPage = lazy(() => import("../pages/solutions/PublicChargingPage"));
const HeavyVehiclesPage = lazy(() => import("../pages/solutions/HeavyVehiclesPage"));
const SpiderConnectPage = lazy(() => import("../pages/solutions/SpiderConnectPage"));
const SpiderEVAppPage = lazy(() => import("../pages/solutions/SpiderEVAppPage"));
const EPCWorksPage = lazy(() => import("../pages/solutions/EPCWorksPage"));

const AboutUsPage = lazy(() => import("../pages/AboutUsPage"));
const ContactUsPage = lazy(() => import("../pages/ContactUsPage"));

const FranchisePage = lazy(() => import("../pages/FranchisePage"));
const ROIPage = lazy(() => import("../pages/ROIPage"));

const BESSPage = lazy(() => import("../pages/BESSPage"));
const HarGharPage = lazy(() => import("../pages/HarGharPage"));
const ChargeLocatorPage = lazy(() => import("../pages/ChargeLocatorPage"));
const NewsPage = lazy(() => import("../pages/NewsPage"));
const BlogPage = lazy(() => import("../pages/BlogPage"));
const BlogDetailPage = lazy(() => import("../pages/BlogDetailPage"));
const GalleryPage = lazy(() => import("../pages/GalleryPage"));
const PartnerWithUsPage = lazy(() => import("../pages/PartnerWithUsPage"));

// Minimal loading fallback (no layout shift)
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* ── Products (new SEO URLs) ── */}
        <Route path="/electric-vehicle-ev-ac-charger" element={<ACChargersPage />} />
        <Route path="/electric-vehicle-ev-dc-charger" element={<DCChargersPage />} />
        <Route path="/products/:category/:productId" element={<ProductDetailPage />} />

        {/* ── Solutions (new SEO URLs) ── */}
        <Route path="/park-and-charge-electric-vehicle-ev-charging-station" element={<ParkAndChargePage />} />
        <Route path="/community-ev-charging-stations" element={<CommunityChargingPage />} />
        <Route path="/public-ev-charging-stations" element={<PublicChargingPage />} />
        <Route path="/heavy-duty-ev-charging-station" element={<HeavyVehiclesPage />} />
        <Route path="/cpms-ev-charging-point-management-system" element={<SpiderConnectPage />} />
        <Route path="/ev-charging-station-app" element={<SpiderEVAppPage />} />
        <Route path="/ev-charging-epc-services" element={<EPCWorksPage />} />

        {/* ── Company (new SEO URLs) ── */}
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />

        {/* ── Standalone (new SEO URLs) ── */}
        <Route path="/ev-charging-station-franchise" element={<FranchisePage />} />
        <Route path="/ev-charging-station-roi-calculator" element={<ROIPage />} />

        {/* ── Other (new SEO URLs) ── */}
        <Route path="/bess-battery-backup-for-ev-charging-stations" element={<BESSPage />} />
        <Route path="/ev-charging-station-locator" element={<ChargeLocatorPage />} />
        <Route path="/news" element={<NewsPage />} />

        {/* ── Unchanged routes ── */}
        <Route path="/har-ghar" element={<HarGharPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/partner-withus" element={<PartnerWithUsPage />} />

        {/* ── Legacy redirects (old URLs → new SEO URLs) ── */}
        <Route path="/products/ac-chargers" element={<Navigate to="/electric-vehicle-ev-ac-charger" replace />} />
        <Route path="/products/dc-chargers" element={<Navigate to="/electric-vehicle-ev-dc-charger" replace />} />
        <Route path="/solutions/park-and-charge" element={<Navigate to="/park-and-charge-electric-vehicle-ev-charging-station" replace />} />
        <Route path="/solutions/community-charging" element={<Navigate to="/community-ev-charging-stations" replace />} />
        <Route path="/solutions/public-charging" element={<Navigate to="/public-ev-charging-stations" replace />} />
        <Route path="/solutions/heavy-vehicles" element={<Navigate to="/heavy-duty-ev-charging-station" replace />} />
        <Route path="/solutions/spider-connect" element={<Navigate to="/cpms-ev-charging-point-management-system" replace />} />
        <Route path="/solutions/spiderev-app" element={<Navigate to="/ev-charging-station-app" replace />} />
        <Route path="/solutions/epc-works" element={<Navigate to="/ev-charging-epc-services" replace />} />
        <Route path="/company/about" element={<Navigate to="/about-us" replace />} />
        <Route path="/company/contact" element={<Navigate to="/contact-us" replace />} />
        <Route path="/franchise" element={<Navigate to="/ev-charging-station-franchise" replace />} />
        <Route path="/roi" element={<Navigate to="/ev-charging-station-roi-calculator" replace />} />
        <Route path="/bess" element={<Navigate to="/bess-battery-backup-for-ev-charging-stations" replace />} />
        <Route path="/charge-locator" element={<Navigate to="/ev-charging-station-locator" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
