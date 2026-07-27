import React from "react";
import { Download, FileText, Gavel, CheckCircle2 } from "lucide-react";
import Reveal from "../components/Reveal";
import { regulationsPageData } from "../data/pagesData";

export default function RegulationsPage() {
  const { hero, trackers, briefings } = regulationsPageData;

  return (
    <div className="space-y-10">
      {/* Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 space-y-2">
        <span className="font-label-caps text-xs text-accent font-bold tracking-widest uppercase block">
          SUPERVISORY FRAMEWORKS & COMPLIANCE INTELLIGENCE
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface">
          {hero.title}
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          {hero.subtitle}
        </p>
      </Reveal>

      {/* Regulatory Tracker Matrix Table */}
      <Reveal as="section" className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden space-y-4 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-headline-sm text-xl font-bold text-primary flex items-center gap-2">
              <Gavel size={20} className="text-accent" /> Active Institutional Framework Matrix
            </h2>
            <p className="text-xs text-on-surface-variant">Status overview of local regulatory bodies (PVARA, SBP, SECP, FBR) and international regimes.</p>
          </div>
          <span className="text-xs font-data-tabular text-accent font-semibold flex items-center gap-1">
            <CheckCircle2 size={14} /> Updated Q4 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Authority</th>
                <th className="py-3 px-4">Regulatory Framework</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Impact</th>
                <th className="py-3 px-4">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-data-tabular">
              {trackers.map((row) => (
                <tr key={row.framework} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-accent">{row.authority}</td>
                  <td className="py-3.5 px-4 font-semibold text-on-surface">{row.framework}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent border border-accent/20">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface-variant">{row.impact}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Official Legal Consultation Papers & Briefings */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-primary border-b border-outline-variant pb-2 flex items-center gap-2">
          <FileText size={20} className="text-accent" /> Official Directives & Consultation Briefings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {briefings.map((b, i) => (
            <Reveal
              key={b.title}
              as="div"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-secondary/15 text-secondary font-bold text-[10px] rounded-full uppercase tracking-wide">
                  {b.authority}
                </span>
                <h3 className="font-headline-md text-lg font-bold text-on-surface group-hover:text-accent transition-colors leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {b.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-accent font-semibold">
                <span className="text-on-surface-variant font-data-tabular">{b.format}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Download <Download size={14} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
