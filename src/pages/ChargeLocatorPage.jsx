import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PageLayout from "../components/layout/PageLayout";
import AppStoreButtons from "../components/ui/AppStoreButtons";
import { fadeUp, staggerContainer, viewport } from "../utils/animationConfig";
import heroBg from "../assets/home/hero-bg.png";
import SEO from "../components/SEO";
import { getSoftwareAppSchema, getBreadcrumbSchema } from "../seo/schemas";

// ---------------------------------------------------------------------------
// Station data (extracted from SpiderEV app screenshots)
// ---------------------------------------------------------------------------
const STATIONS = [
  {
    id: 1,
    name: "Primark Destature_Spider",
    address: "Sy No: 188, HC5M+QMV and 189, Bachupally-Kompally Main Road, Sundar Rao Nagar, Bahadurpally",
    lat: 17.5596,
    lng: 78.4395,
    type: "Public",
  },
  {
    id: 2,
    name: "Primark Econest_Spider",
    address: "Sy.No 509, opposite to Apparel Export Park, Kompally, Gundlapochampalli",
    lat: 17.5665,
    lng: 78.4813,
    type: "Public",
  },
  {
    id: 3,
    name: "Spider_Lansum Eden Gardens",
    address: "Masjid Banda Rd, Kondapur",
    lat: 17.4599,
    lng: 78.3706,
    type: "Public",
  },
  {
    id: 4,
    name: "Spider_Kondapur_Boston",
    address: "Vijetha Midas Touch Apartments, White Field Rd, Kondapur, Venkat Enclave, Whitefields",
    lat: 17.4611,
    lng: 78.3659,
    type: "Public",
  },
  {
    id: 5,
    name: "Seeyan Charge Zone",
    address: "Plot No.170, Sai Lakshmi II phase Khajaguda",
    lat: 17.4129,
    lng: 78.3874,
    type: "Public",
  },
  {
    id: 6,
    name: "Spider_Punjagutta",
    address: "Punjagutta Metro Station, SY no 1/1, 1/2, 1/3, 3/2, 6/1, 6/2",
    lat: 17.4326,
    lng: 78.4485,
    type: "Public",
  },
  {
    id: 7,
    name: "Spider Ev Nagole",
    address: "L&T Metro Rail (Hyderabad) Limited, LB Nagar - Uppal Rd, Laxmi Narayan Nagar Colony, Nagole",
    lat: 17.3762,
    lng: 78.5726,
    type: "Public",
  },
  {
    id: 8,
    name: "Spider_Moosarambagh",
    address: "Next Galleria Mall @ Moosarambagh, NH 65, Saidabad",
    lat: 17.3634,
    lng: 78.5047,
    type: "Public",
  },
  {
    id: 9,
    name: "Spider_Choutuppal",
    address: "Kohara Fuel Services, Choutuppal",
    lat: 17.2506,
    lng: 78.7232,
    type: "Public",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function directionsUrl(userLat, userLng, stationLat, stationLng) {
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/${userLat},${userLng}/${stationLat},${stationLng}`;
  }
  return `https://www.google.com/maps/dir//${stationLat},${stationLng}`;
}

// Custom SVG marker icon
function makeIcon(color = "#293180", size = 32) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <circle cx="16" cy="14" r="11" fill="${color}" stroke="white" stroke-width="2.5"/>
    <path d="M16 32 L10 20 Q16 26 22 20 Z" fill="${color}"/>
    <text x="16" y="19" text-anchor="middle" font-size="13" font-weight="bold" fill="white" font-family="sans-serif">⚡</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

const stationIcon = makeIcon("#293180", 36);
const selectedIcon = makeIcon("#4CAF45", 40);
const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#4CAF45;border:3px solid white;box-shadow:0 0 0 3px #4CAF4566"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Re-centres map when selected station changes
function MapFlyTo({ station }) {
  const map = useMap();
  useEffect(() => {
    if (station) map.flyTo([station.lat, station.lng], 15, { duration: 0.9 });
  }, [station, map]);
  return null;
}

const locatorSchema = getSoftwareAppSchema({
  name: "Spider Energy EV Charging Station Locator",
  description: "Find nearby EV fast charging stations in Andhra Pradesh and Telangana using a smart charge zone locator with real-time availability.",
  url: "/ev-charging-station-locator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
});
const locatorBreadcrumbs = getBreadcrumbSchema([
  { name: "Home", url: "https://spiderenergy.in" },
  { name: "Station Locator" },
]);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const ChargeLocatorPage = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [userPos, setUserPos] = useState(null); // { lat, lng }
  const [locationError, setLocationError] = useState(null);
  const listRef = useRef(null);

  // Request user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location access denied. Distances unavailable."),
    );
  }, []);

  // Stations enriched with distance
  const enriched = STATIONS.map((s) => ({
    ...s,
    distanceKm: userPos ? haversineKm(userPos.lat, userPos.lng, s.lat, s.lng) : null,
  })).sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

  const filtered = enriched.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (station) => {
    setSelected(station);
    // Scroll list item into view on mobile
    if (listRef.current) {
      const el = listRef.current.querySelector(`[data-id="${station.id}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const mapCenter = selected
    ? [selected.lat, selected.lng]
    : [17.4399, 78.4983]; // Hyderabad centre

  return (
    <PageLayout>
      <Helmet>
        <title>EV Charging Station Locator in Andhra Pradesh & Telangana</title>
        <meta name="description" content="Find Nearby EV Fast Charging Stations in Andhra Pradesh and Telangana using a Smart EV Charge Zone Locator and Real-time EV Charging Locator Tools." />
      </Helmet>
      <SEO schema={locatorSchema} breadcrumbs={locatorBreadcrumbs} />
      {/* Header */}
      <section
        className="relative overflow-hidden py-16 sm:py-20"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-bold text-white"
          >
            EV Charging Station Locator in Andhra Pradesh & Telangana
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-white/80 text-lg"
          >
            Locate SpiderEV charging stations near you across Hyderabad.
          </motion.p>
          {locationError && (
            <p className="mt-2 text-yellow-300 text-sm">{locationError}</p>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-8">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by station name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-md border border-gray-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-primary transition-colors bg-white shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Station list */}
            <div ref={listRef} className="lg:col-span-2 space-y-3 max-h-96 lg:max-h-150 overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {filtered.length} Station{filtered.length !== 1 ? "s" : ""}
                {userPos ? " · Sorted by distance" : ""}
              </p>
              {filtered.map((s) => (
                <button
                  key={s.id}
                  data-id={s.id}
                  onClick={() => handleSelect(s)}
                  className={`w-full text-left bg-white rounded-2xl p-4 border-2 shadow-sm hover:border-primary transition-colors ${
                    selected?.id === s.id ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                          {s.type}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight mt-1">{s.name}</h4>
                      <p className="text-gray-400 text-xs mt-1 leading-snug line-clamp-2">{s.address}</p>
                    </div>
                    {/* Direction icon */}
                    <a
                      href={directionsUrl(userPos?.lat, userPos?.lng, s.lat, s.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/80 transition-colors"
                      title="Get Directions"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </a>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                      Available
                    </span>
                    <span className="text-xs text-gray-400">
                      {s.distanceKm != null
                        ? `${s.distanceKm.toFixed(1)} km away`
                        : ""}
                    </span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm">No stations found.</p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-72 sm:h-96 lg:h-130">
                <MapContainer
                  center={mapCenter}
                  zoom={11}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapFlyTo station={selected} />

                  {/* User location marker */}
                  {userPos && (
                    <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                      <Popup>
                        <span className="font-semibold text-sm">Your Location</span>
                      </Popup>
                    </Marker>
                  )}

                  {/* Station markers */}
                  {filtered.map((s) => (
                    <Marker
                      key={s.id}
                      position={[s.lat, s.lng]}
                      icon={selected?.id === s.id ? selectedIcon : stationIcon}
                      eventHandlers={{ click: () => handleSelect(s) }}
                    >
                      <Popup>
                        <div className="text-sm min-w-45">
                          <p className="font-bold text-gray-900 leading-snug">{s.name}</p>
                          <p className="text-gray-500 text-xs mt-1 leading-snug">{s.address}</p>
                          <p className="text-secondary font-semibold text-xs mt-1">Available</p>
                          {s.distanceKm != null && (
                            <p className="text-gray-400 text-xs">{s.distanceKm.toFixed(1)} km away</p>
                          )}
                          <a
                            href={directionsUrl(userPos?.lat, userPos?.lng, s.lat, s.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90"
                          >
                            Get Directions
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Selected station detail */}
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {selected.type}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{selected.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{selected.address}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold px-3 py-1.5 rounded-full bg-secondary text-white">
                      Available
                    </span>
                  </div>
                  {selected.distanceKm != null && (
                    <p className="mt-2 text-sm text-gray-400">
                      📍 {selected.distanceKm.toFixed(1)} km from your location
                    </p>
                  )}
                  <a
                    href={directionsUrl(userPos?.lat, userPos?.lng, selected.lat, selected.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* App Banner */}
      <section
        className="relative overflow-hidden py-12 text-center"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}>
            <motion.p variants={fadeUp} className="text-white font-semibold mb-4">
              Download the SpiderEV app for live availability and real-time navigation
            </motion.p>
            <motion.div variants={fadeUp} className="flex justify-center">
              <AppStoreButtons />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ChargeLocatorPage;
