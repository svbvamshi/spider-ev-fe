import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageLayout from "../components/layout/PageLayout";
import SEO from "../components/SEO";
import { getArticleSchema, getBreadcrumbSchema } from "../seo/schemas";
import { fadeUp, viewport } from "../utils/animationConfig";
import blogPosts from "../data/blog-posts.json";
import "../styles/blog-content.css";

// Use import.meta.glob to lazy-load blog content by slug
const blogContentModules = import.meta.glob("../data/blog-content/*.json");

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find post metadata
  const postMeta = blogPosts.find((p) => p.slug === slug && p.published);

  useEffect(() => {
    if (!postMeta) {
      navigate("/blog", { replace: true });
      return;
    }

    const loadContent = async () => {
      const key = `../data/blog-content/${slug}.json`;
      const loader = blogContentModules[key];
      if (!loader) {
        navigate("/blog", { replace: true });
        return;
      }
      try {
        const module = await loader();
        setContent(module.default || module);
      } catch {
        navigate("/blog", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug, postMeta, navigate]);

  if (!postMeta) return null;

  // Tags for this post (from frontmatter) — show top 5
  const tags = (postMeta.tags || []).slice(0, 5);

  // Related posts (same category, exclude current)
  const relatedPosts = blogPosts
    .filter((p) => p.category === postMeta.category && p.slug !== slug && p.published)
    .slice(0, 3);

  // Schemas
  const articleSchema = getArticleSchema({
    title: postMeta.title,
    description: postMeta.description,
    slug: postMeta.slug,
    datePublished: postMeta.date,
    author: postMeta.author,
    image: postMeta.image,
    category: postMeta.category,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://spiderenergy.in/" },
    { name: "Blog", url: "https://spiderenergy.in/blog" },
    { name: postMeta.title },
  ]);

  return (
    <PageLayout>
      <Helmet>
        <title>{postMeta.title}</title>
        <meta name="description" content={postMeta.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={postMeta.date} />
        <meta property="article:section" content={postMeta.category} />
        <meta property="article:author" content={postMeta.author} />
        <link rel="canonical" href={`https://spiderenergy.in/blog/${slug}`} />
      </Helmet>
      <SEO schema={articleSchema} breadcrumbs={breadcrumbSchema} ogImage={postMeta.image} />

      {/* Article */}
      <article className="bg-white">
        {/* Breadcrumb — hidden visually, present for SEO crawlers */}
        <nav className="sr-only" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/blog">Blog</Link>
          <span>/</span>
          <span>{postMeta.title}</span>
        </nav>

        {/* Hero Banner Image */}
        <div className="w-full overflow-hidden bg-[#0f1423]">
          <img
            src={postMeta.image}
            alt={postMeta.title}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                {postMeta.category}
              </span>
              <span className="text-gray-400 text-sm">{postMeta.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {postMeta.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span>By {postMeta.author}</span>
              <span className="text-gray-300">|</span>
              <time dateTime={postMeta.date}>{postMeta.date}</time>
            </div>
          </motion.div>
        </header>

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : content ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              viewport={viewport}
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          ) : null}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-block bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-100 bg-gray-50 py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
                  >
                    <span className="text-secondary text-xs font-semibold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="text-gray-900 font-semibold mt-2 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.description}</p>
                    <span className="text-gray-400 text-xs mt-3 block">{post.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PageLayout>
  );
};

export default BlogDetailPage;
