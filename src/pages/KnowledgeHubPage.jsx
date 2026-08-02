import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getKnowlegeHubs } from "../services/knowlege-hub.service";

const KNOWLEDGE_CATEGORIES = ["All Guides", "Beginner", "Intermediate", "Advanced", "Regulation", "Architecture"];

export default function KnowledgeHubPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState("All Guides");
  const [searchQuery, setSearchQuery] = useState("");
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    let active = true;
    getKnowlegeHubs()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id || item._id,
            level: Array.isArray(item.category) && item.category.length > 0 ? item.category[0] : "Guide",
            time: item.publish_date || "5 min read",
            title: item.question,
            desc: item.answer,
            tag: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.join(", ") : "General",
          }));
          setGuides(mapped);
        } else {
          setGuides([]);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch knowledge hub guides:", err.message);
        if (active) setGuides([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredGuides = guides.filter((guide) => {
    const matchesCat = selectedCategory === "All Guides" || (guide.level || "").toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = (guide.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || (guide.desc || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10">
      <SEOHead pageKey="Knowledge Hub" />

      <Breadcrumbs currentPage="Knowledge Hub" onNavigate={onNavigate} />

      {/* Header & Search Hero */}
      <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center space-y-6 max-w-4xl mx-auto shadow-sm">
        <span className="font-label-caps text-xs text-[#D4AF37] font-bold uppercase tracking-widest block">
          TOKEN TIMES EDUCATIONAL PLATFORM
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C133D]">
          Knowledge Hub & Explainer Guides
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Master central bank digital currencies, zero-knowledge proofs, and digital asset regulatory frameworks.
        </p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search size={18} className="absolute left-4 top-3.5 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, terms, CBDC, ZK-proofs, Travel Rule..."
            aria-label="Search guides, terms, CBDC, ZK-proofs, Travel Rule"
            className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium text-[#0C133D] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </Reveal>

      {/* Category Pills */}
      <Reveal as="div" className="flex items-center gap-2 overflow-x-auto no-scrollbar justify-center pb-2" role="tablist">
        {KNOWLEDGE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] shadow-sm font-extrabold"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#D4AF37] hover:text-[#0C133D]"
            }`}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      {/* Featured Guides Grid */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-[#0C133D] border-b border-outline-variant pb-2">
          Explainer Guides & Curriculum ({filteredGuides.length})
        </h2>
        {filteredGuides.length === 0 ? (
          <div className="p-8 text-center text-xs text-on-surface-variant bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
            No guides found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide, i) => (
              <Reveal
                key={guide.id || guide.title + i}
                as="article"
                delay={i * 70}
                className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4 shadow-sm hover:border-[#D4AF37]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#0C133D] text-[#D4AF37] font-extrabold text-[10px] rounded-full uppercase tracking-wide border border-[#D4AF37]/40 shadow-sm">
                      {guide.level}
                    </span>
                    <span className="text-xs font-data-tabular text-on-surface-variant">{guide.time}</span>
                  </div>
                  <h3 className="font-headline-md text-xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {guide.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-data-tabular">Tag: {guide.tag}</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#0C133D] text-[#F7F0EB] font-extrabold text-xs group-hover:bg-[#D4AF37] group-hover:text-[#0C133D] transition-all shadow-sm">
                    Read Guide →
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
