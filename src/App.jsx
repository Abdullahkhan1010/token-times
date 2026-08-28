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
import CryptoDetailPage from "./pages/CryptoDetailPage";
import { trackPageVisit, trackArticleClick } from "./services/tracker.service";

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCryptoAsset, setSelectedCryptoAsset] = useState("BTC");
  const changePage = useRouteSync(activePage, setActivePage, setSelectedCryptoAsset);

  const handleNavigate = (page, options) => {
    changePage(page, options);
  };

  // Track page visits
  useEffect(() => {
    if (activePage && activePage !== "ArticleDetail") {
      trackPageVisit(activePage);
    }
  }, [activePage]);

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
    if (article) {
      trackArticleClick(
        article.id,
        article.title,
        Array.isArray(article.category) ? article.category[0] : article.category
      );
    }
    setSelectedArticle(article);
    changePage("ArticleDetail");
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case "ArticleDetail":
        return (
          <ArticleDetailPage
            article={selectedArticle}
            onNavigate={handleNavigate}
            onSelectArticle={handleSelectArticle}
          />
        );
      case "CryptoDetail":
      case "Crypto Detail":
      case "Crypto":
        return (
          <CryptoDetailPage
            initialAsset={selectedCryptoAsset}
            onNavigate={handleNavigate}
            onSelectArticle={handleSelectArticle}
          />
        );
      case "News":
        return <NewsPage onNavigate={handleNavigate} onSelectArticle={handleSelectArticle} />;
      case "Global":
        return <GlobalPage onNavigate={handleNavigate} onSelectArticle={handleSelectArticle} />;
      case "Features":
        return <FeaturesPage onNavigate={handleNavigate} onSelectArticle={handleSelectArticle} />;
      case "Markets":
        return <MarketsPage onNavigate={handleNavigate} onSelectArticle={handleSelectArticle} />;
      case "Opinion":
        return <OpinionPage onNavigate={handleNavigate} onSelectArticle={handleSelectArticle} />;
      case "Policy & Regulation":
      case "Regulations":
        return <RegulationsPage onNavigate={handleNavigate} />;
      case "REIT":
      case "Reit":
        return <ReitPage onNavigate={handleNavigate} onSelectArticle={handleSelectArticle} />;
      case "Learn":
      case "Knowledge Hub":
        return <KnowledgeHubPage onNavigate={handleNavigate} />;
      case "Magazine":
        return <MagazinePage onNavigate={handleNavigate} />;
      case "Research":
        return <ResearchPage onNavigate={handleNavigate} />;
      case "Resources":
        return <ResourcesPage onNavigate={handleNavigate} />;
      case "Events":
        return <EventsPage onNavigate={handleNavigate} />;
      case "About":
        return <AboutPage onNavigate={handleNavigate} />;
      case "Contact":
        return <ContactPage onNavigate={handleNavigate} />;
      case "Privacy Policy":
        return <PrivacyPage onNavigate={handleNavigate} />;
      case "Terms of Service":
        return <TermsPage onNavigate={handleNavigate} />;
      case "Home":
      default:
        return <HomePage onNavigate={handleNavigate} onSelectArticle={handleSelectArticle} />;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-on-background">
      {/* Top Header */}
      <header className="bg-background border-b border-outline-variant/60 sticky top-0 z-50 rounded-none">
        <Header
          activePage={activePage}
          setActivePage={changePage}
          onSelectArticle={handleSelectArticle}
        />
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
