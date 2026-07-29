import React, { useState } from "react";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import BreakingTicker from "./components/BreakingTicker";
import Footer from "./components/Footer";
import SEOHead from "./components/SEOHead";
import { useRouteSync } from "./hooks/useRouteSync";

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
  const changePage = useRouteSync(activePage, setActivePage);

  const renderCurrentPage = () => {
    switch (activePage) {
      case "News":
        return <NewsPage onNavigate={changePage} />;
      case "Magazine":
        return <MagazinePage onNavigate={changePage} />;
      case "Knowledge Hub":
        return <KnowledgeHubPage onNavigate={changePage} />;
      case "Regulations":
        return <RegulationsPage onNavigate={changePage} />;
      case "Research":
        return <ResearchPage onNavigate={changePage} />;
      case "Resources":
        return <ResourcesPage onNavigate={changePage} />;
      case "Events":
        return <EventsPage onNavigate={changePage} />;
      case "Technologies":
        return <TechnologiesPage onNavigate={changePage} />;
      case "About":
        return <AboutPage onNavigate={changePage} />;
      case "Contact":
        return <ContactPage onNavigate={changePage} />;
      case "Privacy Policy":
        return <PrivacyPage onNavigate={changePage} />;
      case "Terms of Service":
        return <TermsPage onNavigate={changePage} />;
      case "Home":
      default:
        return <HomePage onNavigate={changePage} />;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-on-background">
      {/* Top Header */}
      <header className="bg-background border-b border-outline-variant/60 sticky top-0 z-50 rounded-none">
        <Header activePage={activePage} setActivePage={changePage} />
        {/* Navigation Menu */}
        <Navigation activePage={activePage} setActivePage={changePage} />
      </header>

      {/* Breaking News Ticker */}
      <BreakingTicker />

      {/* Main Dynamic Content Area */}
      <main id="main-content" className="flex-grow w-full px-4 md:px-12 py-8" role="main">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer setActivePage={changePage} />
    </div>
  );
}
