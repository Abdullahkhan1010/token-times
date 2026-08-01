import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { getResearches } from "../services/research.service";

export default function ResearchPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getResearches();
        if (!active) return;

        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data]
            .sort((a, b) => {
              const dateA = new Date(a.publish_date || a.createdAt || 0);
              const dateB = new Date(b.publish_date || b.createdAt || 0);
              return dateB - dateA;
            })
            .slice(0, 2);

          const mapped = sorted.map((r) => ({
            id: r.id || r._id || "",
            title: r.title || "Untitled research paper",
            meta: `By ${r.author || "Research Desk"} • ${r.publish_date || "Recent"}`,
            file: r.file || "",
          }));
          setPapers(mapped);
        } else {
          setPapers([]);
        }
      } catch (err) {
        console.error("Failed to load research papers", err);
        if (active) setPapers([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b-2 border-[#0C133D] pb-2.5 mb-5 min-h-[42px]">
        <h3 className="font-headline-md text-base font-bold text-[#0C133D] flex items-center gap-2 uppercase tracking-wider">
          <BookOpen size={18} className="text-[#D4AF37]" /> Research
        </h3>
        <span className="px-2.5 py-0.5 rounded-full bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
          PAPERS
        </span>
      </div>

      {loading ? (
        <p className="text-xs text-on-surface-variant">Loading research papers...</p>
      ) : papers.length > 0 ? (
        <div className="space-y-4">
          {papers.map((r, i) => (
            <article key={r.id || `${r.title}-${i}`} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl flex gap-3 items-center hover:border-[#D4AF37] transition-all cursor-pointer group h-[76px]">
              <div className="w-11 h-11 rounded-lg bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
                PDF
              </div>
              <a className="group block min-w-0 flex-1" href={r.file || "#"} target={r.file ? "_blank" : "_self"} rel="noreferrer" style={{ textDecoration: "none" }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-0.5 truncate">
                  RESEARCH PUBLICATION
                </span>
                <h4 className="font-headline-md text-xs font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2 mb-0.5">
                  {r.title}
                </h4>
                <span className="font-data-tabular text-[10px] text-on-surface-variant block truncate">{r.meta}</span>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-xs text-on-surface-variant">No research papers available right now.</p>
      )}
    </section>
  );
}
