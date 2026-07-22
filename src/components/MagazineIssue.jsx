import React from "react";
import Reveal from "./Reveal";
import { magazineIssue as mag } from "../data/content";

export default function MagazineIssue() {
  return (
    <Reveal as="section" className="mb-8 bg-surface-container-lowest border border-outline-variant p-8 md:p-12">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/3 flex justify-center">
          <div
            className="w-48 md:w-64 border border-outline-variant relative bg-surface-variant hover-lift"
            style={{ aspectRatio: "3/4", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
          >
            <img alt="Magazine Cover" className="w-full h-full object-cover" style={{ filter: "grayscale(1)" }} src={mag.cover} />
            <div className="absolute top-4 left-0 w-full text-center" style={{ mixBlendMode: "difference" }}>
              <h4 className="font-display-lg text-display-lg" style={{ color: "#fff", letterSpacing: "-0.03em" }}>
                TOKEN TIMES
              </h4>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-label-caps text-label-caps text-accent mb-2">{mag.issue}</span>
          <h2 className="font-display-lg text-display-lg text-primary mb-4">{mag.title}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 max-w-2xl">{mag.desc}</p>
          <div className="flex gap-4">
            <button className="bg-accent text-on-accent px-6 py-3 font-label-caps text-label-caps hover:bg-accent-dark transition-colors">
              Read Online
            </button>
            <button className="border border-primary text-primary px-6 py-3 font-label-caps text-label-caps hover:bg-surface-container-low transition-colors">
              Order Print Edition
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
