import React, { useState, useEffect } from "react";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import BreakingTicker from "./components/BreakingTicker";
import Footer from "./components/Footer";
import SEOHead from "./components/SEOHead";
import { useRouteSync } from "./hooks/useRouteSync";

import { getPublishedNews } from "./services/published-news.service";
import { getRegulations } from "./services/regulation.service";
import { getKnowlegeHubs } from "./services/knowlege-hub.service";
import { getEvents } from "./services/event.service";
import { getResearches } from "./services/research.service";
import { getInterviews } from "./services/interview.service";
import { getMagzines } from "./services/magzine.service";

import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import GlobalPage from "./pages/GlobalPage";
import FeaturesPage from "./pages/FeaturesPage";
import MarketsPage from "./pages/MarketsPage";
import OpinionPage from "./pages/OpinionPage";
import MagazinePage from "./pages/MagazinePage";
import KnowledgeHubPage from "./pages/KnowledgeHubPage";
import RegulationsPage from "./pages/RegulationsPage";
import ReitPage from "./pages/ReitPage";
import ResearchPage from "./pages/ResearchPage";
import ResourcesPage from "./pages/ResourcesPage";
import EventsPage from "./pages/EventsPage";

import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const changePage = useRouteSync(activePage, setActivePage);

  useEffect(() => {
    // Pre-warm data cache asynchronously on initial site mount
    getPublishedNews().catch(() => { });
    getRegulations().catch(() => { });
    getKnowlegeHubs().catch(() => { });
    getEvents().catch(() => { });
    getResearches().catch(() => { });
    getInterviews().catch(() => { });
    getMagzines().catch(() => { });
  }, []);

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    changePage("ArticleDetail");
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case "ArticleDetail":
        return (
          <ArticleDetailPage
            article={selectedArticle}
            onNavigate={changePage}
            onSelectArticle={handleSelectArticle}
          />
        );
      case "News":
        return <NewsPage onNavigate={changePage} onSelectArticle={handleSelectArticle} />;
      case "Global":
        return <GlobalPage onNavigate={changePage} onSelectArticle={handleSelectArticle} />;
      case "Features":
        return <FeaturesPage onNavigate={changePage} onSelectArticle={handleSelectArticle} />;
      case "Markets":
        return <MarketsPage onNavigate={changePage} onSelectArticle={handleSelectArticle} />;
      case "Opinion":
        return <OpinionPage onNavigate={changePage} onSelectArticle={handleSelectArticle} />;
      case "Policy & Regulation":
      case "Regulations":
        return <RegulationsPage onNavigate={changePage} />;
      case "REIT":
      case "Reit":
        return <ReitPage onNavigate={changePage} onSelectArticle={handleSelectArticle} />;
      case "Learn":
      case "Knowledge Hub":
        return <KnowledgeHubPage onNavigate={changePage} />;
      case "Magazine":
        return <MagazinePage onNavigate={changePage} />;
      case "Research":
        return <ResearchPage onNavigate={changePage} />;
      case "Resources":
        return <ResourcesPage onNavigate={changePage} />;
      case "Events":
        return <EventsPage onNavigate={changePage} />;
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
        return <HomePage onNavigate={changePage} onSelectArticle={handleSelectArticle} />;
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
