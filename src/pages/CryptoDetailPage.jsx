import React, { useState, useEffect, useMemo } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getCryptoTrend, getCryptoStats, getCryptoPrice } from "../services/crypto.service";
import { getPublishedNews } from "../services/published-news.service";
import { ToImageUrl } from "../services/file.service";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  LineChart,
  Zap,
  Info
} from "lucide-react";
import btcLogo from "../assets/logos/btc.png";
import ethLogo from "../assets/logos/eth.png";
import xrpLogo from "../assets/logos/xrp.png";

const CRYPTO_COINS = [
  { symbol: "BTCUSDT", asset: "BTC", name: "Bitcoin", pair: "BTC / USDT", logo: btcLogo, color: "#F7931A" },
  { symbol: "ETHUSDT", asset: "ETH", name: "Ethereum", pair: "ETH / USDT", logo: ethLogo, color: "#627EEA" },
  { symbol: "XRPUSDT", asset: "XRP", name: "Ripple", pair: "XRP / USDT", logo: xrpLogo, color: "#23292F" },
];

const TIMEFRAMES = [
  { label: "1H", interval: "1m", limit: 60, subtext: "1 Minute Intervals" },
  { label: "24H", interval: "15m", limit: 96, subtext: "15 Minute Intervals" },
  { label: "7D", interval: "1h", limit: 168, subtext: "1 Hour Intervals" },
  { label: "1M", interval: "4h", limit: 180, subtext: "4 Hour Intervals" },
  { label: "YTD", interval: "1d", limit: 240, subtext: "Daily Intervals" },
  { label: "1Y", interval: "1d", limit: 365, subtext: "Daily Intervals" },
  { label: "ALL", interval: "1w", limit: 200, subtext: "Weekly Intervals" },
];

