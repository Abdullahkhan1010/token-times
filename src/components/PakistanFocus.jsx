import React from "react";
import Reveal from "./Reveal";


export default function PakistanFocus({ pakistanFocus }) {
  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-[#0C133D] section-header-border">
        Pakistan Focus
      </Reveal>
      <div className="flex flex-col gap-4">
        {pakistanFocus.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 80}
            as="article"
            className="hover-lift border border-outline-variant p-4 bg-surface-container-lowest"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-caps text-label-caps bg-[#0C133D] text-[#D4AF37] px-2 py-1">{item.tags}</span>
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


