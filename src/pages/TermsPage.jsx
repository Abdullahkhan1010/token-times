import React from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";

export default function TermsPage({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <SEOHead pageKey="Terms of Service" />

      <Breadcrumbs currentPage="Terms of Service" onNavigate={onNavigate} />

      <Reveal as="div" className="border-b border-outline-variant pb-6 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block">
          LEGAL & COMPLIANCE
        </span>
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
          Terms of Service
        </h1>
        <p className="text-xs text-on-surface-variant">Last updated: July 2026</p>
      </Reveal>

      <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 text-xs md:text-sm text-on-surface-variant leading-relaxed">
        <h3 className="text-base font-bold text-[#0C133D]">1. Content & Disclaimer</h3>
        <p>
          Token Times provides virtual asset news, market data, and regulatory commentary strictly for educational and informational purposes. Nothing published on this site constitutes financial, legal, or investment advice.
        </p>

        <h3 className="text-base font-bold text-[#0C133D]">2. Intellectual Property</h3>
        <p>
          All original reporting, whitepapers, analysis, logos, and digital branding published by Token Times are protected by copyright. Reproduction without explicit attribution or written consent is prohibited.
        </p>

        <h3 className="text-base font-bold text-[#0C133D]">3. External Links & Data Feeds</h3>
        <p>
          Our platform may contain links to third-party market resources or external regulatory portals. Token Times is not responsible for external content or third-party market availability.
        </p>
      </Reveal>
    </div>
  );
}
