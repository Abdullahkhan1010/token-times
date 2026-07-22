import React from "react";
import { partners } from "../data/content";

export default function Partners() {
  return (
    <section className="mb-8 border-y border-outline-variant py-8">
      <h3 className="font-label-caps text-label-caps text-on-surface-variant text-center mb-6">
        INDUSTRY PARTNERS &amp; DATA PROVIDERS
      </h3>
      <div
        className="flex flex-wrap justify-center items-center gap-8 md:gap-16 transition-opacity hover:opacity-100"
        style={{ opacity: 0.6, filter: "grayscale(1)" }}
      >
        <div className="font-display-lg text-display-lg font-bold">
          CHAIN<span className="font-light">ANALYTICS</span>
        </div>
        <div className="font-headline-lg text-headline-lg" style={{ letterSpacing: "0.1em" }}>
          COINMETRICS
        </div>
        <div className="font-body-lg text-body-lg border-2 border-current p-2 font-bold uppercase">
          Crypto
          <br />
          Compare
        </div>
        <div className="font-headline-lg text-headline-lg" style={{ fontStyle: "italic" }}>
          The Block Research
        </div>
      </div>
    </section>
  );
}
