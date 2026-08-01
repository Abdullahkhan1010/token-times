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
            className="border-l-4 border-l-[#D4AF37] border-y border-r border-outline-variant p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer rounded-r-xl"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-caps text-label-caps text-[#D4AF37]">
                {Array.isArray(item.tags) ? item.tags.join(" • ") : (item.tags || "GLOBAL HIGHLIGHT")}
              </span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">{item.date}</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-2" style={{ fontSize: 20 }}>
              {item.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{item.summary}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


