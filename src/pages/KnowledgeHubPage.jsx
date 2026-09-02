import React, { useState, useEffect, useMemo } from "react";
import { Search, BookOpen, ChevronDown, ChevronUp, Share2, Check, Sparkles } from "lucide-react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getKnowlegeHubs } from "../services/knowlege-hub.service";

export default function KnowledgeHubPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState("All Guides");
  const [searchQuery, setSearchQuery] = useState("");
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getKnowlegeHubs()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            level: Array.isArray(item.category) && item.category.length > 0 ? item.category[0] : (item.category || "Explainer"),
            time: item.publish_date ? new Date(item.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Editorial Explainer",
            title: item.question,
            desc: item.answer,
            author: item.author || "Token Times Research Desk",
            tag: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.join(", ") : (item.tags || "Digital Assets"),
          }));
          setGuides(mapped);
        } else {
          setGuides([]);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch knowledge hub guides:", err.message);
        if (active) setGuides([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const list = ["All Guides"];
    const found = new Set();
    guides.forEach((g) => {
      if (g.level && g.level !== "Guide" && !found.has(g.level)) {
        found.add(g.level);
        list.push(g.level);
      }
    });
    if (list.length === 1) {
      list.push("Explainer", "Regulation", "Digital Assets", "Architecture");
    }
    return list;
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCat =
        selectedCategory === "All Guides" ||
        (guide.level || "").toLowerCase() === selectedCategory.toLowerCase() ||
        (guide.tag || "").toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        !searchQuery.trim() ||
        (guide.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.desc || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guide.tag || "").toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [guides, selectedCategory, searchQuery]);

  const handleCopyLink = (id, e) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(`${window.location.origin}/knowledge-hub#${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <SEOHead pageKey="Knowledge Hub" />

      <Breadcrumbs currentPage="Knowledge Hub" onNavigate={onNavigate} />

      {/* Header & Search Hero */}
      <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-10 text-center space-y-5 max-w-4xl mx-auto shadow-sm">
        <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5">
          <Sparkles size={14} /> TOKEN TIMES EDUCATIONAL PLATFORM
        </span>
        <h1 className="font-display-lg text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0C133D] leading-tight">
          Knowledge Hub &amp; Explainer Guides
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Comprehensive explainers on virtual asset regulations, monetary frameworks, digital currencies, tokenized real estate, and cryptographic infrastructure.
        </p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search size={18} className="absolute left-4 top-5.5 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search explainers, laws (GENIUS Act, CLARITY Act), CBDC, ZK-proofs..."
            aria-label="Search knowledge hub guides"
            className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs sm:text-sm font-medium text-[#0C133D] focus:outline-none focus:border-[#D4AF37] shadow-xs"
          />
        </div>
      </Reveal>

      {/* Category Filter Tabs Bar without Background Container */}
      <Reveal as="div" className="w-full pb-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar justify-center py-1" role="tablist">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                  isSelected
                    ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] shadow-sm font-extrabold"
                    : "bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-[#0C133D] border-outline-variant hover:border-[#D4AF37]/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Featured Guides Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-[#0C133D] flex items-center gap-2">
            <BookOpen size={20} className="text-[#D4AF37]" />
            Explainer Curriculum ({filteredGuides.length})
          </h2>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#D4AF37] font-bold hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-on-surface-variant">
            Loading Knowledge Hub guides...
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="p-10 text-center text-sm text-on-surface-variant bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl space-y-2">
            <p className="font-bold text-base text-[#0C133D]">No explainer guides found.</p>
            <p className="text-xs text-on-surface-variant">Try modifying your search keywords or switching category filters.</p>
            <button
              onClick={() => { setSelectedCategory("All Guides"); setSearchQuery(""); }}
              className="mt-2 px-4 py-2 rounded-lg bg-[#0C133D] text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide, i) => {
              const isExpanded = expandedId === guide.id;
              const isLong = (guide.desc || "").length > 280;

              return (
                <Reveal
                  key={guide.id || guide.title + i}
                  as="article"
                  delay={i * 60}
                  className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-[#D4AF37] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-[#0C133D] text-[#D4AF37] font-extrabold text-[10px] rounded-full uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
                        {guide.level}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-data-tabular text-on-surface-variant">{guide.time}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyLink(guide.id, e)}
                          className="p-1 rounded-md text-on-surface-variant hover:text-[#0C133D] hover:bg-surface-container-low transition-colors"
                          title="Copy Link"
                          aria-label="Copy explainer link"
                        >
                          {copiedId === guide.id ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                        </button>
                      </div>
                    </div>

                    <h3 className="font-headline-md text-lg sm:text-xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {guide.title}
                    </h3>

                    <p className={`text-xs sm:text-sm text-on-surface-variant leading-relaxed ${!isExpanded && isLong ? "line-clamp-4" : ""}`}>
                      {guide.desc}
                    </p>

                    {isLong && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(guide.id)}
                        className="text-xs font-bold text-[#0C133D] hover:text-[#D4AF37] inline-flex items-center gap-1 transition-colors cursor-pointer mt-1"
                      >
                        {isExpanded ? (
                          <>Show Less <ChevronUp size={14} /></>
                        ) : (
                          <>Read Full Explanation <ChevronDown size={14} /></>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant text-[11px] font-medium">
                      Tag: <strong className="text-[#0C133D]">{guide.tag}</strong>
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-data-tabular">
                      By {guide.author}
                    </span>
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
