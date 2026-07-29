import React, { useState } from "react";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import BreakingTicker from "./components/BreakingTicker";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import MagazinePage from "./pages/MagazinePage";
import KnowledgeHubPage from "./pages/KnowledgeHubPage";
import RegulationsPage from "./pages/RegulationsPage";
import ResearchPage from "./pages/ResearchPage";
import ResourcesPage from "./pages/ResourcesPage";
import EventsPage from "./pages/EventsPage";
import TechnologiesPage from "./pages/TechnologiesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

export default function App() {
  const [activePage, setActivePage] = useState("Home");

  const renderCurrentPage = () => {
    switch (activePage) {
      case "News":
        return <NewsPage />;
      case "Magazine":
        return <MagazinePage />;
      case "Knowledge Hub":
        return <KnowledgeHubPage />;
      case "Regulations":
        return <RegulationsPage />;
      case "Research":
        return <ResearchPage />;
      case "Resources":
        return <ResourcesPage />;
      case "Events":
        return <EventsPage />;
      case "Technologies":
        return <TechnologiesPage />;
      case "About":
        return <AboutPage />;
      case "Contact":
        return <ContactPage />;
      case "Privacy Policy":
        return <PrivacyPage />;
      case "Terms of Service":
        return <TermsPage />;
      case "Home":
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-on-background">
      {/* Top Header */}
      <header className="bg-background border-b border-outline-variant/60 sticky top-0 z-50 rounded-none">
        <Header activePage={activePage} setActivePage={setActivePage} />
        {/* Navigation Menu */}
        <Navigation activePage={activePage} setActivePage={setActivePage} />
      </header>

      {/* Breaking News Ticker */}
      <BreakingTicker />

      <main className="flex-grow w-full px-4 md:px-12 py-8">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
