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
        _id: regulation._id || regulation.id || "",
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
    <section className="h-full flex flex-col gap-3">
      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading regulatory briefings...</p>
      ) : briefings.length > 0 ? (
        briefings.map((b, i) => {
          const Icon = ICONS[b.icon] || Gavel;
          return (
            <Reveal
              key={b._id || `${b.title}-${i}`}
              delay={i * 80}
              as="div"
              className="rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-3 hover-lift flex-1 flex items-center"
            >
              <div className="flex items-center gap-3 w-full">
                <Icon size={20} className="text-[#D4AF37] shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-headline-md text-[15px] md:text-[16px] text-on-surface mb-0.5 leading-tight truncate">
                    {b.title}
                  </h4>
                  <p className="font-body-md text-[12px] text-on-surface-variant truncate">
                    {b.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate?.("Policy & Regulation")}
                  className="font-label-caps text-[10px] md:text-[11px] text-[#D4AF37] hover:underline whitespace-nowrap shrink-0 bg-transparent border-0 cursor-pointer"
                >
                  Read
                </button>
              </div>
            </Reveal>
          );
        })
      ) : (
        <p className="text-sm text-on-surface-variant">No regulatory briefings available right now.</p>
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
    <section className="mb-8 border border-outline-variant bg-surface-container-lowest rounded-xl">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-on-surface">Pakistan Regulatory Tracker</h2>
        <button
          type="button"
          onClick={() => onNavigate?.("Policy & Regulation")}
          className="font-label-caps text-label-caps text-[#D4AF37] hover:text-[#B08D23] flex items-center gap-1 group cursor-pointer bg-transparent border-0"
        >
          View Full Dashboard <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-on-surface-variant">Loading regulatory tracker...</div>
      ) : tracker.length > 0 ? (
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
                  key={r._id || `${r.framework}-${i}`}
                  className={`hover:bg-surface-container-low transition-colors ${i < tracker.length - 1 ? "border-b border-outline-variant" : ""}`}
                >
                  <td className="px-6 py-4 font-semibold">{r.authority}</td>
                  <td className="px-6 py-4">{r.title}</td>
                  <td className="px-6 py-4 font-data-tabular text-data-tabular">{r.publish_date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 font-label-caps text-label-caps uppercase border ${STATUS_STYLES[r.status] || STATUS_STYLES.Active}`}>
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
