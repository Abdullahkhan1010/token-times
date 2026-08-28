import React, { useEffect, useState } from "react";
import SEOHead from "../components/SEOHead";
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, Check, Newspaper, Sparkles, Pin, Star, Zap, Building2, Globe, BookOpen } from "lucide-react";
import { getPublishedNews } from "../services/published-news.service";
import { ToImageUrl } from "../services/file.service";
import { trackArticleClick } from "../services/tracker.service";
import LazyImage from "../components/LazyImage";

export default function ArticleDetailPage({ article, onNavigate, onSelectArticle }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [resolvedImage, setResolvedImage] = useState(article?.image || "");

  // Track article open click
  useEffect(() => {
    if (article) {
      const artId = article.id;
      const cat = Array.isArray(article.category) ? article.category[0] : article.category || "News";
      trackArticleClick(artId, article.title, cat);
    }
  }, [article]);

  // Load image if path needs resolution & fetch related articles
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    (async () => {
      if (article?.image) {
        try {
          const href = await ToImageUrl(article.image);
          setResolvedImage(href);
          if (href) {
            const img = new Image();
            img.src = href;
            if (img.decode) img.decode().catch(() => { });
          }
        } catch {
          setResolvedImage(article.image);
        }
      }

      try {
        const allData = await getPublishedNews();
        const published = (Array.isArray(allData) ? allData : []).filter(
          (a) => a.status === "published" && a.id !== article?.id
        );
        setRelatedArticles(published.slice(0, 3));
      } catch (err) {
        console.warn("Could not load related articles", err);
      }
    })();
  }, [article]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Fallback if no article selected
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="font-display-lg text-2xl font-bold text-[#0C133D]">No Article Selected</h2>
        <p className="text-sm text-on-surface-variant">Select an article from the homepage or news section to view details.</p>
        <button
          onClick={() => onNavigate?.("Home")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C133D] text-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all"
        >
          <ArrowLeft size={16} /> Return to Home
        </button>
      </div>
    );
  }

  const publishDateStr = article.publish_date || article.createdAt
    ? new Date(article.publish_date || article.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
    : "Recently Published";

  const categories = Array.isArray(article.category) ? article.category : [article.category || "General News"];
  const tags = Array.isArray(article.tags) ? article.tags : [];
  const contentParagraphs = (article.article || article.summary || article.content || "")
    .split("\n")
    .filter((p) => p.trim().length > 0);

  return (
    <>
      <SEOHead title={`${article.title || "Article Details"} — Token Times`} description={article.summary || article.title} />

      <article className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
          <button
            onClick={() => onNavigate?.("Home")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0C133D] hover:text-[#D4AF37] transition-colors group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Stories</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              title="Share Article"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} className="text-[#D4AF37]" />}
              <span>{copied ? "Link Copied" : "Share"}</span>
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 rounded-lg border border-outline-variant transition-colors ${bookmarked ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37]" : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              title="Bookmark Article"
            >
              <Bookmark size={15} />
            </button>
          </div>
        </div>

        {/* Category Badges & Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[10px] uppercase tracking-wider"
              >
                {cat.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          <h1 className="font-display-lg text-3xl md:text-5xl font-extrabold text-[#0C133D] leading-tight">
            {article.title}
          </h1>

          {article.headlines && article.headlines.length > 0 && (
            <p className="text-base md:text-lg text-on-surface-variant font-medium leading-relaxed border-l-2 border-[#D4AF37] pl-4 italic">
              {article.headlines[0]}
            </p>
          )}

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-on-surface-variant border-y border-outline-variant/60 py-3.5 font-data-tabular">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#D4AF37]" />
              <span>By <strong className="text-[#0C133D]">{article.author || "Editorial Desk"}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#D4AF37]" />
              <span>{publishDateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#D4AF37]" />
              <span>
                {(() => {
                  const text = article.article || article.content || article.summary || "";
                  const words = text.trim().split(/\s+/).filter(Boolean).length;
                  if (words > 30) return Math.max(1, Math.ceil(words / 200));
                  return Number(article.approx_time_to_read) || 3;
                })()} min read
              </span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {resolvedImage && (
          <figure className="space-y-2">
            <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-low shadow-sm">
              <img
                src={resolvedImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.summary && (
              <figcaption className="text-[11px] text-on-surface-variant italic text-center">
                {article.summary.slice(0, 120)}...
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Body Content */}
        <section className="prose max-w-none text-on-surface space-y-6 text-base md:text-lg leading-relaxed font-serif">
          {contentParagraphs.map((para, i) => (
            <p key={i} className={i === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:text-[#0C133D] first-letter:mr-2 first-letter:float-left leading-relaxed text-lg" : "leading-relaxed"}>
              {para}
            </p>
          ))}
        </section>

        {/* Custom Tags Section */}
        {tags.length > 0 && (
          <footer className="border-t border-outline-variant/60 pt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Related Topics & Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-surface-container-low border border-outline-variant text-xs text-on-surface font-medium hover:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        )}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="border-t-2 border-[#0C133D] pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display-lg text-xl font-bold text-[#0C133D]">
                More Stories from Token Times
              </h3>
              <button
                onClick={() => onNavigate?.("News")}
                className="text-xs font-bold text-[#D4AF37] hover:underline"
              >
                View All News →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle?.(rel)}
                  className="group cursor-pointer bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden p-4 space-y-3 hover:border-[#D4AF37] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {rel.image && (
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container-low">
                        <LazyImage
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h4 className="font-headline-md text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-data-tabular">
                    {rel.approx_time_to_read || 4} min read
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
