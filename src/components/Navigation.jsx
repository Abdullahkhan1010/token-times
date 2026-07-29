import React from "react";
import { navLinks } from "../data/content";
import { ROUTE_PATH_MAP } from "../data/seoData";

export default function Navigation({ activePage = "Home", setActivePage }) {
  return (
    <nav className="w-full hidden md:block" aria-label="Main Navigation">
      {/* Desktop Navigation (md and above) */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-4 md:px-12 pb-4">
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
    </nav>
  );
}
