import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X } from "lucide-react";
import { getPublishedNews } from "../services/published-news.service";
import { ToImageUrl } from "../services/file.service";
import {
  heroLead,
  heroSubStories,
  heroLeftArticles,
  editorsPicks,
  latestNews,
  pakistanFocus,
  globalHighlights,
  featuredAnalysis,
} from "../data/content";

const POPULAR_SEARCH_KEYWORDS = [
  "CBDC",
  "Bitcoin",
  "SECP",
  "SBP",
  "Tax",
  "REIT",
  "Web3",
  "Regulations",
  "Stablecoins",
  "Mining",
];

// Helper to escape regular expression characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Highlight matched search keywords inside text
function HighlightedText({ text = "", query = "" }) {
  if (!query || !text) return <span>{text}</span>;

  const tokens = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegExp);

  if (tokens.length === 0) return <span>{text}</span>;

  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  const parts = String(text).split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-[#D4AF37]/30 text-[#0C133D] font-bold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

// Normalize static data into article object shape
function getStaticArticles() {
  const list = [];

  if (heroLead?.title) {
    list.push({
      _id: "static-hero-lead",
      id: "static-hero-lead",
      title: heroLead.title,
      summary: heroLead.summary || "",
      article: heroLead.summary || "",
      category: [heroLead.tag || "Regulation"],
      author: heroLead.author || "T.T. Editorial Board",
      approx_time_to_read: parseInt(heroLead.readTime) || 6,
      image: heroLead.img || "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  }

  (heroSubStories || []).forEach((item, idx) => {
    list.push({
      _id: `static-sub-${idx}`,
      id: `static-sub-${idx}`,
      title: item.title,
      summary: item.title,
      article: item.title,
      category: [item.tag || "General"],
      author: "Token Times Desk",
      approx_time_to_read: 3,
      image: "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  });

  (heroLeftArticles || []).forEach((item, idx) => {
    list.push({
      _id: `static-left-${idx}`,
      id: `static-left-${idx}`,
      title: item.title,
      summary: item.title,
      article: item.title,
      category: [item.tag || "Insights"],
      author: "Token Times Desk",
      approx_time_to_read: parseInt(item.read) || 4,
      image: item.img || "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  });

  (editorsPicks || []).forEach((item, idx) => {
    list.push({
      _id: `static-editors-${idx}`,
      id: `static-editors-${idx}`,
      title: item.title,
      summary: item.desc || "",
      article: item.desc || "",
      category: [item.tag || "Analysis"],
      author: "Editorial Board",
      approx_time_to_read: parseInt(item.read) || 5,
      image: item.img || "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  });

  (latestNews || []).forEach((item, idx) => {
    list.push({
      _id: `static-latest-${idx}`,
      id: `static-latest-${idx}`,
      title: item.title,
      summary: item.title,
      article: item.title,
      category: [item.cat?.split("•")[0]?.trim() || "News"],
      author: "News Desk",
      approx_time_to_read: 3,
      image: item.img || "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  });

  (pakistanFocus || []).forEach((item, idx) => {
    list.push({
      _id: `static-pakistan-${idx}`,
      id: `static-pakistan-${idx}`,
      title: item.title,
      summary: item.desc || "",
      article: item.desc || "",
      category: [item.badge || "Pakistan"],
      author: "Regulatory Desk",
      approx_time_to_read: 3,
      image: "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  });

  (globalHighlights || []).forEach((item, idx) => {
    list.push({
      _id: `static-global-${idx}`,
      id: `static-global-${idx}`,
      title: item.title,
      summary: item.desc || "",
      article: item.desc || "",
      category: [item.region || "Global"],
      author: "Global Desk",
      approx_time_to_read: 3,
      image: "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  });

  if (featuredAnalysis?.title) {
    list.push({
      _id: "static-featured-analysis",
      id: "static-featured-analysis",
      title: featuredAnalysis.title,
      summary: featuredAnalysis.desc || "",
      article: featuredAnalysis.desc || "",
      category: [featuredAnalysis.tag || "Analysis"],
      author: "Lead Analyst",
      approx_time_to_read: 7,
      image: "",
      publishedAt: new Date().toISOString(),
      status: "published",
    });
  }

  return list;
}

export default function HeaderSearch({
  onSelectArticle,
  onCloseMobileMenu,
  isMobile = false,
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [allArticles, setAllArticles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch and cache articles on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const backendData = await getPublishedNews();
        if (!active) return;
        const published = (Array.isArray(backendData) ? backendData : []).filter(
          (a) => a.status === "published"
        );

        const staticList = getStaticArticles();

        // Merge: avoid duplicates by matching lowercase title
        const existingTitles = new Set(published.map((a) => (a.title || "").toLowerCase().trim()));
        const uniqueStatic = staticList.filter(
          (s) => !existingTitles.has((s.title || "").toLowerCase().trim())
        );

        const combined = [...published, ...uniqueStatic];

        // Resolve images for preview
        const resolved = await Promise.all(
          combined.map(async (art) => {
            if (!art.image || typeof art.image !== "string") return art;
            if (
              art.image.startsWith("http://") ||
              art.image.startsWith("https://") ||
              art.image.startsWith("data:")
            ) {
              return art;
            }
            try {
              const url = await ToImageUrl(art.image);
              return { ...art, image: url };
            } catch {
              return art;
            }
          })
        );

        if (active) {
          setAllArticles(resolved);
        }
      } catch (err) {
        console.warn("Failed to pre-load search articles", err);
        if (active) {
          setAllArticles(getStaticArticles());
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Filter and score articles matching the query keywords
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const tokens = trimmed.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    const scored = [];

    for (const article of allArticles) {
      const title = (article.title || "").toLowerCase();
      const summary = (article.summary || article.desc || "").toLowerCase();
      const body = (article.article || article.content || "").toLowerCase();
      const author = (article.author || "").toLowerCase();
      const categories = (
        Array.isArray(article.category)
          ? article.category.join(" ")
          : article.category || ""
      ).toLowerCase();
      const tags = (
        Array.isArray(article.tags) ? article.tags.join(" ") : ""
      ).toLowerCase();
      const headlines = (
        Array.isArray(article.headlines) ? article.headlines.join(" ") : ""
      ).toLowerCase();

      let score = 0;
      let allTokensFound = true;

      // Check full phrase match
      if (title.includes(trimmed)) score += 120;
      if (summary.includes(trimmed)) score += 60;
      if (categories.includes(trimmed) || tags.includes(trimmed)) score += 50;
      if (body.includes(trimmed)) score += 30;

      // Check individual keyword tokens
      for (const token of tokens) {
        let tokenFound = false;

        if (title.includes(token)) {
          score += 40;
          tokenFound = true;
        }
        if (categories.includes(token) || tags.includes(token)) {
          score += 30;
          tokenFound = true;
        }
        if (headlines.includes(token)) {
          score += 25;
          tokenFound = true;
        }
        if (summary.includes(token)) {
          score += 20;
          tokenFound = true;
        }
        if (author.includes(token)) {
          score += 15;
          tokenFound = true;
        }
        if (body.includes(token)) {
          score += 10;
          tokenFound = true;
        }

        if (!tokenFound) {
          allTokensFound = false;
        }
      }

      // Bonus if all searched words appear in the article
      if (allTokensFound) {
        score += 50;
      }

      if (score > 0) {
        scored.push({ article, score });
      }
    }

    // Sort by relevance score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 8).map((s) => s.article);
  }, [query, allArticles]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (article) => {
    if (onSelectArticle && article) {
      onSelectArticle(article);
    }
    setIsOpen(false);
    setQuery("");
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex]);
      } else if (searchResults.length > 0) {
        handleSelect(searchResults[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeywordPillClick = (kw) => {
    setQuery(kw);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={searchContainerRef}
      className={`relative ${isMobile ? "w-full" : "w-64 lg:w-72"}`}
    >
      {/* Search Bar Input Container */}
      <div
        className={`flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${
          isOpen
            ? "border-[#D4AF37] bg-white shadow-md ring-2 ring-[#D4AF37]/20"
            : "border-outline-variant bg-surface-container-low hover:border-[#0C133D]/40"
        }`}
      >
        <Search
          size={16}
          className={`mr-2 shrink-0 transition-colors ${
            isOpen ? "text-[#D4AF37]" : "text-on-surface-variant"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search articles & keywords..."
          className="bg-transparent border-none text-xs md:text-sm text-on-surface w-full focus:outline-none placeholder:text-on-surface-variant/60"
          aria-label="Search articles by keywords"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 text-on-surface-variant/70 hover:text-[#0C133D] rounded-full hover:bg-black/5 transition-colors shrink-0 ml-1"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Live Search Results Dropdown Overlay */}
      {isOpen && (
        <div
          className={`absolute left-0 mt-2 bg-white border border-outline-variant/80 rounded-xl shadow-2xl z-[999] overflow-hidden animate-fade-in ${
            isMobile
              ? "w-full max-w-full"
              : "w-[380px] lg:w-[420px] md:right-0 md:left-auto"
          }`}
        >
          {/* Header Bar inside Dropdown */}
          <div className="px-3.5 py-2.5 bg-[#0C133D] text-white flex items-center justify-between border-b border-white/10 text-xs">
            <span className="font-bold tracking-wide">
              {query.trim()
                ? `Results for "${query.trim()}"`
                : "Article Keyword Search"}
            </span>
            {query.trim() && (
              <span className="text-[11px] text-white/70 bg-white/10 px-2 py-0.5 rounded-full font-medium">
                {searchResults.length} {searchResults.length === 1 ? "match" : "matches"}
              </span>
            )}
          </div>

          {/* Body Content */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-outline-variant/40">
            {/* Empty Query State: Show Popular Keywords */}
            {!query.trim() && (
              <div className="p-4 space-y-3">
                <div className="text-xs font-bold text-[#0C133D] uppercase tracking-wider">
                  Popular Search Keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCH_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleKeywordPillClick(kw)}
                      className="text-xs bg-[#0C133D]/5 hover:bg-[#D4AF37] hover:text-[#0C133D] text-[#0C133D] font-medium px-2.5 py-1 rounded-md border border-outline-variant/60 transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-on-surface-variant pt-1 leading-relaxed">
                  Type any keyword (e.g. <em>SECP, CBDC, Bitcoin, REIT</em>) to search live article titles, summaries, and tags.
                </p>
              </div>
            )}

            {/* Query Entered & Results Found */}
            {query.trim() && searchResults.length > 0 && (
              <div>
                {searchResults.map((article, idx) => {
                  const isHighlighted = selectedIndex === idx;
                  const categoryName = Array.isArray(article.category)
                    ? article.category[0]
                    : article.category || "News";

                  return (
                    <div
                      key={article._id || article.id || idx}
                      onClick={() => handleSelect(article)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                        isHighlighted
                          ? "bg-[#D4AF37]/15 border-l-4 border-[#D4AF37]"
                          : "hover:bg-surface-container-low border-l-4 border-transparent"
                      }`}
                      role="option"
                      aria-selected={isHighlighted}
                    >
                      {/* Thumbnail or Fallback Icon */}
                      <div className="w-12 h-12 rounded-lg bg-[#0C133D]/10 overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant/60">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-[#0C133D]/50 uppercase tracking-tighter">
                            TT
                          </span>
                        )}
                      </div>

                      {/* Info & Content */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#0C133D] text-white">
                            {categoryName}
                          </span>
                          {article.approx_time_to_read && (
                            <span className="text-[10px] text-on-surface-variant">
                              {article.approx_time_to_read} min read
                            </span>
                          )}
                        </div>

                        {/* Title with Keyword Highlight */}
                        <h4 className="text-xs font-bold text-[#0C133D] leading-snug line-clamp-2">
                          <HighlightedText
                            text={article.title}
                            query={query}
                          />
                        </h4>

                        {/* Summary Excerpt */}
                        {(article.summary || article.desc) && (
                          <p className="text-[11px] text-on-surface-variant line-clamp-1 leading-normal">
                            <HighlightedText
                              text={article.summary || article.desc}
                              query={query}
                            />
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Query Entered & No Results Found */}
            {query.trim() && searchResults.length === 0 && (
              <div className="p-6 text-center space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#0C133D]">
                    No articles found matching "{query.trim()}"
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Try searching for broader keywords like <em>crypto, SBP, tax, regulation</em>.
                  </p>
                </div>
                {/* Fallback suggestion pills */}
                <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                  {POPULAR_SEARCH_KEYWORDS.slice(0, 5).map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleKeywordPillClick(kw)}
                      className="text-[11px] bg-[#0C133D]/5 hover:bg-[#D4AF37] hover:text-[#0C133D] text-[#0C133D] font-medium px-2 py-0.5 rounded border border-outline-variant/60 transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dropdown Footer Hint */}
          {query.trim() && searchResults.length > 0 && (
            <div className="px-3 py-2 bg-surface-container-low/60 border-t border-outline-variant/40 text-[10px] text-on-surface-variant flex items-center justify-between">
              <span>Press <strong>Enter</strong> to open selected article</span>
              <span><strong>Esc</strong> to close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
