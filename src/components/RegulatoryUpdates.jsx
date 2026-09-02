import React, { useState, useEffect } from "react";
import Reveal from "./Reveal";
import { Gavel, FileText, ArrowRight } from "lucide-react";
import { getRegulations } from "../services/regulation.service";

const ICONS = { gavel: Gavel, file: FileText };

const STATUS_STYLES = {
  "Public Consultation": "bg-surface-container-high text-[#0C133D] border-outline-variant",
  "Pilot Phase": "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37]/50",
  Active: "bg-[#D4AF37] text-[#0C133D] border-[#D4AF37]",
  "Under Review": "bg-surface-container-low text-on-surface-variant border-outline-variant",
};

export function formatShortDate(dateStr) {
  if (!dateStr || dateStr === "Recent") return "Recent";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function normalizeRegulations(data, limit = 5) {
  if (!Array.isArray(data)) return [];

  return [...data]
    .sort((a, b) => {
      const dateA = new Date(a.publish_date || a.createdAt || 0);
      const dateB = new Date(b.publish_date || b.createdAt || 0);
      return dateB - dateA;
    })
    .slice(0, limit)
    .map((regulation) => {
      const formattedDate = formatShortDate(regulation.publish_date || regulation.createdAt);
      return {
        id: regulation.id || "",
        title: regulation.title || "Untitled regulation",
        authority: regulation.authority || "Regulatory Desk",
        publish_date: formattedDate,
        summary: regulation.summary || `Authority: ${regulation.authority || "Regulatory Desk"} • Date: ${formattedDate}`,
        icon: regulation.icon || "gavel",
        status: regulation.status || "Active",
      };
    });
}

export function RegulatoryBriefings({ onNavigate }) {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getRegulations();
        if (!active) return;
        setBriefings(normalizeRegulations(data, 5));
      } catch (err) {
        console.error("Error loading regulatory briefings", err);
        if (active) setBriefings([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="flex flex-col gap-2.5 sm:gap-3 w-full">
      {loading ? (
        <p className="text-sm text-on-surface-variant py-4">Loading regulatory briefings...</p>
      ) : briefings.length > 0 ? (
        briefings.map((b, i) => {
          const Icon = ICONS[b.icon] || Gavel;
          return (
            <Reveal
              key={b.id || `${b.title}-${i}`}
              delay={i * 60}
              as="div"
              className="rounded-2xl sm:rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 sm:px-4 py-2.5 sm:py-3 hover-lift flex items-center w-full shadow-xs transition-all"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-[#0C133D]/5 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#D4AF37] shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-headline-md text-xs sm:text-sm font-bold text-on-surface mb-0.5 leading-snug truncate">
                    {b.title}
                  </h4>
                  <p className="font-body-md text-[11px] sm:text-xs text-on-surface-variant truncate">
                    {b.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.("Policy & Regulation")}
                  className="font-label-caps text-[11px] sm:text-xs font-bold text-[#D4AF37] hover:text-[#B08D23] hover:underline whitespace-nowrap shrink-0 bg-transparent border-0 cursor-pointer pl-1"
                >
                  Read
                </button>
              </div>
            </Reveal>
          );
        })
      ) : (
        <p className="text-sm text-on-surface-variant py-4">No regulatory briefings available right now.</p>
      )}
    </section>
  );
}

export function RegulatoryTracker({ onNavigate }) {
  const [tracker, setTracker] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getRegulations();
        if (!active) return;
        setTracker(normalizeRegulations(data, 5));
      } catch (err) {
        console.error("Error loading regulatory tracker", err);
        if (active) setTracker([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mb-8 border border-outline-variant bg-surface-container-lowest rounded-xl overflow-hidden shadow-xs">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant bg-surface-bright flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">Pakistan Regulatory Tracker</h2>
        <button
          type="button"
          onClick={() => onNavigate?.("Policy & Regulation")}
          className="font-label-caps text-xs text-[#D4AF37] hover:text-[#B08D23] flex items-center gap-1 group cursor-pointer bg-transparent border-0 self-start sm:self-auto"
        >
          View Full Dashboard <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-on-surface-variant">Loading regulatory tracker...</div>
      ) : tracker.length > 0 ? (
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant font-label-caps text-[11px] text-on-surface-variant">
                <th className="px-4 sm:px-6 py-3 font-semibold uppercase">Authority</th>
                <th className="px-4 sm:px-6 py-3 font-semibold uppercase">Framework / Initiative</th>
                <th className="px-4 sm:px-6 py-3 font-semibold uppercase">Latest Update</th>
                <th className="px-4 sm:px-6 py-3 font-semibold uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-xs sm:text-sm text-on-surface">
              {tracker.map((r, i) => (
                <tr
                  key={r.id || `${r.framework}-${i}`}
                  className={`hover:bg-surface-container-low transition-colors ${i < tracker.length - 1 ? "border-b border-outline-variant" : ""}`}
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-[#0C133D]">{r.authority}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">{r.title}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-data-tabular text-data-tabular text-on-surface-variant">{r.publish_date}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-label-caps uppercase border rounded ${STATUS_STYLES[r.status] || STATUS_STYLES.Active}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-sm text-on-surface-variant">No regulatory tracker data available right now.</div>
      )}
    </section>
  );
}
