import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "../data/content";

export default function Navigation({ activePage = "Home", setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (link) => {
    if (setActivePage) {
      setActivePage(link);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="w-full">
      {/* Desktop Navigation (md and above) */}
      <div className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar px-4 md:px-12 pb-4">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleSelect(link);
            }}
            className={`accent-underline font-label-caps text-label-caps pb-1 whitespace-nowrap transition-colors ${
              activePage === link ? "text-primary is-active" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Mobile Navigation (under md): Icon on Left, Current Page Name */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Hamburger Icon Button on Left */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface transition-colors hover:border-accent flex items-center justify-center shrink-0 shadow-sm"
          >
            {isOpen ? <X size={22} className="text-accent" /> : <Menu size={22} className="text-on-surface" />}
          </button>

          {/* Display Current Page Name */}
          <div className="flex-grow px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between shadow-sm">
            <span className="font-headline-sm text-sm font-bold text-primary uppercase tracking-wider">
              {activePage}
            </span>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isOpen && (
          <div className="mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-2 shadow-xl animate-fade-up space-y-1">
            {navLinks.map((link) => {
              const isActive = activePage === link;
              return (
                <button
                  key={link}
                  onClick={() => handleSelect(link)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold font-label-caps transition-all text-left ${
                    isActive
                      ? "bg-accent text-on-accent shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  }`}
                >
                  <span className="uppercase tracking-wider">{link}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-on-accent" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}



