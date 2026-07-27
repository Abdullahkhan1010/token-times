import React from "react";

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary w-full py-10 px-4 md:px-12 flex flex-col md:flex-row justify-between items-start border-t border-outline-variant/30">
      <div className="flex flex-col mb-8 md:mb-0 max-w-sm space-y-3">
        <h2 className="font-headline-lg text-2xl font-bold text-on-primary">Tokens Times</h2>
        <p className="font-body-md text-xs text-on-primary-container leading-relaxed">
          © 2026 Token Times. All rights reserved. Pakistan's Digital Assets & Sovereign Financial Intelligence Platform.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-12 gap-y-6">
        <div className="flex flex-col gap-3">
          {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((t) => (
            <a key={t} className="font-label-caps text-xs text-surface-container-high hover:text-accent transition-colors" href="#">
              {t}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {["Advertising", "Pakistan Regulatory Tracker", "Research Centre", "Archive"].map((t) => (
            <a key={t} className="font-label-caps text-xs text-surface-container-high hover:text-accent transition-colors" href="#">
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

