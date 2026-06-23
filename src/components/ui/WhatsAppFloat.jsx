import whatsappLogo from "../../assets/illustrations/WhatsApp.svg.webp";

const WA_NUMBER = "919997776080";
const WA_URL = `https://wa.me/${WA_NUMBER}`;

const WhatsAppFloat = () => {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Button */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 hover:scale-110 transition-transform duration-200">
        <img loading="lazy" src={whatsappLogo} alt="WhatsApp" className="w-8 h-8 object-contain" />
      </span>

      {/* Tooltip */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppFloat;
