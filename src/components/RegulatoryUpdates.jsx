import React from "react";
import Reveal from "./Reveal";
import { Gavel, FileText, ArrowRight } from "lucide-react";
import { regulatoryBriefings, regulatoryTracker } from "../data/content";

const ICONS = { gavel: Gavel, description: FileText };

const STATUS_STYLES = {
  "Public Consultation": "bg-secondary-fixed text-on-secondary-fixed border-secondary-container",
  "Pilot Phase": "bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim",
  Active: "bg-accent-container text-accent-dark border-accent",
  "Under Review": "bg-surface-container-high text-on-surface-variant border-outline-variant",
};

export function RegulatoryBriefings() {
  return (
    <section>
      <Reveal as="h2" className="font-headline-lg text-headline-lg text-primary section-header-border">
        Regulatory Briefings
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {regulatoryBriefings.map((b, i) => {
          const Icon = ICONS[b.icon];
          return (
            <Reveal key={b.title} delay={i * 80} as="div" className="hover-lift border border-outline-variant p-5 bg-surface-container-lowest">
              <Icon size={30} className="text-accent mb-3" />
              <h4 className="font-headline-md text-headline-md text-on-surface mb-2" style={{ fontSize: 18 }}>
                {b.title}
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4" style={{ fontSize: 14 }}>
                {b.desc}
              </p>
              <a className="font-label-caps text-label-caps text-accent hover:underline" href="#">
                Read Document
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function RegulatoryTracker() {
  return (
    <section className="mb-8 border border-outline-variant bg-surface-container-lowest rounded-xl">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-on-surface">Pakistan Regulatory Tracker</h2>
        <a className="font-label-caps text-label-caps text-accent hover:text-accent-dark flex items-center gap-1 group" href="#">
          View Full Dashboard <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant">
              <th className="px-6 py-3 font-semibold uppercase">Authority</th>
              <th className="px-6 py-3 font-semibold uppercase">Framework / Initiative</th>
              <th className="px-6 py-3 font-semibold uppercase">Latest Update</th>
              <th className="px-6 py-3 font-semibold uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface">
            {regulatoryTracker.map((r, i) => (
              <tr
                key={r.auth}
                className={`hover:bg-surface-container-low transition-colors ${
                  i < regulatoryTracker.length - 1 ? "border-b border-outline-variant" : ""
                }`}
              >
                <td className="px-6 py-4 font-semibold">{r.auth}</td>
                <td className="px-6 py-4">{r.framework}</td>
                <td className="px-6 py-4 font-data-tabular text-data-tabular">{r.update}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 font-label-caps text-label-caps uppercase border ${STATUS_STYLES[r.status]}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
