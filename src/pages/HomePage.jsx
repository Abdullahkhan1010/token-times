import React, { useEffect, useState } from "react";
import SEOHead from "../components/SEOHead";
import Hero from "../components/Hero";
import EditorsPick from "../components/EditorsPick";
import LatestNews from "../components/LatestNews";
import PakistanFocus from "../components/PakistanFocus";
import GlobalHighlights from "../components/GlobalHighlights";
import { RegulatoryBriefings, RegulatoryTracker } from "../components/RegulatoryUpdates";
import MarketsDashboard, { ForexRates } from "../components/MarketsDashboard";
import FeaturedAnalysis from "../components/FeaturedAnalysis";
import KnowledgeHub from "../components/KnowledgeHub";
import MagazineIssue from "../components/MagazineIssue";
import ResearchPapers from "../components/ResearchPapers";
import Interviews from "../components/Interviews";
import UpcomingEvents from "../components/UpcomingEvents";
import Newsletter from "../components/Newsletter";
import Partners from "../components/Partners";
import { getPublishedNews } from "../services/published-news.service";
import { ToHref } from "../services/file.service";

export default function HomePage({ onNavigate }) {

  const [mainStoryData, setMainStoryData] = React.useState(null);
  const [subStoriesData, setSubStoriesData] = React.useState([]);
  const [featuredSpotlightData, setFeaturedSpotlightData] = React.useState([]);
  const [editorsPickData, setEditorsPickData] = React.useState([]);
  const [latestNewsData, setLatestNewsData] = React.useState([]);
  const [pakistanFocusData, setPakistanFocusData] = React.useState([]);
  const [globalHighlightsData, setGlobalHighlightsData] = React.useState([]);
  const [featuredAnalysisData, setFeaturedAnalysisData] = React.useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublishedNews();
        const publishedArticles = data.filter(
          (item) => item.status === "published"
        );

        const resolvedArticles = await Promise.all(
          publishedArticles.map(async (article) => {
            const fileName = `${(article.title || "article")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-") || "article"}.jpg`;

            return {
              ...article,
              image: await ToHref(article.image, fileName),
            };
          })
        );

        const sections = resolvedArticles.reduce((acc, article) => {
          article.display_section?.forEach((section) => {
            if (!acc[section]) acc[section] = [];
            acc[section].push(article);
          });

          return acc;
        }, {});

        setMainStoryData(sections.main_story?.[0] ?? null);
        setSubStoriesData(sections.sub_stories ?? []);
        setFeaturedSpotlightData(sections.featured_spotlight ?? []);
        setEditorsPickData(sections.editor_picks ?? []);
        setLatestNewsData(sections.latest_news ?? []);
        setPakistanFocusData(sections.Pakistan_Focus ?? []);
        setGlobalHighlightsData(sections.Global_Highlight ?? []);
        setFeaturedAnalysisData(sections.featured_analysis ?? []);

      } catch (err) {
        console.error("Failed to load published news for HomePage", err);
      }
    })();
  }, []);

  return (
    <>
      <SEOHead pageKey="Home" />

      {/* Hero Section — top featured stories */}
      <Hero
        featuredspotlight={featuredSpotlightData}
        mainStory={mainStoryData}
        substories={subStoriesData}
      />

      {/* Editor's Pick */}
      <EditorsPick editorsPicks={editorsPickData} />


      {/* Latest News */}
      <LatestNews latestNews={latestNewsData} />

      {/* Pakistan Focus & Global Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PakistanFocus pakistanFocus={pakistanFocusData} />
        <GlobalHighlights globalHighlights={globalHighlightsData} />
      </div>

      {/* Regulatory Updates & Market Dashboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
        <div className="flex flex-col h-full min-h-0">
          <h2 className="font-headline-lg text-headline-lg text-primary section-header-border shrink-0">Regulatory Briefings</h2>
          <div className="flex-1 flex flex-col min-h-0">
            <RegulatoryBriefings />
          </div>
        </div>
        <div className="flex flex-col h-full min-h-0">
          <h2 className="font-headline-lg text-headline-lg text-primary section-header-border shrink-0">Forex Trade Rates</h2>
          <div className="flex-1 flex flex-col min-h-0">
            <ForexRates />
          </div>
        </div>
        <div className="flex flex-col h-full min-h-0">
          <h2 className="font-headline-lg text-headline-lg text-primary section-header-border shrink-0">Crypto Marketplace</h2>
          <div className="flex-1 flex flex-col min-h-0">
            <MarketsDashboard />
          </div>
        </div>
      </div>
      <RegulatoryTracker />

      {/* Featured Analysis & Knowledge Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FeaturedAnalysis fa={featuredAnalysisData[0]} />
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
    </>
  );
}
