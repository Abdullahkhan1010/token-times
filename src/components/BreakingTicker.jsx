import React from "react";
import { tickerItems } from "../data/content";

export default function BreakingTicker() {
  const tickerLine = (prefix) =>
    tickerItems.map((item, i) => (
      <span key={`${prefix}-${i}`} className="ticker__item text-[#D4AF37] font-semibold">
        {item}
        <span className="ticker__item text-[#D4AF37]/60 font-bold">•</span>
      </span>
    ));

  return (
    <div className="bg-[#0C133D] text-white border-b border-white/10 py-2 flex items-center shadow-sm">
      <div className="px-4 md:px-12 font-label-caps text-xs whitespace-nowrap bg-[#0C133D] z-10 font-bold border-r border-white/10 pr-4 flex items-center gap-2">
        <span className="bg-[#D4AF37] text-[#0C133D] px-2.5 py-0.5 rounded-sm text-[11px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0C133D] animate-pulse" />
          BREAKING
        </span>
      </div>

      <div className="ticker-wrap h-5">
        <div className="ticker animate-ticker font-data-tabular text-xs">
          <div className="ticker-group">{tickerLine("a")}</div>
          <div className="ticker-group" aria-hidden="true">
            {tickerLine("b")}
          </div>
        </div>
      </div>
    </div>
  );
}
