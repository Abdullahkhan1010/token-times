import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getPublishedNews } from "../services/published-news.service";
import { ToHref } from "../services/file.service";
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

const MARKET_TABS = ["All Markets", "Bitcoin & Majors", "CBDC Pilots", "Tokenized Assets", "DeFi & Yields"];

function formatTag(tag) {
  if (!tag) return "MARKETS";
  if (Array.isArray(tag)) {
    if (tag.length === 0) return "MARKETS";
    return tag.map((t) => formatTag(t)).join(" • ");
  }
  return String(tag)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const TICKER_DATA = [
  { symbol: "BTC/USD", price: "$96,480.00", change: "+3.4%", up: true },
  { symbol: "ETH/USD", price: "$3,420.50", change: "+2.1%", up: true },
  { symbol: "SOL/USD", price: "$188.20", change: "-0.8%", up: false },
  { symbol: "PKR/USD", price: "278.45", change: "+0.05%", up: true },
  { symbol: "USDT/PKR", price: "282.10", change: "+0.12%", up: true },
];

export default function MarketsPage({ onNavigate, onSelectArticle }) {
  const [selectedTab, setSelectedTab] = useState("All Markets");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPublishedNews();
        if (!active) return;
        const published = data.filter((a) => a.status === "published");
        const resolved = await Promise.all(
          published.map(async (art) => ({
            ...art,
            image: await ToHref(art.image, "market.jpg"),
          }))
        );
        if (active) setArticles(resolved);
      } catch (err) {
        console.error("Failed to load market news", err);
      }
    })();
    return () => { active = false; };
  }, []);

  // Filter to only market-relevant articles
  const marketArticles = articles.filter((a) => {
    const secs = Array.isArray(a.display_section) ? a.display_section : [];
    const cats = Array.isArray(a.category) ? a.category : [a.category || ""];
    const tags = Array.isArray(a.tags) ? a.tags : [a.tags || ""];
    const catText = cats.map((t) => String(t).toLowerCase().replace(/_/g, " "));
    // Match if display_section is latest_news, OR category includes "markets", "defi", or "trading"
    const isMarketSection = secs.includes("latest_news");
    const isMarketCategory = catText.some((c) => ["markets", "defi", "trading"].includes(c));
    // Also match tags like ETF, Bitcoin, Staking, Yield
    const marketTags = ["etf", "bitcoin", "trading", "volume", "liquidity", "staking", "yield", "psx"];
    const tagText = tags.map((t) => String(t).toLowerCase());
    const hasMarketTag = tagText.some((t) => marketTags.includes(t));
    return isMarketSection || isMarketCategory || hasMarketTag;
  });

  const filteredArticles = selectedTab === "All Markets"
    ? marketArticles
    : marketArticles.filter((a) => {
        const catArray = Array.isArray(a.category) ? a.category : [a.category || ""];
        const secArray = Array.isArray(a.display_section) ? a.display_section : [];
        const allTags = [...catArray, ...secArray].map((t) => String(t).toLowerCase().replace(/_/g, " "));
        const target = selectedTab.toLowerCase();
        return allTags.some((t) => t.includes(target) || target.includes(t));
      });

  const activeList = filteredArticles.length > 0 ? filteredArticles : (marketArticles.length > 0 ? marketArticles : articles);

  const leadMarket = activeList[0] || {
    title: "Institutional Inflows Surge Across Digital Asset Derivative Desks",
    summary: "Commercial banks and asset managers allocate record capital to licensed OTC crypto liquidity pools ahead of regulatory frameworks.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgyzCbG60lvIFTQKg26XntSCOHuPXN-3VME8fauPPOKXhlpbiEwff1rA-d3SE1ZFowCZAbA77CvjbrmI4m99zr5DPnXgHsoBmiXATqCh3M2-xFNsSeX_yZXS88H6IBZSAmErDP6HnACV0bBeln1nOdbf3KnbWeLIzN6fv26kDv9qFUIG2EdbdBwkFkfQkhgZC9GCxqpB2AgyTB1IWyVebeAmupft1j6R7sEXRLOraMEL5Zd52dmOwKIDp7W1x1rZt-L2cTvQGNB2A",
    author: "Markets Desk",
    category: ["MARKETS LEAD"],
    publish_date: "Live"
  };

  const secondaryMarketStories = activeList.slice(1, 5).length > 0 ? activeList.slice(1, 5) : [
    { title: "Bitcoin Hashrate Touches All-Time High Following Difficulty Adjustment", approx_time_to_read: 3 },
    { title: "Local Crypto Exchanges Integrate Layer-2 Networks for Faster Withdrawals", approx_time_to_read: 4 },
    { title: "FBR Proposes 15% Flat Capital Gains Tax Framework for Digital Assets", approx_time_to_read: 5 },
    { title: "State Bank CBDC Pilot Prepares Phase 2 Interbank Settlement Tests", approx_time_to_read: 4 },
  ];

  return (
    <div className="space-y-8">
      <SEOHead pageKey="Markets" customTitle="Digital Asset & Crypto Market Intelligence | Token Times" />
      <Breadcrumbs currentPage="Markets" onNavigate={onNavigate} />

      {/* Real-time Crypto Price Dashboard Bar */}
      <Reveal as="div" className="bg-[#0C133D] text-white rounded-xl p-4 border border-[#D4AF37]/40 shadow-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#D4AF37]" />
            <span className="text-xs font-extrabold tracking-wider uppercase text-[#D4AF37]">
              LIVE MARKETS DESK
            </span>
          </div>
          <span className="text-[10px] text-white/60">Updated Real-Time</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TICKER_DATA.map((t, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-2.5">
              <span className="text-[10px] font-bold text-white/70 block uppercase">{t.symbol}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-extrabold font-data-tabular text-white">{t.price}</span>
                <span className={`text-[10px] font-bold flex items-center ${t.up ? "text-emerald-400" : "text-rose-400"}`}>
                  {t.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {t.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block mb-1">
            FINANCIAL INTELLIGENCE & DATA
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
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
        <Reveal
          as="article"
          onClick={() => onSelectArticle?.(leadMarket)}
          className="lg:col-span-8 hover-lift group bg-surface-container-lowest border-2 border-[#0C133D] rounded-xl overflow-hidden cursor-pointer shadow-md hover:border-[#D4AF37] flex flex-col justify-between"
        >
          <div className="relative h-72 sm:h-96 overflow-hidden">
            <img src={leadMarket.image || leadMarket.img} alt={leadMarket.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-3 left-3 bg-[#0C133D] text-[#D4AF37] text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-[#D4AF37]/40">
              MARKETS LEAD
            </span>
          </div>
          <div className="p-6">
            <h2 className="font-headline-lg text-xl sm:text-3xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors mb-3">
              {leadMarket.title}
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              {leadMarket.summary}
            </p>
            <span className="text-xs font-data-tabular text-on-surface-variant pt-3 border-t border-outline-variant/40 block">
              By {leadMarket.author} • Live Markets
            </span>
          </div>
        </Reveal>

        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-start gap-4 shadow-sm">
          <h3 className="font-headline-sm text-sm font-bold text-[#0C133D] border-b border-outline-variant pb-3 uppercase tracking-wider">
            Markets Headlines Wire
          </h3>
          <div className="space-y-4">
            {secondaryMarketStories.map((item, i) => (
              <div key={i} onClick={() => onSelectArticle?.(item)} className="group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase block mb-0.5">MARKETS WIRE</span>
                <h4 className="text-xs sm:text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <span className="text-[10px] text-on-surface-variant block mt-1">{item.approx_time_to_read || 4} mins read</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
