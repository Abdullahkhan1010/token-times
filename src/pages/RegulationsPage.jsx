import React, { useState, useEffect } from "react";
import { Download, FileText, Gavel, CheckCircle2 } from "lucide-react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getRegulations } from "../services/regulation.service";
import { formatShortDate } from "../components/RegulatoryUpdates";

export default function RegulationsPage({ onNavigate }) {


  const [trackers, setTrackers] = useState([]);
  const [briefings, setBriefings] = useState([]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getRegulations();
        if (!active) return;

        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.publish_date || 0);
            const dateB = new Date(b.createdAt || b.publish_date || 0);
            return dateB - dateA;
          });

          for (const regulation of sorted) {
            if (regulation.file) {
              const link = await ToHref(regulation.file, "regulation.pdf");
              regulation.file = link;
            }
          }

          const mappedBriefings = sorted.map((r) => {
            const shortDate = formatShortDate(r.publish_date || r.createdAt);
            return {
              authority: r.authority,
              title: r.title,
              desc: `Directive issued on ${shortDate}. Download legal compliance text.`,
              format: r.file ? "PDF Document" : "Official Directives",
              file: r.file,
            };
          });

          const mappedTrackers = sorted.map((r) => ({
            authority: r.authority,
            framework: r.title,
            status: "Active",
            lastUpdate: formatShortDate(r.publish_date || r.createdAt),
          }));

          setBriefings(mappedBriefings);
          setTrackers(mappedTrackers);
        } else {
          setBriefings([]);
          setTrackers([]);
        }
      } catch (err) {
        console.warn("Using static fallback for regulations:", err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <SEOHead pageKey="Regulations" />

      <Breadcrumbs currentPage="Regulations" onNavigate={onNavigate} />

      {/* Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-bold tracking-widest uppercase block">
          SUPERVISORY FRAMEWORKS & COMPLIANCE INTELLIGENCE
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C133D]">
          Policy & Regulatory Frameworks
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          Stay informed with the latest regulatory updates, compliance directives, and institutional frameworks from local and international authorities. Our comprehensive tracker provides insights into the evolving landscape of financial regulations, ensuring you remain compliant and ahead of industry standards.
        </p>
      </Reveal>

      {/* Regulatory Tracker Matrix Table */}
      <Reveal as="section" className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden space-y-4 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-headline-sm text-xl font-bold text-[#0C133D] flex items-center gap-2">
              <Gavel size={20} className="text-[#D4AF37]" /> Active Institutional Framework Matrix
            </h2>
            <p className="text-xs text-on-surface-variant">Status overview of local regulatory bodies (PVARA, SBP, SECP, FBR) and international regimes.</p>
          </div>
          <span className="text-xs font-data-tabular text-[#D4AF37] font-semibold flex items-center gap-1">
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

                <th className="py-3 px-4">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-data-tabular">
              {trackers.map((row, i) => (
                <tr key={row.framework + i} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0C133D]">{row.authority}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#0C133D]">{row.framework}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 uppercase shadow-sm">
                      {row.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-on-surface-variant">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Official Legal Consultation Papers & Briefings */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-[#0C133D] border-b border-outline-variant pb-2 flex items-center gap-2">
          <FileText size={20} className="text-[#D4AF37]" /> Official Directives & Consultation Briefings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {briefings.map((b, i) => (
            <Reveal
              key={b.title + i}
              as="div"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4 shadow-sm hover:border-[#D4AF37]"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[10px] rounded-full uppercase tracking-wide">
                  {b.authority}
                </span>
                <h3 className="font-headline-md text-lg font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {b.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-data-tabular">{b.format}</span>
                {b.file ? (
                  <a
                    href={b.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C133D] text-[#F7F0EB] font-extrabold text-xs group-hover:bg-[#D4AF37] group-hover:text-[#0C133D] transition-all shadow-sm"
                  >
                    Download <Download size={14} />
                  </a>
                ) : (
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C133D] text-[#F7F0EB] font-extrabold text-xs group-hover:bg-[#D4AF37] group-hover:text-[#0C133D] transition-all shadow-sm">
                    Download <Download size={14} />
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
