import React, { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  TrendingUp,
  ShieldCheck,
  Zap,
  DollarSign,
  Layers,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Coins,
  FileText,
  Lock,
  Building,
  HelpCircle,
  ChevronRight,
  Percent,
  Landmark,
  Scale,
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getReitContent, fetchReitContent } from "../services/reit.service";
import { getPublishedNews } from "../services/published-news.service";
import { ToImageUrl } from "../services/file.service";
import LazyImage from "../components/LazyImage";

export default function ReitPage({ onNavigate, onSelectArticle }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [reitContent, setReitContent] = useState(getReitContent);
  const [streamArticles, setStreamArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [resolvedHeroImg, setResolvedHeroImg] = useState("");

  // Interactive Yield Simulator state
  const [investmentAmount, setInvestmentAmount] = useState(1000);

  const benchmarkRate = (reitContent.simulatorConfig?.benchmarkYield || 11.8) / 100;
  const tokenUnitPrice = reitContent.simulatorConfig?.tokenPrice || 25;
  const tokenSymbol = reitContent.simulatorConfig?.tokenSymbol || "DCR";

  const estimatedAnnualYield = (investmentAmount * benchmarkRate).toFixed(2);
  const estimatedMonthlyPayout = (estimatedAnnualYield / 12).toFixed(2);
  const fractionalTokens = Math.floor(investmentAmount / tokenUnitPrice);

  // Sync dynamic REIT content from storage & listen for live admin updates
  useEffect(() => {
    let active = true;
    const updateContent = () => {
      const fresh = getReitContent();
      if (active) setReitContent(fresh);
    };

    updateContent();
    fetchReitContent().then((fresh) => {
      if (active && fresh) setReitContent(fresh);
    }).catch(() => {});

    window.addEventListener("reit-content-updated", updateContent);
    return () => {
      active = false;
      window.removeEventListener("reit-content-updated", updateContent);
    };
  }, []);

  // Resolve hero image S3/URL & preload
  useEffect(() => {
    let active = true;
    (async () => {
      if (reitContent.heroLandmark?.image) {
        try {
          const url = await ToImageUrl(reitContent.heroLandmark.image);
          if (active) {
            setResolvedHeroImg(url || reitContent.heroLandmark.image);
            if (url) {
              const img = new Image();
              img.src = url;
              if (img.decode) img.decode().catch(() => { });
            }
          }
        } catch {
          if (active) setResolvedHeroImg(reitContent.heroLandmark.image);
        }
      }
    })();
    return () => { active = false; };
  }, [reitContent.heroLandmark?.image]);

  // Fetch dynamic REIT articles published through admin panel
  useEffect(() => {
    let active = true;

    async function loadReitNewsStream() {
      setLoadingArticles(true);
      try {
        const allNews = await getPublishedNews();
        if (!active) return;

        // Filter published articles matching REIT category / tag / display_section
        const isReitMatch = (art) => {
          if (!art || art.status !== "published") return false;

          const cats = Array.isArray(art.category)
            ? art.category
            : [art.category || ""];
          const sections = Array.isArray(art.display_section)
            ? art.display_section
            : [art.display_section || ""];
          const tags = Array.isArray(art.tags) ? art.tags : [art.tags || ""];

          const textBlob = `${cats.join(" ")} ${sections.join(" ")} ${tags.join(" ")} ${art.title || ""}`.toLowerCase();

          return (
            textBlob.includes("reit") ||
            textBlob.includes("proptech") ||
            textBlob.includes("real estate") ||
            textBlob.includes("tokenization")
          );
        };

        const reitPublished = (Array.isArray(allNews) ? allNews : []).filter(isReitMatch);

        if (active) {
          setStreamArticles(reitPublished);
        }
      } catch (err) {
        console.warn("Failed to load REIT dynamic news stream:", err);
        if (active) {
          setStreamArticles([]);
        }
      } finally {
        if (active) setLoadingArticles(false);
      }
    }

    loadReitNewsStream();
    return () => { active = false; };
  }, []);

  const { heroLandmark, pakistanFeatures, globalApplications } = reitContent;

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime())
        ? String(dateString)
        : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="space-y-10">
      <SEOHead pageKey="REIT" />

      <Breadcrumbs currentPage="REIT" onNavigate={onNavigate} />

      {/* Page Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label-caps text-xs text-[#D4AF37] font-bold tracking-widest uppercase bg-[#0C133D] px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm">
            PROPTECH & REAL ESTATE TOKENIZATION
          </span>

        </div>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C133D] tracking-tight">
          Real Estate Investment Trusts (REIT) & Asset Tokenization
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-4xl leading-relaxed">
          Discover how modern REIT technology, blockchain fractionalization, and smart contract automation are revolutionizing real estate liquidity worldwide and driving commercial property innovation in Pakistan—highlighted by landmarks like Dolmen City REIT.
        </p>
      </Reveal>

      {/* Hero Highlight Box: Dolmen City REIT & Pakistan Landmark (Dynamic) */}
      <Reveal
        as="section"
        className="bg-surface-container-lowest border-2 border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 relative"
      >
        <div className="lg:col-span-6 relative rounded-xl overflow-hidden min-h-[280px] sm:min-h-[340px] bg-[#0C133D]/10">
          <img
            src={
              resolvedHeroImg ||
              heroLandmark?.image ||
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
            }
            alt={heroLandmark?.title || "Landmark Commercial Real Estate"}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C133D]/95 via-[#0C133D]/40 to-transparent flex flex-col justify-end p-6">
            <span className="bg-[#D4AF37] text-[#0C133D] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider w-max mb-2 shadow">
              {heroLandmark?.badge || "PAKISTAN LANDMARK REIT"}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display-lg leading-tight">
              {heroLandmark?.title || "Dolmen City REIT (DCR)"}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              {heroLandmark?.location ||
                "Dolmen Mall Clifton & Harbour Front Corporate Tower, Karachi"}
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-label-caps">
              <Building2 className="w-4 h-4" />{" "}
              {heroLandmark?.tag || "SECP LISTED RENTAL REIT SCHEME"}
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-[#0C133D] leading-tight">
              {heroLandmark?.heading ||
                "Transforming Pakistan's Commercial Property via Tokenized Yields"}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {heroLandmark?.description ||
                "Dolmen City REIT represents Pakistan's premier listed rental REIT, offering investors exposure to top-tier commercial retail and corporate real estate in Karachi. With SECP's regulatory sandbox for digital asset tokenization, assets like Dolmen Mall can be digitized into micro-fractional security tokens, allowing both local retail investors and overseas Pakistanis to invest directly from digital wallets."}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/60">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
              <span className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">
                Annual Yield
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#0C133D] font-data-tabular">
                {heroLandmark?.annualYield || "11.8% - 13.5%"}
              </span>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
              <span className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">
                Mall Occupancy
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#0C133D] font-data-tabular">
                {heroLandmark?.mallOccupancy || "98.4%"}
              </span>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">
                Asset Area
              </span>
              <span className="text-base sm:text-lg font-extrabold text-[#0C133D] font-data-tabular">
                {heroLandmark?.assetArea || "3.5M+ Sq. Ft"}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Tabbed Navigation Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-bold font-label-caps uppercase rounded-lg transition-all whitespace-nowrap ${activeTab === "overview"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "text-on-surface-variant hover:text-[#0C133D] bg-surface-container-low"
              }`}
          >
            What is REIT Technology?
          </button>
          <button
            onClick={() => setActiveTab("pakistan")}
            className={`px-4 py-2 text-xs font-bold font-label-caps uppercase rounded-lg transition-all whitespace-nowrap ${activeTab === "pakistan"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "text-on-surface-variant hover:text-[#0C133D] bg-surface-container-low"
              }`}
          >
            Pakistan Ecosystem & SECP
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`px-4 py-2 text-xs font-bold font-label-caps uppercase rounded-lg transition-all whitespace-nowrap ${activeTab === "global"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "text-on-surface-variant hover:text-[#0C133D] bg-surface-container-low"
              }`}
          >
            Global Applications
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-4 py-2 text-xs font-bold font-label-caps uppercase rounded-lg transition-all whitespace-nowrap ${activeTab === "simulator"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "text-on-surface-variant hover:text-[#0C133D] bg-surface-container-low"
              }`}
          >
            Token Yield Simulator
          </button>
        </div>

        {/* Tab 1: What is REIT Technology? */}
        {activeTab === "overview" && (
          <Reveal as="div" className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-3 shadow-sm hover:border-[#D4AF37] transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#0C133D] flex items-center justify-center text-[#D4AF37]">
                  <Coins size={20} />
                </div>
                <h3 className="font-bold text-[#0C133D] text-base">
                  Fractional Token Ownership
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Instead of requiring millions of rupees or dollars to buy commercial real estate, tokenization breaks multi-story office towers or shopping malls into security tokens representing fractional ownership.
                </p>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-3 shadow-sm hover:border-[#D4AF37] transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#0C133D] flex items-center justify-center text-[#D4AF37]">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-[#0C133D] text-base">
                  Smart Contract Dividends
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Rental revenues collected from tenants are automatically routed into blockchain smart contracts, distributing monthly or quarterly dividend payouts directly to token holders' non-custodial wallets.
                </p>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-3 shadow-sm hover:border-[#D4AF37] transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#0C133D] flex items-center justify-center text-[#D4AF37]">
                  <Lock size={20} />
                </div>
                <h3 className="font-bold text-[#0C133D] text-base">
                  Auditable Property Titles
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Every property title, lease deed, and valuation report is cryptographically hashed onto immutable ledgers, eliminating title fraud and speeding up property audit cycles from months to minutes.
                </p>
              </div>
            </div>

            {/* Comparison Matrix */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-headline-sm text-lg font-bold text-[#0C133D]">
                Traditional Real Estate vs. Tokenized REIT Technology
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps text-[11px] uppercase">
                      <th className="py-3 px-4">Feature</th>
                      <th className="py-3 px-4">Traditional Real Estate</th>
                      <th className="py-3 px-4">Traditional Public REIT</th>
                      <th className="py-3 px-4 text-[#0C133D] font-bold">
                        Tokenized REIT Technology
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40 font-data-tabular">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0C133D]">Minimum Capital</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">$100,000+ / PKR 20M+</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">$500 / PKR 50,000</td>
                      <td className="py-3.5 px-4 font-bold text-[#D4AF37] bg-[#0C133D]/5">
                        $10 / PKR 2,500
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0C133D]">Settlement Speed</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">30 to 90 Days</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">T+2 Stock Exchange</td>
                      <td className="py-3.5 px-4 font-bold text-[#D4AF37] bg-[#0C133D]/5">
                        T+0 Atomic (Instant)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0C133D]">Dividend Payouts</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">Quarterly / Annual Manual</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">Semi-Annual Brokerage Payout</td>
                      <td className="py-3.5 px-4 font-bold text-[#D4AF37] bg-[#0C133D]/5">
                        Automated Monthly Smart Contract
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#0C133D]">Cross-Border Access</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">Complex Paperwork & Taxes</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">Restricted Brokerage Accounts</td>
                      <td className="py-3.5 px-4 font-bold text-[#D4AF37] bg-[#0C133D]/5">
                        24/7 Global Wallet Access
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        )}

        {/* Tab 2: Pakistan Ecosystem & SECP (Dynamic Cards) */}
        {activeTab === "pakistan" && (
          <Reveal as="div" className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pakistanFeatures?.map((feat, idx) => (
                <div
                  key={feat.id || idx}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-[#D4AF37] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                        {feat.tag}
                      </span>
                      <Building2 className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="font-headline-md text-lg font-bold text-[#0C133D] leading-snug">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {feat.desc}
                    </p>
                    <ul className="space-y-2 pt-2 border-t border-outline-variant/40">
                      {feat.highlights?.map((item, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-2 text-xs text-[#0C133D] font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Callout Box: SECP Sandbox & RDA Integration */}
            <div className="bg-gradient-to-r from-[#0C133D] to-[#121C59] text-white p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/40 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <Landmark className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display-lg text-white">
                    SECP Regulatory Sandbox & State Bank Integration
                  </h3>
                  <p className="text-xs text-white/70">
                    Unlocking Capital Flows for Pakistani Infrastructure & Commercial Malls
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                The Securities and Exchange Commission of Pakistan (SECP) has launched regulatory sandbox cohorts enabling fintech startups to test asset tokenization. Concurrently, integrating tokenized REIT contracts with the State Bank of Pakistan's (SBP) Roshan Digital Account (RDA) allows 9+ million overseas Pakistanis to invest directly into flagship projects like Dolmen Mall Clifton, Centaurus, or Lahore tech parks, earning high-yield rental returns in audited PKR/USD formats.
              </p>
            </div>
          </Reveal>
        )}

        {/* Tab 3: Global Applications (Dynamic Cards) */}
        {activeTab === "global" && (
          <Reveal as="div" className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {globalApplications?.map((app, idx) => (
                <div
                  key={app.id || idx}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm hover:border-[#D4AF37] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0C133D] font-label-caps tracking-wider flex items-center gap-1.5">
                        <span className="text-base">{app.flag}</span> {app.country}
                      </span>
                      <span className="px-2.5 py-0.5 bg-surface-container-low text-on-surface-variant font-data-tabular font-bold text-[10px] rounded-full border border-outline-variant">
                        {app.framework}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0C133D] text-base leading-snug">
                      {app.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {app.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between bg-surface-container-low/50 p-3 rounded-lg">
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase">
                      {app.metricLabel}
                    </span>
                    <span className="text-sm font-extrabold text-[#0C133D] font-data-tabular">
                      {app.metric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Tab 4: Token Yield Simulator (Dynamic Config) */}
        {activeTab === "simulator" && (
          <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
            <div className="space-y-2 border-b border-outline-variant pb-4">
              <span className="text-xs font-bold text-[#D4AF37] font-label-caps uppercase tracking-wider">
                INTERACTIVE ESTIMATOR
              </span>
              <h3 className="font-headline-md text-2xl font-bold text-[#0C133D]">
                Tokenized REIT Rental Yield Simulator
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Simulate prospective annualized rental yields based on prime commercial REIT performance (benchmark: {(benchmarkRate * 100).toFixed(1)}% APY).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#0C133D]">
                    <span>Investment Amount (USD Equivalent)</span>
                    <span className="font-data-tabular text-sm font-extrabold text-[#D4AF37] bg-[#0C133D] px-3 py-1 rounded-lg">
                      ${investmentAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="100"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-data-tabular">
                    <span>$100 (Micro Entry)</span>
                    <span>$25,000</span>
                    <span>$50,000 (Institutional)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                    <span className="text-[10px] text-on-surface-variant block font-bold">
                      Benchmark Annual APY
                    </span>
                    <span className="text-sm font-bold text-[#0C133D]">
                      {(benchmarkRate * 100).toFixed(1)}% Rental Dividend
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                    <span className="text-[10px] text-on-surface-variant block font-bold">
                      Token Price
                    </span>
                    <span className="text-sm font-bold text-[#0C133D]">
                      ${tokenUnitPrice.toFixed(2)} / {tokenSymbol} Token
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0C133D] text-white p-6 rounded-xl border border-[#D4AF37]/40 space-y-4 text-center">
                <span className="text-[11px] text-[#D4AF37] font-bold font-label-caps uppercase tracking-wider block">
                  Projected Smart Contract Returns
                </span>
                <div>
                  <span className="text-xs text-white/70 block">Estimated Annual Rental Yield</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#D4AF37] font-data-tabular block mt-1">
                    ${estimatedAnnualYield}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-white/60 block text-[10px]">Monthly Payout</span>
                    <span className="font-bold text-white font-data-tabular">
                      ${estimatedMonthlyPayout} / mo
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px]">Tokens Owned</span>
                    <span className="font-bold text-white font-data-tabular">
                      {fractionalTokens} {tokenSymbol} Tokens
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {/* Featured Articles & Research Stream (Dynamic from Admin Panel) */}
      <div className="space-y-4 pt-6 border-t border-outline-variant">
        <div className="flex items-center justify-between border-b border-outline-variant pb-2">
          <h2 className="font-headline-sm text-xl font-bold text-[#0C133D] flex items-center gap-2">
            <FileText size={20} className="text-[#D4AF37]" /> Latest REIT Intelligence & Research Stream
          </h2>
          <span className="text-xs text-on-surface-variant font-data-tabular">
            {streamArticles.length} {streamArticles.length === 1 ? "Article" : "Articles"} Published
          </span>
        </div>

        {streamArticles.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface-variant text-xs">
            No REIT articles published yet. Publish an article under the <strong>REIT & PropTech</strong> category in Admin Panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {streamArticles.map((art, idx) => {
              const categoryBadge = Array.isArray(art.category)
                ? art.category[0]
                : art.category || "REIT & PropTech";
              const dateDisplay = formatDate(art.publish_date || art.publishedAt || art.createdAt);
              const readTimeDisplay = art.approx_time_to_read
                ? `${art.approx_time_to_read} Min Read`
                : "5 Min Read";

              return (
                <Reveal
                  key={art.id || idx}
                  as="article"
                  delay={idx * 80}
                  className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer space-y-4 shadow-sm hover:border-[#D4AF37] transition-all"
                  onClick={() => {
                    if (onSelectArticle) {
                      onSelectArticle(art);
                    }
                  }}
                >
                  <div className="h-44 overflow-hidden relative bg-[#0C133D]/10 flex items-center justify-center">
                    {art.image ? (
                      <LazyImage
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-[#0C133D]/40" />
                    )}
                    <span className="absolute top-3 left-3 bg-[#0C133D] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#D4AF37]/40 shadow">
                      {categoryBadge}
                    </span>
                  </div>

                  <div className="p-5 pt-0 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-on-surface-variant font-data-tabular">
                        {dateDisplay} • {readTimeDisplay}
                      </span>
                      <h3 className="font-headline-md text-base font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                        {art.summary || art.desc || (art.article ? art.article.slice(0, 150) + "..." : "")}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-[#0C133D] font-bold">
                      <span className="truncate max-w-[140px]">By {art.author || "Editorial Desk"}</span>
                      <span className="flex items-center gap-1 group-hover:text-[#D4AF37] transition-colors shrink-0">
                        Read Article <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
