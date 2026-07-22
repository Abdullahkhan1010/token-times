import React from "react";
import Reveal from "./Reveal";
import { pakistanFocus } from "../data/content";

export default function PakistanFocus() {
  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-primary section-header-border">
        Pakistan Focus
      </Reveal>
      <div className="flex flex-col gap-4">
        {pakistanFocus.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 80}
            as="article"
            className="hover-lift border border-outline-variant p-4 bg-surface-container-lowest"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-1">{item.badge}</span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">{item.date}</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2" style={{ fontSize: 20 }}>
              {item.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
