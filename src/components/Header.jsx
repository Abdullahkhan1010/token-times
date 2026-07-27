import React, { useEffect, useState } from "react";
import { Search, Rss, Twitter, Linkedin } from "lucide-react";
import logo from "../assets/TokenTimesLogo.svg";

export default function Header({ setActivePage }) {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setDateStr(new Date().toLocaleDateString("en-US", options).toUpperCase());
  }, []);

  return (
    <div className="flex justify-between items-center w-full px-4 md:px-12 py-4">
      {/* Logo + date */}
      <div className="flex flex-col min-w-0 gap-2">
        <div
          onClick={() => {
            if (setActivePage) setActivePage("Home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-4 min-w-0 cursor-pointer group"
        >
          <img alt="Token Times logo" className="w-14 h-14 md:w-16 md:h-16 shrink-0 group-hover:scale-105 transition-transform" src={logo} />
          <div className="flex flex-col min-w-0">
            <h1 className="font-display-lg text-display-lg text-primary tracking-tighter leading-none truncate group-hover:text-accent transition-colors">
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
        <div className="hidden md:flex items-center bg-surface-container-low px-3 py-2 rounded border border-outline-variant focus-within:border-accent transition-colors">
          <Search size={16} className="text-on-surface-variant mr-2" />
          <input
            className="bg-transparent border-none text-body-md font-body-md text-on-surface w-48 focus:outline-none"
            placeholder="Search Intel..."
            type="text"
          />
        </div>

        <div className="hidden lg:flex items-center gap-3 pr-3 border-r border-outline-variant">
          <a href="#" aria-label="Twitter" className="text-on-surface-variant hover:text-accent transition-colors">
            <Twitter size={18} />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-on-surface-variant hover:text-accent transition-colors">
            <Linkedin size={18} />
          </a>
          <a href="#" aria-label="RSS Feed" className="text-on-surface-variant hover:text-accent transition-colors">
            <Rss size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
