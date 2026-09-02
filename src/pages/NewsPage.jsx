import React, { useState, useEffect, useMemo } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { BASE_URL } from "../data/seoData";
import { getPublishedNews } from "../services/published-news.service";
import { ToImageUrl } from "../services/file.service";
import LazyImage from "../components/LazyImage";

const INTERNAL_SECTION_KEYS = new Set([
  "main_story", "mainstory", "top_story", "top_stories", "topstory",
  "sub_stories", "substories", "substory", "featured_spotlight",
  "spotlight", "editor_picks", "editors_pick", "editorspick",
  "latest_news", "latestnews", "featured_analysis", "featuredanalyis"
]);

const NEWS_FILTER_CATEGORIES = [
  "All",
  "Policy & Regulation",
  "Markets",
  "Pakistan Focus",
  "Global Highlights",
  "Web3 & Crypto",
  "REIT & PropTech",
  "Features",
  "Opinion",
];

function getSingleCleanTag(item, fallback = "NEWS") {
  if (!item) return fallback;

  let candidates = [];
  if (typeof item === "object" && !Array.isArray(item)) {
    const cats = Array.isArray(item.category)
      ? item.category
      : typeof item.category === "string"
      ? item.category.split(",")
      : [];
    const tags = Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === "string"
      ? item.tags.split(",")
      : [];
    const displaySecs = Array.isArray(item.display_section)
      ? item.display_section
      : [];
    candidates = [...cats, ...tags, ...displaySecs];
  } else if (Array.isArray(item)) {
    candidates = item.flatMap((t) => typeof t === "string" ? t.split(",") : [t]);
  } else if (typeof item === "string") {
    candidates = item.split(",");
  }

  for (const raw of candidates) {
    if (!raw) continue;
    const str = String(raw).trim();
    const normalizedKey = str.toLowerCase().replace(/[\s_-]+/g, "_");
    if (INTERNAL_SECTION_KEYS.has(normalizedKey)) continue;

    const cleaned = str
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned && cleaned.length >= 2) {
      return cleaned.toUpperCase();
    }
  }

  return fallback;
}

