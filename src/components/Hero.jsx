import React from "react";
import Reveal from "./Reveal";

export default function Hero({ featuredspotlight = [], substories = [], mainStory = null }) {
  const safeFeaturedSpotlight = Array.isArray(featuredspotlight) ? featuredspotlight : [];
  const safeSubStories = Array.isArray(substories) ? substories : [];
  const safeMainStory = mainStory && typeof mainStory === "object" ? mainStory : null;
  const hasContent = safeFeaturedSpotlight.length > 0 || safeSubStories.length > 0 || Boolean(safeMainStory);

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
      {/* Left Column: 4 Featured Sub-Stories (3rd on mobile, 1st on desktop) */}
      <div className="lg:col-span-3 order-3 lg:order-1 flex flex-col gap-4 h-full">
        {/* Sleek Pill Header Container */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 rounded-full max-w-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
            <span className="font-label-caps text-xs font-extrabold uppercase tracking-wider truncate">
              Sub Stories
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 flex-grow">
          {substories.map((s, i) => (
            <Reveal
              key={s.title}
              as="article"
              delay={100 + i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant p-4 flex-1 flex flex-col justify-between rounded-xl cursor-pointer shadow-sm hover:border-[#D4AF37]"
            >
              <div>
                <span className="font-label-caps text-xs font-bold text-[#D4AF37] mb-1.5 block">
                  {s.tags}
                </span>

                <h3 className="font-headline-md text-[#0C133D] group-hover:text-[#D4AF37] transition-colors text-xs sm:text-sm font-semibold leading-snug mb-2 line-clamp-2">
                  {s.title}
                </h3>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant text-xs pt-1">
                {s.approx_time_to_read} mins read
              </span>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Center Column: Main Lead Story with Video */}
      <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full max-w-full">
        <Reveal
          as="article"
          className="hover-lift group bg-surface-container-lowest border border-outline-variant relative flex flex-col h-full rounded-xl overflow-hidden max-w-full shadow-sm hover:border-[#D4AF37]"
        >
          {/* Main Video on TOP */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[440px] overflow-hidden border-b border-outline-variant bg-black max-w-full">
            <video
              className="w-full h-full object-cover max-w-full block"
              autoPlay
              loop
              muted
              playsInline
              poster={safeMainStory?.image || ""}
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-data-42838-large.mp4"
                type="video/mp4"
              />
              <img
                className="img-fade img-scale w-full h-full object-cover max-w-full"
                alt={safeMainStory?.title || "Featured story"}
                src={safeMainStory?.image || ""}
              />
            </video>
            <div className="absolute top-3 left-3 bg-[#D4AF37] text-[#0C133D] font-label-caps px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md max-w-[calc(100%-1.5rem)] truncate z-10">
              LIVE • {safeMainStory?.tags || "Featured"}
            </div>
          </div>

          {/* Compact Text BELOW IT */}
          <div className="p-4 sm:p-5 flex flex-col flex-grow relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-bl-xl bg-[#D4AF37]" />
            <h2 className="font-headline-lg text-lg sm:text-xl md:text-2xl font-bold mb-2 text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-tight">
              {safeMainStory?.title || "Featured story"}
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-4 flex-grow leading-relaxed line-clamp-3">
              {safeMainStory?.summary || "More stories will appear here soon."}
            </p>
            <div className="flex items-center gap-3 font-label-caps text-xs text-on-surface-variant pt-3 border-t border-outline-variant/50 mt-auto flex-wrap">
              <span>By {safeMainStory?.author || "Token Times"}</span>
              <span>•</span>
              <span>{safeMainStory?.approx_time_to_read} mins read</span>
              <a
                href="#"
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/50 font-extrabold text-xs hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-sm"
              >
                Read Story →
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Right Column: 2 Featured Spotlight Articles (2nd on mobile, 3rd on desktop) */}
      <div className="lg:col-span-3 order-2 lg:order-3 flex flex-col gap-4 h-full">
        {/* Sleek Pill Header Container */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 rounded-full max-w-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse flex-shrink-0" />
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
                  {art.tags}
                </span>
              </div>

              {/* Compact Text Content Below Picture */}
              <div className="p-3.5 flex flex-col flex-grow justify-between">
                <h3 className="font-headline-md text-[#0C133D] group-hover:text-[#D4AF37] transition-colors text-xs sm:text-sm font-semibold leading-snug mb-2 line-clamp-2">
                  {art.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-data-tabular pt-2 border-t border-outline-variant/30 mt-auto">
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






