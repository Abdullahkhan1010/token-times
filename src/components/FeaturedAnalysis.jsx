import React from "react";
import Reveal from "./Reveal";
import { featuredAnalysis as fa } from "../data/content";

export default function FeaturedAnalysis() {
  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-[#0C133D] section-header-border">
        Featured Analysis
      </Reveal>
      <Reveal as="article" className="hover-lift relative h-96 group overflow-hidden rounded-xl">
        <img alt={fa.title} className="img-fade img-scale absolute inset-0 w-full h-full object-cover" src={fa.img} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C133D] via-[#0C133D]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-on-primary w-full">
          <span className="font-label-caps text-label-caps text-[#D4AF37] mb-2 block">{fa.tag}</span>
          <h3 className="font-headline-lg text-headline-lg mb-3">{fa.title}</h3>
          <p className="font-body-md text-body-md text-surface-variant mb-4 max-w-xl">{fa.desc}</p>
          <a
            className="font-label-caps text-label-caps border border-[#D4AF37] text-[#D4AF37] px-4 py-2 hover:bg-[#D4AF37] hover:text-[#0C133D] transition-colors inline-block"
            href="#"
          >
            Read Full Report
          </a>
        </div>
      </Reveal>
    </section>
  );
}

