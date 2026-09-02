import React from "react";
import Reveal from "./Reveal";


export default function PakistanFocus({ pakistanFocus = [], onSelectArticle }) {
  return (
    <section className="flex flex-col h-full">
      <Reveal as="h2" className="text-xl sm:text-2xl font-extrabold text-[#0C133D] section-header-border">
        Pakistan Focus
      </Reveal>
      <div className="flex flex-col gap-4 flex-1">
        {pakistanFocus.map((item, i) => (
          <Reveal
            key={item.title || i}
            delay={i * 80}
            as="article"
            onClick={() => onSelectArticle?.(item)}
            className="hover-lift border border-outline-variant border-l-4 border-l-[#D4AF37] p-5 bg-surface-container-lowest rounded-xl cursor-pointer hover:border-[#D4AF37] transition-all flex-1 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex justify-between items-start mb-2.5">
                <span className="font-label-caps bg-[#0C133D] text-[#D4AF37] px-2.5 py-1 uppercase rounded-md text-[11px] font-bold">
                  {Array.isArray(item.category) && item.category.length > 0
                    ? String(item.category[0]).replace(/_/g, " ").toUpperCase()
                    : Array.isArray(item.tags) && item.tags.length > 0
                    ? String(item.tags[0]).replace(/_/g, " ").toUpperCase()
                    : String(item.tags || "PAKISTAN FOCUS").replace(/_/g, " ").toUpperCase()}
                </span>
                <span className="font-data-tabular text-xs text-on-surface-variant font-normal">{item.date}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0C133D] hover:text-[#D4AF37] transition-colors mb-2 leading-snug line-clamp-2">
                {item.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed line-clamp-2 mt-auto">{item.summary}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


