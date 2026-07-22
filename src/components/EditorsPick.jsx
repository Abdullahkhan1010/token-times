import React from "react";
import Reveal from "./Reveal";
import { editorsPicks } from "../data/content";

export default function EditorsPick() {
  return (
    <section className="mb-8">
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-primary section-header-border">
        Editor's Pick
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {editorsPicks.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} as="article" className="group cursor-pointer flex flex-col">
            <div className="w-full h-48 overflow-hidden bg-surface-variant mb-4 rounded-xl">
              <img alt={p.title} className="img-fade img-scale w-full h-full object-cover" src={p.img} />
            </div>
            <span className="font-label-caps text-label-caps text-accent mb-2 block">{p.tag}</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-accent transition-colors">
              {p.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">{p.desc}</p>
            <span className="font-data-tabular text-data-tabular text-on-surface-variant">{p.read}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
