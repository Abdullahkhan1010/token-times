import React, { useEffect, useState } from "react";
import { Search, Linkedin, Menu, X } from "lucide-react";
import logo from "../assets/TokenTimesLogo.svg";
import { navLinks } from "../data/content";
import HeaderSearch from "./HeaderSearch";

export default function Header({ activePage = "Home", setActivePage, onSelectArticle }) {
  const [dateStr, setDateStr] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setDateStr(new Date().toLocaleDateString("en-US", options).toUpperCase());
  }, []);

  // Lock body scroll when mobile full-screen menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSelectPage = (link) => {
    if (setActivePage) {
      setActivePage(link);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <div className="w-full">
      {/* ---------------- SINGLE MOBILE STICKY HEADER BAR (md:hidden) ---------------- */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-background border-b border-outline-variant rounded-none">
        {/* Left: Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Navigation Menu"
          className="p-1.5 text-on-surface hover:text-[#0C133D] transition-colors flex items-center justify-center rounded-lg"
        >
          <Menu size={24} />
        </button>

        {/* Center: Logo & Publication Title */}
        <div
          onClick={() => handleSelectPage("Home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img alt="Token Times logo" className="w-7 h-7 shrink-0" src={logo} />
          <span className="font-display-lg text-lg font-bold tracking-tight text-[#0C133D] uppercase group-hover:text-[#0C133D] transition-colors">
            Token Times
          </span>
        </div>

        {/* Right: Search Toggle Button */}
        <button
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          aria-label="Toggle Search"
          className={`p-1.5 transition-colors flex items-center justify-center rounded-lg ${mobileSearchOpen ? "text-[#D4AF37] bg-[#0C133D]/5" : "text-on-surface hover:text-[#0C133D]"
            }`}
        >
          <Search size={22} />
        </button>
      </div>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/60 animate-fade-in">
          <HeaderSearch
            onSelectArticle={onSelectArticle}
            isMobile={true}
            onCloseMobileMenu={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* ---------------- FULL SCREEN MOBILE SLIDE-IN MENU FROM LEFT (md:hidden) ---------------- */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background flex flex-col w-screen h-screen overflow-y-auto animate-fade-up">

          {/* Menu Drawer Header Bar */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-outline-variant shrink-0">
            {/* Left: Cross / Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation Menu"
              className="p-2 text-on-surface hover:text-[#0C133D] transition-colors flex items-center justify-center rounded-lg border border-outline-variant/60"
            >
              <X size={24} className="text-[#0C133D]" />
            </button>

            {/* Center: Title & Logo */}
            <div
              onClick={() => handleSelectPage("Home")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img alt="Token Times logo" className="w-7 h-7 shrink-0" src={logo} />
              <span className="font-display-lg text-lg font-bold tracking-tight text-[#0C133D] uppercase">
                Token Times
              </span>
            </div>

            {/* Right Spacer */}
            <div className="w-10 shrink-0" />
          </div>

          {/* Full Screen Menu Content Stream */}
          <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* In-Drawer Mobile Search Bar */}
              <div className="pb-1">
                <span className="font-label-caps text-xs text-[#0C133D] font-bold uppercase tracking-widest block mb-2">
                  SEARCH INTEL & KEYWORDS
                </span>
                <HeaderSearch
                  onSelectArticle={onSelectArticle}
                  isMobile={true}
                  onCloseMobileMenu={() => setMobileMenuOpen(false)}
                />
              </div>

              <span className="font-label-caps text-xs text-[#0C133D] font-bold uppercase tracking-widest block border-b border-outline-variant/40 pb-2 pt-2">
                MAIN NAVIGATION DIRECTORY
              </span>

              <div className="flex flex-col divide-y divide-outline-variant/30">
                {navLinks.map((link) => {
                  const isActive = activePage === link;
                  return (
                    <button
                      key={link}
                      onClick={() => handleSelectPage(link)}
                      className={`w-full flex items-center justify-between py-3.5 px-2 text-base font-bold font-label-caps tracking-wider uppercase transition-colors text-left ${isActive
                        ? "text-[#0C133D] font-extrabold"
                        : "text-on-surface hover:text-[#0C133D]"
                        }`}
                    >
                      <span>{link}</span>
                      {isActive && (
                        <span className="text-xs text-[#0C133D] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Info inside Fullscreen Mobile Drawer */}
            <div className="pt-4 border-t border-outline-variant/40 text-xs text-on-surface-variant space-y-2">
              <span className="font-label-caps text-[11px] font-bold text-[#0C133D] block uppercase">
                Token Times Intelligence Platform
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Pakistan's premiere platform for virtual asset regulations, digital currencies, and market analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- DESKTOP HEADER (hidden md:flex) ---------------- */}
      <div className="hidden md:flex justify-between items-center w-full px-4 md:px-12 py-5">
        {/* Logo + date */}
        <div className="flex items-center gap-4 min-w-0">
          <img
            alt="Token Times logo"
            className="w-14 h-14 md:w-16 md:h-16 shrink-0 cursor-pointer hover:scale-105 transition-transform"
            src={logo}
            onClick={() => handleSelectPage("Home")}
          />
          <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => handleSelectPage("Home")}>
            <h1 className="font-display-lg text-3xl md:text-5xl font-extrabold text-[#0C133D] tracking-tight leading-none truncate uppercase font-serif">
              Token Times
            </h1>
            <span className="font-label-caps text-xs text-on-surface-variant tracking-widest truncate mt-1 font-bold pl-2">
              Gateway to the Digital Asset Economy
            </span>
            <span className="font-data-tabular text-xs font-bold text-[#0C133D] tracking-wider mt-0.5 block pl-2">
              {dateStr}
            </span>
          </div>
        </div>

        {/* Search and social */}
        <div className="flex items-center gap-4">
          <HeaderSearch onSelectArticle={onSelectArticle} />

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://twitter.com/TokenTimesIO"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="text-on-surface-variant hover:text-[#0C133D] transition-colors p-1"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/tokentimes"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-on-surface-variant hover:text-[#0C133D] transition-colors p-1"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
