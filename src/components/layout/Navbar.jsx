import { motion, AnimatePresence } from "framer-motion";
import useScrollDirection from "../../hooks/useScrollDirection";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/home/spider-ev-logo.png";

const HERO_HEIGHT = 100;

const navDropdowns = {
  Products: [
    { label: "AC Chargers", href: "/electric-vehicle-ev-ac-charger" },
    { label: "DC Chargers", href: "/electric-vehicle-ev-dc-charger" },
  ],
  Solutions: [
    { label: "Park & Charge", href: "/park-and-charge-electric-vehicle-ev-charging-station" },
    { label: "Community Charging", href: "/community-ev-charging-stations" },
    { label: "Public Charging", href: "/public-ev-charging-stations" },
    { label: "Heavy Vehicles", href: "/heavy-duty-ev-charging-station" },
    { label: "CPMS", href: "/cpms-ev-charging-point-management-system" },
    { label: "Mobile App", href: "/ev-charging-station-app" },
    { label: "EPC Works", href: "/ev-charging-epc-services" },
  ],
  Company: [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
  ],
};

const directLinks = [
  { label: "SpiderAtHome", href: "/har-ghar" },
  { label: "Franchise", href: "/ev-charging-station-franchise" },
  { label: "BESS", href: "/bess-battery-backup-for-ev-charging-stations" },
  { label: "ROI", href: "/ev-charging-station-roi-calculator" },
  { label: "Stations", href: "/ev-charging-station-locator" },
  // { label: "News", href: "/news" },
];

const DropdownMenu = ({ items }) => (
  <div className="absolute top-full left-0 mt-2 w-52 rounded-xl shadow-xl z-50 bg-white border border-gray-100 overflow-hidden">
    {items.map((item) => (
      <Link
        key={item.href}
        to={item.href}
        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors"
      >
        {item.label}
      </Link>
    ))}
  </div>
);

const NavItems = ({ fontSize = "text-sm" }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  let closeTimer = null;

  const handleMouseEnter = (key) => {
    if (closeTimer) clearTimeout(closeTimer);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <ul className={`hidden lg:flex items-center gap-4 xl:gap-5 ${fontSize} font-medium`}>
      {Object.entries(navDropdowns).map(([key, items]) => (
        <li
          key={key}
          className="relative"
          onMouseEnter={() => handleMouseEnter(key)}
          onMouseLeave={handleMouseLeave}
        >
          <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors">
            {key}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {openDropdown === key && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenu items={items} />
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
      {directLinks.map((link) => (
        <li key={link.href}>
          {link.newTab ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ) : (
            <Link to={link.href} className="text-gray-600 hover:text-primary transition-colors">
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

const MobileMenu = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {Object.entries(navDropdowns).map(([key, items]) => (
            <div key={key}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-2">
                {key}
              </div>
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100">
            {directLinks.map((link) =>
              link.newTab ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={onClose}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const HamburgerBtn = ({ open, onClick }) => (
  <button className="lg:hidden p-2 text-gray-600" onClick={onClick} aria-label="Toggle menu">
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {open
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  </button>
);

const Navbar = () => {
  const scrollDir = useScrollDirection();
  const [state, setState] = useState("hero");
  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setState("hero");
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (scrollY <= HERO_HEIGHT) { setState("hero"); return; }
    if (scrollDir === "down") setState("hidden");
    else setState("floating");
  }, [scrollDir, scrollY]);

  return (
    <>
      {state === "hero" && (
        <div className="absolute top-0 left-0 w-full z-40">
          <div className="bg-white mx-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-3 flex items-center justify-between">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="SpiderEV Logo" className="h-10 sm:h-12 w-auto" />
            </Link>
            <NavItems fontSize="text-sm" />
            <HamburgerBtn open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
          </div>
          <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        </div>
      )}

      <AnimatePresence>
        {state === "floating" && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
              <Link to="/" className="flex-shrink-0">
                <img src={logo} alt="SpiderEV Logo" className="h-8 sm:h-9 w-auto" />
              </Link>
              <NavItems fontSize="text-xs" />
              <HamburgerBtn open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
            </div>
            <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
