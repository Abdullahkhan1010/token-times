import React, { useState, useEffect } from "react";
import Reveal from "./Reveal";
import { Gavel, FileText, ArrowRight } from "lucide-react";
import { regulatoryBriefings as staticBriefings, regulatoryTracker as staticTracker } from "../data/content";
import { getRegulations } from "../services/regulation.service";

const ICONS = { gavel: Gavel, description: FileText };

const STATUS_STYLES = {
  "Public Consultation": "bg-surface-container-high text-[#0C133D] border-outline-variant",
  "Pilot Phase": "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37]/50",
  Active: "bg-[#D4AF37] text-[#0C133D] border-[#D4AF37]",
  "Under Review": "bg-surface-container-low text-on-surface-variant border-outline-variant",
};

export function RegulatoryBriefings() {
  const [briefings, setBriefings] = useState(staticBriefings);

  useEffect(() => {
    let active = true;
    getRegulations()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((r) => ({
            title: r.title,
            desc: `Authority: ${r.authority || "Regulatory Desk"} • Date: ${r.publish_date || "Recent"}`,
            icon: "gavel",
          }));
          setBriefings(mapped);
        }
      })
      .catch((err) => console.warn("Using static fallback for regulatory briefings:", err.message));

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="h-full flex flex-col justify-between gap-3">
      {briefings.map((b, i) => {
        const Icon = ICONS[b.icon] || Gavel;
        return (
          <Reveal key={b.title + i} delay={i * 80} as="div" className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-3 hover-lift flex-1 flex items-center">
            <div className="flex items-center gap-3 w-full">
              <Icon size={20} className="text-[#D4AF37] shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-headline-md text-[15px] md:text-[16px] text-on-surface mb-0.5 leading-tight truncate">
                  {b.title}
                </h4>
                <p className="font-body-md text-[12px] text-on-surface-variant truncate">
                  {b.desc}
                </p>
              </div>
              <a className="font-label-caps text-[10px] md:text-[11px] text-[#D4AF37] hover:underline whitespace-nowrap shrink-0" href="#">
                Read
              </a>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}

export function RegulatoryTracker() {
  const [tracker, setTracker] = useState(staticTracker);

  useEffect(() => {
    let active = true;
    getRegulations()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((r) => ({
            auth: r.authority || "Government Agency",
            framework: r.title,
            update: r.publish_date || "2026",
            status: "Active",
          }));
          setTracker(mapped);
        }
      })
      .catch((err) => console.warn("Using static fallback for regulatory tracker:", err.message));

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mb-8 border border-outline-variant bg-surface-container-lowest rounded-xl">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-on-surface">Pakistan Regulatory Tracker</h2>
        <a className="font-label-caps text-label-caps text-[#D4AF37] hover:text-[#B08D23] flex items-center gap-1 group" href="#">
          View Full Dashboard <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant">
              <th className="px-6 py-3 font-semibold uppercase">Authority</th>
              <th className="px-6 py-3 font-semibold uppercase">Framework / Initiative</th>
              <th className="px-6 py-3 font-semibold uppercase">Latest Update</th>
              <th className="px-6 py-3 font-semibold uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface">
            {tracker.map((r, i) => (
              <tr
                key={r.framework + i}
                className={`hover:bg-surface-container-low transition-colors ${
                  i < tracker.length - 1 ? "border-b border-outline-variant" : ""
                }`}
              >
                <td className="px-6 py-4 font-semibold">{r.auth}</td>
                <td className="px-6 py-4">{r.framework}</td>
                <td className="px-6 py-4 font-data-tabular text-data-tabular">{r.update}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 font-label-caps text-label-caps uppercase border ${STATUS_STYLES[r.status] || STATUS_STYLES.Active}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
