import React from "react";
import { Cpu, ShieldCheck, Zap } from "lucide-react";
import Reveal from "../components/Reveal";
import { technologiesPageData } from "../data/pagesData";

export default function TechnologiesPage() {
  const { techStack } = technologiesPageData;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 space-y-2">
        <span className="font-label-caps text-xs text-accent font-bold tracking-widest uppercase block">
          INFRASTRUCTURE & PROTOCOL ARCHITECTURE
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface">
          Web3 & Financial Technologies
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          Deep technical breakdowns of CBDC settlement layers, zero-knowledge compliance engines, and high-throughput Layer-2 rollup architectures.
        </p>
      </Reveal>

      {/* Tech Stack Cards Grid */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-primary border-b border-outline-variant pb-2">
          Enterprise Financial Infrastructure Layers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techStack.map((t, i) => (
            <Reveal
              key={t.name}
              as="article"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-accent/10 rounded-lg border border-accent/20">
                    {i === 0 ? <Cpu size={20} className="text-accent" /> : i === 1 ? <Zap size={20} className="text-accent" /> : <ShieldCheck size={20} className="text-accent" />}
                  </span>
                  <span className="text-xs font-data-tabular font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    {t.throughput}
                  </span>
                </div>
                <h3 className="font-headline-md text-lg font-bold text-on-surface group-hover:text-accent transition-colors leading-snug">
                  {t.name}
                </h3>
                <span className="text-xs font-data-tabular text-secondary font-semibold block">
                  Tech: {t.tech}
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {t.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 text-xs text-accent font-semibold flex items-center justify-between">
                <span>View Architecture Spec</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
