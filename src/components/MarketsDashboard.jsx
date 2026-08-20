import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getCrypto24HourTickerData, getCryptoPrice, getCryptoStats } from "../services/crypto.service";
import { getForexRates } from "../services/forex.service";

const MARKET_SYMBOLS = [
  { symbol: "XRPUSDT", asset: "XRP", accent: "bg-accent/15 text-accent border border-accent/30" },
  { symbol: "BTCUSDT", asset: "BTC", accent: "bg-primary/10 text-primary border border-primary/20" },
  { symbol: "ETHUSDT", asset: "ETH", accent: "bg-accent/15 text-accent border border-accent/30" },
];

function normalizeChartData(trend) {
  const candles = Array.isArray(trend) ? trend : Array.isArray(trend?.data) ? trend.data : [];
  const closes = candles
    .map((candle) => Number(Array.isArray(candle) ? candle[4] : candle?.close))
    .filter((value) => Number.isFinite(value));

  if (closes.length === 0) return [];

  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  return closes.map((value) => 10 + ((value - min) / range) * 45);
}

export default function MarketsDashboard() {
  const [marketCards, setMarketCards] = useState([]);

  useEffect(() => {
    let active = true;

    Promise.all(MARKET_SYMBOLS.map(async (market) => {
      const [stats, price, trend] = await Promise.all([
        getCryptoStats(market.symbol),
        getCryptoPrice(market.symbol),
        getCrypto24HourTickerData(market.symbol),
      ]);

      return {
        ...market,
        value: Number(price?.price ?? stats?.lastPrice ?? 0),
        change: Number(stats?.priceChangePercent ?? 0),
        data: normalizeChartData(trend),
      };
    }))
      .then((data) => {
        if (active) setMarketCards(data);
      })
      .catch((error) => {
        console.error("Failed to load crypto dashboard data", error);
        if (active) setMarketCards([]);
      });

    return () => { active = false; };
  }, []);

  const buildPaths = (data) => {
    const width = 120;
    const height = 60;
    if (data.length === 0) {
      return {
        line: `M0 ${height}`,
        area: `M0 ${height} L${width} ${height} Z`,
        points: [],
      };
    }

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
      className="bg-surface-container-lowest text-on-surface p-4 md:p-5 flex flex-col justify-between h-full rounded-xl relative overflow-hidden border border-outline-variant"
    >
      <div className="relative space-y-3 overflow-hidden flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {marketCards.map((coin) => (
            <div key={coin.asset} className="rounded-xl border border-outline-variant bg-surface-container-low px-2.5 py-1.5 flex items-center justify-between gap-2">
              <div>
                <div className="font-label-caps text-[10px] md:text-[11px] tracking-[0.14em] text-on-surface-variant font-bold">{coin.asset}</div>
                <div className="font-body-md text-[14px] md:text-[15px] font-semibold text-on-surface leading-tight">${coin.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              <div className={`rounded-full ${coin.accent} px-2 py-0.5 font-label-caps text-[10px] md:text-[11px] font-bold`}>
                {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {marketCards.map((coin) => (
            <div key={`${coin.asset}-chart`} className="rounded-xl border border-outline-variant bg-surface-container-low p-2.5 overflow-hidden">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div>
                  <div className="font-label-caps text-[10px] md:text-[11px] tracking-[0.14em] text-on-surface-variant font-bold">{coin.asset} chart</div>
                  <div className="font-body-md text-[12px] md:text-[13px] text-on-surface-variant">24H spot movement</div>
                </div>
                <div className={`rounded-full ${coin.accent} px-2 py-0.5 font-label-caps text-[10px] md:text-[11px] font-bold whitespace-nowrap`}>
                  ${coin.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="relative h-28 md:h-32 rounded-lg bg-surface-container-high border border-outline-variant p-2 overflow-hidden">
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
                            <stop offset="0%" stopColor="#C5A028" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#C5A028" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={area} fill={`url(#${coin.asset}-fill)`} opacity="0.9" />
                        <path d={line} fill="none" stroke="#C5A028" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                        {points.map((point, index) => (
                          <circle key={`${coin.asset}-point-${index}`} cx={point.x} cy={point.y} r="1.5" fill="#C5A028" opacity="0.9" />
                        ))}
                      </svg>

                      <div className="absolute inset-x-0 bottom-0 h-[38%] flex items-end gap-1 px-2.5 pb-2.5 opacity-75">
                        {coin.data.slice(-8).map((value, index) => (
                          <div key={`${coin.asset}-volume-${index}`} className="flex-1 flex items-end h-full">
                            <div className="bg-accent/40 w-full rounded-t-sm" style={{ height: `${Math.max(18, value * 0.72)}%` }} />
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
  const [forexRates, setForexRates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getForexRates()
      .then((data) => {
        if (active) setForexRates(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        console.error("Failed to load forex rate", requestError);
        if (active) setError("Forex rate unavailable");
      });

    return () => { active = false; };
  }, []);

  return (
    <Reveal
      as="section"
      className="bg-surface-container-lowest text-on-surface p-3 md:p-4 flex flex-col rounded-xl relative overflow-hidden h-full border border-outline-variant"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-outline-variant shrink-0">
        <span className="font-label-caps text-[10px] md:text-[11px] tracking-[0.16em] text-on-surface-variant font-bold uppercase">Currency</span>
        <span className="font-label-caps text-[10px] md:text-[11px] tracking-[0.16em] text-on-surface-variant font-bold uppercase">Rate</span>
      </div>
      <div className="divide-y divide-outline-variant/40 overflow-y-auto flex-1 min-h-0 pr-1">
        {error ? (
          <p className="px-4 py-3 text-xs text-on-surface-variant">{error}</p>
        ) : forexRates.length > 0 ? (
          forexRates.map((forexRate) => (
            <div key={`${forexRate.base}-${forexRate.quote}`} className="flex items-center justify-between gap-3 px-4 py-2 md:py-2.5 hover:bg-surface-container-low transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
                  <span className="font-body-md text-xs font-semibold leading-tight text-on-surface truncate">{forexRate.name}</span>
                  <span className="font-body-md text-[11px] text-accent font-medium">/ {forexRate.date}</span>
                </div>
              </div>
              <span className="rounded-full bg-accent/15 text-accent border border-accent/30 px-2.5 py-0.5 font-label-caps text-[10px] md:text-[11px] font-bold whitespace-nowrap shrink-0">
                {forexRate.rate.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="px-4 py-3 text-xs text-on-surface-variant">Loading forex rate...</p>
        )}
      </div>
    </Reveal>
  );
}
