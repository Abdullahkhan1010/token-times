import React from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";

export default function PrivacyPage({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <SEOHead pageKey="Privacy Policy" />

      <Breadcrumbs currentPage="Privacy Policy" onNavigate={onNavigate} />

      <Reveal as="div" className="border-b border-outline-variant pb-6 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block">
          LEGAL & COMPLIANCE
        </span>
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
          Privacy Policy
        </h1>
        <p className="text-xs text-on-surface-variant">Last updated: July 2026</p>
      </Reveal>

      <Reveal as="div" className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4 text-xs md:text-sm text-on-surface-variant leading-relaxed">
        <h3 className="text-base font-bold text-[#0C133D]">1. Information Collection</h3>
        <p>
          Token Times collects minimal personal data required to deliver news digests, newsletter subscriptions, and site analytics. We respect reader privacy and do not sell user data to third parties.
        </p>

        <h3 className="text-base font-bold text-[#0C133D]">2. Newsletter & Communications</h3>
        <p>
          When you subscribe to the Daily Sovereign Dispatch, we store your email address securely to send market briefings and breaking news alerts. You can unsubscribe at any time via the link in any dispatch.
        </p>

        <h3 className="text-base font-bold text-[#0C133D]">3. Cookies & Analytics</h3>
        <p>
          We use essential cookies to measure audience traffic and optimize performance across our web platform.
        </p>

        <h3 className="text-base font-bold text-[#0C133D]">4. Contact Us</h3>
        <p>
          For privacy requests or data inquiries, contact <strong className="text-[#0C133D]">privacy@tokentimes.io</strong>.
        </p>
      </Reveal>
    </div>
  );
}
