import React from "react";
import { tickerItems } from "../data/content";

export default function BreakingTicker() {
  const tickerLine = (prefix) =>
    tickerItems.map((item, i) => (
      <span key={`${prefix}-${i}`} className="ticker__item">
        {item}
        <span className="ticker__item">•</span>
      </span>
    ));

  return (
    <div className="bg-accent text-white border-b border-accent-dark py-2 flex items-center">
      <div className="px-4 md:px-12 font-label-caps text-label-caps whitespace-nowrap bg-accent z-10 font-bold border-r border-accent-dark pr-4 flex items-center gap-2 text-white">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-dot" />
        </span>
        BREAKING
      </div>
      <div className="ticker-wrap h-5">
        <div className="ticker animate-ticker font-data-tabular text-data-tabular text-white">
          <div className="ticker-group">{tickerLine("a")}</div>
          <div className="ticker-group" aria-hidden="true">
            {tickerLine("b")}
          </div>
        </div>
      </div>
    </div>
  );
}
