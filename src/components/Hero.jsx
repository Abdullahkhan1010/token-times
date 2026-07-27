import React from "react";
import Reveal from "./Reveal";
import { heroLead, heroSubStories, heroLeftArticles } from "../data/content";

export default function Hero() {
  return (
    <section aria-label="Top featured stories" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
      {/* Left Column: 2 Featured Spotlight Articles (2nd on mobile, 1st on desktop) */}
      <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col gap-4 h-full">
        {/* Sleek Pill Header Container */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/80 rounded-full max-w-full">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
            <span className="font-label-caps text-xs font-bold text-on-surface uppercase tracking-wider truncate">
              Featured Spotlight
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 flex-grow">
          {heroLeftArticles.map((art, i) => (
            <Reveal
              key={art.title}
              as="article"
              delay={i * 90}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant flex-1 flex flex-col justify-between rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Picture on Top */}
              <div className="w-full h-40 sm:h-44 md:h-52 overflow-hidden relative border-b border-outline-variant/60 bg-surface-variant">
                <img
                  className="img-fade img-scale w-full h-full object-cover"
                  alt={art.title}
                  src={art.img}
                />
                <span className="absolute top-2 left-2 bg-background/90 backdrop-blur-md text-accent font-label-caps px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border border-outline-variant/40 shadow-sm max-w-[calc(100%-1rem)] truncate">
                  {art.tag}
                </span>
              </div>

              {/* Compact Text Content Below Picture */}
              <div className="p-3.5 flex flex-col flex-grow justify-between">
                <h3 className="font-headline-md text-on-surface group-hover:text-accent transition-colors text-xs sm:text-sm font-semibold leading-snug mb-2 line-clamp-2">
                  {art.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-data-tabular pt-2 border-t border-outline-variant/30 mt-auto">
                  <span>{art.read}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-accent font-medium">Read →</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Center Column: Main Lead Story (1st on mobile, 2nd on desktop) */}
      <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full">
        <Reveal
          as="article"
          className="hover-lift group bg-surface-container-lowest border border-outline-variant relative flex flex-col h-full rounded-xl overflow-hidden"
        >
          {/* Main Image on TOP */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[440px] overflow-hidden border-b border-outline-variant">
            <img
              className="img-fade img-scale w-full h-full object-cover"
              alt={heroLead.title}
              src={heroLead.img}
            />
            <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-md text-on-accent font-label-caps px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-md max-w-[calc(100%-1.5rem)] truncate">
              {heroLead.tag}
            </div>
          </div>

          {/* Compact Text BELOW IT */}
          <div className="p-4 sm:p-5 flex flex-col flex-grow relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-bl-xl" />
            <h2 className="font-headline-lg text-lg sm:text-xl md:text-2xl font-bold mb-2 text-on-surface group-hover:text-accent transition-colors leading-tight">
              {heroLead.title}
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-4 flex-grow leading-relaxed line-clamp-3">
              {heroLead.summary}
            </p>
            <div className="flex items-center gap-3 font-label-caps text-xs text-on-surface-variant pt-3 border-t border-outline-variant/50 mt-auto flex-wrap">
              <span>By {heroLead.author}</span>
              <span>•</span>
              <span>{heroLead.readTime}</span>
              <a href="#" className="accent-underline text-accent ml-auto font-medium">
                Read More →
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Right Column: 4 Featured Sub-Stories (3rd on mobile & desktop) */}
      <div className="lg:col-span-3 order-3 lg:order-3 flex flex-col gap-4 h-full">
        {/* Sleek Pill Header Container */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/80 rounded-full max-w-full">
            <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
            <span className="font-label-caps text-xs font-bold text-on-surface uppercase tracking-wider truncate">
              Sub Stories
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 flex-grow">
          {heroSubStories.map((s, i) => (
            <Reveal
              key={s.title}
              as="article"
              delay={100 + i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant p-4 flex-1 flex flex-col justify-between rounded-xl cursor-pointer"
            >
              <div>
                <span className="font-label-caps text-label-caps text-secondary mb-1.5 block">
                  {s.tag}
                </span>
                <h3 className="font-headline-md text-on-surface group-hover:text-accent transition-colors text-xs sm:text-sm font-semibold leading-snug mb-2 line-clamp-2">
                  {s.title}
                </h3>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant text-xs pt-1">
                {s.time}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}





