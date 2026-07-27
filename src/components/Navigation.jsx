import React, { useState } from "react";
import { Menu, X, Compass } from "lucide-react";
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

      {/* Mobile Navigation (under md): Hamburger Toggle + Dropdown Drawer */}
      <div className="md:hidden px-4 pb-3">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface transition-colors hover:border-accent"
        >
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-accent" />
            <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
              Menu: <span className="text-accent">{activePage}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            {isOpen ? <X size={20} className="text-accent" /> : <Menu size={20} />}
          </div>
        </button>

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


