import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { newsPageData } from "../data/pagesData";
import { BASE_URL } from "../data/seoData";

function formatTag(tag) {
  if (!tag) return "NEWS";
  if (Array.isArray(tag)) {
    if (tag.length === 0) return "NEWS";
    return tag.map((t) => formatTag(t)).join(" • ");
  }
  return String(tag)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function NewsPage({ onNavigate, onSelectArticle }) {
  const [selectedCat, setSelectedCat] = useState("All");

  const filteredArticles =
    selectedCat === "All"
      ? newsPageData.articles
      : newsPageData.articles.filter((a) => {
          const catStr = String(a.category || "").toLowerCase().replace(/_/g, " ");
          const target = selectedCat.toLowerCase().replace(/_/g, " ");
          return catStr.includes(target) || target.includes(catStr);
        });

  // Generate NewsArticle schema for Lead Story
  const leadArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: newsPageData.leadStory.title,
    description: newsPageData.leadStory.summary,
    image: [newsPageData.leadStory.img],
    datePublished: "2026-07-29T14:30:00+05:00",
    dateModified: "2026-07-29T15:00:00+05:00",
    author: {
      "@type": "Person",
      name: newsPageData.leadStory.author,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/news`,
    },
  };

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
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
            Latest News & Market Analysis
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-md">
          Real-time reporting on regulatory shifts, market momentum, and Web3 innovation across Pakistan and global hubs.
        </p>
      </Reveal>

      {/* Category Filter Tabs */}
      <Reveal as="div" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2" role="tablist">
        {newsPageData.categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCat === cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap border ${
              selectedCat === cat
                ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] shadow-sm font-extrabold"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#D4AF37] hover:text-[#0C133D]"
            }`}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      {/* Main Grid: Lead Story + News Stream + Most Read Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Featured Lead & Articles Stream */}
        <div className="lg:col-span-8 space-y-8">
          {/* Featured Breaking Lead Story */}
          <Reveal
            as="article"
            onClick={() => onSelectArticle?.({
              title: newsPageData.leadStory.title,
              summary: newsPageData.leadStory.summary,
              image: newsPageData.leadStory.img,
              author: newsPageData.leadStory.author,
              approx_time_to_read: 5,
              category: [newsPageData.leadStory.tag],
              article: `${newsPageData.leadStory.summary}\n\nThe digital asset landscape in Pakistan and broader Asian financial corridors continues to experience structural transformations. Regulatory clarity provided by central monetary authorities and securities commissions has laid the foundation for institutional participation.\n\nMarket participants continue to monitor digital asset policies, tax frameworks, and central bank digital currency (CBDC) pilot programs closely.`
            })}
            className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden cursor-pointer shadow-sm hover:border-[#D4AF37]"
          >
            <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
              <img
                src={newsPageData.leadStory.img}
                alt={newsPageData.leadStory.title}
                loading="eager"
                decoding="async"
                className="img-fade img-scale w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#0C133D] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {formatTag(newsPageData.leadStory.tag)}
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-tight mb-3">
                {newsPageData.leadStory.title}
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant mb-4 leading-relaxed">
                {newsPageData.leadStory.summary}
              </p>
              <div className="flex items-center gap-4 text-xs font-data-tabular text-on-surface-variant pt-3 border-t border-outline-variant/40">
                <span>By {newsPageData.leadStory.author}</span>
                <span>•</span>
                <span>{newsPageData.leadStory.time}</span>
                <span>•</span>
                <span className="text-[#D4AF37] font-bold">{newsPageData.leadStory.readTime}</span>
              </div>
            </div>
          </Reveal>

          {/* Filtered Articles List */}
          <div className="space-y-6">
            <h3 className="font-headline-sm text-lg font-bold text-[#0C133D] border-b border-outline-variant pb-2">
              {selectedCat === "All" ? "Recent News Stream" : `${selectedCat} News`}
            </h3>

            {filteredArticles.map((art, i) => (
              <Reveal
                key={art.id}
                as="article"
                delay={i * 60}
                onClick={() => onSelectArticle?.({
                  title: art.title,
                  summary: art.summary,
                  image: art.img,
                  author: art.author,
                  approx_time_to_read: 4,
                  category: [art.tag || "News"],
                  article: `${art.summary}\n\nInstitutional reporting and market analysis provided by Token Times Editorial Desk. Detailed market data shows increasing liquidity and institutional engagement across digital asset derivative channels.`
                })}
                className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 cursor-pointer shadow-sm hover:border-[#D4AF37]"
              >
                <div className="w-full sm:w-48 sm:h-32 h-44 shrink-0 overflow-hidden rounded-lg bg-surface-variant relative border border-outline-variant/60">
                  <img
                    src={art.img}
                    alt={art.title}
                    loading="lazy"
                    decoding="async"
                    className="img-fade img-scale w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow-sm">
                    {formatTag(art.tag)}
                  </span>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h4 className="font-headline-md text-base sm:text-lg font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug mb-2">
                      {art.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 mb-3">
                      {art.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-data-tabular pt-2 border-t border-outline-variant/30">
                    <span>By {art.author} • {art.time}</span>
                    <span className="text-[#D4AF37] font-semibold">{art.readTime}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right 4 Columns: Most Read & Breaking Wire Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Most Read Widget */}
          <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <h3 className="font-headline-sm text-base font-bold text-[#0C133D] uppercase tracking-wider">
                Trending / Most Read
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            </div>
            <div className="space-y-4">
              {newsPageData.mostRead.map((item) => (
                <div key={item.rank} className="flex gap-4 items-start group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none">
                  <span className="font-display-lg text-2xl font-extrabold text-[#D4AF37] group-hover:scale-110 transition-transform w-6">
                    0{item.rank}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug mb-1">
                      {item.title}
                    </h4>
                    <span className="text-xs text-on-surface-variant font-data-tabular">
                      {item.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

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
    </div>
  );
}
