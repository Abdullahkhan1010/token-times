import React from "react";
import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";


export default function LatestNews({ latestNews = [], onSelectArticle }) {
  return (
    <section className="mb-8 bg-surface-container-low p-6 border border-outline-variant rounded-xl">
      <div className="flex justify-between items-center section-header-border mb-6">
        <h2 className="font-headline-lg text-headline-lg text-[#0C133D] m-0" style={{ border: 0, paddingBottom: 0 }}>
          Latest News
        </h2>
        <span className="font-label-caps text-label-caps text-[#D4AF37] hover:text-[#B08D23] flex items-center gap-1 group cursor-pointer">
          View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {latestNews.map((n, i) => (
          <Reveal
            key={n.title}
            delay={i * 60}
            as="article"
            onClick={() => onSelectArticle?.(n)}
            className="flex gap-4 group cursor-pointer p-3 rounded-xl hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-outline-variant"
          >
            <div className="w-24 h-24 flex-shrink-0 bg-surface-variant rounded-xl overflow-hidden">
              <img alt={n.title} className="img-fade w-full h-full object-cover" src={n.image} />
            </div>
            <div className="flex flex-col justify-center">
              <h4
                className="font-headline-md text-headline-md text-[#0C133D] leading-snug group-hover:text-[#D4AF37] transition-colors"
                style={{ fontSize: 18 }}
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


