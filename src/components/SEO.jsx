/**
 * SEO.jsx
 *
 * Reusable component that injects JSON-LD structured data, Open Graph image,
 * and Twitter Card meta tags via react-helmet-async.
 * Use alongside the existing <Helmet> title/description already on each page.
 *
 * Props:
 *   - schema: JSON-LD object for structured data
 *   - breadcrumbs: BreadcrumbList JSON-LD object
 *   - ogImage: Custom OG image URL (defaults to logo-based og-image.jpg)
 *              For blog/news posts, pass the post's featured image URL.
 */
import { Helmet } from "react-helmet-async";

const BASE_URL = "https://spiderenergy.in";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export function SEO({ schema, breadcrumbs, ogImage }) {
  const image = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      {/* Open Graph image (overrides prerender default when a custom image is passed) */}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image} />

      {/* Primary JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Breadcrumb JSON-LD (separate script block per Google guidelines) */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbs)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;
