import React from "react";
import { BookOpen } from "lucide-react";
import { researchPapers } from "../data/content";

export default function ResearchPapers() {
  return (
    <section>
      <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-2">
        <BookOpen size={20} className="text-accent" /> Research
      </h3>
      <ul className="space-y-4">
        {researchPapers.map((r, i) => (
          <li key={r.title} className={i < researchPapers.length - 1 ? "border-b border-outline-variant pb-4" : ""}>
            <a className="group block" href="#" style={{ textDecoration: "none" }}>
              <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-accent transition-colors mb-1">
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
