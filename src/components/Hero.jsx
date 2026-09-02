import React from "react";
import Reveal from "./Reveal";

function getSingleCleanTag(article, fallback = "NEWS") {
  if (!article) return fallback;
  let rawTag = null;
  if (Array.isArray(article.category) && article.category.length > 0) {
    rawTag = article.category[0];
  } else if (typeof article.category === "string" && article.category.trim()) {
    rawTag = article.category;
  } else if (Array.isArray(article.tags) && article.tags.length > 0) {
    rawTag = article.tags[0];
  } else if (typeof article.tags === "string" && article.tags.trim()) {
    rawTag = article.tags;
  } else if (Array.isArray(article.display_section) && article.display_section.length > 0) {
    rawTag = article.display_section[0];
  }

  if (!rawTag) return fallback;

  const cleaned = String(rawTag)
    .split(",")[0]
    .replace(/_/g, " ")
    .trim();

  if (!cleaned) return fallback;
  return cleaned.toUpperCase();
}

export default function Hero({ featuredspotlight = [], substories = [], mainStory = null, topStory = null, onSelectArticle }) {
  const safeFeaturedSpotlight = Array.isArray(featuredspotlight) ? featuredspotlight : [];
  const safeSubStories = Array.isArray(substories) ? substories : [];
  const safeMainStory = mainStory && typeof mainStory === "object" ? mainStory : null;
  const safeTopStory = topStory && typeof topStory === "object" ? topStory : null;

  // Determine topStory to display (explicit topStory prop OR first article from substories)
  const activeTopStory = safeTopStory || safeSubStories[0] || null;

  // Determine sub-stories list (3 items)
  const remainingSubStories = safeTopStory ? safeSubStories : safeSubStories.slice(1);
  const subStoriesList = remainingSubStories.slice(0, 3);

  const hasContent = safeFeaturedSpotlight.length > 0 || subStoriesList.length > 0 || Boolean(safeMainStory) || Boolean(activeTopStory);

  if (!hasContent) {
    return (
      <section
        aria-label="Top featured stories"
        className="mb-8 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-6 text-center text-sm text-on-surface-variant"
      >
        No featured stories available yet.
      </section>
    );
  }

  return (

    <section aria-label="Top featured stories" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
      {/* Left Column: Top Story + 3 Sub-Stories */}
      <div className="lg:col-span-3 order-3 lg:order-1 flex flex-col gap-3 h-full justify-between">
        {/* Top Story Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#B22222] text-white border border-red-400/60 rounded-full max-w-full shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse flex-shrink-0" />
            <span className="font-label-caps text-xs font-black uppercase tracking-widest truncate text-white">
              TOP STORY
            </span>
          </div>
        </div>

        {/* Top Story Card (Text-Only, Bigger & Prominent) */}
        {activeTopStory && (
          <Reveal
            as="article"
            onClick={() => onSelectArticle?.(activeTopStory)}
            className="hover-lift group bg-surface-container-lowest border-2 border-[#B22222] p-4 sm:p-5 rounded-xl cursor-pointer shadow-lg hover:border-[#D4AF37] transition-all relative flex flex-col justify-between flex-grow"
          >
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <span className="font-label-caps text-xs font-black text-white bg-[#B22222] px-2.5 py-1 rounded mb-2.5 inline-block uppercase tracking-wider shadow-sm">
                  {getSingleCleanTag(activeTopStory, "MARKETS")}
                </span>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0C133D] group-hover:text-[#B22222] transition-colors leading-snug mb-3">
                  {activeTopStory.title}
                </h3>
                {activeTopStory.summary && (
                  <p className="text-xs sm:text-sm text-on-surface-variant font-normal line-clamp-4 lg:line-clamp-5 mb-4 leading-relaxed">
                    {activeTopStory.summary}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between font-data-tabular text-xs text-on-surface-variant font-normal pt-2.5 border-t border-outline-variant/40 mt-auto">
                <span>By {activeTopStory.author || "Editorial Desk"} • {activeTopStory.time || `${activeTopStory.approx_time_to_read || 4} mins read`}</span>
                <span className="text-[#B22222] font-black text-xs shrink-0 ml-2 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Read Story →</span>
              </div>
            </div>
          </Reveal>
        )}

        {/* Sub Stories Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1 pt-1 mt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 rounded-full max-w-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
            <span className="font-label-caps text-[10px] font-extrabold uppercase tracking-wider truncate">
              Sub Stories
            </span>
          </div>
        </div>

        {/* 3 Compact Sub Stories */}
        <div className="flex flex-col gap-2">
          {subStoriesList.map((s, i) => (
            <Reveal
              key={s.title || i}
              as="article"
              delay={100 + i * 60}
              onClick={() => onSelectArticle?.(s)}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant p-2.5 flex flex-col justify-between rounded-lg cursor-pointer shadow-sm hover:border-[#D4AF37] transition-all"
            >
              <div>
                <span className="font-label-caps text-[9px] font-bold text-[#D4AF37] mb-0.5 block uppercase">
                  {getSingleCleanTag(s, "NEWS")}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                  {s.title}
                </h4>
              </div>
              <span className="font-data-tabular text-[9px] text-on-surface-variant font-normal pt-1 mt-1 border-t border-outline-variant/20">
                {s.time || `${s.approx_time_to_read || 3} mins read`}
              </span>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Center Column: Main Lead Story with Video */}
      <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full max-w-full">
        <Reveal
          as="article"
          onClick={() => safeMainStory && onSelectArticle?.(safeMainStory)}
          className="hover-lift group bg-surface-container-lowest border border-outline-variant relative flex flex-col h-full rounded-xl overflow-hidden max-w-full shadow-sm hover:border-[#D4AF37] cursor-pointer"
        >
          {/* Main Story Media on TOP */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[440px] overflow-hidden border-b border-outline-variant bg-surface-variant max-w-full">
            {safeMainStory?.video ? (
              <video
                className="w-full h-full object-cover max-w-full block"
                autoPlay
                loop
                muted
                playsInline
                poster={safeMainStory?.image || ""}
              >
                <source src={safeMainStory.video} type="video/mp4" />
                {safeMainStory?.image && (
                  <img
                    className="img-fade img-scale w-full h-full object-cover max-w-full"
                    alt={safeMainStory?.title || "Featured story"}
                    src={safeMainStory.image}
                  />
                )}
              </video>
            ) : safeMainStory?.image ? (
              <img
                className="img-fade img-scale w-full h-full object-cover max-w-full block"
                alt={safeMainStory?.title || "Featured story"}
                src={safeMainStory.image}
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-[#0C133D] flex items-center justify-center text-[#D4AF37] font-bold text-center p-4">
                <span>Token Times • Lead Story</span>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#0C133D] font-label-caps px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md max-w-[calc(100%-1.5rem)] truncate z-10">
              LIVE • {getSingleCleanTag(safeMainStory, "FEATURED")}
            </div>
          </div>

          {/* Compact Text BELOW IT */}
          <div className="p-4 sm:p-5 flex flex-col flex-grow relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-bl-xl bg-[#D4AF37]" />
            <h2 className="font-headline-lg text-lg sm:text-xl md:text-2xl font-bold mb-2 text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-tight">
              {safeMainStory?.title || "Featured story"}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-normal mb-4 flex-grow line-clamp-3 leading-relaxed">
              {safeMainStory?.summary || ""}
            </p>
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-data-tabular font-normal pt-3 border-t border-outline-variant/40 mt-auto">
              <span>By {safeMainStory?.author || "Editorial Desk"} • {safeMainStory?.approx_time_to_read || 4} mins read</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0C133D] text-[#D4AF37] font-bold text-xs group-hover:bg-[#D4AF37] group-hover:text-[#0C133D] transition-all">
                Read Story →
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Right Column: Featured Spotlight */}
      <div className="lg:col-span-3 order-2 lg:order-3 flex flex-col gap-2.5 h-full">
        {/* Section Header with Pill */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 rounded-full max-w-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0 animate-pulse" />
            <span className="font-label-caps text-xs font-extrabold uppercase tracking-wider truncate">
              Featured Spotlight
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 flex-grow">
          {featuredspotlight.map((art, i) => (
            <Reveal
              key={art.title}
              as="article"
              delay={i * 90}
              onClick={() => onSelectArticle?.(art)}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant flex-1 flex flex-col justify-between rounded-xl overflow-hidden cursor-pointer shadow-sm hover:border-[#D4AF37]"
            >
              {/* Picture on Top */}
              <div className="w-full h-40 sm:h-44 md:h-52 overflow-hidden relative border-b border-outline-variant/60 bg-surface-variant">
                <img
                  className="img-fade img-scale w-full h-full object-cover"
                  alt={art.title}
                  src={art.image}
                />
                <span className="absolute top-2 left-2 bg-[#D4AF37] text-[#0C133D] font-label-caps px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide shadow-sm max-w-[calc(100%-1rem)] truncate">
                  {getSingleCleanTag(art, "SPOTLIGHT")}
                </span>
              </div>

              {/* Compact Text Content Below Picture */}
              <div className="p-3.5 flex flex-col flex-grow justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug mb-2 line-clamp-2">
                  {art.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-data-tabular font-normal pt-2 border-t border-outline-variant/30 mt-auto">
                  <span>{art.approx_time_to_read} mins read</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0C133D] text-[#F7F0EB] font-bold text-[11px] group-hover:bg-[#D4AF37] group-hover:text-[#0C133D] transition-all">
                    Read →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

  );
}






