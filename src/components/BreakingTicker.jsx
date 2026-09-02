import React, { useState, useEffect } from "react";
import { getTickerItems } from "../services/ticker.service";
import { useLanguage } from "../context/LanguageContext";

export default function BreakingTicker() {
  const [items, setItems] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const handleUpdate = async () => {
      const updatedItems = await getTickerItems();
      if (!cancelled) {
        setItems(Array.isArray(updatedItems) ? updatedItems : []);
      }
    };

    handleUpdate();
    window.addEventListener("ticker-items-updated", handleUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("ticker-items-updated", handleUpdate);
    };
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  const tickerLine = (prefix) =>
    items.map((item, i) => (
      <span key={`${prefix}-${i}`} className="inline-flex items-center gap-3 text-[#D4AF37] font-semibold px-4">
        <span>{item}</span>
        <span className="text-[#D4AF37]/60 font-bold">•</span>
      </span>
    ));

  return (
    <div className="bg-[#0C133D] text-white border-b border-white/10 py-2 flex items-center shadow-sm">
      <div className="px-4 md:px-12 font-label-caps text-xs whitespace-nowrap bg-[#0C133D] z-10 font-bold border-r border-white/10 pr-4 flex items-center gap-2">
        <span className="bg-[#D4AF37] text-[#0C133D] px-2.5 py-0.5 rounded-sm text-[11px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0C133D] animate-pulse" />
          {t("ticker.breaking", "BREAKING")}
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
