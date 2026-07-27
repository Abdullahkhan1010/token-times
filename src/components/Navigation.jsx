import React from "react";
import { navLinks } from "../data/content";

export default function Navigation({ activePage = "Home", setActivePage }) {
  return (
    <nav className="w-full hidden md:block">
      {/* Desktop Navigation (md and above) */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-4 md:px-12 pb-4">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (setActivePage) {
                setActivePage(link);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`accent-underline font-label-caps text-label-caps pb-1 whitespace-nowrap transition-colors ${
              activePage === link ? "text-[#D4AF37] font-bold is-active" : "text-[#0C133D] hover:text-[#D4AF37]"
            }`}

          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}




