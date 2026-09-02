import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getPublishedNews } from "../services/published-news.service";
import { ToImageUrl } from "../services/file.service";
import { getCryptoPrice, getCryptoStats } from "../services/crypto.service";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import btcLogo from "../assets/logos/btc.png";
import ethLogo from "../assets/logos/eth.png";
import xrpLogo from "../assets/logos/xrp.png";

const MARKET_TABS = ["All Markets", "Bitcoin & Majors", "CBDC Pilots", "Tokenized Assets", "DeFi & Yields"];

const MARKET_COINS = [
  { symbol: "BTCUSDT", asset: "BTC", name: "Bitcoin", pair: "BTC / USDT", logo: btcLogo },
  { symbol: "ETHUSDT", asset: "ETH", name: "Ethereum", pair: "ETH / USDT", logo: ethLogo },
  { symbol: "XRPUSDT", asset: "XRP", name: "Ripple", pair: "XRP / USDT", logo: xrpLogo },
];

export default function MarketsPage({ onNavigate, onSelectArticle }) {
  const [selectedTab, setSelectedTab] = useState("All Markets");
  const [articles, setArticles] = useState([]);
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    let active = true;

    const loadLiveDesk = () => {
      Promise.all(
        MARKET_COINS.map(async (coin) => {
          try {
            const [stats, price] = await Promise.all([
              getCryptoStats(coin.symbol),
              getCryptoPrice(coin.symbol),
            ]);
            const change = Number(stats?.priceChangePercent || 0);

            return {
              ...coin,
              price: Number(price?.price ?? stats?.lastPrice ?? 0),
              change,
              high: Number(stats?.highPrice || 0),
              low: Number(stats?.lowPrice || 0),
              up: change >= 0,
            };
          } catch {
            return {
              ...coin,
              price: 0,
              change: 0,
              high: 0,
              low: 0,
              up: true,
            };
          }
        })
      )
        .then((data) => {
          if (active) setTickerData(data);
        })
        .catch((err) => {
          console.error("Failed to load crypto market desk data", err);
          if (active) setTickerData([]);
        });
    };

    loadLiveDesk();
    const interval = setInterval(loadLiveDesk, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPublishedNews();
        if (!active) return;
        const published = (Array.isArray(data) ? data : []).filter((a) => a.status === "published");
        if (active) setArticles(published);

        const resolved = await Promise.all(
          published.map(async (art) => {
            if (!art.image || typeof art.image !== "string" || art.image.startsWith("http://") || art.image.startsWith("https://") || art.image.startsWith("data:")) {
              return art;
            }
            try {
              const resolvedImg = await ToImageUrl(art.image);
              return { ...art, image: resolvedImg };
            } catch {
              return art;
            }
          })
        );
        if (active) setArticles(resolved);
      } catch (err) {
        console.error("Failed to load market news", err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const marketArticles = articles.filter((a) => {
    const secs = Array.isArray(a.display_section) ? a.display_section : [];
    const cats = Array.isArray(a.category) ? a.category : [a.category || ""];
    const tags = Array.isArray(a.tags) ? a.tags : [a.tags || ""];
    const catText = cats.map((t) => String(t).toLowerCase().replace(/_/g, " "));
    const isMarketSection = secs.includes("latest_news");
    const isMarketCategory = catText.some((c) => ["markets", "defi", "trading"].includes(c));
    const marketTags = ["etf", "bitcoin", "trading", "volume", "liquidity", "staking", "yield", "psx"];
    const tagText = tags.map((t) => String(t).toLowerCase());
    const hasMarketTag = tagText.some((t) => marketTags.includes(t));
    return isMarketSection || isMarketCategory || hasMarketTag;
  });

  const filteredArticles =
    selectedTab === "All Markets"
      ? marketArticles
      : marketArticles.filter((a) => {
          const catArray = Array.isArray(a.category) ? a.category : [a.category || ""];
          const secArray = Array.isArray(a.display_section) ? a.display_section : [];
          const allTags = [...catArray, ...secArray].map((t) => String(t).toLowerCase().replace(/_/g, " "));
          const target = selectedTab.toLowerCase();
          return allTags.some((t) => t.includes(target) || target.includes(t));
        });

  const activeList =
    filteredArticles.length > 0 ? filteredArticles : marketArticles.length > 0 ? marketArticles : articles;

  const leadMarket = activeList[0] || null;
  const secondaryMarketStories = activeList.slice(1, 5);

  const formatPrice = (val) => {
    if (!val) return "0.00";
    if (val < 2) return val.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <SEOHead pageKey="Markets" customTitle="Digital Asset & Crypto Market Intelligence | Token Times" />
      <Breadcrumbs currentPage="Markets" onNavigate={onNavigate} />

      {/* 1. Sleek Live Crypto Markets Desk (3 Currencies, Compact & Full Width) */}
      <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 sm:p-3.5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#0C133D]">
              LIVE CRYPTO MARKETS DESK
            </span>
          </div>
          <span className="text-[10px] text-[#7F707A] font-medium">Real-Time Binance Spot Average</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {tickerData.map((coin) => {
            const isPos = coin.change >= 0;

            return (
              <div
                key={coin.symbol}
                onClick={() => onNavigate?.("CryptoDetail", { symbol: coin.asset.toLowerCase() })}
                className="bg-surface-container-low/50 hover:bg-surface-container-low border border-outline-variant hover:border-[#D4AF37] rounded-lg p-2.5 sm:p-3 cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-xs group flex flex-col justify-between"
                title={`Click to open detailed ${coin.name} interactive charts`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={coin.logo}
                      alt={coin.name}
                      className="w-5 h-5 rounded-full object-contain shrink-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors block leading-tight">
                        {coin.name}
                      </span>
                      <span className="text-[9px] text-[#7F707A] font-mono leading-none block">
                        {coin.pair}
                      </span>
                    </div>
                  </div>

                  {/* Percentage Pill */}
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                      isPos
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}
                  >
                    {isPos ? <ArrowUpRight size={11} className="text-emerald-700" /> : <ArrowDownRight size={11} className="text-rose-600" />}
                    {isPos ? "+" : ""}{coin.change.toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-end justify-between mt-1 pt-1.5 border-t border-outline-variant/30">
                  <span className="font-sans text-base sm:text-lg font-extrabold text-[#0C133D] tabular-nums tracking-tight">
                    ${formatPrice(coin.price)}
                  </span>
                  <span className="text-[10px] font-bold text-[#D4AF37] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Chart ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block mb-1">
            FINANCIAL INTELLIGENCE & DATA
          </span>
          <h1 className="font-display-lg text-2xl sm:text-3xl md:text-5xl font-bold text-[#0C133D]">
            Market Dashboards & News
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-md">
          Track institutional capital flows, forex exchange rates, and market liquidity across regional crypto desks.
        </p>
      </Reveal>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {MARKET_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedTab === tab
                ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] font-extrabold"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#D4AF37]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Lead Story + Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {leadMarket && (
          <Reveal
            as="article"
            onClick={() => onSelectArticle?.(leadMarket)}
            className="lg:col-span-8 hover-lift group bg-surface-container-lowest border-2 border-[#0C133D] rounded-xl overflow-hidden cursor-pointer shadow-md hover:border-[#D4AF37] flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-72 md:h-96 overflow-hidden">
              <img
                src={leadMarket.image || leadMarket.img}
                alt={leadMarket.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#0C133D] text-[#D4AF37] text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-[#D4AF37]/40">
                MARKETS LEAD
              </span>
            </div>
            <div className="p-4 sm:p-6">
              <h2 className="font-headline-lg text-xl sm:text-3xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors mb-3">
                {leadMarket.title}
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant font-normal leading-relaxed mb-4">
                {leadMarket.summary}
              </p>
              <span className="text-xs font-data-tabular text-on-surface-variant font-normal pt-3 border-t border-outline-variant/40 block">
                By {leadMarket.author} • Live Markets
              </span>
            </div>
          </Reveal>
        )}

        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 flex flex-col justify-start gap-4 shadow-sm">
          <h3 className="font-headline-sm text-sm font-bold text-[#0C133D] border-b border-outline-variant pb-3 uppercase tracking-wider">
            Markets Headlines Wire
          </h3>
          <div className="space-y-4">
            {secondaryMarketStories.map((item, i) => (
              <div
                key={i}
                onClick={() => onSelectArticle?.(item)}
                className="group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none"
              >
                <span className="font-label-caps text-[10px] font-bold text-[#D4AF37] uppercase block mb-0.5">MARKETS WIRE</span>
                <h4 className="text-xs sm:text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <span className="font-data-tabular text-[10px] text-on-surface-variant font-normal block mt-1">
                  {item.approx_time_to_read || 4} mins read
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
