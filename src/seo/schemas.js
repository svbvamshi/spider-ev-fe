/**
 * schemas.js
 *
 * Central JSON-LD structured data generators for spiderenergy.in
 * All schemas follow https://schema.org/ and Google's structured data guidelines.
 */

const BASE_URL = "https://www.spiderenergy.in";

// ─── Organization + WebSite (used on every page) ─────────────────────────────

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Spider Energy",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/spider-ev-logo.png`,
        width: 200,
        height: 60,
      },
      description:
        "India's trusted EV charging infrastructure company — manufacturing and deploying AC & DC chargers across homes, businesses, and highways.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "THub, Raidurgam",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500081",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-9997776080",
          contactType: "sales",
          availableLanguage: ["English", "Hindi", "Telugu"],
          areaServed: "IN",
        },
      ],
      email: "connect@spiderenergy.in",
      sameAs: [
        "https://www.instagram.com/spider.ev/",
        "https://in.linkedin.com/company/spider-green-energy-solutions",
      ],
      areaServed: [
        { "@type": "State", name: "Telangana" },
        { "@type": "State", name: "Andhra Pradesh" },
      ],
      knowsAbout: [
        "Electric Vehicle Charging",
        "EV Chargers",
        "EVSE",
        "EV Infrastructure",
        "AC Chargers",
        "DC Fast Chargers",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "EV Charging Products & Solutions",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "AC EV Chargers (3.3kW - 80kW)",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "DC Fast Chargers (3kW - 240kW)",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "EV Charging Station Installation (EPC)",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Charging Point Management System (CPMS)",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "EV Charging Station Franchise",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Spider Energy",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

// ─── Product Schema ──────────────────────────────────────────────────────────

/**
 * Generate Product schema from product data.
 * @param {object} product - Product object from productData (ProductDetailPage)
 * @param {string} category - "ac" or "dc"
 * @param {string} productId - slug like "spider-smart"
 */
export function getProductSchema(product, category, productId) {
  const typeLabel = category === "ac" ? "AC EV Charger" : "DC Fast EV Charger";
  const categoryLabel =
    category === "ac"
      ? "Electric Vehicle Chargers > AC Chargers"
      : "Electric Vehicle Chargers > DC Fast Chargers";
  const url = `${BASE_URL}/products/${category}/${productId}`;

  const additionalProperty = [
    { "@type": "PropertyValue", name: "Power Output", value: product.power },
    {
      "@type": "PropertyValue",
      name: "Connector Type",
      value: product.connector,
    },
    {
      "@type": "PropertyValue",
      name: "Input Voltage",
      value: product.inputVoltage,
    },
    {
      "@type": "PropertyValue",
      name: "Output Current",
      value: product.outputCurrent,
    },
    {
      "@type": "PropertyValue",
      name: "Protection Rating",
      value: product.ipRating,
    },
    {
      "@type": "PropertyValue",
      name: "Certifications",
      value: product.certifications,
    },
    { "@type": "PropertyValue", name: "Protocol", value: product.ocpp },
  ];

  if (product.outputVoltage) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "DC Output Voltage",
      value: product.outputVoltage,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.power} ${typeLabel}`,
    description: product.tagline,
    brand: { "@type": "Brand", name: "SpiderEV" },
    manufacturer: { "@id": `${BASE_URL}/#organization` },
    category: categoryLabel,
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${BASE_URL}/#organization` },
    },
    additionalProperty,
  };
}

// ─── FAQ Schema ──────────────────────────────────────────────────────────────

/**
 * Generate FAQPage schema from an array of FAQ items.
 * @param {Array<{question: string, answer: string}>} faqItems
 */
export function getFAQSchema(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ─── Breadcrumb Schema ───────────────────────────────────────────────────────

/**
 * Generate BreadcrumbList schema.
 * @param {Array<{name: string, url?: string}>} items - Ordered breadcrumb items
 */
export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

// ─── Service Schema ──────────────────────────────────────────────────────────

/**
 * Generate Service schema for solution pages.
 * @param {object} opts
 * @param {string} opts.name - Service name
 * @param {string} opts.description - Service description
 * @param {string} opts.url - Page URL
 * @param {string} [opts.serviceType] - Type of service
 */
export function getServiceSchema({ name, description, url, serviceType }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${BASE_URL}${url}`,
    serviceType: serviceType || name,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: [
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
    ],
  };
}

// ─── Software Application Schema ─────────────────────────────────────────────

/**
 * Generate SoftwareApplication schema.
 * @param {object} opts
 * @param {string} opts.name
 * @param {string} opts.description
 * @param {string} opts.url
 * @param {string} [opts.applicationCategory]
 * @param {string} [opts.operatingSystem]
 */
export function getSoftwareAppSchema({
  name,
  description,
  url,
  applicationCategory = "UtilitiesApplication",
  operatingSystem = "Android, iOS",
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${BASE_URL}${url}`,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    provider: { "@id": `${BASE_URL}/#organization` },
  };
}

// ─── Local Business Schema ───────────────────────────────────────────────────

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#localbusiness`,
  name: "Spider Energy",
  url: BASE_URL,
  telephone: "+91-9997776080",
  email: "connect@spiderenergy.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "THub, Raidurgam",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500081",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "17.4435",
    longitude: "78.3772",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "$$",
  image: `${BASE_URL}/spider-ev-logo.png`,
  sameAs: [
    "https://www.instagram.com/spider.ev/",
    "https://in.linkedin.com/company/spider-green-energy-solutions",
  ],
};

// ─── ItemList Schema (for product listing pages) ─────────────────────────────

/**
 * Generate ItemList schema for product catalog pages.
 * @param {Array<{name: string, url: string, position?: number}>} items
 * @param {string} listName
 */
export function getItemListSchema(items, listName) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${BASE_URL}${item.url}`,
    })),
  };
}
