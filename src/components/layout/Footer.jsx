import { Link } from "react-router-dom";
import logo from "../../assets/home/spider-ev-logo.webp";

const acProducts = [
  { label: "Spider Mini", href: "/products/ac/spider-mini" },
  { label: "Spider Lite", href: "/products/ac/spider-lite" },
  { label: "Spider Smart", href: "/products/ac/spider-smart" },
  { label: "Spider Blaze", href: "/products/ac/spider-blaze" },
  { label: "Spider Strike", href: "/products/ac/spider-strike" },
  { label: "Spider Dash", href: "/products/ac/spider-dash" },
];

const dcProducts = [
  { label: "Spider Base", href: "/products/dc/spider-base" },
  { label: "Spider Spark", href: "/products/dc/spider-spark" },
  { label: "Spider Fast", href: "/products/dc/spider-fast" },
  { label: "Spider Falcon", href: "/products/dc/spider-falcon" },
  { label: "Spider Hulk", href: "/products/dc/spider-hulk" },
  { label: "Spider Ultra", href: "/products/dc/spider-ultra" },
];

const solutions = [
  { label: "Park & Charge", href: "/park-and-charge-electric-vehicle-ev-charging-station" },
  { label: "Community Charging", href: "/community-ev-charging-stations" },
  { label: "Public Charging", href: "/public-ev-charging-stations" },
  { label: "Heavy Vehicles", href: "/heavy-duty-ev-charging-station" },
  { label: "CPMS (Spider Connect)", href: "/cpms-ev-charging-point-management-system" },
  { label: "Mobile App (SpiderEV)", href: "/ev-charging-station-app" },
  { label: "EPC Works", href: "/ev-charging-epc-services" },
];

const companyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Blog", href: "/blog" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
];

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            to={link.href}
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10 py-16">
        {/* Top: Logo + description + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10 pb-12 border-b border-white/10">
          {/* Brand column */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <img loading="lazy" src={logo} alt="SpiderEV" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              India's trusted EV charging infrastructure company — manufacturing and deploying
              AC & DC chargers across homes, businesses, and highways.
            </p>
            <div className="flex gap-3">
              {/* Instagram */}
              <a href="https://www.instagram.com/spider.ev/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://in.linkedin.com/company/spider-green-energy-solutions" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="LinkedIn">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Gmail / Email */}
              <a href="mailto:connect@spiderenergy.in"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Email">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              </a>
            </div>
          </div>

          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="AC Chargers" links={acProducts} />
          <FooterColumn title="DC Chargers" links={dcProducts} />
          <FooterColumn title="Solutions" links={solutions} />
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <span>© {new Date().getFullYear()} SpiderEV. All rights reserved.</span>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
