import React, { useState, useEffect } from "react";
import Reveal from "./Reveal";
import { knowledgeHub as staticHub } from "../data/content";
import { getKnowlegeHubs } from "../services/knowlege-hub.service";

export default function KnowledgeHub() {
  const [hubItems, setHubItems] = useState(staticHub);

  useEffect(() => {
    let active = true;
    getKnowlegeHubs()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            eyebrow: Array.isArray(item.category) && item.category.length > 0 ? item.category[0].toUpperCase() : "EXPLAINER",
            title: item.question,
            desc: item.answer,
          }));
          setHubItems(mapped);
        }
      })
      .catch((err) => console.warn("Using static fallback for Knowledge Hub entries:", err.message));

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-[#0C133D] section-header-border">
        Knowledge Hub
      </Reveal>
      <div className="flex flex-col gap-4">
        {hubItems.map((item, i) => (
          <Reveal key={item.id || item.title + i} delay={i * 70} as="div">
            <a
              href="#"
              className="group block hover-lift border border-outline-variant p-4 bg-surface-container-lowest"
              style={{ textDecoration: "none" }}
            >
              <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">{item.eyebrow}</span>
              <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-[#D4AF37] transition-colors mb-1">
                {item.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant" style={{ fontSize: 14 }}>
                {item.desc}
              </p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
