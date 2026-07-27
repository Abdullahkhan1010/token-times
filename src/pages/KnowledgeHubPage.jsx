import React, { useState } from "react";
import { Search } from "lucide-react";
import Reveal from "../components/Reveal";
import { knowledgeHubPageData } from "../data/pagesData";

export default function KnowledgeHubPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Guides");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = knowledgeHubPageData.featuredGuides.filter((guide) => {
    const matchesCat = selectedCategory === "All Guides" || guide.level.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || guide.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header & Search Hero */}
      <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center space-y-6 max-w-4xl mx-auto shadow-sm">
        <span className="font-label-caps text-xs text-accent font-bold uppercase tracking-widest block">
          TOKEN TIMES EDUCATIONAL PLATFORM
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface">
          {knowledgeHubPageData.hero.title}
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          {knowledgeHubPageData.hero.subtitle}
        </p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search size={18} className="absolute left-4 top-3.5 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, terms, CBDC, ZK-proofs, Travel Rule..."
            className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-accent"
          />
        </div>
      </Reveal>

      {/* Category Pills */}
      <Reveal as="div" className="flex items-center gap-2 overflow-x-auto no-scrollbar justify-center pb-2">
        {knowledgeHubPageData.categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? "bg-accent text-on-accent border-accent shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-accent hover:text-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      {/* Featured Guides Grid */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-primary border-b border-outline-variant pb-2">
          Explainer Guides & Curriculum
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide, i) => (
            <Reveal
              key={guide.title}
              as="article"
              delay={i * 70}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-accent/10 text-accent font-bold text-[10px] rounded-full uppercase tracking-wide border border-accent/20">
                    {guide.level}
                  </span>
                  <span className="text-xs font-data-tabular text-on-surface-variant">{guide.time}</span>
                </div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface group-hover:text-accent transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {guide.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-accent font-semibold">
                <span>Tag: {guide.tag}</span>
                <span className="group-hover:translate-x-1 transition-transform">Read Guide →</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Glossary & Dictionary Section */}
      <Reveal as="section" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <h3 className="font-headline-sm text-lg font-bold text-primary">Web3 & Legal Glossary</h3>
          <span className="text-xs text-on-surface-variant font-data-tabular">Quick Reference Dictionary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {knowledgeHubPageData.glossary.map((item) => (
            <div key={item.term} className="p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-1">
              <span className="font-bold text-accent text-sm font-data-tabular block">{item.term}</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.definition}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
