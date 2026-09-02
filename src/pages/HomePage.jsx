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
import { ToImageUrl } from "../services/file.service";
import HeroSkeleton from "../components/HeroSkeleton";

export default function HomePage({ onNavigate, onSelectArticle }) {
  const [heroReady, setHeroReady] = useState(false);
  const [mainStoryData, setMainStoryData] = React.useState(null);
  const [topStoryData, setTopStoryData] = React.useState(null);
  const [subStoriesData, setSubStoriesData] = React.useState([]);
  const [featuredSpotlightData, setFeaturedSpotlightData] = React.useState([]);
  const [editorsPickData, setEditorsPickData] = React.useState([]);
  const [latestNewsData, setLatestNewsData] = React.useState([]);
  const [pakistanFocusData, setPakistanFocusData] = React.useState([]);
  const [globalHighlightsData, setGlobalHighlightsData] = React.useState([]);
  const [featuredAnalysisData, setFeaturedAnalysisData] = React.useState([]);
  const [topStoriesData, setTopStoriesData] = React.useState([]);

  useEffect(() => {
    let active = true;

    // Safety timeout: ensure site is visible after max 4.5s even under extreme network latency
    const safetyTimer = setTimeout(() => {
      if (active) setHeroReady(true);
    }, 4500);

    (async () => {
      try {
        const data = await getPublishedNews();
        if (!active) return;

        const publishedArticles = (Array.isArray(data) ? data : [])
          .filter((item) => item.status === "published")
          .sort((a, b) => {
            const dateA = new Date(a.publish_date || a.createdAt || 0);
            const dateB = new Date(b.publish_date || b.createdAt || 0);
            return dateB - dateA;
          });

        const sections = publishedArticles.reduce((acc, article) => {
          article.display_section?.forEach((section) => {
            if (!acc[section]) acc[section] = [];
            acc[section].push(article);
          });
          return acc;
        }, {});

        const rawMain = sections.main_story?.[0] ?? null;
        const rawTopStory = sections.top_story?.[0] || sections.top_stories?.[0] || null;
        const rawSubStories = sections.sub_stories || sections.substories || [];
        const rawSpotlight = (sections.featured_spotlight ?? []).slice(0, 2);

        // Fetch and resolve images ONLY for the main lead story and the 2 featured spotlights
        const [resolvedMain, resolvedSpotlights] = await Promise.all([
          rawMain && rawMain.image && typeof rawMain.image === "string" && !rawMain.image.startsWith("http://") && !rawMain.image.startsWith("https://") && !rawMain.image.startsWith("data:")
            ? ToImageUrl(rawMain.image).then((img) => ({ ...rawMain, image: img })).catch(() => rawMain)
            : Promise.resolve(rawMain),
          Promise.all(
            rawSpotlight.map(async (art) => {
              if (
                art.image &&
                typeof art.image === "string" &&
                !art.image.startsWith("http://") &&
                !art.image.startsWith("https://") &&
                !art.image.startsWith("data:")
              ) {
                try {
                  const img = await ToImageUrl(art.image);
                  return { ...art, image: img };
                } catch {
                  return art;
                }
              }
              return art;
            })
          ),
        ]);

        // Preload and decode images in browser memory before showing website
        const preloadImage = (url) => {
          if (!url || typeof url !== "string") return Promise.resolve();
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            if (img.complete) {
              if (img.decode) {
                img.decode().then(resolve).catch(resolve);
              } else {
                resolve();
              }
            } else {
              img.onload = () => {
                if (img.decode) {
                  img.decode().then(resolve).catch(resolve);
                } else {
                  resolve();
                }
              };
              img.onerror = () => resolve();
            }
          });
        };

        const heroImageUrls = [
          resolvedMain?.image,
          ...resolvedSpotlights.map((s) => s.image),
        ].filter(Boolean);

        await Promise.all(heroImageUrls.map(preloadImage));

        if (active) {
          // Set all sections
          setMainStoryData(resolvedMain);
          setTopStoryData(rawTopStory);
          setSubStoriesData(rawSubStories);
          setFeaturedSpotlightData(resolvedSpotlights);
          setEditorsPickData((sections.editor_picks || sections.editors_pick || []).slice(0, 3));
          setLatestNewsData((sections.latest_news ?? []).slice(0, 4));
          setPakistanFocusData((sections.Pakistan_Focus || sections.pakistan_focus || []).slice(0, 2));
          setGlobalHighlightsData((sections.Global_Highlight || sections.global_highlights || []).slice(0, 2));
          setFeaturedAnalysisData((sections.featured_analysis ?? []).slice(0, 1));

          // Reveal hero section smoothly
          setHeroReady(true);
          clearTimeout(safetyTimer);
        }

      } catch (err) {
        console.error("Failed to load published news for HomePage", err);
        if (active) setHeroReady(true);
      }
    })();

    return () => {
      active = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <>
      <SEOHead pageKey="Home" />

      {/* Subtle Top Accent Progress Bar while Hero Preloads */}
      {!heroReady && (
        <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] overflow-hidden bg-transparent pointer-events-none">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full animate-loader-bar" />
        </div>
      )}

      {/* Hero Section: Render subtle skeleton until hero images & text are 100% preloaded */}
      {!heroReady ? (
        <HeroSkeleton />
      ) : (
        <div className="animate-fade-in">
          <Hero
            featuredspotlight={featuredSpotlightData}
            mainStory={mainStoryData}
            substories={subStoriesData}
            topStory={topStoriesData[0] || topStoryData}
            onSelectArticle={onSelectArticle}
          />
        </div>
      )}

      {/* Editor's Pick */}
      <EditorsPick editorsPicks={editorsPickData} onSelectArticle={onSelectArticle} />


      {/* Latest News */}
      <LatestNews latestNews={latestNewsData} onSelectArticle={onSelectArticle} onNavigate={onNavigate} />

      {/* Pakistan Focus & Global Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
        <PakistanFocus pakistanFocus={pakistanFocusData} onSelectArticle={onSelectArticle} />
        <GlobalHighlights globalHighlights={globalHighlightsData} onSelectArticle={onSelectArticle} />
      </div>

      {/* Regulatory Updates & Market Dashboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
        <div className="flex flex-col w-full">
          <h2 className="font-headline-lg text-headline-lg text-primary section-header-border shrink-0">Regulatory Briefings</h2>
          <div className="w-full">
            <RegulatoryBriefings onNavigate={onNavigate} />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-headline-lg text-headline-lg text-primary section-header-border shrink-0">Forex Trade Rates</h2>
          <div className="w-full">
            <ForexRates />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-headline-lg text-headline-lg text-primary section-header-border shrink-0">Crypto Marketplace</h2>
          <div className="w-full">
            <MarketsDashboard onNavigate={onNavigate} />
          </div>
        </div>
      </div>
      <RegulatoryTracker onNavigate={onNavigate} />

      {/* Featured Analysis & Knowledge Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FeaturedAnalysis fa={featuredAnalysisData[0]} onSelectArticle={onSelectArticle} />
        <KnowledgeHub onNavigate={onNavigate} />
      </div>

      {/* Current Magazine Issue */}
      <MagazineIssue />

      {/* Research, Interviews, Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-outline-variant pt-8 items-start">
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
