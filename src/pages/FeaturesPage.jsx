import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getPublishedNews } from "../services/published-news.service";
import { ToHref } from "../services/file.service";

const FEATURE_CATS = ["All Features", "Deep Dives", "Investigative", "Executive Q&A", "Special Reports"];

function formatTag(tag) {
  if (!tag) return "FEATURE";
  if (Array.isArray(tag)) {
    if (tag.length === 0) return "FEATURE";
    return tag.map((t) => formatTag(t)).join(" • ");
  }
  return String(tag)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FeaturesPage({ onNavigate, onSelectArticle }) {
  const [selectedCat, setSelectedCat] = useState("All Features");
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
            image: await ToHref(art.image, "feature.jpg"),
          }))
        );
        if (active) setArticles(resolved);
      } catch (err) {
        console.error("Failed to load features", err);
      }
    })();
    return () => { active = false; };
  }, []);

  const filteredArticles = selectedCat === "All Features"
    ? articles
    : articles.filter((a) => {
        const catArray = Array.isArray(a.category) ? a.category : [a.category || ""];
        const secArray = Array.isArray(a.display_section) ? a.display_section : [];
        const allTags = [...catArray, ...secArray].map((t) => String(t).toLowerCase().replace(/_/g, " "));
        const target = selectedCat.toLowerCase();
        return allTags.some((t) => t.includes(target) || target.includes(t));
      });

  const activeList = filteredArticles.length > 0 ? filteredArticles : articles;

  const leadFeature = activeList[0] || {
    title: "Tokenization of Real Estate: Evaluating Sovereign Asset Digitization",
    summary: "An extensive long-form investigation into how fractional ownership protocols could unlock liquidity across emerging debt and property markets.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5WbZ_u8XLylH-dyvD7qBkhDgMGEunLP53NK59UTnEEIwI1mrKvkOGitpXMwdx1kNhXQsIRk6zOlAhzsSWc-tDGfr8zkJp6jJF7a3BvfCuMySVmhMyHGBMXU-Xu1Ha9JNE7dJ_yycuWqKLO-Q6UKPKYAQznhpUlQvWeHlod3G0RplbrDaWLRJEs0trxUpQ4MditfkxsgVNAn7AeUXrC8IsbtkCvOz8tWOOEqf1WJuq86-v7KZgP75lswuFqwmgir4AC0P2KfjJpC4",
    author: "T.T. Special Investigations Unit",
    category: ["FLAGSHIP FEATURE"],
    publish_date: "12 Min Read"
  };

  const secondaryFeatures = activeList.slice(1, 5).length > 0 ? activeList.slice(1, 5) : [
    { title: "The Compliance Cost of Web3 Startups Navigating AML/KYC", approx_time_to_read: 8 },
    { title: "Institutional Custody: The Missing Link in Regional Capital Markets", approx_time_to_read: 7 },
    { title: "Zero-Knowledge Proofs in Compliance & Privacy Preservation", approx_time_to_read: 6 },
    { title: "DeFi Yield Risk Premiums vs Traditional Fixed Income", approx_time_to_read: 9 },
  ];

  const gridFeatures = activeList.slice(5, 8).length > 0 ? activeList.slice(5, 8) : [
    {
      title: "How Sovereign Wealth Funds View Digital Asset Allocations",
      summary: "Exploring institutional treasury strategies amidst macroeconomic shifts.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAyQHNrcuGeUVnrfRjOMY26ZqROKXbnSdi0HsE8QCzSU85WqHel18vyCJ02F8S17S4ExddiHtbDI34wCx97yk_RuDU3EolYDzHn1rNVVSdPEJcmPHEodMGIDVnxvAzMHeKuD-Xh4GuERtYSWGIpDmH5c7okEJNpnjJXLCBoGC1fhESeHQL4jcYOurangdqO6It-OJ5m6QkgiLlRgYywhFAH9ms4LWBi-utcqdI6i0P9q9DqNJzenhcMK8qI_XE6dRFpJDagtPd_pw",
      category: ["SPECIAL REPORT"]
    },
    {
      title: "Building Enterprise Blockchain Corridors in Emerging Hubs",
      summary: "Case studies on public-private distributed ledger initiatives.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGkvqzBG4VJkeeqmiHOL-JV1mapsEoJXAjqCL7auL1RUmGiZgaC80SgHvZnwzlMvHAGaQj8Bfd-dJ_eIbwMUMMDyg-i7BlsPW5NIWN9Oq37gpQDweeq4AqdS1AIhNLWYEXmd8aCI08lZzlrL1Oi4oRfmpJ74pnYQ3EFtMbo_iYEF1YiAMYyfaQwWLU4W4SKP2CbsTSG06mCnWmCZGbIix0Vnd4fWAHqSjkwG5z6LzKKMsLpf5HBNgfk6yAbrBb5IKrYpjf0YvZpn8",
      category: ["DEEP DIVE"]
    },
    {
      title: "The Architecture of Central Bank Digital Currencies",
      summary: "Technical breakdown of wholesale versus retail CBDC settlement engines.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbUp_CcXTSQ0J0qgwRKo4P1W1ba5gy27AUFvv19-DV0GBeBUxAJi785TMHKthNEdxefVJCUOboc-ZbDZ0-VshIQHjnHihX_1g7K_9wwxXxy2qsL91kzBbHnDS0zgTGzL7Qqd1kxFIgTZKLTPxEl8q5lQoZytYlPh07RnHWc9aaFL1mOuOnfw2BwbKLNDNWwKAevDBduGnM9P_Li-RKVS21DLK6162hSf9OE1AKuDzajSm9JUNnZq07YRYXEn21G2cJF7TQGx2B0FQ",
      category: ["INVESTIGATIVE"]
    }
  ];

  return (
    <div className="space-y-8">
      <SEOHead pageKey="Features" customTitle="Features & Long-Read Journalism | Token Times" />
      <Breadcrumbs currentPage="Features" onNavigate={onNavigate} />

      <Reveal as="div" className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block mb-1">
            LONG-FORM JOURNALISM & DEEP DIVES
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
            Feature Stories & Analysis
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-md">
          In-depth investigative reports, technical breakdowns, and flagship digital asset feature stories.
        </p>
      </Reveal>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {FEATURE_CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedCat === cat
                ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] font-extrabold"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#D4AF37]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Reveal
          as="article"
          onClick={() => onSelectArticle?.(leadFeature)}
          className="lg:col-span-8 hover-lift group bg-surface-container-lowest border-2 border-[#0C133D] rounded-xl overflow-hidden cursor-pointer shadow-md hover:border-[#D4AF37] flex flex-col justify-between"
        >
          <div className="relative h-72 sm:h-96 overflow-hidden">
            <img src={leadFeature.image || leadFeature.img} alt={leadFeature.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-3 left-3 bg-[#0C133D] text-[#D4AF37] text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-[#D4AF37]/40">
              {formatTag(leadFeature.category || leadFeature.tags)}
            </span>
          </div>
          <div className="p-6">
            <h2 className="font-headline-lg text-xl sm:text-3xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors mb-3">
              {leadFeature.title}
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              {leadFeature.summary}
            </p>
            <span className="text-xs font-data-tabular text-on-surface-variant pt-3 border-t border-outline-variant/40 block">
              By {leadFeature.author} • {leadFeature.publish_date}
            </span>
          </div>
        </Reveal>

        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-start gap-4 shadow-sm">
          <h3 className="font-headline-sm text-sm font-bold text-[#0C133D] border-b border-outline-variant pb-3 uppercase tracking-wider">
            Featured Reading List
          </h3>
          <div className="space-y-4">
            {secondaryFeatures.map((item, i) => (
              <div key={i} onClick={() => onSelectArticle?.(item)} className="group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase block mb-0.5">LONG READ</span>
                <h4 className="text-xs sm:text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <span className="text-[10px] text-on-surface-variant block mt-1">{item.approx_time_to_read || 7} mins read</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Across Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gridFeatures.map((card, i) => (
          <Reveal key={i} as="article" onClick={() => onSelectArticle?.(card)} className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 cursor-pointer shadow-sm hover:border-[#D4AF37]">
            <div className="h-44 rounded-lg overflow-hidden mb-3 border border-outline-variant/40 relative">
              <img src={card.image || card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <span className="absolute top-2 left-2 bg-[#0C133D] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded">
                {formatTag(card.category || card.tags)}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors mb-1 line-clamp-2">
              {card.title}
            </h3>
            <p className="text-xs text-on-surface-variant line-clamp-2">{card.summary}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
