import React from "react";
import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";
import { latestNews } from "../data/content";

export default function LatestNews() {
  return (
    <section className="mb-8 bg-surface-container-low p-6 border border-outline-variant rounded-xl">
      <div className="flex justify-between items-center section-header-border mb-6">
        <h2 className="font-headline-lg text-headline-lg text-primary m-0" style={{ border: 0, paddingBottom: 0 }}>
          Latest News
        </h2>
        <a className="font-label-caps text-label-caps text-accent hover:text-accent-dark flex items-center gap-1 group" href="#">
          View All <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {latestNews.map((n, i) => (
          <Reveal key={n.title} delay={i * 60} as="article" className="flex gap-4 group cursor-pointer">
            <div className="w-24 h-24 flex-shrink-0 bg-surface-variant rounded-xl overflow-hidden">
              <img alt={n.title} className="img-fade w-full h-full object-cover" src={n.img} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">{n.cat}</span>
              <h4
                className="font-headline-md text-headline-md text-on-surface leading-snug group-hover:text-accent transition-colors"
                style={{ fontSize: 18 }}
              >
                {n.title}
              </h4>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
