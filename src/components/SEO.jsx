/**
 * SEO.jsx
 *
 * Reusable component that injects JSON-LD structured data and Twitter Card
 * meta tags via react-helmet-async. Use alongside the existing <Helmet>
 * title/description already on each page.
 */
import { Helmet } from "react-helmet-async";

const DEFAULT_OG_IMAGE = "https://www.spiderenergy.in/og-image.jpg";

export function SEO({ schema, breadcrumbs, ogImage }) {
  return (
    <Helmet>
      {/* Twitter Card tags (complements existing OG tags from prerender) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />

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
