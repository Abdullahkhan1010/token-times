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
          const mapped = data.map((r) => ({
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
    <section>
      <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-6 flex items-center gap-2">
        <BookOpen size={20} className="text-[#D4AF37]" /> Research
      </h3>

      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading research papers...</p>
      ) : papers.length > 0 ? (
        <ul className="space-y-4">
          {papers.map((r, i) => (
            <li key={r.id || `${r.title}-${i}`} className={i < papers.length - 1 ? "border-b border-outline-variant pb-4" : ""}>
              <a className="group block" href={r.file || "#"} target={r.file ? "_blank" : "_self"} rel="noreferrer" style={{ textDecoration: "none" }}>
                <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-[#D4AF37] transition-colors mb-1">
                  {r.title}
                </h4>
                <span className="font-data-tabular text-data-tabular text-on-surface-variant text-xs uppercase">{r.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-on-surface-variant">No research papers available right now.</p>
      )}
    </section>
  );
}
