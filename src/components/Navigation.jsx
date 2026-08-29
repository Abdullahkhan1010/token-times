import React, { useState } from "react";
import { navLinks } from "../data/content";
import { ROUTE_PATH_MAP } from "../data/seoData";

export default function Navigation({ activePage = "Home", setActivePage }) {
  const [isUrduSelected, setIsUrduSelected] = useState(() => {
    try {
      return localStorage.getItem("selected_lang") === "ur";
    } catch {
      return false;
    }
  });

  const toggleLanguage = () => {
    setIsUrduSelected((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("selected_lang", next ? "ur" : "en");
      } catch {}
      return next;
    });
  };

  return (
    <nav className="w-full hidden md:block" aria-label="Main Navigation">
      {/* Desktop Navigation (md and above) */}
      <div className="flex items-center justify-between px-4 md:px-12 pb-4">
        {/* Navigation Links */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = activePage === link;
            const hrefPath = ROUTE_PATH_MAP[link] || "/";
            return (
              <a
                key={link}
                href={hrefPath}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (setActivePage) {
                    setActivePage(link);
                  }
                }}
                className={`accent-underline font-label-caps text-label-caps pb-1 whitespace-nowrap transition-colors ${
                  isActive ? "text-[#D4AF37] font-bold is-active" : "text-[#0C133D] hover:text-[#D4AF37]"
                }`}
              >
                {link}
              </a>
            );
          })}
        </div>

        {/* Language Selection Button (positioned directly below Twitter & LinkedIn icons) */}
        <div className="shrink-0 flex items-center pl-4">
          <button
            type="button"
            onClick={toggleLanguage}
            id="lang-toggle-btn"
            aria-label={isUrduSelected ? "Switch to English" : "اردو منتخب کریں"}
            title={isUrduSelected ? "Switch to English" : "اردو منتخب کریں"}
            className="px-3.5 py-1 text-xs font-bold rounded-lg border border-[#0C133D]/20 bg-white/70 hover:bg-[#D4AF37] hover:text-[#0C133D] hover:border-[#D4AF37] text-[#0C133D] transition-all shadow-xs flex items-center justify-center cursor-pointer select-none"
          >
            <span className={isUrduSelected ? "font-sans font-bold tracking-wide" : "font-urdu text-sm leading-none pt-0.5"}>
              {isUrduSelected ? "English" : "اردو"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
