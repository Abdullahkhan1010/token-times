import React, { useEffect, useState } from "react";
import { Search, Rss, Twitter, Linkedin, Menu, X } from "lucide-react";
import logo from "../assets/TokenTimesLogo.svg";
import { navLinks } from "../data/content";

export default function Header({ activePage = "Home", setActivePage }) {
  const [dateStr, setDateStr] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            Tokens Times
          </span>
        </div>

        {/* Right Spacer for balance */}
        <div className="w-8 shrink-0" />
      </div>

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
                Tokens Times
              </span>
            </div>

            {/* Right Spacer */}
            <div className="w-10 shrink-0" />
          </div>

          {/* Full Screen Menu Content Stream */}
          <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-label-caps text-xs text-[#0C133D] font-bold uppercase tracking-widest block border-b border-outline-variant/40 pb-2">
                MAIN NAVIGATION DIRECTORY
              </span>

              <div className="flex flex-col divide-y divide-outline-variant/30">
                {navLinks.map((link) => {
                  const isActive = activePage === link;
                  return (
                    <button
                      key={link}
                      onClick={() => handleSelectPage(link)}
                      className={`w-full flex items-center justify-between py-3.5 px-2 text-base font-bold font-label-caps tracking-wider uppercase transition-colors text-left ${
                        isActive
                          ? "text-[#0C133D] font-extrabold"
                          : "text-on-surface hover:text-[#0C133D]"
                      }`}
                    >
                      <span>{link}</span>
                      {isActive && (
                        <span className="flex items-center gap-2 text-xs text-[#0C133D] font-bold">
                          ● ACTIVE
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
                Tokens Times Intelligence Platform
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Pakistan's premiere platform for virtual asset regulations, digital currencies, and market analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- DESKTOP HEADER (hidden md:flex) ---------------- */}
      <div className="hidden md:flex justify-between items-center w-full px-4 md:px-12 py-4">
        {/* Logo + date */}
        <div className="flex flex-col min-w-0 gap-2">
          <div
            onClick={() => handleSelectPage("Home")}
            className="flex items-center gap-4 min-w-0 cursor-pointer group"
          >
            <img alt="Token Times logo" className="w-14 h-14 md:w-16 md:h-16 shrink-0 group-hover:scale-105 transition-transform" src={logo} />
            <div className="flex flex-col min-w-0">
              <h1 className="font-display-lg text-display-lg text-[#0C133D] tracking-tighter leading-none truncate group-hover:text-[#0C133D] transition-colors">
                Tokens Times
              </h1>
              <span className="font-label-caps text-label-caps text-on-surface-variant truncate">
                Pakistan's Digital Assets Intelligence Platform
              </span>
            </div>
          </div>
          <span className="font-data-tabular text-data-tabular text-on-surface-variant pl-[4.25rem] md:pl-[5rem]">
            {dateStr}
          </span>
        </div>

        {/* Search and social */}
        <div className="flex items-center gap-gutter">
          <div className="hidden md:flex items-center bg-surface-container-low px-3 py-2 rounded border border-outline-variant focus-within:border-[#0C133D] transition-colors">
            <Search size={16} className="text-on-surface-variant mr-2" />
            <input
              className="bg-transparent border-none text-body-md font-body-md text-on-surface w-48 focus:outline-none"
              placeholder="Search Intel..."
              type="text"
            />
          </div>

          <div className="hidden lg:flex items-center gap-3 pr-3 border-r border-outline-variant">
            <a href="#" aria-label="Twitter" className="text-on-surface-variant hover:text-[#0C133D] transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-on-surface-variant hover:text-[#0C133D] transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="#" aria-label="RSS Feed" className="text-on-surface-variant hover:text-[#0C133D] transition-colors">
              <Rss size={18} />
            </a>
          </div>
        </div>
      </div>


    </div>
  );
}



