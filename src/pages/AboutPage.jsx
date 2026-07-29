import React from "react";
import Reveal from "../components/Reveal";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <Reveal as="div" className="border-b border-outline-variant pb-6 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block">
          ABOUT TOKEN TIMES
        </span>
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
          Pakistan's Sovereign Financial & Web3 Intelligence
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed pt-2">
          Token Times is an independent digital media platform dedicated to coverage of virtual assets, sovereign digital infrastructure, blockchain innovation, and regulatory affairs across Pakistan and international markets.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-3">
          <h3 className="text-lg font-bold text-[#0C133D] border-b border-[#D4AF37]/40 pb-2">
            Our Mission
          </h3>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            To empower policymakers, financial institutions, Web3 founders, and investors with accurate, real-time data, rigorous policy research, and objective market journalism.
          </p>
        </Reveal>

        <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-3">
          <h3 className="text-lg font-bold text-[#0C133D] border-b border-[#D4AF37]/40 pb-2">
            Editorial Integrity
          </h3>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            We operate strictly under independent journalism standards. Our reporting is free from commercial bias, sponsored influence, or unverified speculation.
          </p>
        </Reveal>
      </div>

      <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
        <h3 className="text-xl font-bold text-[#0C133D]">Core Coverage Pillars</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-on-surface-variant">
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold">✓</span> State Bank of Pakistan & SECP Virtual Asset Regulation
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold">✓</span> Central Bank Digital Currencies (CBDC) & Digital Rupee
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold">✓</span> Institutional Crypto Market Data & Exchange Intelligence
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] font-bold">✓</span> Islamic Fintech & Shariah-Compliant Tokenomics
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
