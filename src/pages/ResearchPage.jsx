import React from "react";
import { Download, BarChart3, BookOpen } from "lucide-react";
import Reveal from "../components/Reveal";
import { researchPageData } from "../data/pagesData";

export default function ResearchPage() {
  const { featuredReport, papers, keyMetrics } = researchPageData;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-bold tracking-widest uppercase block">
          INSTITUTIONAL RESEARCH & DATA DESK
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C133D]">
          Research Papers & Market Intelligence
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          Rigorous macro analysis, technical whitepapers, and demographic survey insights covering digital asset liquidity in emerging markets.
        </p>
      </Reveal>

      {/* Key Metrics Stats Banner */}
      <Reveal as="div" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyMetrics.map((m) => (
          <div key={m.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center space-y-1 shadow-sm">
            <span className="font-display-lg text-2xl sm:text-3xl font-extrabold text-[#D4AF37] block">{m.value}</span>
            <span className="text-xs text-on-surface-variant font-label-caps font-semibold uppercase">{m.label}</span>
          </div>
        ))}
      </Reveal>

      {/* Featured Annual Report Banner */}
      <Reveal
        as="section"
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8"
      >
        <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full rounded-xl overflow-hidden">
          <img src={featuredReport.img} alt={featuredReport.title} className="w-full h-full object-cover" />
          <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#0C133D] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
            {featuredReport.edition}
          </span>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold tracking-wider uppercase">FLAGSHIP PUBLICATION</span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-[#0C133D] leading-tight">
              {featuredReport.title}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {featuredReport.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/40">
            <span className="text-xs text-on-surface-variant font-data-tabular">
              {featuredReport.pages} • {featuredReport.format} • {featuredReport.date}
            </span>
            <button className="px-5 py-2.5 bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/50 font-extrabold text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all flex items-center gap-2 shadow-sm">
              Download Full Report <Download size={14} />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Whitepapers & Research Papers List */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-[#0C133D] border-b border-outline-variant pb-2 flex items-center gap-2">
          <BookOpen size={20} className="text-[#D4AF37]" /> Published Technical Papers & Macro Audits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {papers.map((p, i) => (
            <Reveal
              key={p.title}
              as="div"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4 shadow-sm hover:border-[#D4AF37]"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block font-data-tabular">
                  {p.meta}
                </span>
                <h3 className="font-headline-md text-base font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span>By {p.author}</span>
                <a href="#" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C133D] text-[#F7F0EB] font-extrabold text-xs hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-sm">
                  Download <Download size={14} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
