import React from "react";
import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";
import { latestNews } from "../data/content";

export default function LatestNews() {
  return (
    <section className="mb-8 bg-surface-container-low p-5 sm:p-6 border border-outline-variant rounded-xl overflow-hidden max-w-full">
      <div className="flex justify-between items-center section-header-border mb-6">
        <h2 className="font-headline-lg text-headline-lg text-primary m-0" style={{ border: 0, paddingBottom: 0 }}>
          Latest News
        </h2>
        <a className="font-label-caps text-label-caps text-accent hover:text-accent-dark flex items-center gap-1 group text-xs font-bold" href="#">
          View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {latestNews.map((n, i) => (
          <Reveal
            key={n.title}
            delay={i * 60}
            as="article"
            className="flex gap-4 items-center group cursor-pointer border border-outline-variant/50 bg-surface-container-lowest p-3.5 rounded-xl overflow-hidden hover-lift min-w-0 max-w-full"
          >
            {/* Perfectly Fitted Thumbnail Box */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-surface-variant rounded-lg overflow-hidden relative border border-outline-variant/40">
              <img
                alt={n.title}
                className="w-full h-full object-cover rounded-lg block m-0 p-0 max-w-full max-h-full"
                src={n.img}
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-grow overflow-hidden">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-1 text-[11px] truncate block">
                {n.cat}
              </span>
              <h4 className="font-headline-md text-on-surface leading-snug group-hover:text-accent transition-colors text-xs sm:text-sm font-semibold line-clamp-2">
                {n.title}
              </h4>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


