import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { researchPapers as staticPapers } from "../data/content";
import { getResearches } from "../services/research.service";

export default function ResearchPapers() {
  const [papers, setPapers] = useState(staticPapers);

  useEffect(() => {
    let active = true;
    getResearches()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((r) => ({
            id: r.id,
            title: r.title,
            meta: `By ${r.author || "Research Desk"} • ${r.publish_date || "2026"}`,
            file: r.file,
          }));
          setPapers(mapped);
        }
      })
      .catch((err) => console.warn("Using static fallback for research papers:", err.message));

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-6 flex items-center gap-2">
        <BookOpen size={20} className="text-[#D4AF37]" /> Research
      </h3>
      <ul className="space-y-4">
        {papers.map((r, i) => (
          <li key={r.id || r.title + i} className={i < papers.length - 1 ? "border-b border-outline-variant pb-4" : ""}>
            <a className="group block" href={r.file || "#"} target={r.file ? "_blank" : "_self"} rel="noreferrer" style={{ textDecoration: "none" }}>
              <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-[#D4AF37] transition-colors mb-1">
                {r.title}
              </h4>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant text-xs uppercase">{r.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
