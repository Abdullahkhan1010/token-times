import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getPublishedNews } from "../services/published-news.service";
import { ToHref } from "../services/file.service";

const REGIONS = ["All Regions", "Pakistan", "Middle East & UAE", "Europe & MiCA", "North America", "Asia Pacific"];

function formatTag(tag) {
  if (!tag) return "GLOBAL";
  if (Array.isArray(tag)) {
    if (tag.length === 0) return "GLOBAL";
    return tag.map((t) => formatTag(t)).join(" • ");
  }
  return String(tag)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function GlobalPage({ onNavigate, onSelectArticle }) {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPublishedNews();
        if (!active) return;
        const published = data.filter((a) => a.status === "published");
        
        const resolved = await Promise.all(
          published.map(async (art) => ({
            ...art,
            image: await ToHref(art.image, "global.jpg"),
          }))
        );

        if (active) {
          setArticles(resolved);
        }
      } catch (err) {
        console.error("Failed to load global articles", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Filter to only global-relevant articles (strict: by display_section or category only)
  const globalArticles = articles.filter((a) => {
    const secs = Array.isArray(a.display_section) ? a.display_section : [];
    const cats = Array.isArray(a.category) ? a.category : [a.category || ""];
    const catText = cats.map((t) => String(t).toLowerCase().replace(/_/g, " "));
    // Match display_section Global_Highlight, or category is explicitly global/international/middle east/asia pacific/europe
    const isGlobalSection = secs.includes("Global_Highlight") || secs.includes("global_highlights");
    const globalCategories = ["global", "international", "middle east", "asia pacific", "europe"];
    const isGlobalCategory = catText.some((c) => globalCategories.includes(c));
    return isGlobalSection || isGlobalCategory;
  });

  const filteredArticles = selectedRegion === "All Regions"
    ? globalArticles
    : globalArticles.filter((a) => {
        const catArray = Array.isArray(a.category) ? a.category : [a.category || ""];
        const secArray = Array.isArray(a.display_section) ? a.display_section : [];
        const allTags = [...catArray, ...secArray].map((t) => String(t).toLowerCase().replace(/_/g, " "));
        const target = selectedRegion.toLowerCase();
        return allTags.some((t) => t.includes(target) || target.includes(t));
      });

  const activeList = filteredArticles.length > 0 ? filteredArticles : (globalArticles.length > 0 ? globalArticles : articles);

  const leadStory = activeList[0] || null;
  const secondaryHeadlines = activeList.slice(1, 5);
  const gridCards = activeList.slice(5, 8);
  const feedArticles = activeList.slice(8, 13);

  return (
    <div className="space-y-5 sm:space-y-8">
      <SEOHead
        pageKey="Global"
        customTitle="Global Web3 & Digital Asset Coverage | Token Times"
      />

      <Breadcrumbs currentPage="Global" onNavigate={onNavigate} />

      {/* Page Title */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block mb-1">
            INTERNATIONAL INTELLIGENCE HUB
          </span>
          <h1 className="font-display-lg text-2xl sm:text-3xl md:text-5xl font-bold text-[#0C133D]">
            Global Digital Asset Coverage
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-md">
          Cross-border monetary policy, international VASP compliance, and institutional Web3 developments worldwide.
        </p>
      </Reveal>

      {/* Region Filter Bar */}
      <Reveal as="div" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2" role="tablist">
        {REGIONS.map((reg) => (
          <button
            key={reg}
            role="tab"
            aria-selected={selectedRegion === reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap border ${
              selectedRegion === reg
                ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] shadow-sm font-extrabold"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#D4AF37] hover:text-[#0C133D]"
            }`}
          >
            {reg}
          </button>
        ))}
      </Reveal>

      {/* Hero Section: Lead Story (Full Image + Headline) + Secondary Headlines List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Lead Story */}
        {leadStory && (
          <Reveal
            as="article"
            onClick={() => onSelectArticle?.(leadStory)}
            className="lg:col-span-8 hover-lift group bg-surface-container-lowest border-2 border-[#0C133D] rounded-xl overflow-hidden cursor-pointer shadow-md hover:border-[#D4AF37] flex flex-col justify-between"
          >
            <div className="relative w-full h-48 sm:h-80 md:h-96 overflow-hidden">
              <img
                src={leadStory.image || leadStory.img}
                alt={leadStory.title}
                className="img-fade img-scale w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {formatTag(leadStory.category || leadStory.display_section)}
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
                <span>By {leadStory.author || "Global Editorial"}</span>
                <span>•</span>
                <span>{leadStory.publish_date || "Today"}</span>
              </div>
            </div>
          </Reveal>
        )}

        {/* Secondary Headlines Rail (4-5 text-only headlines) */}
        <Reveal as="aside" className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 flex flex-col justify-start gap-3 shadow-sm">
          <div className="border-b border-outline-variant pb-3 flex items-center justify-between">
            <h3 className="font-headline-sm text-sm font-bold text-[#0C133D] uppercase tracking-wider">
              Global Headlines Wire
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          </div>

          <div className="space-y-3.5">
            {secondaryHeadlines.map((item, i) => (
              <div
                key={i}
                onClick={() => onSelectArticle?.(item)}
                className="group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none"
              >
                <span className="font-label-caps text-[10px] font-bold text-[#D4AF37] uppercase block mb-0.5">
                  INTERNATIONAL WIRE
                </span>
                <h4 className="font-headline-md text-xs sm:text-sm font-semibold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <span className="font-data-tabular text-[10px] text-on-surface-variant block mt-1">
                  {item.approx_time_to_read || 3} mins read
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* 3-Across Story Cards Grid */}
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
                <img src={card.image || card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 left-2 bg-[#0C133D] text-[#D4AF37] text-[10px] font-extrabold px-2 py-0.5 rounded">
                  {card.category?.[0] || "GLOBAL"}
                </span>
              </div>
              <h3 className="font-headline-md text-sm sm:text-base font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug mb-2 line-clamp-2">
                {card.title}
              </h3>
              <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                {card.summary}
              </p>
            </div>
            <span className="font-data-tabular text-[10px] text-on-surface-variant pt-2 border-t border-outline-variant/40">
              Read Analysis →
            </span>
          </Reveal>
        ))}
      </div>

      {/* Bottom Main Content: Chronological Feed + Persistent Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chronological Feed */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-headline-sm text-base font-bold text-[#0C133D] border-b border-outline-variant pb-2 uppercase tracking-wider">
            Chronological Global Dispatch
          </h3>

          {feedArticles.map((art, i) => (
            <Reveal
              key={art._id || i}
              as="article"
              delay={i * 60}
              onClick={() => onSelectArticle?.(art)}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 cursor-pointer shadow-sm hover:border-[#D4AF37]"
            >
              <div className="w-full sm:w-44 h-40 sm:h-32 shrink-0 rounded-lg overflow-hidden border border-outline-variant/60 relative">
                <img src={art.image || art.img} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <span className="font-label-caps text-[10px] font-bold text-[#D4AF37] uppercase block mb-1">
                    {art.category?.[0] || "GLOBAL"}
                  </span>
                  <h4 className="font-headline-md text-sm sm:text-base font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug mb-1">
                    {art.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {art.summary}
                  </p>
                </div>
                <span className="font-data-tabular text-[10px] text-on-surface-variant pt-2 border-t border-outline-variant/30 mt-2">
                  By {art.author || "Global Desk"} • {art.publish_date || "Today"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Persistent Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trending Box */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-headline-sm text-sm font-bold text-[#0C133D] border-b border-outline-variant pb-2 uppercase tracking-wider">
              Trending International
            </h3>
            <div className="space-y-3">
              {[
                "UAE VARA Expands Virtual Asset Licensing Cohort",
                "European Central Bank Progresses CBDC Phase 2",
                "Asian Banks Test Tokenized Commercial Paper",
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-outline-variant/40 pb-2.5 last:border-none">
                  <span className="font-display-lg text-lg font-bold text-[#D4AF37]">0{idx + 1}</span>
                  <h4 className="text-xs font-semibold text-[#0C133D] hover:text-[#D4AF37] transition-colors cursor-pointer">
                    {item}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="bg-surface-container-lowest border border-outline-variant border-t-4 border-t-[#D4AF37] rounded-xl p-5 space-y-3 shadow-sm">
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">GLOBAL DISPATCH</span>
            <h4 className="font-headline-md text-base font-bold text-[#0C133D]">
              Subscribe to International Briefings
            </h4>
            <p className="text-xs text-on-surface-variant">
              Daily cross-border financial intelligence straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter email..."
                aria-label="Email address for global dispatch newsletter"
                className="w-full px-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/60 text-xs font-extrabold rounded-lg hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all"
              >
                Subscribe Free →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
