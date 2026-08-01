import React from "react";
import Reveal from "./Reveal";

export default function FeaturedAnalysis({ fa = null, onSelectArticle }) {
  const safeFeaturedAnalysis = fa && typeof fa === "object" ? fa : {};
  const hasContent = Boolean(
    safeFeaturedAnalysis.title ||
    safeFeaturedAnalysis.summary ||
    safeFeaturedAnalysis.image ||
    safeFeaturedAnalysis.tags
  );

  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-[#0C133D] section-header-border">
        Featured Analysis
      </Reveal>

      {hasContent ? (
        <Reveal
          as="article"
          onClick={() => onSelectArticle?.(safeFeaturedAnalysis)}
          className="hover-lift relative h-96 group overflow-hidden rounded-xl cursor-pointer"
        >
          <img
            alt={safeFeaturedAnalysis.title || "Featured analysis"}
            className="img-fade img-scale absolute inset-0 w-full h-full object-cover"
            src={safeFeaturedAnalysis.image || ""}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C133D] via-[#0C133D]/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-on-primary w-full">
            <span className="font-label-caps text-label-caps text-[#D4AF37] mb-2 block">
              {safeFeaturedAnalysis.tags || "Featured Analysis"}
            </span>
            <h3 className="font-headline-lg text-headline-lg mb-3">
              {safeFeaturedAnalysis.title || "Featured analysis"}
            </h3>
            <p className="font-body-md text-body-md text-surface-variant mb-4 max-w-xl line-clamp-2">
              {safeFeaturedAnalysis.summary || "More analysis will appear here soon."}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectArticle?.(safeFeaturedAnalysis);
              }}
              className="font-label-caps text-label-caps border border-[#D4AF37] text-[#D4AF37] px-4 py-2 hover:bg-[#D4AF37] hover:text-[#0C133D] transition-colors inline-block font-bold rounded-lg"
            >
              Read Full Report →
            </button>
          </div>
        </Reveal>
      ) : (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-6 text-center text-sm text-on-surface-variant">
          No featured analysis available yet.
        </div>
      )}
    </section>
  );
}

