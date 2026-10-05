import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import AppDownloadCTA from "../components/ui/AppDownloadCTA";
import { getProductSchema, getBreadcrumbSchema, getFAQSchema } from "../seo/schemas";
import { fadeUp, fadeLeft, fadeRight, scaleUp, staggerContainer, staggerFast, viewport } from "../utils/animationConfig";
import acImg from "../assets/home/AcCharger.webp";
import dcImg from "../assets/home/DcCharger.webp";
import heroBg from "../assets/home/hero-bg.webp";
import sparkDcImg from "../assets/chargers/spark.webp";
import surgeDcImg from "../assets/chargers/surge.webp";
import ultraDcImg from "../assets/chargers/ultra.webp";

// Per-product image overrides (DC only; AC all use acImg)
const productImages = {
  "spider-spark": sparkDcImg,
  "spider-ultra": ultraDcImg,
  "spider-surge": surgeDcImg,
};

const productImageDimensions = {
  "spider-spark": { width: 853, height: 1280 },
  "spider-ultra": { width: 853, height: 1280 },
  "spider-surge": { width: 1024, height: 1536 },
};

const productData = {
  ac: {
    "spider-mini": {
      name: "Spider Mini",
      tagline: "Compact single-phase AC charger built for all-weather home use",
      power: "3.3 kW",
      connector: "IEC 60309 Socket (Heavy Duty)",
      protocol: "OCPP 1.6J",
      inputVoltage: "180 – 300 V AC, Single Phase",
      operatingVoltage: "220 – 240 V AC",
      outputCurrent: "16 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Mini is the entry-level AC charger designed specifically for home and apartment overnight charging. At 3.3 kW, it delivers steady, reliable charging that's perfectly matched to residential single-phase power without requiring any electrical upgrades or special wiring – just a standard 16A socket.

What sets Spider Mini apart in this power tier is its all-weather IP67 rating and heavy-duty IEC 60309 socket connector. While most budget home chargers use standard plugs that can't handle outdoor installation, Spider Mini is built to be mounted in open parking spaces, covered carports, or apartment building common areas where weather exposure is a factor. The IP67 rating means it's dust-tight and can handle temporary immersion in water, so monsoon rain or dust storms won't affect reliability.

For home buyers with a single EV used primarily for daily commuting, Spider Mini is ideal for overnight charging. A typical 30 kWh battery pack will charge from near-empty to full in 8-10 hours – exactly the window most vehicles sit parked at home overnight. This makes it a set-and-forget solution: plug in when you get home, and you start each day with a full charge without needing to monitor charging progress or rush to a public station.

The RFID and app authentication features make Spider Mini suitable for shared parking environments too – apartment complexes or small residential societies can install these units in common parking areas and assign access to specific residents, tracking usage per vehicle without requiring a full commercial charge management system.`,
      faqs: [
        {
          question: "How fast does Spider Mini charge?",
          answer: "Spider Mini charges at 3.3 kW, delivering approximately 15-20 km of range per hour of charging. A typical 30 kWh EV battery will fully charge overnight in 8-10 hours, making it ideal for daily commuting where the vehicle is parked at home for extended periods."
        },
        {
          question: "What type of vehicles is Spider Mini suitable for?",
          answer: "Spider Mini is suitable for all 4-wheeler EVs with AC charging capability. It's designed for home users with single-phase power supply who primarily use their vehicle for daily commuting and can charge overnight. It works with any EV that accepts single-phase AC charging via the IEC 60309 connector."
        },
        {
          question: "Where can Spider Mini be installed?",
          answer: "Spider Mini can be installed in home garages, covered carports, open parking spaces, and apartment common areas. Its IP67 weather protection rating means it can handle outdoor installation and exposure to rain, dust, and temperature variations typical of Indian climate conditions."
        },
        {
          question: "Do I need any special electrical work to install Spider Mini?",
          answer: "No. Spider Mini works with standard single-phase residential power (180-300V AC) and requires only a 16A circuit – the same as a typical air conditioner or water heater. Most homes can install it without upgrading their electrical panel, though it's always recommended to have a certified electrician verify compatibility."
        }
      ],
      features: [
        "IP67 all-weather protection",
        "Heavy-duty IEC 60309 connector",
        "No electrical upgrade required",
        "Overnight home charging optimized",
        "RFID & App Authentication",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
      ],
    },
    "spider-lite": {
      name: "Spider Lite",
      tagline: "Smart single-phase charger with free installation and app monitoring",
      power: "3.3 kW",
      connector: "IEC 60309 Socket (Heavy Duty)",
      protocol: "OCPP 1.6J",
      inputVoltage: "180 – 300 V AC, Single Phase",
      operatingVoltage: "220 – 240 V AC",
      outputCurrent: "16 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Lite is designed for home and apartment overnight charging where speed isn't the priority but reliability and cost-effectiveness are. At 3.3 kW, it's the entry-level AC charging solution that matches what most Indian homes can support on standard single-phase 16A circuits without requiring any electrical upgrades or panel modifications.

The key differentiator for Spider Lite is the included free installation and app-based remote monitoring. Many first-time EV buyers underestimate installation complexity — getting a charger wired correctly, grounded properly, and positioned for convenient cable reach. Spider Lite bundles that into the purchase, removing one friction point from home EV adoption.

The companion app lets you track charging history, monitor power consumption, and receive alerts when charging completes or if any faults occur. For overnight charging scenarios where you plug in at 10 PM and wake up with a full battery at 7 AM, that 8-9 hour window is more than sufficient for most daily commutes, even with a 3.3 kW charging rate.

Spider Lite is ideal for apartment dwellers with assigned parking spots, homeowners installing their first EV charger, or as an affordable backup unit for commercial properties that need basic Level 2 AC charging without the cost of higher-power installations. The RFID and app authentication also make it suitable for shared parking areas in gated communities where you want controlled access but don't need a full commercial charging management system.`,
      faqs: [
        {
          question: "How fast does Spider Lite charge?",
          answer: "Spider Lite charges at 3.3 kW, which adds approximately 12-15 km of range per hour of charging. For most daily commutes of 40-60 km, an overnight charge of 8-9 hours will fully replenish your battery."
        },
        {
          question: "What type of vehicles is Spider Lite suitable for?",
          answer: "Spider Lite works with all electric vehicles that support AC charging via the IEC 60309 socket standard. This includes most 4-wheeler EVs available in India. It's particularly well-suited for daily commuter vehicles used in city driving."
        },
        {
          question: "Where can Spider Lite be installed?",
          answer: "Spider Lite is designed for home and apartment installations. It works on standard single-phase residential power supplies and comes with free installation included. It can be mounted in covered parking spots, garages, or designated EV charging areas in apartment complexes."
        },
        {
          question: "Do I need to upgrade my home electrical panel to install Spider Lite?",
          answer: "No. Spider Lite operates on standard 16A single-phase circuits that are already present in most Indian homes. As long as you have a dedicated 16A circuit available, no panel upgrade is required."
        }
      ],
      features: [
        "Free installation included",
        "Remote app monitoring and control",
        "RFID & App Authentication",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
      ],
    },
    "spider-smart": {
      name: "Spider Smart",
      tagline: "7.4 kW Type 2 charger with smart app control and dynamic load management",
      metaTitle: "Spider Smart — 7.4 kW Type 2 AC EV Charger | SpiderEV",
      metaDescription: "7.4 kW Type 2 AC EV charger with smart app control and dynamic load management. Perfect for home and commercial EV charging in Andhra Pradesh & Telangana.",
      metaKeywords: "7.4 kW Type 2 AC EV charger India, smart AC charger AP, Type 2 home charger Telangana, dynamic load EV charger India, Spider Smart",
      power: "7.4 kW",
      connector: "Type 2 (IEC 62196)",
      protocol: "OCPP 1.6J",
      inputVoltage: "210 – 280 V AC, Single Phase",
      operatingVoltage: "220 – 260 V AC",
      outputCurrent: "32 A",
      ipRating: "IP67",
      management: "Dynamic load management, remote app monitoring and control",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Smart is for anyone wanting faster than basic home charging but not wanting to upgrade to a three-phase commercial system. It will charge at 7.4 kW with a single-phase Type 2 connector, some 2-3x faster than a regular 3.3 kW home unit – the difference between a full overnight top-up and needing 10+ hours to get the same charge.

The dynamic load management is what makes this more than a basic AC charger. It watches the total electrical draw of your home in real time, and when other high-draw appliances come on, it automatically reduces the charging current instead of tripping your main breaker. For Indian homes that run ACs and water heaters on the same panel, that's not a convenience feature – it's what makes 7.4 kW charging possible on typical residential wiring without an electrical upgrade.

The companion app provides remote start/stop control, charging session history and scheduling – useful for taking advantage of any time-of-day electricity tariff your DISCOM might offer, since you can set the charger to start once cheaper night-rate power kicks in rather than charging manually at peak rates.

Spider Smart works great in smaller commercial environments too—offices with a few employee EVs, to name one—where the RFID authentication enables you to track charger usage without a full commercial CPMS deployment.`,
      faqs: [
        {
          question: "How much faster does the Spider Smart charge compared to a basic 3.3 kW charger?",
          answer: "The Spider Smart charges at 7.4kW which is around 2-3 times faster than a standard 3.3kW home charger, so will greatly reduce a standard overnight charge time depending on your EV's battery size."
        },
        {
          question: "Do I need an electrical upgrade to install a Spider Smart charger at home?",
          answer: "Most existing single-phase supply homes can handle 7.4 kW charging. Dynamic load management also protects your panel by automatically reducing the charging current when other appliances are using power. Check that the installation site is compatible."
        },
        {
          question: "Can I schedule charging to run during off-peak electricity hours?",
          answer: "Yes. The SpiderEV app also allows you to schedule charging sessions, which is useful if your DISCOM has a time-of-day tariff with cheaper night-rate electricity."
        },
        {
          question: "Is the Spider Smart suitable for small offices, not just homes?",
          answer: "Yeah. RFID authentication allows small offices or shared parking areas to track usage per employee without deploying a full commercial charge point management solution."
        }
      ],
      features: [
        "Dynamic load management",
        "Remote app monitoring and control",
        "Charging session scheduling",
        "RFID authentication",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
      ],
    },
    "spider-blaze": {
      name: "Spider Blaze",
      tagline: "22 kW three-phase AC charger for fleets and commercial installations",
      metaTitle: "Spider Blaze — 22 kW Type 2 AC EV Charger | SpiderEV",
      metaDescription: "22 kW three-phase Type 2 AC EV charger designed for commercial fleets and small business installations in Andhra Pradesh & Telangana. OCPP 1.6J, IP67 rated.",
      metaKeywords: "22 kW AC charger India, three phase EV charger, Type 2 commercial charger AP, fleet charging Telangana, Spider Blaze",
      power: "22 kW",
      connector: "Type 2 (IEC 62196)",
      protocol: "OCPP 1.6J",
      inputVoltage: "400 – 460 V AC, Three Phase",
      operatingVoltage: "410 – 450 V AC",
      outputCurrent: "32 A",
      ipRating: "IP67",
      management: "RFID authentication, remote monitoring via SpiderConnect CPMS",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Blaze occupies the sweet spot between residential and heavy commercial charging. At 22 kW on three-phase power, it's roughly 3x faster than a typical 7.4 kW home charger and 6-7x faster than basic single-phase units — the difference between a full charge overnight versus needing most of the next day. For small commercial fleets, office parking, or retail sites with a handful of employee or customer EV bays, that speed advantage translates into practical operational benefit without requiring the electrical infrastructure of a DC fast charger.

The three-phase requirement does mean Spider Blaze isn't a drop-in for most Indian homes, which run single-phase supplies. But for commercial properties — offices, small warehouses, retail locations — three-phase is standard, and 22 kW charging becomes viable without major panel upgrades. This makes Spider Blaze well-suited to businesses adding EV charging as an employee perk or customer amenity, where utilization isn't high enough to justify DC but single-phase AC is too slow for daytime top-ups.

RFID authentication and SpiderConnect CPMS integration allow site operators to track usage per vehicle or employee, set access controls, and monitor uptime remotely. For a small fleet — delivery vans, sales vehicles, service technicians — that visibility helps manage charging schedules and catch issues before they impact vehicle availability.

The IP67 ingress protection and all-weather build mean Spider Blaze can be installed outdoors in open parking areas without requiring dedicated enclosures, keeping installation costs lower than indoor-only units. Combined with BIS certification and OCPP 1.6J support, Spider Blaze fits into India's emerging commercial charging landscape as a reliable mid-tier AC option that bridges the gap between home charging and public DC infrastructure.`,
      faqs: [
        {
          question: "How fast does Spider Blaze charge compared to home chargers?",
          answer: "Spider Blaze charges at 22 kW, which is approximately 3 times faster than a 7.4 kW home charger and 6-7 times faster than a basic 3.3 kW single-phase unit. This means a typical EV can be fully charged overnight in 4-6 hours instead of 10-12 hours, making it ideal for commercial settings where vehicles need to be ready for use during business hours."
        },
        {
          question: "What type of vehicles is Spider Blaze suitable for?",
          answer: "Spider Blaze is designed for 4-wheeler passenger EVs and light commercial vehicles that support Type 2 AC charging. It's particularly well-suited for small commercial fleets, office employee charging, retail customer parking, and mixed-use developments where faster charging than home units is needed but DC fast charging infrastructure isn't justified."
        },
        {
          question: "Where can Spider Blaze be installed?",
          answer: "Spider Blaze can be installed at any commercial property with three-phase electrical supply — offices, retail stores, small warehouses, apartment complexes, and business parking areas. The IP67 rating allows for outdoor installation in open parking lots without requiring weatherproof enclosures, reducing installation costs."
        },
        {
          question: "Do I need three-phase power to install Spider Blaze?",
          answer: "Yes, Spider Blaze requires a three-phase electrical connection (400-460V AC) to deliver its full 22 kW charging power. Most commercial and industrial properties in India already have three-phase supply as standard, but residential homes typically do not, making Spider Blaze primarily a commercial solution."
        }
      ],
      features: [
        "Three-phase 22 kW fast charging",
        "Type 2 (IEC 62196) connector",
        "RFID authentication for access control",
        "SpiderConnect CPMS integration",
        "Remote monitoring and diagnostics",
        "IP67 weatherproof outdoor rating",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
      ],
    },
    "spider-strike": {
      name: "Spider Strike",
      tagline: "40 kW high-power three-phase AC charger for commercial fleets",
      power: "40 kW",
      connector: "Type 2 (IEC 62196)",
      protocol: "OCPP 1.6J",
      inputVoltage: "400 – 460 V AC, Three Phase",
      operatingVoltage: "410 – 450 V AC",
      outputCurrent: "55 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Strike is engineered for commercial operations that need more power than standard 22 kW AC but don't yet require the capital outlay of DC fast charging infrastructure. At 40 kW, it sits in that middle tier where fleet operators can charge multiple vehicles simultaneously or use dual-gun setups to serve two EVs at once, cutting dwell times nearly in half compared to typical 22 kW units.

The three-phase 55 A output per gun makes Spider Strike practical for taxi fleets, delivery vans, and commercial car parks where vehicles return for scheduled charging between shifts. It's powerful enough to meaningfully reduce downtime—charging a typical 50 kWh battery from 20% to 80% in about 45-60 minutes—but doesn't require the grid capacity or upfront investment that DC infrastructure demands.

What sets the Spider Strike apart in this power class is its dual-gun capability. Many commercial sites have multiple vehicles arriving at shift end, and being able to charge two simultaneously at 40 kW total (split intelligently by the charger based on vehicle acceptance rates) means higher utilization per square meter of parking real estate. OCPP 1.6J ensures integration with fleet management systems for usage tracking, scheduling, and remote troubleshooting.

The IP67-rated enclosure is built for outdoor installation without additional weatherproofing. Combined with RFID authentication, Spider Strike works in mixed-use scenarios like office complexes or retail centers where you need to differentiate between employee fleet vehicles and public or guest charging—something residential-grade chargers can't handle at scale.`,
      faqs: [
        {
          question: "How fast does Spider Strike charge compared to standard AC chargers?",
          answer: "Spider Strike delivers 40 kW, which is nearly twice as fast as a 22 kW AC charger. For a typical fleet vehicle with a 50 kWh battery, you can expect a 20-80% charge in 45-60 minutes, compared to 90+ minutes with standard commercial AC units."
        },
        {
          question: "What type of vehicles is Spider Strike suitable for?",
          answer: "Spider Strike is ideal for commercial fleet applications—taxi services, delivery vans, ride-share operators, and employee fleet vehicles at corporate campuses. It's designed for 4-wheeler EVs that need faster turnaround than home charging but don't require DC fast charging infrastructure."
        },
        {
          question: "Where can Spider Strike be installed?",
          answer: "Spider Strike is built for commercial outdoor installations with IP67 weatherproofing. Common deployment sites include fleet depots, commercial parking facilities, corporate campuses, retail centers, and mixed-use developments where multiple vehicles need scheduled charging between operational shifts."
        },
        {
          question: "Can Spider Strike charge two vehicles at the same time?",
          answer: "Yes. Spider Strike supports dual-gun operation, allowing two vehicles to charge simultaneously. The 40 kW output is intelligently distributed between both guns based on each vehicle's charging acceptance rate, maximizing throughput and parking space utilization for commercial sites."
        }
      ],
      features: [
        "Dual-gun simultaneous charging capability",
        "OCPP 1.6J fleet management integration",
        "55 A per gun output for fast turnaround",
        "IP67 weatherproof outdoor installation",
        "RFID access control for mixed-use sites",
        "Three-phase commercial power compatibility",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
      ],
    },
    "spider-dash": {
      name: "Spider Dash",
      tagline: "80 kW dual-gun three-phase AC charger for high-throughput commercial sites",
      metaTitle: "Spider Dash — 80 kW Dual-Gun AC EV Charger | SpiderEV",
      metaDescription: "80 kW dual-gun three-phase AC EV charger for commercial fleets and high-throughput sites. Charge two vehicles simultaneously with OCPP 1.6J support.",
      metaKeywords: "80 kW AC charger India, dual gun EV charger, commercial fleet charger AP, three-phase AC charger Telangana, Spider Dash",
      power: "80 kW",
      connector: "Type 2 (IEC 62196)",
      protocol: "OCPP 1.6J",
      inputVoltage: "400 – 460 V AC, Three Phase",
      operatingVoltage: "410 – 450 V AC",
      outputCurrent: "55 A per Gun",
      ipRating: "IP67",
      management: "Dual simultaneous charging, RFID authentication, remote monitoring via SpiderEV app",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Dash is the top-tier AC charging solution for commercial operators who need to charge multiple vehicles simultaneously without investing in DC fast-charging infrastructure. With 80 kW split across two Type 2 guns, each delivering up to 55 A, you can service two fleet vehicles at the same time – doubling your station throughput compared to a single-gun unit.

This makes Spider Dash ideal for taxi and ride-hailing depots, corporate campuses with employee EV programs, or franchise petrol pump sites adding EV charging as an ancillary service. Instead of vehicles queuing for a single charge point, two can charge in parallel, reducing wait times and improving asset utilisation during peak hours.

The dual-gun configuration is particularly valuable for operators working with mixed fleets. You might have some vehicles that need a full overnight charge and others that only need a quick top-up between shifts. Spider Dash handles both scenarios simultaneously without requiring separate installations or additional electrical upgrades for a second standalone unit.

OCPP 1.6J compliance means Spider Dash integrates with third-party charge point management systems, enabling fleet managers to monitor usage, schedule maintenance windows, and track per-vehicle charging costs remotely. The RFID authentication ensures that only authorised drivers can initiate sessions, which is critical for shared depot environments or sites open to multiple tenant companies.`,
      faqs: [
        {
          question: "How fast does Spider Dash charge compared to home chargers?",
          answer: "Spider Dash delivers 80 kW total across two guns (up to 40 kW per vehicle), which is 5-10x faster than typical 7-22 kW home AC chargers. This makes it suitable for commercial scenarios where vehicles need to be back on the road quickly."
        },
        {
          question: "What type of vehicles is Spider Dash suitable for?",
          answer: "Spider Dash works with any EV that has a Type 2 AC charging port and can accept three-phase power. This includes passenger cars, commercial vans, and small delivery vehicles commonly used in fleet operations."
        },
        {
          question: "Where can Spider Dash be installed?",
          answer: "Spider Dash is designed for commercial locations with three-phase power supply – taxi depots, ride-hailing hubs, corporate parking lots, franchise petrol pumps, and shopping mall parking. It requires 400-460V three-phase electrical infrastructure."
        },
        {
          question: "Can both guns be used at the same time?",
          answer: "Yes. Spider Dash supports simultaneous dual charging, so two vehicles can charge at the same time without waiting. This is what makes it ideal for high-turnover commercial sites where multiple vehicles need charging during the same shift window."
        }
      ],
      features: [
        "Dual simultaneous charging (2 vehicles at once)",
        "80 kW total / 40 kW per gun maximum",
        "OCPP 1.6J for third-party CPMS integration",
        "RFID authentication for fleet access control",
        "Remote monitoring via SpiderEV app",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
      ],
    },
  },
  dc: {
    "spider-base": {
      name: "Spider Base",
      tagline: "3–12 kW modular DC charger with IS 17017-2-6 connector for light EVs",
      power: "3 – 12 kW",
      connector: "Type 6 (IS 17017-2-6)",
      protocol: "OCPP 1.6J",
      inputVoltage: "230 V AC, Single Phase",
      operatingVoltage: "—",
      outputVoltage: "20 – 120 V DC",
      outputCurrent: "0 – 100 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Base is SpiderEV's entry-level DC charger, designed specifically for 2-wheelers, e-rickshaws, and light electric vehicles that operate on lower-voltage battery systems. At 3-12 kW, it sits between basic AC overnight charging and the higher-power DC fast chargers built for passenger cars — bridging that gap for vehicle segments that need faster turnaround than AC but don't have the battery architecture to accept 60 kW+ DC input.

What sets Spider Base apart from other chargers in this power tier is the modular 3-12 kW range combined with the IS 17017-2-6 connector (Type 6). That standard was specifically adopted in India for 2- and 3-wheeler EVs — vehicles that typically run 48V to 120V battery packs. Most DC chargers on the market target 4-wheelers with CCS2 or CHAdeMO connectors and 200V+ output voltage, making them incompatible with light EVs that can't handle that voltage range. Spider Base outputs 20-120V DC, matching the exact operating range of India's growing fleet of electric 2-wheelers and auto-rickshaws.

The modular power design means fleet operators can deploy the same hardware for different vehicle types — 3 kW for smaller e-rickshaw batteries, 12 kW for premium electric scooters with larger packs — without needing separate charger models. That's particularly useful for mixed fleets where delivery companies or ride-hailing operators run both light commercial 3-wheelers and electric mopeds from the same depot.

Spider Base is most commonly deployed at small commercial sites: delivery hubs, last-mile logistics depots, and public 2-wheeler charging points in urban areas where commuters need a quick top-up during work hours rather than overnight home charging. A typical electric scooter with a 3-4 kWh battery can go from 20% to 80% in under 30 minutes on a 12 kW Spider Base — fast enough for a lunch break charge, but without requiring the three-phase power infrastructure that higher-wattage DC chargers demand.

The single-phase 230V AC input is another practical consideration. Most small commercial sites and residential areas in India have single-phase supply. Spider Base works within that constraint, making it viable for franchise partners and small business owners who want to offer public charging without a costly electrical panel upgrade. IP67 weatherproofing and BIS certification mean it can be installed outdoors in India's monsoon climate without requiring a dedicated shelter.`,
      faqs: [
        {
          question: "How fast does Spider Base charge a 2-wheeler EV?",
          answer: "Charging speed depends on your vehicle's battery size and the selected power level (3-12 kW). A typical electric scooter with a 3-4 kWh battery can charge from 20% to 80% in approximately 25-35 minutes at 12 kW, or around 60-90 minutes at 3 kW."
        },
        {
          question: "What type of vehicles is Spider Base suitable for?",
          answer: "Spider Base is designed for 2-wheelers (electric scooters, mopeds), e-rickshaws, and light commercial EVs that use 48V to 120V battery systems. It uses the IS 17017-2-6 (Type 6) connector standard adopted for light EVs in India."
        },
        {
          question: "Where can Spider Base be installed?",
          answer: "Spider Base is ideal for delivery hubs, last-mile logistics depots, small commercial sites, and public 2-wheeler charging points in urban areas. It runs on single-phase 230V AC power, so it doesn't require three-phase infrastructure, making it suitable for most residential and small commercial locations."
        },
        {
          question: "Can Spider Base charge 4-wheeler passenger EVs?",
          answer: "No. Spider Base outputs 20-120V DC and uses the Type 6 (IS 17017-2-6) connector, which is designed for light EVs. Passenger cars typically require 200V+ DC charging via CCS2 or CHAdeMO connectors. For 4-wheelers, consider Spider Spark, Spider Fast, or higher-power DC models."
        }
      ],
      features: [
        "Modular 3-12 kW power range",
        "IS 17017-2-6 (Type 6) connector for 2/3-wheelers",
        "Single-phase 230V AC input (no 3-phase required)",
        "20-120V DC output for light EV battery systems",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-spark": {
      name: "Spider Spark",
      tagline: "60 kW DC fast charger with CCS2 / CHAdeMO for public and commercial charging",
      metaTitle: "Spider Spark — 60 kW DC Fast EV Charger | SpiderEV",
      metaDescription: "60 kW DC fast charger with CCS2 / CHAdeMO connectors for public charging stations and highway corridors. Rapid charging for commercial EV networks in India.",
      metaKeywords: "60 kW DC charger India, CCS2 CHAdeMO charger, public EV charging station, highway fast charger AP, commercial DC charger Telangana, Spider Spark",
      power: "60 kW",
      connector: "CCS2 / CHAdeMO",
      protocol: "OCPP 1.6J",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 150 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Spark sits in the sweet spot for public charging infrastructure — fast enough to serve highway corridors and commercial hubs, but not so high-powered that it requires costly electrical upgrades or grid reinforcement at every site. At 60 kW, it can add 200+ km of range to most passenger EVs in 20-30 minutes, which is the practical threshold for a highway rest stop or shopping mall parking session. This charging speed makes it ideal for locations where drivers naturally spend 20-40 minutes — food courts, shopping centers, highway rest stops, or office campuses.

The dual-connector design (CCS2 + CHAdeMO) means a single unit can service the full range of EVs on Indian roads today. CCS2 handles most new passenger vehicles — the Tata Nexon EV, MG ZS EV, Hyundai Kona, and newer models from Mahindra and BYD. CHAdeMO covers older imports and certain commercial vehicles still using that standard, including some Nissan Leaf imports and legacy commercial EV models. For a site operator, that's one charger doing the work of two and avoiding the "sorry, wrong connector" customer experience that kills repeat visits and damages site reputation.

Spider Spark is targeted at three distinct use cases. First, highway corridor operators setting up charging networks along inter-city routes need fast enough charging to keep stops under 30 minutes without requiring the electrical infrastructure of 120 kW or 180 kW systems. Second, commercial property owners — shopping malls, office parks, hotel chains — adding charging as an amenity for customers or tenants need a solution that provides meaningful charging speed without consuming excessive power capacity. Third, fleet depot operators running mixed commercial fleets benefit from the dual-connector flexibility and the ability to charge multiple vehicles throughout the day without thermal throttling issues.

OCPP 1.6J compliance ensures the Spider Spark integrates with any standards-compliant charge point management system, whether you're running SpiderConnect or a third-party CPMS. That matters for multi-site operators who need centralized billing, remote diagnostics and uptime monitoring across a network rather than managing chargers as isolated units. Dynamic pricing, load management, and usage analytics all flow through the OCPP protocol, making the Spark a networked asset rather than standalone hardware.

IP67 ingress protection and the full suite of electrical protections (overcurrent, surge, ground fault, thermal cutoff) make this suitable for outdoor installations in the variable Indian climate — monsoon downpours one season, 45°C summers the next. RFID and app authentication support both public pay-per-use scenarios and private fleet applications where access control and usage tracking are required. BIS certification ensures compliance with Indian safety and quality standards, a mandatory requirement for commercial charging infrastructure deployment.`,
      faqs: [
        {
          question: "How fast does Spider Spark charge an electric vehicle?",
          answer: "Spider Spark delivers 60 kW DC fast charging, which typically adds 200+ km of range to most passenger EVs in 20-30 minutes, depending on the vehicle's battery size and charging acceptance rate."
        },
        {
          question: "What type of vehicles is Spider Spark suitable for?",
          answer: "Spider Spark is designed for passenger EVs and light commercial vehicles using CCS2 or CHAdeMO connectors. It's ideal for public charging networks, highway rest stops, shopping malls, and commercial fleet depots."
        },
        {
          question: "Where can Spider Spark be installed?",
          answer: "Spider Spark is suitable for outdoor public charging stations, highway corridors, commercial parking lots, and fleet depots. Its IP67 rating makes it weather-resistant for Indian climate conditions including monsoons and high summer temperatures."
        },
        {
          question: "Does Spider Spark support both CCS2 and CHAdeMO connectors?",
          answer: "Yes. Spider Spark comes with both CCS2 and CHAdeMO connectors, allowing it to charge the full range of EVs on Indian roads with a single unit, covering both modern passenger vehicles and older imports or commercial vehicles."
        }
      ],
      features: [
        "Dual CCS2 + CHAdeMO connectors",
        "OCPP 1.6J compliance",
        "IP67 weather-resistant enclosure",
        "Remote CPMS integration",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-fast": {
      name: "Spider Fast",
      tagline: "30 kW rapid DC charger with CCS2 / CHAdeMO for 4-wheeler public charging",
      metaTitle: "Spider Fast — 30 kW DC Fast EV Charger | SpiderEV",
      metaDescription: "30 kW DC fast charger with CCS2 / CHAdeMO connectors for entry-level public charging. Ideal for 2-wheelers, light EVs, and community charging points.",
      metaKeywords: "30 kW DC charger India, entry public charging, light EV charger, 2-wheeler fast charger, Spider Fast, CCS2 CHAdeMO India",
      power: "30 kW",
      connector: "CCS2 / CHAdeMO",
      protocol: "OCPP 1.6J",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 100 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Fast is positioned at the entry tier of public DC charging — 30 kW is enough to deliver meaningful fast charging for light 4-wheelers, 2-wheelers, and smaller battery EVs without the capital expense of a 60+ kW installation. It's a practical choice for franchise owners, community charging points, or retail sites where footfall is moderate and the vehicle mix skews toward compact urban EVs rather than long-range highway vehicles.

At 30 kW, Spider Fast can add 80-100 km of range in 20-30 minutes for a typical compact EV, which bridges the gap between slow AC home charging and full highway-grade DC infrastructure. That charge speed works well in parking-while-shopping scenarios — a mall, a supermarket, a transit hub — where drivers are spending 30-45 minutes on-site anyway and don't need the 10-minute top-up that a 120 kW unit would provide. For 2-wheelers and light electric vehicles, the charging time is even shorter, often completing a full charge within 15-20 minutes, making it particularly attractive for urban mobility solutions.

The dual CCS2 and CHAdeMO connectors mean the unit can serve both the CCS2-dominant passenger EV market and the legacy CHAdeMO vehicles still in circulation, particularly in the 2-wheeler and commercial light vehicle segments. For a franchise site operator, that translates to broader vehicle compatibility without having to deploy two separate charging units. This flexibility is especially valuable in India's diverse EV ecosystem where both connector standards are actively in use.

Spider Fast is OCPP 1.6J compliant, so it integrates into any standard charge point management system for remote monitoring, billing, and uptime tracking. The IP67 ingress protection rating makes it suitable for open-air installations common at public charging sites in India, where weather exposure is a given. BIS certification ensures compliance with Indian safety and quality standards, which is a baseline requirement for most commercial deployments.

For site hosts considering their first DC fast charger installation, Spider Fast represents a lower-risk entry point. The 30 kW power draw is manageable on most three-phase commercial electrical connections without requiring major infrastructure upgrades. Operating costs are moderate, and the unit can scale usage patterns as EV adoption grows in the surrounding area. The included RFID authentication and app-based access control allow operators to manage charging sessions, implement usage-based billing, and track charger performance remotely through the SpiderEV platform — all essential features for running a charging business, even at entry scale.`,
      faqs: [
        {
          question: "How fast does Spider Fast charge a typical EV?",
          answer: "Spider Fast delivers 30 kW of DC power, which typically adds 80-100 km of range in 20-30 minutes for a compact urban EV, depending on the vehicle's battery size and charging acceptance rate."
        },
        {
          question: "What type of vehicles is Spider Fast suitable for?",
          answer: "Spider Fast is ideal for 2-wheelers, light 4-wheelers, and compact urban EVs. It's well-suited for entry-level public charging at community points, retail locations, and franchise sites where the vehicle mix includes smaller battery EVs rather than long-range highway vehicles."
        },
        {
          question: "Where can Spider Fast be installed?",
          answer: "Spider Fast works well in community charging points, shopping malls, supermarkets, transit hubs, and franchise locations where drivers typically spend 30-45 minutes on-site. Its IP67 rating makes it suitable for open-air installations common in Indian public charging environments."
        },
        {
          question: "Does Spider Fast support both CCS2 and CHAdeMO connectors?",
          answer: "Yes, Spider Fast comes with dual CCS2 and CHAdeMO connectors, allowing it to serve both the CCS2-dominant passenger EV market and legacy CHAdeMO vehicles still in circulation, particularly in the 2-wheeler and commercial light vehicle segments."
        }
      ],
      features: [
        "Dual CCS2 / CHAdeMO connectors",
        "OCPP 1.6J compliant",
        "Remote monitoring and billing",
        "IP67 weather protection",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
        "spider-falcon": {
      name: "Spider Falcon",
      tagline: "60 kW high-speed CCS2 DC charger for public networks and commercial hubs",
      metaTitle: "Spider Falcon — 60 kW CCS2 DC Fast Charger | SpiderEV",
      metaDescription: "60 kW CCS2 DC fast charger designed for public charging networks, highway corridors, and commercial hubs across India. BIS certified with OCPP 1.6J protocol.",
      metaKeywords: "60 kW DC charger India, CCS2 fast charger, public charging station, highway EV charger, Spider Falcon, commercial EV charger AP TG",
      power: "60 kW",
      connector: "CCS2",
      protocol: "OCPP 1.6J",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 100 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Falcon delivers 60 kW of DC fast charging power specifically optimized for public charging networks and commercial installations where single-connector simplicity matters. Unlike dual-connector models that support both CCS2 and CHAdeMO, the Falcon is CCS2-only—an intentional design choice that reduces hardware complexity, lowers upfront cost, and focuses on the dominant charging standard for passenger EVs in India.

At 60 kW, the Falcon sits in the sweet spot for highway rest stops, mall parking areas, and commercial fleet hubs that need faster-than-home charging without the power infrastructure demands of 120 kW+ systems. Most modern EV batteries can accept 60 kW continuously, which translates to adding 200+ km of range in 30-40 minutes—fast enough to make public charging practical without requiring costly grid upgrades or demand charges that come with higher-power units.

The CCS2-only configuration is well-suited for networks expanding into Tier 2 and Tier 3 cities where the vast majority of 4-wheeler EVs on the road use CCS2, and site hosts want predictable per-unit costs rather than paying for connector types that rarely see use. For operators building out franchise networks or retail charging sites, the Falcon offers a lower capital expenditure entry point while still delivering the charging speed expectations of EV drivers moving beyond home charging.

OCPP 1.6J compliance ensures the Falcon can integrate into existing charge point management systems without custom integration work, and the IP67-rated enclosure handles monsoon and high-dust environments typical of outdoor installations across Indian climates. RFID authentication and remote monitoring through the SpiderEV app enable site owners to track utilization and manage access without on-site staff.`,
      faqs: [
        {
          question: "How fast does Spider Falcon charge an electric vehicle?",
          answer: "Spider Falcon delivers 60 kW of DC power, typically adding 200+ km of range in 30-40 minutes for most modern passenger EVs. Actual charging speed depends on your vehicle's battery acceptance rate and state of charge."
        },
        {
          question: "What type of vehicles is Spider Falcon suitable for?",
          answer: "Spider Falcon is designed for 4-wheeler passenger electric vehicles using the CCS2 charging standard, which covers most EVs sold in India today including Tata Nexon EV, MG ZS EV, Hyundai Kona, and similar models."
        },
        {
          question: "Where can Spider Falcon be installed?",
          answer: "Spider Falcon is ideal for public charging networks, highway rest stops, shopping mall parking areas, office complexes, and commercial fleet hubs. Its IP67 rating makes it suitable for outdoor installation in all-weather conditions."
        },
        {
          question: "Why is Spider Falcon CCS2-only instead of dual-connector?",
          answer: "The CCS2-only design reduces hardware complexity and upfront cost, focusing on the dominant charging standard for passenger EVs in India. This makes it an economical choice for site hosts expanding into markets where CCS2 covers the vast majority of charging demand."
        }
      ],
      features: [
        "CCS2-only optimized design",
        "60 kW continuous power delivery",
        "IP67 all-weather rated enclosure",
        "OCPP 1.6J network integration",
        "Remote monitoring via SpiderEV app",
        "RFID authentication",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
      ],
    },

    "spider-hulk": {
      name: "Spider Hulk",
      tagline: "240 kW ultra-rapid DC fast EV charger",
      metaTitle: "Spider Hulk — 240 kW Ultra-Rapid DC EV Charger | SpiderEV",
      metaDescription: "240 kW ultra-rapid DC EV charger — SpiderEV's flagship fast charger for highway charging hubs, large fleets and heavy-duty EV applications.",
      metaKeywords: "Spider Hulk, 240 kW charger, ultra rapid charger, heavy duty EV charger, bus charger India, truck charger, highway fast charger",
      power: "240 kW",
      connector: "CCS2 + CHAdeMO (4-gun system)",
      chargingSpeed: "Full bus charge in under 60 minutes; 300+ km passenger EV range in 10–15 min",
      protocol: "OCPP 1.6J, OCPP 2.0 ready",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 350 A",
      ipRating: "IP67",
      cooling: "Liquid-cooled dispensing cables",
      management: "Fleet management API, SpiderConnect CPMS integration, remote firmware updates",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `The Spider Hulk is designed for the peak of the charging demand curve — electric bus depots, highway fast-charging corridors, and commercial fleets that can't afford long dwell times. A 4-gun system with 240 kW can charge an electric bus to full in under an hour, or add 300+ km of range to a passenger EV in 10-15 minutes.

Liquid cooling on the dispensing cables isn't a spec-sheet detail — it's what allows the Hulk to sustain high current draw for back-to-back sessions without thermal throttling. That matters at a depot running multiple vehicles through the same unit across a shift.

The Hulk supports both CCS2 and CHAdeMO connectors, meaning it can handle the CCS2 standard used by most passenger EVs in India as well as CHAdeMO-fitted commercial vehicles, without requiring a second unit. OCPP 1.6J by default, with OCPP 2.0 support for operators building newer network management stacks.

The fleet management API and SpiderConnect integration enables fleet operators to view charging schedules, per vehicle usage and uptime remotely, useful for depots operating on tight turnaround windows where an offline charger has a direct cost.`,
      faqs: [
        {
          question: "How fast does the Spider Hulk charge an electric bus?",
          answer: "The Spider Hulk can charge an electric bus in under 60 mins to full capacity, and 300+ km of range in 10-15 mins to a passenger EV depending on the vehicle battery and charging acceptance rate."
        },
        {
          question: "What connectors does the Spider Hulk support?",
          answer: "The Spider Hulk comes with 4-guns and supports both CCS2 and CHAdeMO, which means it can cater to most passenger and commercial EVs on the Indian roads without any additional hardware."
        },
        {
          question: "Is the Spider Hulk suitable for highway charging stations?",
          answer: "Yes — the Spider Hulk is designed for highway hubs and depot use with liquid-cooled cables for prolonged high-current sessions at 240 kW, charging multiple vehicles back-to-back through the same unit."
        },
        {
          question: "Does the Spider Hulk integrate with fleet management software?",
          answer: "Yes. It connects to SpiderConnect CPMS and provides a fleet management API to give operators visibility into scheduling, per-vehicle usage and uptime remotely."
        }
      ],
      features: [
        "Liquid-cooled dispensing cables",
        "4-gun CCS2 + CHAdeMO system",
        "OCPP 2.0 ready",
        "Fleet management API",
        "SpiderConnect CPMS integration",
        "Remote firmware updates",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-ultra": {
      name: "Spider Ultra",
      tagline: "120 kW high-speed DC charger for public networks, fleets, and commercial hubs",
      metaTitle: "Spider Ultra — 120 kW High-Speed DC EV Charger | SpiderEV",
      metaDescription: "120 kW high-speed DC EV charger with CCS2 / CHAdeMO dual connectors. OCPP 1.6J enabled for public charging stations, highway corridors and commercial fleets.",
      metaKeywords: "120 kW DC charger India, high speed EV charger AP, public charging station Telangana, CCS2 CHAdeMO charger India, Spider Ultra",
      power: "120 kW",
      connector: "CCS2 / CHAdeMO",
      protocol: "OCPP 1.6J",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 200 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Ultra is positioned at the higher end of public fast-charging infrastructure — the 120 kW output hits the balance between speed and widespread grid compatibility that makes it a workhorse for highway corridors, public networks, and captive commercial fleets.

At 120 kW, the Spider Ultra can add 80-100 km of range to most passenger EVs in under 10 minutes, or recover 200+ km in 20-25 minutes depending on the vehicle's battery acceptance curve. That's quick enough to keep dwell times reasonable at a busy public station while avoiding the heavier electrical infrastructure required for 180 kW+ installations.

The dual CCS2 / CHAdeMO connector support matters in India's current charging landscape — CCS2 is the dominant standard for newer passenger EVs, but many commercial vehicles, early-generation EVs, and certain 2-wheeler fleets still use CHAdeMO. Rather than forcing site hosts to deploy two separate chargers or turn away incompatible vehicles, Spider Ultra handles both standards in a single unit.

With OCPP 1.6J protocol support, the Ultra integrates into any standard charge point management system, giving operators remote monitoring, session control, pricing flexibility, and uptime tracking — table stakes for anyone running a revenue-generating public charging network or managing a fleet with utilization KPIs.`,
      faqs: [
        {
          question: "How fast does Spider Ultra charge?",
          answer: "Spider Ultra charges at 120 kW DC, which can add 80-100 km of range in under 10 minutes to most passenger EVs, or 200+ km in 20-25 minutes depending on the vehicle's battery size and charging acceptance rate."
        },
        {
          question: "What type of vehicles is Spider Ultra suitable for?",
          answer: "Spider Ultra supports both CCS2 and CHAdeMO connectors, making it compatible with most passenger EVs, commercial vehicles, and early-generation EVs on Indian roads. The 120 kW power level suits 4-wheelers and commercial fleets."
        },
        {
          question: "Where can Spider Ultra be installed?",
          answer: "Spider Ultra is ideal for public charging stations, highway corridor sites, commercial fleet depots, and franchise locations where fast turnaround and high utilization are priorities. It requires three-phase 415V AC input."
        },
        {
          question: "Does Spider Ultra integrate with charging network management software?",
          answer: "Yes. Spider Ultra supports OCPP 1.6J protocol, enabling integration with any standard charge point management system for remote monitoring, session control, dynamic pricing, and uptime tracking."
        }
      ],
      features: [
        "Dual CCS2 / CHAdeMO connector support",
        "OCPP 1.6J network integration",
        "0-200 A output current range",
        "200-1000V DC output voltage",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
    "spider-surge": {
      name: "Spider Surge",
      tagline: "180 kW rapid DC charger delivering powerful charge for highways and depots",
      metaTitle: "Spider Surge — 180 kW Rapid DC EV Charger | SpiderEV",
      metaDescription: "180 kW rapid DC EV charger for highway corridors, commercial depots, and high-throughput public charging stations. Heavy-duty charging infrastructure for India.",
      metaKeywords: "180 kW DC charger, rapid EV charger India, highway fast charger, commercial depot charger, bus charging station, truck EV charger, Spider Surge",
      power: "180 kW",
      connector: "CCS2 / CHAdeMO",
      protocol: "OCPP 1.6J",
      chargingSpeed: "250+ km range in 15 minutes; commercial vehicle full charge in 90 minutes",
      inputVoltage: "415 V AC, Three Phase",
      operatingVoltage: "—",
      outputVoltage: "200 – 1000 V DC",
      outputCurrent: "0 – 250 A",
      ipRating: "IP67",
      certifications: "BIS Certified",
      ocpp: "OCPP 1.6J",
      bodyContent: `Spider Surge sits at the intersection of high-throughput public charging and commercial fleet infrastructure. At 180 kW, it delivers meaningfully faster charging than 120 kW units while avoiding the power supply and infrastructure costs of 240 kW installations — a balance point that works for highway corridor operators, commercial depots, and high-traffic urban charging hubs.

For passenger EVs, the Surge can add 250+ km of range in around 15 minutes, fast enough to match a fuel stop on an intercity route. For commercial vehicles with larger battery packs — delivery vans, light commercial trucks, or shuttle buses — it can complete a full charge cycle in roughly 90 minutes, fitting into depot turnaround windows without requiring the capital outlay of ultra-rapid infrastructure.

The dual CCS2 / CHAdeMO connector support means the Surge can handle both the CCS2 standard used by most passenger EVs and the CHAdeMO standard still common in older commercial vehicles and some imported models, making it suitable for mixed-use sites serving both private and commercial operators.

OCPP 1.6J compliance enables integration with most charge point management systems in India, allowing site operators to track usage, handle dynamic pricing, and monitor uptime remotely. For franchise or multi-site operators, this standardization reduces the operational overhead of managing chargers across locations — one management interface for all units, regardless of site.

Spider Surge is aimed at site hosts who need high throughput without the electrical infrastructure of 240 kW systems — highway corridor franchisees, commercial property managers adding charging amenities, and depot operators running mixed fleets where 120 kW isn't quite fast enough but 240 kW exceeds both power availability and budget.`,
      faqs: [
        {
          question: "How fast does Spider Surge charge an electric vehicle?",
          answer: "Spider Surge delivers 180 kW DC charging, adding around 250+ km of range to a passenger EV in approximately 15 minutes. For commercial vehicles with larger battery packs, a full charge takes roughly 90 minutes, depending on the vehicle's battery size and charging acceptance rate."
        },
        {
          question: "What type of vehicles is Spider Surge suitable for?",
          answer: "Spider Surge is designed for both passenger EVs and commercial vehicles. It supports CCS2 and CHAdeMO connectors, making it compatible with most passenger cars, delivery vans, light commercial trucks, and shuttle buses operating in India."
        },
        {
          question: "Where can Spider Surge be installed?",
          answer: "Spider Surge is ideal for highway charging corridors, commercial depots, high-traffic urban public charging stations, and franchise locations. It's designed for sites that need high-throughput charging without the electrical infrastructure demands of 240 kW systems."
        },
        {
          question: "Does Spider Surge integrate with charge point management systems?",
          answer: "Yes. Spider Surge supports OCPP 1.6J protocol, enabling integration with most charge point management systems. This allows operators to monitor usage, implement dynamic pricing, track uptime remotely, and manage multiple units across different locations from a single interface."
        }
      ],
      features: [
        "Dual CCS2 / CHAdeMO connector support",
        "OCPP 1.6J compliance for fleet management",
        "High-throughput charging for highway corridors",
        "Optimized for mixed passenger and commercial use",
        "Remote monitoring and dynamic pricing",
        "Short Circuit Prevention",
        "Over Current Prevention",
        "Voltage Surge Protection",
        "Overheat Protection",
        "Ground Fault Protection",
        "Auto Power Cut-off",
        "Over / Under Voltage Protection",
        "RFID & App Authentication",
      ],
    },
  },
};

const specRows = (product) => [
  ["Power Output",       product.power],
  ["Connector Type",     product.connector],
  ...(product.chargingSpeed ? [["Charging Speed", product.chargingSpeed]] : []),
  ...(product.protocol ? [["Protocol", product.protocol]] : []),
  ["Input Voltage",      product.inputVoltage],
  ["Operating Voltage",  product.operatingVoltage],
  ...(product.outputVoltage ? [["DC Output Voltage", product.outputVoltage]] : []),
  ["Output Current",     product.outputCurrent],
  ["Protection Rating",  product.ipRating],
  ...(product.cooling ? [["Cooling", product.cooling]] : []),
  ...(product.management ? [["Management", product.management]] : []),
  ["Certifications",     product.certifications],
  ["OCPP Version",       product.ocpp],
].filter(([, val]) => val && val !== "—");

const ProductDetailPage = () => {
  const { category, productId } = useParams();
  const catData = productData[category];
  const product = catData ? catData[productId] : null;
  const productImg = (category === "dc" && productImages[productId]) ? productImages[productId] : (category === "ac" ? acImg : dcImg);

  if (!product) {
    return (
      <PageLayout>
        <Helmet>
          <title>Product Not Found | Spider Energy</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to={`${category === "ac" ? "/electric-vehicle-ev-ac-charger" : "/electric-vehicle-ev-dc-charger"}`} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold">
            Back to {category === "ac" ? "AC" : "DC"} Chargers
          </Link>
        </div>
      </PageLayout>
    );
  }

  const typeLabel = category === "ac" ? "AC EV Charger" : "DC Fast EV Charger";
  const productSchema = getProductSchema(product, category, productId, productImg);
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "https://spiderenergy.in" },
    { name: "SpiderEV", url: "/spiderev" },
    {
      name: category === "ac" ? "AC Chargers" : "DC Chargers",
      url: `https://spiderenergy.in/${category === "ac" ? "electric-vehicle-ev-ac-charger" : "electric-vehicle-ev-dc-charger"}`,
    },
    { name: product.name, url: `/products/${category}/${productId}` },
  ]);
  const faqSchema = product.faqs && product.faqs.length > 0 ? getFAQSchema(product.faqs) : null;

  // Enhanced meta tags for products with custom meta fields
  const pageTitle = product.metaTitle || `${product.name} — ${product.power} ${typeLabel} | SpiderEV`;
  const pageDescription = product.metaDescription || product.tagline;
  return (
    <PageLayout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <SEO
        schema={productSchema}
        breadcrumbs={breadcrumbs}
        schemas={faqSchema ? [faqSchema] : []}
        title={pageTitle}
        description={pageDescription}
        ogImage={`/og/products/${productId}.jpg`}
      />
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={fadeUp} className="text-secondary font-semibold text-sm uppercase tracking-wider">
                {category === "ac" ? "AC Charger" : "DC Fast Charger"}
              </motion.span>
              <motion.p variants={fadeUp} className="mt-2 text-white/70 text-sm">Part of <Link to="/spiderev" className="text-white font-semibold underline underline-offset-4">SpiderEV by Spider Energy</Link></motion.p>
              <motion.h1 variants={fadeUp} className="mt-3 text-4xl sm:text-5xl font-bold text-white">
                {product.name} — {product.power} {typeLabel}
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-4 text-white/80 text-xl">{product.tagline}</motion.p>
              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                <span className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold">{product.power}</span>
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">{product.ocpp}</span>
              </motion.div>
              <motion.button variants={fadeUp} className="mt-8 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Download Datasheet (PDF)
              </motion.button>
            </motion.div>
            <motion.div
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              className="flex justify-center"
            >
              <div className="bg-white/10 rounded-2xl p-10">
                <img
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={productImageDimensions[productId]?.width ?? 1536}
                  height={productImageDimensions[productId]?.height ?? 1024}
                  src={productImg}
                  alt={`${product.name} ${product.power} ${category.toUpperCase()} EV charger by SpiderEV`}
                  className="h-64 w-auto object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specs + Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Specs */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</motion.h2>
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                {specRows(product).map(([label, value], i) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    className={`flex ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <div className="w-44 px-5 py-3.5 text-sm font-semibold text-gray-600 border-r border-gray-100 flex-shrink-0">{label}</div>
                    <div className="px-5 py-3.5 text-sm text-gray-900">{value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <div>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="text-2xl font-bold text-gray-900 mb-6"
              >
                Key Features
              </motion.h2>
              <motion.div
                variants={staggerFast}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="grid grid-cols-2 gap-4"
              >
                {product.features.map((feature) => (
                  <motion.div
                    key={feature}
                    variants={scaleUp}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-4"
                  >
                    <span className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-800">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Body Content Section - Only for products with bodyContent */}
      {product.bodyContent && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 mb-8">
                About {product.name}
              </motion.h2>
              <motion.div
                variants={fadeUp}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              >
                {product.bodyContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section - Only for products with FAQs */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions
              </motion.h2>
              <div className="space-y-6">
                {product.faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    className="bg-gray-50 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Back link */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="py-10 bg-gray-50 text-center"
      >
        <div className="max-w-330 mx-auto px-4 sm:px-6 lg:px-10">
          <Link
            to={`${category === "ac" ? "/electric-vehicle-ev-ac-charger" : "/electric-vehicle-ev-dc-charger"}`}
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            ← View All {category === "ac" ? "AC" : "DC"} Chargers
          </Link>
        </div>
      </motion.section>

      <AppDownloadCTA />
    </PageLayout>
  );
};

export default ProductDetailPage;
