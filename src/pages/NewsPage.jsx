import React, { useState } from "react";
import Reveal from "../components/Reveal";
import { newsPageData } from "../data/pagesData";

export default function NewsPage() {
  const [selectedCat, setSelectedCat] = useState("All");

  const filteredArticles =
    selectedCat === "All"
      ? newsPageData.articles
      : newsPageData.articles.filter((a) => a.category.toLowerCase() === selectedCat.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Top Banner / Section Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-accent font-bold uppercase tracking-widest block mb-1">
            DIGITAL ASSETS INTELLIGENCE STREAM
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface">
            Latest News & Market Analysis
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-md">
          Real-time reporting on regulatory shifts, market momentum, and Web3 innovation across Pakistan and global hubs.
        </p>
      </Reveal>

      {/* Category Filter Tabs */}
      <Reveal as="div" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {newsPageData.categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap border ${
              selectedCat === cat
                ? "bg-accent text-on-accent border-accent shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-accent hover:text-accent"
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
            className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden cursor-pointer"
          >
            <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
              <img
                src={newsPageData.leadStory.img}
                alt={newsPageData.leadStory.title}
                className="img-fade img-scale w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-accent text-on-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {newsPageData.leadStory.tag}
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl font-bold text-on-surface group-hover:text-accent transition-colors leading-tight mb-3">
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
                <span>{newsPageData.leadStory.readTime}</span>
              </div>
            </div>
          </Reveal>

          {/* Filtered Articles List */}
          <div className="space-y-6">
            <h3 className="font-headline-sm text-lg font-bold text-primary border-b border-outline-variant pb-2">
              {selectedCat === "All" ? "Recent News Stream" : `${selectedCat} News`}
            </h3>

            {filteredArticles.map((art, i) => (
              <Reveal
                key={art.id}
                as="article"
                delay={i * 60}
                className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 cursor-pointer"
              >
                <div className="w-full sm:w-48 sm:h-32 h-44 shrink-0 overflow-hidden rounded-lg bg-surface-variant relative">
                  <img
                    src={art.img}
                    alt={art.title}
                    className="img-fade img-scale w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-background/90 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {art.tag}
                  </span>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h4 className="font-headline-md text-base sm:text-lg font-bold text-on-surface group-hover:text-accent transition-colors leading-snug mb-2">
                      {art.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2 mb-3">
                      {art.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-data-tabular pt-2 border-t border-outline-variant/30">
                    <span>By {art.author} • {art.time}</span>
                    <span className="text-accent font-semibold">{art.readTime}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right 4 Columns: Most Read & Breaking Wire Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Most Read Widget */}
          <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <h3 className="font-headline-sm text-base font-bold text-primary uppercase tracking-wider">
                Trending / Most Read
              </h3>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </div>
            <div className="space-y-4">
              {newsPageData.mostRead.map((item) => (
                <div key={item.rank} className="flex gap-4 items-start group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none">
                  <span className="font-display-lg text-2xl font-extrabold text-accent/50 group-hover:text-accent transition-colors w-6">
                    0{item.rank}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface group-hover:text-accent transition-colors leading-snug mb-1">
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
          <Reveal as="div" className="bg-surface-container-high border border-outline-variant rounded-xl p-6 space-y-4">
            <span className="font-label-caps text-xs text-accent font-bold uppercase">DAILY DISPATCH</span>
            <h4 className="font-headline-md text-lg font-bold text-on-surface">
              Get the Token Times Briefing
            </h4>
            <p className="text-xs text-on-surface-variant">
              Every morning, get our curated breakdown of virtual asset policy, markets, and macroeconomic analysis.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full px-3 py-2 text-xs bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-accent"
              />
              <button className="w-full py-2 bg-accent text-on-accent text-xs font-bold rounded-lg hover:bg-accent-dark transition-colors">
                Subscribe Free
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