export default function NewsPage({ onNavigate, onSelectArticle }) {
  const [selectedCat, setSelectedCat] = useState("All");
  const [backendNews, setBackendNews] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPublishedNews();
        if (!active) return;
        const published = (Array.isArray(data) ? data : []).filter((a) => a.status === "published");

        if (active) setBackendNews(published);

        // Preload lead story image if present
        const topStory = published[0];
        if (topStory && topStory.image && typeof topStory.image === "string" && !topStory.image.startsWith("http://") && !topStory.image.startsWith("https://") && !topStory.image.startsWith("data:")) {
          try {
            const url = await ToImageUrl(topStory.image);
            if (url && active) {
              const img = new Image();
              img.src = url;
              if (img.decode) img.decode().catch(() => { });
            }
          } catch { }
        }
      } catch (err) {
        console.error("Failed to load news page articles", err);
      }
    })();
    return () => { active = false; };
  }, []);

  const filteredArticles = useMemo(() => {
    if (selectedCat === "All") {
      return backendNews;
    }

    const target = selectedCat.toLowerCase().replace(/&/g, "and").replace(/[\s_-]+/g, " ").trim();

    return backendNews.filter((a) => {
      const catArray = Array.isArray(a.category) ? a.category : [a.category || ""];
      const tagArray = Array.isArray(a.tags) ? a.tags : [a.tags || ""];
      const secArray = Array.isArray(a.display_section) ? a.display_section : [];

      const allTokens = [...catArray, ...tagArray, ...secArray]
        .filter(Boolean)
        .map((t) => String(t).toLowerCase().replace(/&/g, "and").replace(/[\s_-]+/g, " ").trim());

      if (selectedCat === "Policy & Regulation") {
        return allTokens.some((t) => t.includes("policy") || t.includes("regulat") || t.includes("compliance") || t.includes("legal") || t.includes("pvara") || t.includes("sbp") || t.includes("secp"));
      }
      if (selectedCat === "Markets") {
        return allTokens.some((t) => t.includes("market") || t.includes("crypto") || t.includes("trading") || t.includes("forex") || t.includes("liquidity") || t.includes("price") || t.includes("btc") || t.includes("eth"));
      }
      if (selectedCat === "Pakistan Focus") {
        return allTokens.some((t) => t.includes("pakistan") || t.includes("local") || t.includes("national"));
      }
      if (selectedCat === "Global Highlights") {
        return allTokens.some((t) => t.includes("global") || t.includes("international") || t.includes("world"));
      }
      if (selectedCat === "Web3 & Crypto") {
        return allTokens.some((t) => t.includes("web3") || t.includes("crypto") || t.includes("blockchain") || t.includes("token") || t.includes("defi"));
      }
      if (selectedCat === "REIT & PropTech") {
        return allTokens.some((t) => t.includes("reit") || t.includes("proptech") || t.includes("real estate") || t.includes("property"));
      }
      if (selectedCat === "Features") {
        return allTokens.some((t) => t.includes("feature") || t.includes("spotlight") || t.includes("deep dive") || t.includes("special"));
      }
      if (selectedCat === "Opinion") {
        return allTokens.some((t) => t.includes("opinion") || t.includes("op-ed") || t.includes("column") || t.includes("analysis") || t.includes("interview"));
      }

      return allTokens.some((t) => t.includes(target) || target.includes(t));
    });
  }, [backendNews, selectedCat]);

  // Hero Lead Story
  const leadStory = filteredArticles[0] || null;

  // Secondary Headlines Rail (4 items)
  const secondaryHeadlines = filteredArticles.slice(1, 5);

  // 3-Across Story Cards Grid
  const gridCards = filteredArticles.slice(5, 8);

  // Moderate Chronological Feed (capped at 5 items)
  const feedArticles = filteredArticles.slice(8, 13);

  // Generate NewsArticle schema for Lead Story
  const leadArticleSchema = leadStory ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: leadStory.title,
    description: leadStory.summary,
    image: [leadStory.image || leadStory.img || ""],
    author: {
      "@type": "Person",
      name: leadStory.author || "Editorial Desk",
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/news`,
    },
  } : undefined;

  return (
    <div className="space-y-8">
      <SEOHead
        pageKey="News"
        customTitle={selectedCat !== "All" ? `${selectedCat} News & Digital Asset Analysis` : undefined}
        customSchema={leadArticleSchema}
      />

      <Breadcrumbs
        currentPage="News"
        category={selectedCat !== "All" ? selectedCat : undefined}
        onNavigate={onNavigate}
      />

      {/* Top Banner / Section Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block mb-1">
            DIGITAL ASSETS INTELLIGENCE STREAM
          </span>
          <h1 className="font-display-lg text-2xl sm:text-3xl md:text-5xl font-bold text-[#0C133D]">
            Latest News & Market Analysis
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-md">
          Real-time reporting on regulatory shifts, market momentum, and Web3 innovation across Pakistan and global hubs.
        </p>
      </Reveal>

      {/* Curated Category Filter Tabs Bar */}
      <Reveal as="div" className="w-full pb-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1" role="tablist">
          {NEWS_FILTER_CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] shadow-sm font-extrabold"
                    : "bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-[#0C133D] border-outline-variant hover:border-[#D4AF37]/60"
                }`}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                )}
                <span>{cat === "All" ? "All News" : cat}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Empty State when no articles match filter */}
      {filteredArticles.length === 0 && (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant space-y-2">
          <p className="font-semibold text-base text-[#0C133D]">No articles found under "{selectedCat}".</p>
          <p className="text-xs text-on-surface-variant">Showing latest news across all categories.</p>
          <button
            onClick={() => setSelectedCat("All")}
            className="mt-2 px-4 py-2 rounded-lg bg-[#0C133D] text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all cursor-pointer"
          >
            Reset Filter to All News
          </button>
        </div>
      )}

      {/* Hero Section: Lead Story + Secondary Headlines Wire */}
      {leadStory && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Lead Story */}
          <Reveal
            as="article"
            onClick={() => onSelectArticle?.(leadStory)}
            className="lg:col-span-8 hover-lift group bg-surface-container-lowest border-2 border-[#0C133D] rounded-xl overflow-hidden cursor-pointer shadow-md hover:border-[#D4AF37] flex flex-col justify-between"
          >
            <div className="relative w-full h-48 sm:h-80 md:h-96 overflow-hidden">
              <LazyImage
                src={leadStory.image || leadStory.img}
                alt={leadStory.title}
                eager={true}
                className="w-full h-full"
                imgClassName="img-fade img-scale w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {getSingleCleanTag(leadStory)}
              </span>
            </div>
            <div className="p-4 sm:p-6">
              <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-tight mb-3">
                {leadStory.title}
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed mb-4 line-clamp-3">
                {leadStory.summary}
              </p>
              <div className="flex items-center gap-3 text-xs font-data-tabular text-on-surface-variant pt-3 border-t border-outline-variant/40">
                <span>By {leadStory.author || "Editorial Desk"}</span>
                <span>•</span>
                <span>{leadStory.publish_date || "Today"}</span>
              </div>
            </div>
          </Reveal>

          {/* Secondary Headlines Rail (4 text-only headlines) */}
          <Reveal as="aside" className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 flex flex-col justify-start gap-3 shadow-sm">
            <div className="border-b border-outline-variant pb-3 flex items-center justify-between">
              <h3 className="font-headline-sm text-sm font-bold text-[#0C133D] uppercase tracking-wider">
                News Wire Bulletins
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            </div>

            <div className="space-y-3.5">
              {secondaryHeadlines.length > 0 ? (
                secondaryHeadlines.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => onSelectArticle?.(item)}
                    className="group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none"
                  >
                    <span className="font-label-caps text-[10px] font-bold text-[#D4AF37] uppercase block mb-0.5">
                      {getSingleCleanTag(item, "BULLETIN")}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="font-data-tabular text-[10px] text-on-surface-variant font-normal block mt-1">
                      {item.approx_time_to_read || 3} mins read
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant font-normal py-4">No additional wire bulletins in this section.</p>
              )}
            </div>
          </Reveal>
        </div>
      )}

      {/* 3-Across Story Cards Grid */}
      {gridCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gridCards.map((card, i) => (
            <Reveal
              key={i}
              as="article"
              delay={i * 80}
              onClick={() => onSelectArticle?.(card)}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer shadow-sm hover:border-[#D4AF37]"
            >
              <div>
                <div className="h-36 sm:h-40 w-full overflow-hidden rounded-lg mb-3 border border-outline-variant/40 relative">
                  <LazyImage
                    src={card.image || card.img}
                    alt={card.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#0C133D] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-[#D4AF37]/40 shadow-sm">
                    {getSingleCleanTag(card)}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug mb-2 line-clamp-2">
                  {card.title}
                </h3>
                <p className="text-xs text-on-surface-variant font-normal line-clamp-2 mb-3 leading-relaxed">
                  {card.summary}
                </p>
              </div>
              <span className="font-data-tabular text-[10px] text-on-surface-variant font-normal pt-2 border-t border-outline-variant/40">
                Read Analysis →
              </span>
            </Reveal>
          ))}
        </div>
      )}

      {/* Bottom Main Content: Chronological Stream + Persistent Sidebar */}
      {feedArticles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Chronological Stream */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-6">
              <h3 className="font-headline-sm text-lg font-bold text-[#0C133D] border-b border-outline-variant pb-2 uppercase tracking-wider">
                {selectedCat === "All" ? "Recent News Stream" : `${selectedCat} News`}
              </h3>

              {feedArticles.map((art, i) => (
                <Reveal
                  key={art.id || i}
                  as="article"
                  delay={i * 60}
                  onClick={() => onSelectArticle?.(art)}
                  className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-3 sm:p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 cursor-pointer shadow-sm hover:border-[#D4AF37]"
                >
                  <div className="w-full sm:w-48 sm:h-32 h-40 shrink-0 overflow-hidden rounded-lg bg-surface-variant relative border border-outline-variant/60">
                    <LazyImage
                      src={art.image || art.img}
                      alt={art.title}
                      className="w-full h-full"
                      imgClassName="img-fade img-scale w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                      {getSingleCleanTag(art)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug mb-2">
                        {art.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-on-surface-variant font-normal line-clamp-2 mb-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant font-data-tabular font-normal pt-2 border-t border-outline-variant/30">
                      <span>By {art.author || "News Desk"} • {art.publish_date || art.time || "Recent"}</span>
                      <span className="text-[#D4AF37] font-semibold">{art.readTime || "4 mins read"}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right 4 Columns: Most Read & Breaking Wire Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Newsletter Box */}
            <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant border-t-4 border-t-[#D4AF37] rounded-xl p-6 space-y-4 shadow-sm">
              <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase">DAILY DISPATCH</span>
              <h4 className="font-headline-md text-lg font-bold text-[#0C133D]">
                Get the Token Times Briefing
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Every morning, get our curated breakdown of virtual asset policy, markets, and macroeconomic analysis.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  aria-label="Email address for daily briefing newsletter"
                  className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/60 text-xs font-extrabold rounded-lg hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-sm"
                >
                  Subscribe Free →
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  );
}
