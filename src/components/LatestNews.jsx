import React from "react";
import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";

function getCleanCategory(item) {
  if (!item) return "NEWS";
  if (Array.isArray(item.category) && item.category.length > 0) {
    return String(item.category[0]).replace(/_/g, " ").toUpperCase();
  }
  if (typeof item.category === "string" && item.category.trim()) {
    return item.category.replace(/_/g, " ").toUpperCase();
  }
  if (Array.isArray(item.tags) && item.tags.length > 0) {
    return String(item.tags[0]).replace(/_/g, " ").toUpperCase();
  }
  return String(item.tags || "NEWS").replace(/_/g, " ").toUpperCase();
}

export default function LatestNews({ latestNews = [], onSelectArticle }) {
  return (
    <section className="mb-8 bg-surface-container-low p-4 sm:p-6 border border-outline-variant rounded-xl">
      <div className="flex justify-between items-center section-header-border mb-4 sm:mb-6">
        <h2 className="font-headline-lg text-headline-lg text-[#0C133D] m-0 text-lg sm:text-xl" style={{ border: 0, paddingBottom: 0 }}>
          Latest News
        </h2>
        <a className="font-label-caps text-label-caps text-[#D4AF37] hover:text-[#B08D23] flex items-center gap-1 group" href="#">
          View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6">
        {latestNews.map((n, i) => (
          <Reveal
            key={n.title || i}
            delay={i * 60}
            as="article"
            onClick={() => onSelectArticle?.(n)}
            className="flex gap-3 sm:gap-4 group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-surface-variant rounded-xl overflow-hidden">
              <img alt={n.title} className="img-fade w-full h-full object-cover" src={n.image} />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[10px] sm:text-xs">
                {getCleanCategory(n)}
              </span>
              <h4
                className="font-headline-md text-headline-md text-[#0C133D] leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2"
                style={{ fontSize: 16 }}
              >
                {n.title}
              </h4>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


