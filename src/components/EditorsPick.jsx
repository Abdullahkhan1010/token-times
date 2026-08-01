import React from "react";
import Reveal from "./Reveal";

export default function EditorsPick({ editorsPicks = [], onSelectArticle }) {
  return (
    <section className="mb-8">
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-[#0C133D] section-header-border">
        Editor's Pick
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {editorsPicks.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 80}
            as="article"
            onClick={() => onSelectArticle?.(p)}
            className="group cursor-pointer flex flex-col hover-lift border border-outline-variant p-4 rounded-xl bg-surface-container-lowest hover:border-[#D4AF37] transition-all"
          >
            <div className="w-full h-48 overflow-hidden bg-surface-variant mb-4 rounded-xl">
              <img alt={p.title} className="img-fade img-scale w-full h-full object-cover" src={p.image} />
            </div>
            <span className="font-label-caps text-label-caps text-[#D4AF37] mb-2 block">
              {Array.isArray(p.tags) ? p.tags.join(" • ") : (p.tags || "")}
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-[#D4AF37] transition-colors">
              {p.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">{p.summary}</p>
            <span className="font-data-tabular text-data-tabular text-on-surface-variant">{p.approx_time_to_read} mins read</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


