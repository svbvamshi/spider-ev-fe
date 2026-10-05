import heroBg from "../../assets/home/hero-bg.webp";

const HeroBanner = ({ title, subtitle, bgImage }) => {
  const bg = bgImage || heroBg;
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative max-w-330 mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white/80 text-lg max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
