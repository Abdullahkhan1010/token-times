import React from "react";
import Reveal from "./Reveal";
import { knowledgeHub } from "../data/content";

export default function KnowledgeHub() {
  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-primary section-header-border">
        Knowledge Hub
      </Reveal>
      <div className="flex flex-col gap-4">
        {knowledgeHub.map((item, i) => (
          <Reveal key={item.title} delay={i * 70} as="div">
            <a
              href="#"
              className="group block hover-lift border border-outline-variant p-4 bg-surface-container-lowest"
              style={{ textDecoration: "none" }}
            >
              <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">{item.eyebrow}</span>
              <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-accent transition-colors mb-1">
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
