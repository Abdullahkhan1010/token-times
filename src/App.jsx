import React from "react";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import BreakingTicker from "./components/BreakingTicker";
import Hero from "./components/Hero";
import EditorsPick from "./components/EditorsPick";
import LatestNews from "./components/LatestNews";
import PakistanFocus from "./components/PakistanFocus";
import GlobalHighlights from "./components/GlobalHighlights";
import { RegulatoryBriefings, RegulatoryTracker } from "./components/RegulatoryUpdates";
import MarketsDashboard, { ForexRates } from "./components/MarketsDashboard";
import FeaturedAnalysis from "./components/FeaturedAnalysis";
import KnowledgeHub from "./components/KnowledgeHub";
import MagazineIssue from "./components/MagazineIssue";
import ResearchPapers from "./components/ResearchPapers";
import Interviews from "./components/Interviews";
import UpcomingEvents from "./components/UpcomingEvents";
import Newsletter from "./components/Newsletter";
import Partners from "./components/Partners";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-on-background">
      {/* Top Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50">
        <Header />
        {/* Navigation Menu */}
        <Navigation />
      </header>

      {/* Breaking News Ticker */}
      <BreakingTicker />

      <main className="flex-grow w-full px-4 md:px-12 py-8">
        {/* Hero Section — top 5 featured stories */}
        <Hero />

        {/* Editor's Pick */}
        <EditorsPick />

        {/* Latest News */}
        <LatestNews />

        {/* Pakistan Focus & Global Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PakistanFocus />
          <GlobalHighlights />
        </div>

        {/* Regulatory Updates & Market Dashboards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4 items-end">
          <div className="pb-2">
            <h2 className="font-headline-lg text-headline-lg text-primary section-header-border">Regulatory Briefings</h2>
          </div>
          <div className="pb-2">
            <h2 className="font-headline-lg text-headline-lg text-primary section-header-border">Forex Trade Rates</h2>
          </div>
          <div className="pb-2">
            <h2 className="font-headline-lg text-headline-lg text-primary section-header-border">Crypto Marketplace</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          <div className="h-full">
            <RegulatoryBriefings />
          </div>
          <div className="h-full">
            <ForexRates />
          </div>
          <div className="h-full">
            <MarketsDashboard />
          </div>
        </div>
        <RegulatoryTracker />

        {/* Featured Analysis & Knowledge Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FeaturedAnalysis />
          <KnowledgeHub />
        </div>

        {/* Current Magazine Issue */}
        <MagazineIssue />

        {/* Research, Interviews, Events */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-outline-variant pt-8">
          <ResearchPapers />
          <Interviews />
          <UpcomingEvents />
        </div>

        {/* Newsletter Subscription */}
        <Newsletter />

        {/* Partners / Sponsors */}
        <Partners />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
