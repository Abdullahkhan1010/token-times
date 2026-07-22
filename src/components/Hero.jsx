import React from "react";
import Reveal from "./Reveal";
import { heroLead, heroSubStories } from "../data/content";

export default function Hero() {
  return (
    <section aria-label="Top 5 featured stories" className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
      {/* Lead story */}
      <Reveal
        as="article"
        className="md:col-span-8 hover-lift group bg-surface-container-lowest border border-outline-variant relative flex flex-col h-full rounded-xl overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
        <div className="p-6 flex-grow">
          <span className="font-label-caps text-label-caps text-accent mb-2 block">{heroLead.tag}</span>
          <h2 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg mb-4 text-on-surface transition-colors">
            {heroLead.title}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">{heroLead.summary}</p>
          <div className="flex items-center gap-4 font-label-caps text-label-caps text-on-surface-variant">
            <span>By {heroLead.author}</span>
            <span>•</span>
            <span>{heroLead.readTime}</span>
            <a href="#" className="accent-underline text-accent ml-auto">
              Read More
            </a>
          </div>
        </div>
        <div className="border-t border-outline-variant mt-auto overflow-hidden">
          <img
            className="img-fade img-scale w-full h-80 object-cover"
            alt={heroLead.title}
            src={heroLead.img}
          />
        </div>
      </Reveal>

      {/* Four smaller featured stories, alongside the lead */}
      <div className="md:col-span-4 flex flex-col gap-6 h-full">
        {heroSubStories.map((s, i) => (
          <Reveal
            key={s.title}
            as="article"
            delay={100 + i * 80}
            className="hover-lift bg-surface-container-lowest border border-outline-variant p-4 flex-1 flex flex-col justify-center rounded-xl"
          >
            <span className="font-label-caps text-label-caps text-secondary mb-1 block">{s.tag}</span>
            <h3 className="font-headline-md text-on-surface mb-2 leading-tight" style={{ fontSize: 20, lineHeight: "26px" }}>
              {s.title}
            </h3>
            <span className="font-data-tabular text-data-tabular text-on-surface-variant">{s.time}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
