import React from "react";
import Reveal from "./Reveal";
import { BarChart3 } from "lucide-react";

export default function MarketsDashboard() {
  const marketCards = [
    {
      asset: "XRP",
      value: "279.90",
      change: "+4.2%",
      accent: "bg-emerald-300",
      data: [28, 30, 29, 34, 37, 41, 39, 45, 49, 47, 52, 56],
    },
    {
      asset: "BTC",
      value: "26.45M",
      change: "+2.1%",
      accent: "bg-amber-300",
      data: [74, 72, 75, 73, 77, 81, 79, 84, 86, 88, 92, 95],
    },
    {
      asset: "ETH",
      value: "1.62M",
      change: "+1.0%",
      accent: "bg-sky-300",
      data: [41, 40, 43, 46, 45, 49, 53, 57, 55, 60, 64, 68],
    },
  ];

  const buildPaths = (data) => {
    const width = 120;
    const height = 60;
    const step = width / Math.max(data.length - 1, 1);
    const points = data.map((value, index) => {
      const x = index * step;
      const y = height - value;
      return { x, y };
    });

    const line = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");

    const area = `${line} L ${width} ${height} L 0 ${height} Z`;

    return { line, area, points };
  };

  return (
    <Reveal
      as="section"
      className="bg-surface-container-lowest text-on-surface p-3 md:p-4 flex flex-col gap-2 rounded-[1.5rem] relative overflow-hidden border border-outline-variant"
    >

      <div className="relative space-y-2 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {marketCards.map((coin) => (
            <div key={coin.asset} className="rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1.5 flex items-center justify-between gap-2">
              <div>
                <div className="font-label-caps text-[10px] md:text-[11px] tracking-[0.14em] text-on-surface/70">{coin.asset}</div>
                <div className="font-body-md text-[14px] md:text-[15px] font-semibold text-on-surface leading-tight">Rs {coin.value}</div>
              </div>
              <div className={`rounded-full ${coin.accent} text-primary px-2 py-1 font-label-caps text-[10px] md:text-[11px] font-bold`}>
                {coin.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {marketCards.map((coin) => (
            <div key={`${coin.asset}-chart`} className="rounded-[1.25rem] border border-outline-variant bg-surface-container-low p-2.5 overflow-hidden">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div>
                  <div className="font-label-caps text-[10px] md:text-[11px] tracking-[0.14em] text-on-surface/70">{coin.asset} chart</div>
                  <div className="font-body-md text-[12px] md:text-[13px] text-on-surface/80">24H spot movement</div>
                </div>
                <div className={`rounded-full ${coin.accent} text-primary px-2 py-1 font-label-caps text-[10px] md:text-[11px] font-bold whitespace-nowrap`}>
                  {coin.value}
                </div>
              </div>

              <div className="relative h-28 md:h-32 rounded-2xl bg-surface-container-high border border-outline-variant p-2 overflow-hidden">
                <div className="absolute inset-2 opacity-20 pointer-events-none">
                  <div className="h-full w-full grid grid-rows-4">
                    <span className="border-b border-outline-variant" />
                    <span className="border-b border-outline-variant" />
                    <span className="border-b border-outline-variant" />
                    <span />
                  </div>
                </div>

                {(() => {
                  const { line, area, points } = buildPaths(coin.data);
                  return (
                    <>
                      <svg
                        className="absolute inset-0 pointer-events-none h-full w-full"
                        viewBox="0 0 120 60"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id={`${coin.asset}-fill`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#111827" stopOpacity="0.16" />
                            <stop offset="100%" stopColor="#111827" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={area} fill={`url(#${coin.asset}-fill)`} opacity="0.9" />
                        <path d={line} fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.92" />
                        {points.map((point, index) => (
                          <circle key={`${coin.asset}-point-${index}`} cx={point.x} cy={point.y} r="1.5" fill="#111827" opacity="0.9" />
                        ))}
                      </svg>

                      <div className="absolute inset-x-0 bottom-0 h-[38%] flex items-end gap-1 px-2.5 pb-2.5 opacity-75">
                        {coin.data.slice(-8).map((value, index) => (
                          <div key={`${coin.asset}-volume-${index}`} className="flex-1 flex items-end h-full">
                            <div className={`${coin.accent} w-full rounded-t-full`} style={{ height: `${Math.max(18, value * 0.72)}%` }} />
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function ForexRates() {
  return (
    <Reveal
      as="section"
      className="bg-surface-container-lowest text-on-surface p-4 md:p-5 flex flex-col gap-3 rounded-[1.5rem] relative overflow-hidden h-full border border-outline-variant"
    >


        <div className="flex items-center justify-between px-4 py-2.5 ">
          <span className="font-label-caps text-[10px] md:text-[11px] tracking-[0.16em] text-on-surface">Currency</span>
          <span className="font-label-caps text-[10px] md:text-[11px] tracking-[0.16em] text-on-surface">Rate</span>
        </div>
        <div className="divide-y divide-outline-variant max-h-[24rem] overflow-y-auto">
          {[
            { name: "USD PKR Interbank Selling", date: "Jul 24", rate: "278.07", accent: "bg-emerald-300" },
            { name: "USD PKR Interbank Buying", date: "Jul 24", rate: "277.87", accent: "bg-amber-300" },
            { name: "USD to Japanese Yen", date: "Jul 27", rate: "163.55", accent: "bg-sky-300" },
            { name: "USD to Swiss Franc", date: "Jul 27", rate: "0.81", accent: "bg-emerald-300" },
            { name: "Pound Sterling to USD", date: "Jul 27", rate: "1.34", accent: "bg-amber-300" },
            { name: "Euro to USD", date: "Jul 27", rate: "1.14", accent: "bg-sky-300" },
            { name: "SOFR %", date: "Jul 24", rate: "3.57", accent: "bg-emerald-300" },
          ].map((row) => (
            <div key={row.name} className="flex items-center justify-between gap-3 px-4 py-2.5 md:py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
                  <span className="font-body-md text-[14px] md:text-[15px] leading-tight text-on-surface truncate">{row.name}</span>
                  <span className="font-body-md text-[14px] md:text-[15px] leading-tight text-[#d97706]">/ {row.date}</span>
                </div>
              </div>
              <span className={`rounded-full ${row.accent} text-primary px-2 py-1 font-label-caps text-[10px] md:text-[11px] font-bold whitespace-nowrap shrink-0`}>
                {row.rate}
              </span>
            </div>
          ))}
        </div>
    </Reveal>
  );
}
