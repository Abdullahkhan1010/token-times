import React, { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getCrypto24HourTickerData, getCryptoPrice, getCryptoStats } from "../services/crypto.service";
import { getForexRates } from "../services/forex.service";
import { TrendingUp, TrendingDown, Activity, Sparkles, ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";
import btcLogo from "../assets/logos/btc.png";
import ethLogo from "../assets/logos/eth.png";
import xrpLogo from "../assets/logos/xrp.png";

const MARKET_SYMBOLS = [
  { symbol: "BTCUSDT", asset: "BTC", name: "Bitcoin", pair: "BTC / USDT", logo: btcLogo },
  { symbol: "ETHUSDT", asset: "ETH", name: "Ethereum", pair: "ETH / USDT", logo: ethLogo },
  { symbol: "XRPUSDT", asset: "XRP", name: "Ripple", pair: "XRP / USDT", logo: xrpLogo },
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

  // Normalized to SVG coordinate space
  return closes.map((value) => 8 + ((value - min) / range) * 54);
}

export default function MarketsDashboard({ onNavigate }) {
  const [marketCards, setMarketCards] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [hoverData, setHoverData] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all(
      MARKET_SYMBOLS.map(async (market) => {
        const [stats, price, trend] = await Promise.all([
          getCryptoStats(market.symbol),
          getCryptoPrice(market.symbol),
          getCrypto24HourTickerData(market.symbol),
        ]);

        const val = Number(price?.price ?? stats?.lastPrice ?? 0);
        const chg = Number(stats?.priceChangePercent ?? 0);
        const highVal = Number(stats?.highPrice ?? val * 1.02);
        const lowVal = Number(stats?.lowPrice ?? val * 0.98);
        const volumeVal = Number(stats?.volume ?? stats?.quoteVolume ?? 0);

        return {
          ...market,
          value: val,
          change: chg,
          high: highVal,
          low: lowVal,
          volume: volumeVal,
          data: normalizeChartData(trend),
        };
      })
    )
      .then((data) => {
        if (active) setMarketCards(data);
      })
      .catch((error) => {
        console.error("Failed to load crypto dashboard data", error);
        if (active) setMarketCards([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeCoin = marketCards.find((c) => c.asset === selectedAsset) || marketCards[0] || {
    asset: "BTC",
    name: "Bitcoin",
    pair: "BTC / USDT",
    icon: "₿",
    value: 0,
    change: 0,
    high: 0,
    low: 0,
    volume: 0,
    data: [],
  };

  const buildPaths = (data) => {
    const width = 360;
    const height = 110;
    if (!data || data.length === 0) {
      return {
        line: `M0 ${height}`,
        area: `M0 ${height} L${width} ${height} Z`,
        points: [],
        lastPoint: null,
      };
    }

    const step = width / Math.max(data.length - 1, 1);
    const points = data.map((value, index) => {
      const x = index * step;
      const y = height - value;
      return { x, y };
    });

    const line = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");

    const area = `${line} L ${width} ${height} L 0 ${height} Z`;
    const lastPoint = points[points.length - 1];

    return { line, area, points, lastPoint };
  };

  const formatPrice = (val) => {
    if (!val) return "0.00";
    if (val < 10) return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const { line, area, points, lastPoint } = buildPaths(activeCoin.data);
  const isPositive = activeCoin.change >= 0;

  return (
    <Reveal
      as="section"
      className="bg-surface-container-lowest text-on-surface p-3.5 sm:p-4 flex flex-col justify-between min-h-[390px] h-[390px] lg:h-[420px] xl:h-[440px] rounded-2xl relative overflow-hidden border border-outline-variant shadow-xs w-full"
    >
      {/* 1. Modern Pill Selector Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F2E7E1]/80 rounded-full border border-outline-variant shrink-0 w-full">
        {marketCards.map((coin) => {
          const isSelected = coin.asset === selectedAsset;
          const isCoinPos = coin.change >= 0;

          return (
            <button
              key={coin.asset}
              onClick={() => setSelectedAsset(coin.asset)}
              className={`flex-1 min-w-0 flex items-center justify-between gap-1 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-bold ${
                isSelected
                  ? "bg-[#0C133D] text-white shadow-sm ring-1 ring-[#D4AF37]/50"
                  : "bg-transparent text-[#5C525A] hover:bg-white/60 hover:text-[#0C133D]"
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <img
                  src={coin.logo}
                  alt={coin.name}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-contain shrink-0"
                />
                <span className="font-bold text-[11px] sm:text-xs shrink-0">{coin.asset}</span>
              </div>

              <span className={`text-[10px] sm:text-[11px] font-mono shrink-0 pl-1 font-bold ${
                isSelected
                  ? isCoinPos ? "text-[#D4AF37]" : "text-rose-300"
                  : isCoinPos ? "text-emerald-700" : "text-rose-600"
              }`}>
                {isCoinPos ? "+" : ""}{coin.change.toFixed(1)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Hero Interactive Market Showcase Card (Clickable to open detailed graph page) */}
      <div
        onClick={() => onNavigate?.("CryptoDetail", { symbol: activeCoin.asset })}
        className="flex-1 flex flex-col justify-between my-2 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-surface-container-low/50 to-surface-container-low/20 border border-outline-variant/80 hover:border-[#D4AF37] transition-all duration-300 overflow-hidden cursor-pointer group shadow-2xs hover:shadow-xs"
        title="Click to view detailed interactive live charts & market depth"
      >
        {/* Header Row with Modern Pill Badges */}
        <div className="flex items-start justify-between gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-[#0C133D] tracking-tight group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                <img
                  src={activeCoin.logo}
                  alt={activeCoin.name}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-contain shrink-0"
                />
                <span>{activeCoin.name}</span>
                <span className="text-[10px] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity font-normal hidden sm:inline">
                  View Full Chart ↗
                </span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-white text-[#5C525A] text-[9px] sm:text-[10px] font-bold border border-outline-variant font-mono">
                {activeCoin.pair}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-sans text-xl sm:text-2xl md:text-3xl font-black text-[#0C133D] tracking-tight tabular-nums">
                ${formatPrice(activeCoin.value)}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ${
                  isPositive
                    ? "bg-[#D4AF37]/20 text-[#8F7418] border border-[#D4AF37]/40"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {isPositive ? "+" : ""}{activeCoin.change.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-outline-variant text-[10px] font-bold text-[#0C133D] shrink-0 shadow-2xs group-hover:border-[#D4AF37] transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>24H Spot Feed</span>
          </div>
        </div>

        {/* Dynamic SVG Sparkline Graph */}
        <div className="relative w-full h-20 sm:h-24 my-auto flex flex-col justify-end overflow-hidden">
          <svg
            viewBox="0 0 360 110"
            className="w-full h-full overflow-visible preserve-3d"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${activeCoin.asset}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#D4AF37" : "#EF4444"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? "#D4AF37" : "#EF4444"} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path d={area} fill={`url(#gradient-${activeCoin.asset})`} />

            {/* Line Path */}
            <path
              d={line}
              fill="none"
              stroke={isPositive ? "#B8860B" : "#DC2626"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing Live Data Point */}
            {lastPoint && (
              <g>
                <circle
                  cx={lastPoint.x}
                  cy={lastPoint.y}
                  r="4"
                  fill={isPositive ? "#D4AF37" : "#DC2626"}
                  stroke="#0C133D"
                  strokeWidth="2"
                />
                <circle
                  cx={lastPoint.x}
                  cy={lastPoint.y}
                  r="8"
                  fill={isPositive ? "#D4AF37" : "#DC2626"}
                  opacity="0.35"
                  className="animate-pulse"
                />
              </g>
            )}
          </svg>

          {/* Clean Mini Volume Bars */}
          <div className="relative z-10 w-full h-[22%] flex items-end gap-1 px-3 pb-1 opacity-25 pointer-events-none">
            {activeCoin.data.slice(-20).map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-[#0C133D] rounded-t-xs"
                style={{ height: `${Math.max(15, (val / 60) * 100)}%` }}
              />
            ))}
          </div>
        </div>

        {/* 3. Bottom Modern Pill Metrics Strip */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 shrink-0">
          <div className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-white border border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#7F707A] font-medium">24h High</span>
            <span className="font-sans font-bold text-[#0C133D] tabular-nums">
              ${formatPrice(activeCoin.high)}
            </span>
          </div>

          <div className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-white border border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#7F707A] font-medium">24h Low</span>
            <span className="font-sans font-bold text-[#0C133D] tabular-nums">
              ${formatPrice(activeCoin.low)}
            </span>
          </div>

          <div className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-white border border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#7F707A] font-medium">Volume</span>
            <span className="font-sans font-bold text-[#0C133D] tabular-nums">
              {activeCoin.volume > 1000 ? `${(activeCoin.volume / 1000).toFixed(1)}k` : activeCoin.volume.toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function ForexRates() {
  const [forexRates, setForexRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchRates = () => {
      getForexRates()
        .then((data) => {
          if (active) {
            setForexRates(Array.isArray(data) ? data : []);
            setError("");
          }
        })
        .catch((requestError) => {
          console.error("Failed to load forex rates", requestError);
          if (active) setError("Live rates temporarily unavailable");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000); // 30s auto-refresh
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Reveal
      as="section"
      className="bg-surface-container-lowest text-on-surface p-3.5 sm:p-4 flex flex-col rounded-2xl relative overflow-hidden min-h-[390px] h-[390px] lg:h-[420px] xl:h-[440px] border border-outline-variant shadow-xs w-full"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-outline-variant shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-label-caps text-[10px] sm:text-[11px] tracking-wider text-[#0C133D] font-extrabold uppercase">
            PKR Interbank & Open Rates
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-[#7F707A] font-medium">Real-Time SBP/Market Avg</span>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 gap-1 sm:gap-2 px-2 py-1.5 bg-[#F2E7E1]/50 rounded-lg text-[9px] sm:text-[10px] font-bold text-[#7F707A] uppercase tracking-wider shrink-0 mb-1.5">
        <span className="col-span-5">Currency</span>
        <span className="col-span-4 text-right">Buying (PKR)</span>
        <span className="col-span-3 text-right">Selling</span>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-outline-variant/30 overflow-y-auto flex-1 min-h-0 pr-0.5 no-scrollbar">
        {loading ? (
          <div className="py-8 text-center text-xs text-[#5C525A]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-ping mr-2" />
            Loading live forex rates...
          </div>
        ) : error && forexRates.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-rose-600 font-medium">{error}</p>
        ) : (
          forexRates.map((rate, idx) => {
            const pairCode = rate.currency || (rate.base && rate.quote ? `${rate.base}/${rate.quote}` : rate.name || "FX");
            const displayName = rate.fullName || rate.name || pairCode;
            const buyingVal = Number(rate.buying ?? rate.rate ?? 0);
            const sellingVal = Number(rate.selling ?? (buyingVal ? buyingVal * 1.008 : 0));

            return (
              <div
                key={rate.currency || `${rate.base}-${rate.quote}` || idx}
                className="grid grid-cols-12 items-center gap-1 sm:gap-2 px-2 py-2 hover:bg-surface-container-low/60 rounded-lg transition-colors group"
              >
                <div className="col-span-5 flex items-center min-w-0">
                  <div className="truncate">
                    <span className="font-bold text-xs text-[#0C133D] group-hover:text-[#D4AF37] transition-colors block leading-tight truncate font-mono">
                      {pairCode}
                    </span>
                    <span className="text-[9px] text-[#7F707A] leading-none block truncate">
                      {displayName}
                    </span>
                  </div>
                </div>

                <div className="col-span-4 text-right">
                  <span className="font-sans font-bold text-xs sm:text-sm text-[#0C133D] tabular-nums">
                    {buyingVal < 5 ? buyingVal.toFixed(4) : buyingVal.toFixed(2)}
                  </span>
                </div>

                <div className="col-span-3 text-right">
                  <span className="font-sans text-[11px] sm:text-xs font-semibold text-[#8F7418] tabular-nums">
                    {sellingVal < 5 ? sellingVal.toFixed(4) : sellingVal.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Reveal>
  );
}
