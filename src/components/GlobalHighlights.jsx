import React from "react";
import Reveal from "./Reveal";

export default function GlobalHighlights({ globalHighlights = [], onSelectArticle }) {
  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-[#0C133D] section-header-border">
        Global Highlights
      </Reveal>
      <div className="flex flex-col gap-4">
        {globalHighlights.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 80}
            as="article"
            onClick={() => onSelectArticle?.(item)}
            className="hover-lift border border-outline-variant border-l-4 border-l-[#D4AF37] p-4 bg-surface-container-lowest rounded-r-xl rounded-l-sm cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-caps text-label-caps bg-[#0C133D] text-[#D4AF37] px-2 py-1 uppercase rounded">
                {Array.isArray(item.category) && item.category.length > 0
                  ? String(item.category[0]).replace(/_/g, " ").toUpperCase()
                  : Array.isArray(item.tags) && item.tags.length > 0
                  ? String(item.tags[0]).replace(/_/g, " ").toUpperCase()
                  : String(item.tags || "GLOBAL HIGHLIGHT").replace(/_/g, " ").toUpperCase()}
              </span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">{item.date}</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-[#0C133D] hover:text-[#D4AF37] transition-colors mb-2" style={{ fontSize: 20 }}>
              {item.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{item.summary}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


