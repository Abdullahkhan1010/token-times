import React from "react";
import { tickerItems } from "../data/content";

export default function BreakingTicker() {
  return (
    <div className="bg-primary text-on-primary border-b border-outline-variant py-2 flex items-center">
      <div className="px-4 md:px-12 font-label-caps text-label-caps whitespace-nowrap bg-primary z-10 font-bold border-r border-outline-variant pr-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-dot" />
        </span>
        BREAKING
      </div>
      <div className="ticker-wrap h-5">
        <div className="ticker animate-ticker font-data-tabular text-data-tabular">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker__item">
              {item}
              <span className="ticker__item">•</span>
            </span>
          ))}
          {/* duplicate for seamless loop */}
          {tickerItems.map((item, i) => (
            <span key={`dup-${i}`} className="ticker__item">
              {item}
              <span className="ticker__item">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