export default function CryptoDetailPage({ initialAsset = "BTC", onNavigate, onSelectArticle }) {
  const [selectedAsset, setSelectedAsset] = useState(initialAsset || "BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState("24H");
  const [chartType, setChartType] = useState("line"); // 'line' | 'candles'
  const [chartMode, setChartMode] = useState("basic"); // 'basic' | 'advanced'
  const [hoverIndex, setHoverIndex] = useState(null);

  const [coinStats, setCoinStats] = useState({});
  const [tickerPrices, setTickerPrices] = useState({});
  const [chartCandles, setChartCandles] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const currentCoin = useMemo(() => {
    return CRYPTO_COINS.find((c) => c.asset === selectedAsset) || CRYPTO_COINS[0];
  }, [selectedAsset]);

  // 1. Live ticker feed from Binance via backend API
  useEffect(() => {
    let active = true;

    const fetchLiveTickers = async () => {
      try {
        const results = await Promise.all(
          CRYPTO_COINS.map(async (coin) => {
            const [stats, price] = await Promise.all([
              getCryptoStats(coin.symbol),
              getCryptoPrice(coin.symbol),
            ]);
            return {
              symbol: coin.symbol,
              asset: coin.asset,
              price: Number(price?.price ?? stats?.lastPrice ?? 0),
              change: Number(stats?.priceChangePercent ?? 0),
              stats: stats || {},
            };
          })
        );

        if (!active) return;
        const priceMap = {};
        const statsMap = {};
        results.forEach((r) => {
          priceMap[r.asset] = r;
          if (r.stats) statsMap[r.asset] = r.stats;
        });
        setTickerPrices(priceMap);
        setCoinStats((prev) => ({ ...prev, ...statsMap }));
      } catch (err) {
        console.error("Live ticker error", err);
      }
    };

    fetchLiveTickers();
    const timer = setInterval(fetchLiveTickers, 10000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // 2. Fetch live timeframe chart candles from Binance backend
  useEffect(() => {
    let active = true;
    setLoadingChart(true);

    const tf = TIMEFRAMES.find((t) => t.label === selectedTimeframe) || TIMEFRAMES[1];

    getCryptoTrend(currentCoin.symbol, tf.interval, tf.limit)
      .then((res) => {
        if (!active) return;
        const raw = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        const parsed = raw
          .map((c, i) => {
            const isArr = Array.isArray(c);
            const openTime = isArr ? Number(c[0]) : Number(c?.openTime || Date.now() - (raw.length - i) * 3600000);
            const open = Number(isArr ? c[1] : c?.open);
            const high = Number(isArr ? c[2] : c?.high);
            const low = Number(isArr ? c[3] : c?.low);
            const close = Number(isArr ? c[4] : c?.close);
            const volume = Number(isArr ? c[5] : c?.volume || 0);

            return { openTime, open, high, low, close, volume };
          })
          .filter((c) => Number.isFinite(c.close));

        setChartCandles(parsed);
      })
      .catch((err) => {
        console.error("Failed to load live trend", err);
        if (active) setChartCandles([]);
      })
      .finally(() => {
        if (active) setLoadingChart(false);
      });

    return () => {
      active = false;
    };
  }, [currentCoin.symbol, selectedTimeframe]);

  // 3. Fetch real published news from the database
  useEffect(() => {
    let active = true;
    setLoadingNews(true);

    getPublishedNews()
      .then(async (data) => {
        if (!active) return;
        const published = Array.isArray(data) ? data.filter((a) => a.status === "published") : [];
        const assetQuery = currentCoin.asset.toLowerCase();
        const nameQuery = currentCoin.name.toLowerCase();

        const matched = published.filter((art) => {
          const title = (art.title || "").toLowerCase();
          const summary = (art.summary || "").toLowerCase();
          const cats = Array.isArray(art.category) ? art.category : [art.category || ""];
          const tags = Array.isArray(art.tags) ? art.tags : [art.tags || ""];
          const allText = [...cats, ...tags, title, summary].map((t) => String(t).toLowerCase());
          return allText.some(
            (t) =>
              t.includes(assetQuery) ||
              t.includes(nameQuery) ||
              t.includes("crypto") ||
              t.includes("market") ||
              t.includes("bitcoin") ||
              t.includes("trading")
          );
        });

        const listToDisplay = matched.length > 0 ? matched : published.slice(0, 4);

        const resolved = await Promise.all(
          listToDisplay.slice(0, 4).map(async (art) => ({
            ...art,
            image: await ToImageUrl(art.image),
          }))
        );

        if (active) setRelatedNews(resolved);
      })
      .catch((err) => {
        console.error("Failed to fetch live database articles", err);
        if (active) setRelatedNews([]);
      })
      .finally(() => {
        if (active) setLoadingNews(false);
      });

    return () => {
      active = false;
    };
  }, [currentCoin]);

  // Live active prices and stats
  const activeTicker = tickerPrices[currentCoin.asset] || {};
  const activeStats = coinStats[currentCoin.asset] || {};
  const livePrice = activeTicker.price || Number(activeStats.lastPrice || 0);
  const liveChange = activeTicker.change || Number(activeStats.priceChangePercent || 0);
  const isPositive = liveChange >= 0;

  // Period open, high, low calculated from chart candles
  const periodOpen = chartCandles.length > 0 ? chartCandles[0].open : livePrice;
  const periodHigh =
    chartCandles.length > 0 ? Math.max(...chartCandles.map((c) => c.high), livePrice) : Number(activeStats.highPrice || livePrice);
  const periodLow =
    chartCandles.length > 0 ? Math.min(...chartCandles.map((c) => c.low), livePrice) : Number(activeStats.lowPrice || livePrice);
  const maxCandleVolume = Math.max(...chartCandles.map((c) => c.volume || 0), 1);

  // SVG Chart Geometry (Stretched Full Width)
  const chartWidth = 1000;
  const chartHeight = 380;
  const padLeft = 0; // Starts directly at left edge
  const padRight = 68; // Space for right-hand Y-axis prices
  const padTop = 15;
  const padBottom = 30;
  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;
  const volumeZoneHeight = 45; // Bottom zone for subtle volume histogram
  const priceZoneHeight = plotHeight - volumeZoneHeight;

  const minPrice = Math.min(...chartCandles.map((c) => c.low), periodLow);
  const maxPrice = Math.max(...chartCandles.map((c) => c.high), periodHigh);
  const priceRange = maxPrice - minPrice || 1;

  const points = useMemo(() => {
    if (chartCandles.length === 0) return [];
    const step = plotWidth / Math.max(chartCandles.length - 1, 1);

    return chartCandles.map((c, i) => {
      const x = padLeft + i * step;
      const y = padTop + priceZoneHeight - ((c.close - minPrice) / priceRange) * priceZoneHeight;
      const baselineY = padTop + priceZoneHeight - ((periodOpen - minPrice) / priceRange) * priceZoneHeight;
      return {
        ...c,
        x,
        y,
        baselineY,
        isAbove: c.close >= periodOpen,
      };
    });
  }, [chartCandles, minPrice, priceRange, plotWidth, priceZoneHeight, periodOpen]);

  // Baseline Y Coordinate and Percentage for Dual-Color Transition
  const baselineY = points[0]?.baselineY ?? (padTop + priceZoneHeight / 2);
  const baselineOffsetPct = Math.max(0, Math.min(100, ((baselineY - padTop) / priceZoneHeight) * 100));

  // Dual-Color Area Paths (Green for Rise above baseline, Red for Fall below baseline)
  const { linePath, areaPathAbove, areaPathBelow } = useMemo(() => {
    if (points.length === 0) return { linePath: "", areaPathAbove: "", areaPathBelow: "" };

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");

    // Full closed polygon to baseline
    const areaPathAbove = `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;
    const areaPathBelow = `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

    return { linePath, areaPathAbove, areaPathBelow };
  }, [points, baselineY]);

  // Sync with prop when external route or initialAsset updates
  useEffect(() => {
    if (initialAsset) {
      setSelectedAsset(initialAsset.toUpperCase());
    }
  }, [initialAsset]);

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[points.length - 1];
  const activePointDeltaPct = activePoint && periodOpen ? ((activePoint.close - periodOpen) / periodOpen) * 100 : liveChange;
  const isActivePointPositive = activePointDeltaPct >= 0;

  const formatPrice = (val) => {
    if (!val) return "0.00";
    if (val < 2) return val.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    if (val < 50) return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full space-y-5 sm:space-y-7 animate-fade-up">
      <SEOHead
        pageKey="Markets"
        customTitle={`${currentCoin.name} (${currentCoin.asset}) Live Candlestick & Area Charts | Token Times`}
      />

      <Breadcrumbs currentPage={`${currentCoin.name} Index`} onNavigate={onNavigate} />

      {/* 1. Top Live Coin Switcher Bar (3 Main Currencies with /pricing/:coin URLs) */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xs overflow-x-auto no-scrollbar">
        {CRYPTO_COINS.map((coin) => {
          const isSelected = coin.asset === selectedAsset;
          const ticker = tickerPrices[coin.asset];
          const isPos = (ticker?.change || 0) >= 0;

          return (
            <button
              key={coin.asset}
              onClick={() => {
                setSelectedAsset(coin.asset);
                setHoverIndex(null);
                onNavigate?.("CryptoDetail", { symbol: coin.asset.toLowerCase(), preserveScroll: true });
              }}
              className={`flex-1 flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all text-xs font-bold shrink-0 min-w-[125px] sm:min-w-[140px] ${
                isSelected
                  ? "bg-[#0C133D] text-white shadow-sm ring-1 ring-[#D4AF37]/50"
                  : "bg-surface-container-low/50 text-[#5C525A] hover:bg-surface-container-low hover:text-[#0C133D]"
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <img
                  src={coin.logo}
                  alt={coin.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-contain shrink-0"
                />
                <div className="text-left">
                  <span className="block leading-none text-[11px] sm:text-xs font-extrabold">{coin.asset}</span>
                  <span className="block leading-tight text-[10px] sm:text-[11px] font-normal opacity-80 font-sans tabular-nums mt-0.5">
                    ${formatPrice(ticker?.price)}
                  </span>
                </div>
              </div>

              {/* Rise in Green, Fall in Red */}
              <span
                className={`text-[10px] sm:text-[11px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${
                  isSelected
                    ? isPos
                      ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40"
                      : "bg-rose-600/30 text-rose-300 border border-rose-400/40"
                    : isPos
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-600 border border-rose-200"
                }`}
              >
                {isPos ? "+" : ""}{(ticker?.change || 0).toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Full-Width Financial Card Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src={currentCoin.logo}
              alt={currentCoin.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain shrink-0 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider font-label-caps">
                  {currentCoin.symbol} • BINANCE SPOT
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] sm:text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <h1 className="font-display-lg text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0C133D] tracking-tight leading-tight">
                {currentCoin.name} Index
              </h1>
            </div>
          </div>

          {/* Large Live Price & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5">
            <div className="text-left sm:text-right">
              <div className="flex items-baseline sm:justify-end gap-1.5 sm:gap-2">
                <span className="font-sans text-xl sm:text-2xl md:text-3xl font-black text-[#0C133D] tabular-nums tracking-tight">
                  ${formatPrice(activePoint?.close || livePrice)}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-extrabold ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-600 border border-rose-300"
                  }`}
                >
                  {isPositive ? <ArrowUpRight size={13} className="text-emerald-700" /> : <ArrowDownRight size={13} className="text-rose-600" />}
                  {isPositive ? "+" : ""}{liveChange.toFixed(2)}%
                </span>
              </div>
              <p className="text-[10px] text-[#7F707A] font-medium mt-0.5">
                {activePoint
                  ? new Date(activePoint.openTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                  : "Live Spot Average"}
              </p>
            </div>

            <button
              onClick={() => onNavigate?.("Markets")}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0C133D] hover:bg-[#121A4B] text-[#D4AF37] text-xs font-extrabold transition-all shadow-sm flex items-center gap-1 shrink-0"
            >
              <span>Markets Wire</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* 3. Graph View Toggles (Left) & Timeframe Pills (Right) - Zero Duplicate Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2 bg-[#F2E7E1]/50 rounded-xl border border-outline-variant">
          {/* Left: Chart Type Switcher + Basic/Advanced */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-outline-variant shadow-2xs text-xs">
              <button
                onClick={() => setChartType("line")}
                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                  chartType === "line" ? "bg-[#0C133D] text-[#D4AF37] shadow-2xs" : "text-[#5C525A] hover:text-[#0C133D]"
                }`}
                title="Area Line Chart"
              >
                <LineChart size={14} />
              </button>
              <button
                onClick={() => setChartType("candles")}
                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                  chartType === "candles" ? "bg-[#0C133D] text-[#D4AF37] shadow-2xs" : "text-[#5C525A] hover:text-[#0C133D]"
                }`}
                title="Candlestick OHLC Chart"
              >
                <CandleIcon size={14} />
              </button>
            </div>

            <div className="flex items-center bg-white rounded-lg p-0.5 border border-outline-variant shadow-2xs text-[10px] sm:text-[11px] font-bold">
              <button
                onClick={() => setChartMode("basic")}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-all ${
                  chartMode === "basic" ? "bg-[#0C133D] text-[#D4AF37]" : "text-[#5C525A]"
                }`}
              >
                Basic
              </button>
              <button
                onClick={() => setChartMode("advanced")}
                className={`px-2 sm:px-2.5 py-1 rounded-md transition-all ${
                  chartMode === "advanced" ? "bg-[#0C133D] text-[#D4AF37]" : "text-[#5C525A]"
                }`}
              >
                Advanced
              </button>
            </div>
          </div>

          {/* Right: Timeframe Pill Selector (1H to ALL, Horizontally Scrollable on Phones) */}
          <div className="flex items-center bg-white rounded-lg p-0.5 border border-outline-variant shadow-2xs text-xs font-bold overflow-x-auto no-scrollbar max-w-full">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.label}
                onClick={() => {
                  setSelectedTimeframe(tf.label);
                  setHoverIndex(null);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-all whitespace-nowrap text-[11px] sm:text-xs ${
                  selectedTimeframe === tf.label
                    ? "bg-[#0C133D] text-[#D4AF37] shadow-xs font-black"
                    : "text-[#5C525A] hover:text-[#0C133D]"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Full-Width Edge-to-Edge Interactive Chart Canvas */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[460px] bg-white rounded-xl border border-outline-variant overflow-hidden select-none">
          {loadingChart ? (
            <div className="flex items-center justify-center h-full text-xs text-[#5C525A]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span>Loading live Binance candles...</span>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Clamped Crosshair Floating Badge (Prevents Mobile Overflow) */}
              {hoverIndex !== null && activePoint && (
                <div
                  className={`absolute z-20 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-white text-xs font-semibold shadow-xl pointer-events-none border transition-all duration-75 ${
                    isActivePointPositive
                      ? "bg-[#0C133D] border-emerald-500/60"
                      : "bg-[#0C133D] border-rose-500/60"
                  }`}
                  style={{
                    left: `${Math.max(16, Math.min(84, (activePoint.x / chartWidth) * 100))}%`,
                    top: `${Math.max(20, (activePoint.y / chartHeight) * 100)}%`,
                    transform: "translate(-50%, -100%)",
                    marginTop: "-12px",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[10px] text-[#D4AF37] font-bold">
                      {new Date(activePoint.openTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                    <span
                      className={`text-[9px] font-bold font-mono px-1 rounded ${
                        isActivePointPositive ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {isActivePointPositive ? "+" : ""}
                      {activePointDeltaPct.toFixed(2)}%
                    </span>
                  </div>
                  <p className="font-sans font-black text-xs sm:text-sm tabular-nums text-white">
                    ${formatPrice(activePoint.close)}
                  </p>
                  {chartType === "candles" && (
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#A8B4E5]">
                      <span>O:${formatPrice(activePoint.open)}</span>
                      <span>H:${formatPrice(activePoint.high)}</span>
                      <span>L:${formatPrice(activePoint.low)}</span>
                    </div>
                  )}
                  <p className="text-[9px] sm:text-[10px] text-[#D4AF37]/80 mt-0.5">
                    Vol: {activePoint.volume.toFixed(1)} {currentCoin.asset}
                  </p>
                </div>
              )}

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible touch-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const relX = ((e.clientX - rect.left) / rect.width) * chartWidth;
                  const step = plotWidth / Math.max(points.length - 1, 1);
                  const idx = Math.max(0, Math.min(points.length - 1, Math.round((relX - padLeft) / step)));
                  setHoverIndex(idx);
                }}
                onMouseLeave={() => setHoverIndex(null)}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const relX = ((e.touches[0].clientX - rect.left) / rect.width) * chartWidth;
                    const step = plotWidth / Math.max(points.length - 1, 1);
                    const idx = Math.max(0, Math.min(points.length - 1, Math.round((relX - padLeft) / step)));
                    setHoverIndex(idx);
                  }
                }}
                onTouchEnd={() => setHoverIndex(null)}
              >
                <defs>
                  {/* Clip path for region above open baseline (Green zone) */}
                  <clipPath id="cd20-clip-rise">
                    <rect x={padLeft} y={0} width={plotWidth} height={Math.max(0, baselineY)} />
                  </clipPath>

                  {/* Clip path for region below open baseline (Red zone) */}
                  <clipPath id="cd20-clip-fall">
                    <rect
                      x={padLeft}
                      y={Math.max(0, baselineY)}
                      width={plotWidth}
                      height={Math.max(0, chartHeight - baselineY)}
                    />
                  </clipPath>

                  {/* Emerald Green gradient for Rise area */}
                  <linearGradient id="cd20-rise-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.36" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                  </linearGradient>

                  {/* Crimson Red gradient for Fall area */}
                  <linearGradient id="cd20-fall-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.34" />
                  </linearGradient>

                  {/* Dual-Color Stroke Linear Gradient for Line Chart */}
                  <linearGradient id="cd20-line-dual-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset={`${Math.max(0, baselineOffsetPct - 0.5)}%`} stopColor="#059669" />
                    <stop offset={`${Math.min(100, baselineOffsetPct + 0.5)}%`} stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Right-Hand Y-Axis Price Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = padTop + priceZoneHeight * (1 - pct);
                  const priceVal = minPrice + pct * priceRange;

                  return (
                    <g key={i}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartWidth - padRight}
                        y2={y}
                        stroke="#E2D4CB"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                        opacity="0.75"
                      />
                      <text
                        x={chartWidth - padRight + 8}
                        y={y + 3.5}
                        fontSize="11"
                        fill="#7F707A"
                        fontFamily="Inter"
                        fontWeight="500"
                      >
                        ${formatPrice(priceVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Period Open Baseline (Dashed Guide) */}
                <line
                  x1={padLeft}
                  y1={baselineY}
                  x2={chartWidth - padRight}
                  y2={baselineY}
                  stroke="#7F707A"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                  opacity="0.6"
                />

                {/* Bottom Volume Baseline Separator */}
                {(chartType === "candles" || chartMode === "advanced") && (
                  <line
                    x1={padLeft}
                    y1={padTop + priceZoneHeight + 8}
                    x2={chartWidth - padRight}
                    y2={padTop + priceZoneHeight + 8}
                    stroke="#E2D4CB"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                )}

                {/* 1. Volume Histogram Bars (At bottom of chart) */}
                {(chartType === "candles" || chartMode === "advanced") &&
                  chartCandles.map((c, i) => {
                    const isCandleGreen = c.close >= c.open;
                    const x = padLeft + i * (plotWidth / Math.max(chartCandles.length - 1, 1));
                    const candleWidth = Math.max(2, (plotWidth / chartCandles.length) * 0.8);
                    const volHeight = Math.max(2, (c.volume / maxCandleVolume) * (volumeZoneHeight - 12));
                    const volY = padTop + plotHeight - volHeight;

                    return (
                      <rect
                        key={`vol-${i}`}
                        x={x - candleWidth / 2}
                        y={volY}
                        width={candleWidth}
                        height={volHeight}
                        fill={isCandleGreen ? "#10B981" : "#EF4444"}
                        opacity="0.28"
                        rx="0.5"
                      />
                    );
                  })}

                {/* 2. Main Price Visuals (Candlesticks vs Area Line) */}
                {chartType === "candles" ? (
                  /* Candlestick OHLC Mode */
                  chartCandles.map((c, i) => {
                    const isCandleGreen = c.close >= c.open;
                    const candleColor = isCandleGreen ? "#059669" : "#DC2626";
                    const x = padLeft + i * (plotWidth / Math.max(chartCandles.length - 1, 1));
                    const candleWidth = Math.max(2.5, (plotWidth / chartCandles.length) * 0.75);

                    const topY = padTop + priceZoneHeight - ((Math.max(c.open, c.close) - minPrice) / priceRange) * priceZoneHeight;
                    const bottomY = padTop + priceZoneHeight - ((Math.min(c.open, c.close) - minPrice) / priceRange) * priceZoneHeight;
                    const highY = padTop + priceZoneHeight - ((c.high - minPrice) / priceRange) * priceZoneHeight;
                    const lowY = padTop + priceZoneHeight - ((c.low - minPrice) / priceRange) * priceZoneHeight;

                    return (
                      <g key={`candle-${i}`}>
                        {/* Upper & Lower Wicks */}
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={candleColor} strokeWidth="1.2" />
                        {/* Real Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={topY}
                          width={candleWidth}
                          height={Math.max(2, bottomY - topY)}
                          fill={candleColor}
                          rx="0.5"
                        />
                      </g>
                    );
                  })
                ) : (
                  /* Dual-Color Area Line Mode */
                  <>
                    <path
                      d={areaPathAbove}
                      fill="url(#cd20-rise-grad)"
                      clipPath="url(#cd20-clip-rise)"
                    />
                    <path
                      d={areaPathBelow}
                      fill="url(#cd20-fall-grad)"
                      clipPath="url(#cd20-clip-fall)"
                    />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#cd20-line-dual-grad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Vertical Crosshair Guide */}
                {activePoint && (
                  <g>
                    <line
                      x1={activePoint.x}
                      y1={padTop}
                      x2={activePoint.x}
                      y2={chartHeight - padBottom}
                      stroke="#0C133D"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.y}
                      r="5"
                      fill={isActivePointPositive ? "#059669" : "#DC2626"}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                  </g>
                )}

                {/* Highlighted Right-Hand Active Price Pill on Y-Axis */}
                {(() => {
                  const currentY = points[points.length - 1]?.y || padTop + priceZoneHeight / 2;
                  const isLatestPos = (points[points.length - 1]?.close ?? livePrice) >= periodOpen;

                  return (
                    <g transform={`translate(${chartWidth - padRight + 2}, ${currentY - 10})`}>
                      <rect
                        width={padRight - 4}
                        height="20"
                        rx="4"
                        fill={isLatestPos ? "#059669" : "#DC2626"}
                      />
                      <text
                        x={(padRight - 4) / 2}
                        y="13"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="Inter"
                      >
                        ${formatPrice(livePrice)}
                      </text>
                    </g>
                  );
                })()}

                {/* Bottom X-Axis Time Labels (Edge-Clamped to Prevent Left/Right Truncation) */}
                {points.map((p, i) => {
                  const intervalStep = Math.max(1, Math.floor(points.length / 7));
                  if (i % intervalStep === 0) {
                    const dateObj = new Date(p.openTime);
                    const formatted =
                      selectedTimeframe === "1H" || selectedTimeframe === "24H"
                        ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : dateObj.toLocaleDateString([], { month: "short", day: "numeric" });

                    let textAnchor = "middle";
                    let xPos = p.x;
                    if (i === 0) {
                      textAnchor = "start";
                      xPos = p.x + 4;
                    } else if (i >= points.length - intervalStep) {
                      textAnchor = "end";
                      xPos = Math.min(p.x, chartWidth - padRight - 4);
                    }

                    return (
                      <text
                        key={i}
                        x={xPos}
                        y={chartHeight - 8}
                        textAnchor={textAnchor}
                        fontSize="11"
                        fill="#7F707A"
                        fontFamily="Inter"
                        fontWeight="500"
                      >
                        {formatted}
                      </text>
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
          )}
        </div>

        {/* 5. Key Statistics & Live Market Depth Grid (Mobile Responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 pt-1">
          <div className="p-2.5 sm:p-3 bg-[#F2E7E1]/40 rounded-xl border border-outline-variant">
            <span className="text-[10px] text-[#7F707A] font-bold uppercase tracking-wider block truncate">24H High</span>
            <span className="font-sans font-extrabold text-xs sm:text-sm text-emerald-700 tabular-nums block truncate">
              ${formatPrice(Number(activeStats.highPrice || periodHigh))}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F2E7E1]/40 rounded-xl border border-outline-variant">
            <span className="text-[10px] text-[#7F707A] font-bold uppercase tracking-wider block truncate">24H Low</span>
            <span className="font-sans font-extrabold text-xs sm:text-sm text-rose-600 tabular-nums block truncate">
              ${formatPrice(Number(activeStats.lowPrice || periodLow))}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F2E7E1]/40 rounded-xl border border-outline-variant">
            <span className="text-[10px] text-[#7F707A] font-bold uppercase tracking-wider block truncate">24H Volume</span>
            <span className="font-sans font-extrabold text-xs sm:text-sm text-[#0C133D] tabular-nums block truncate">
              {Number(activeStats.volume || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
              {currentCoin.asset}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F2E7E1]/40 rounded-xl border border-outline-variant">
            <span className="text-[10px] text-[#7F707A] font-bold uppercase tracking-wider block truncate">24H Turnover</span>
            <span className="font-sans font-extrabold text-xs sm:text-sm text-[#0C133D] tabular-nums block truncate">
              ${(Number(activeStats.quoteVolume || 0) / 1000000).toFixed(2)}M
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F2E7E1]/40 rounded-xl border border-outline-variant">
            <span className="text-[10px] text-[#7F707A] font-bold uppercase tracking-wider block truncate">Price Delta</span>
            <span
              className={`font-sans font-extrabold text-xs sm:text-sm tabular-nums block truncate ${
                isPositive ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {Number(activeStats.priceChange || 0).toFixed(2)} USD
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F2E7E1]/40 rounded-xl border border-outline-variant">
            <span className="text-[10px] text-[#7F707A] font-bold uppercase tracking-wider block truncate">Total Trades</span>
            <span className="font-sans font-extrabold text-xs sm:text-sm text-[#0C133D] tabular-nums block truncate">
              {Number(activeStats.count || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Related Intelligence & Analysis Section (Live Database Articles) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-[#0C133D] flex items-center gap-2">
              <Zap size={18} className="text-[#D4AF37]" /> {currentCoin.name} Market Intelligence & News
            </h2>
            <p className="text-xs text-[#5C525A]">
              Live editorial briefings and reports from the Token Times database
            </p>
          </div>
          <button
            onClick={() => onNavigate?.("News")}
            className="text-xs font-bold text-[#D4AF37] hover:text-[#B08D23] flex items-center gap-1 shrink-0"
          >
            All News <ArrowRight size={13} />
          </button>
        </div>

        {loadingNews ? (
          <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl text-center text-xs text-[#5C525A]">
            Loading live articles from database...
          </div>
        ) : relatedNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedNews.map((article, i) => (
              <div
                key={article._id || article.id || i}
                onClick={() => onSelectArticle?.(article)}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col justify-between hover-lift cursor-pointer space-y-3 group shadow-2xs hover:border-[#D4AF37]"
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#F2E7E1] text-[#0C133D] text-[10px] font-bold uppercase tracking-wider">
                    {Array.isArray(article.category) ? article.category[0] : article.category || "Markets"}
                  </span>
                  <h3 className="font-bold text-xs text-[#0C133D] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
                <span className="text-[10px] text-[#7F707A] block pt-2 border-t border-outline-variant/40">
                  {article.approx_time_to_read || 3} min read • By {article.author || "Editorial Desk"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl text-center text-xs text-on-surface-variant">
            No published database articles matching {currentCoin.name} at this time.
          </div>
        )}
      </div>
    </div>
  );
}

function CandleIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 16}
      height={props.size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 3v4" />
      <path d="M9 17v4" />
      <rect x="6" y="7" width="6" height="10" rx="1" fill="currentColor" fillOpacity="0.2" />
      <path d="M17 1v7" />
      <path d="M17 15v8" />
      <rect x="14" y="8" width="6" height="7" rx="1" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function ArrowRight(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
