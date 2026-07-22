import React, { useState } from "react";
import { navLinks } from "../data/content";

export default function Navigation() {
  const [active, setActive] = useState("Home");

  return (
    <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar px-4 md:px-12 pb-4">
      {navLinks.map((link) => (
        <a
          key={link}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActive(link);
          }}
          className={`accent-underline font-label-caps text-label-caps pb-1 whitespace-nowrap transition-colors ${
            active === link ? "text-primary is-active" : "text-on-surface-variant hover:text-primary"
          }`}
        >
          {link}
        </a>
      ))}
    </nav>
  );
}
