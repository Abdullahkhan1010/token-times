import React from "react";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface w-full py-8 px-4 md:px-12 flex flex-col md:flex-row justify-between items-start border-t border-outline-variant">
      <div className="flex flex-col mb-8 md:mb-0" style={{ maxWidth: 384 }}>
        <h2 className="font-headline-lg text-headline-lg text-inverse-on-surface mb-4">Token Times</h2>
        <p className="font-body-md text-body-md text-surface-variant mb-6">
          © 2024 Token Times. All rights reserved. Financial Intelligence for the Digital Era.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-12 gap-y-6">
        <div className="flex flex-col gap-3">
          {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((t) => (
            <a key={t} className="font-label-caps text-label-caps text-surface-variant hover:text-accent transition-colors" href="#">
              {t}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {["Advertising", "Pakistan Regulatory Tracker", "Research Centre", "Archive"].map((t) => (
            <a key={t} className="font-label-caps text-label-caps text-surface-variant hover:text-accent transition-colors" href="#">
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
