import React, { useState, useMemo } from "react";
import PageHeader from "./PageHeader";
import { TrendAreaChart, CategoryBarList } from "./AnalyticsCharts";
import { getPageVisitStats, getArticleClickStats } from "../../services/tracker.service";
import { BarChart3, FileText, Clock, Layers, User, BookOpen, Sparkles, CheckCircle2, Search, Globe, Eye, Compass, TrendingUp, MousePointerClick } from "lucide-react";

export default function Analytics({ published = [], queue = [], archived = [] }) {
  const [timeRange, setTimeRange] = useState(14);
  const [activeTab, setActiveTab] = useState("published"); // 'published' | 'drafts'
  const [searchArticle, setSearchArticle] = useState("");

  // Compute analytics dynamically from real database articles and click tracking
  const analyticsData = useMemo(() => {
    const safePublished = Array.isArray(published) ? published : [];
    const safeQueue = Array.isArray(queue) ? queue : [];
    const safeArchived = Array.isArray(archived) ? archived : [];

    // Real page clicks and article clicks
    const pageVisits = getPageVisitStats();
    const articleClicks = getArticleClickStats();

    const totalClicks = pageVisits.reduce((acc, p) => acc + (p.value || 0), 0);

    // Generate date array for selected range
    const dateLabels = [];
    const publishedCountMap = {};
    const queueCountMap = {};

    const now = new Date();
    for (let i = timeRange - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dateLabels.push({ key, label: formatted });
      publishedCountMap[key] = 0;
      queueCountMap[key] = 0;
    }

    // Category distribution from published database articles
    const categoryCountMap = {};
    safePublished.forEach((art) => {
      const categories = Array.isArray(art.category)
        ? art.category
        : [art.category || "General"];

      categories.forEach((cat) => {
        if (!cat) return;
        const formatted = String(cat)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        categoryCountMap[formatted] = (categoryCountMap[formatted] || 0) + 1;
      });

      // Date bucket
      const artDate = (art.publish_date || art.createdAt || art.fetchedAt || "").split("T")[0];
      if (artDate && publishedCountMap[artDate] !== undefined) {
        publishedCountMap[artDate]++;
      }
    });

    // Queue date distribution
    safeQueue.forEach((draft) => {
      const draftDate = (draft.fetchedAt || draft.createdAt || "").split("T")[0];
      if (draftDate && queueCountMap[draftDate] !== undefined) {
        queueCountMap[draftDate]++;
      }
    });

    const publishedTrend = dateLabels.map((d) => publishedCountMap[d.key] || 0);
    const queueTrend = dateLabels.map((d) => queueCountMap[d.key] || 0);

    const categoriesList = Object.entries(categoryCountMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);

    // Merge articles with real click stats
    const articlesWithClicks = safePublished
      .map((art) => {
        const id = art._id || art.id;
        const clickRecord = articleClicks[id];
        const clicks = clickRecord ? clickRecord.clicks : (art.clicks || art.views || 0);
        return {
          ...art,
          id,
          clicks,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);

    // Calculate editorial stats
    const totalArticles = safePublished.length + safeArchived.length;
    const approvalRate =
      totalArticles + safeQueue.length > 0
        ? Math.round((safePublished.length / (totalArticles + safeQueue.length)) * 100)
        : 0;

    return {
      totalPublished: safePublished.length,
      totalQueue: safeQueue.length,
      totalArchived: safeArchived.length,
      totalClicks,
      approvalRate,
      categoriesCount: categoriesList.length,
      dateLabels,
      publishedTrend,
      queueTrend,
      categoriesList,
      pageVisits,
      articlesList: articlesWithClicks,
    };
  }, [published, queue, archived, timeRange]);

  const filteredArticles = useMemo(() => {
    if (!searchArticle.trim()) return analyticsData.articlesList;
    const query = searchArticle.toLowerCase();
    return analyticsData.articlesList.filter(
      (art) =>
        (art.title || "").toLowerCase().includes(query) ||
        (art.author || "").toLowerCase().includes(query) ||
        String(art.category || "").toLowerCase().includes(query)
    );
  }, [analyticsData.articlesList, searchArticle]);

  const topPage = analyticsData.pageVisits[0]?.value > 0 ? analyticsData.pageVisits[0]?.label : "Home";

  const statCards = [
    {
      label: "Published Articles",
      value: analyticsData.totalPublished,
      desc: "Live in production database",
      icon: FileText,
      color: "text-[#D4AF37]",
      bg: "bg-[#0C133D]",
    },
    {
      label: "Total Page Clicks",
      value: analyticsData.totalClicks,
      desc: "Recorded live visitor clicks",
      icon: MousePointerClick,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Most Visited Section",
      value: topPage,
      desc: "Highest click traffic page",
      icon: Globe,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Pending Review Queue",
      value: analyticsData.totalQueue,
      desc: "Drafts awaiting editorial decision",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader
        badge="Live Database Analytics"
        title="Editorial & Traffic Analytics"
        subtitle="Real-time publishing volume, category breakdown, most visited website pages, and article-wise analytics based on live user clicks."
      >
        {/* Time range selector */}
        <div className="flex items-center bg-white border border-[#E2D4CB] rounded-lg p-0.5 text-xs font-semibold shadow-sm">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                timeRange === days
                  ? "bg-[#0C133D] text-[#D4AF37] shadow-sm font-bold"
                  : "text-[#5C525A] hover:text-[#0C133D]"
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#E2D4CB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C525A]">{card.label}</span>
              <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-3xl font-extrabold text-[#0C133D]">{card.value}</span>
            </div>
            <p className="text-[11px] text-[#5C525A] mt-1 font-medium">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Row 1: Publishing Activity Trend (Independent) & Scrollable Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Chart: Timeline Trend (Independent height) */}
        <div className="lg:col-span-7 bg-white border border-[#E2D4CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2D4CB]">
            <div>
              <h3 className="font-headline-md text-base font-bold text-[#0C133D]">
                {activeTab === "published" ? "Publishing Activity Trend" : "Incoming Drafts Activity"}
              </h3>
              <p className="text-[11px] text-[#5C525A]">
                {activeTab === "published"
                  ? `Articles published daily over the last ${timeRange} days`
                  : `Drafts ingested daily over the last ${timeRange} days`}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#F2E7E1]/60 p-1 rounded-lg border border-[#E2D4CB] text-xs self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("published")}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeTab === "published"
                    ? "bg-[#0C133D] text-[#D4AF37] shadow-sm"
                    : "text-[#5C525A] hover:text-[#0C133D]"
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeTab === "drafts"
                    ? "bg-[#0C133D] text-[#D4AF37] shadow-sm"
                    : "text-[#5C525A] hover:text-[#0C133D]"
                }`}
              >
                AI Queue
              </button>
            </div>
          </div>

          <TrendAreaChart
            data={activeTab === "published" ? analyticsData.publishedTrend : analyticsData.queueTrend}
            labels={analyticsData.dateLabels}
            title={activeTab === "published" ? "Articles Published" : "Drafts Ingested"}
            color={activeTab === "published" ? "#D4AF37" : "#0C133D"}
            height={240}
          />
        </div>

        {/* Right Chart: Scrollable Category Breakdown (Independent height) */}
        <div className="lg:col-span-5 bg-white border border-[#E2D4CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D4CB]">
            <div>
              <h3 className="font-headline-md text-base font-bold text-[#0C133D]">Category Breakdown</h3>
              <p className="text-[11px] text-[#5C525A]">Content distribution across editorial topics</p>
            </div>
            <span className="text-[11px] font-bold text-[#0C133D] bg-[#F2E7E1] px-2 py-0.5 rounded-full border border-[#E2D4CB]">
              {analyticsData.categoriesList.length} Categories
            </span>
          </div>

          {/* Scrollable list so it never stretches out the left card */}
          <CategoryBarList items={analyticsData.categoriesList} maxHeight="290px" />
        </div>
      </div>

      {/* Row 2: Most Visited Pages (Based on Clicks) & Top Clicked Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Most Visited Pages Based on Clicks */}
        <div className="lg:col-span-6 bg-white border border-[#E2D4CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D4CB]">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#D4AF37]" />
              <div>
                <h3 className="font-headline-md text-base font-bold text-[#0C133D]">
                  Most Visited Pages (Based on Clicks)
                </h3>
                <p className="text-[11px] text-[#5C525A]">Pages users visit and click most often (Home, REIT, Opinion, etc.)</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#0C133D] bg-[#F2E7E1] px-2.5 py-1 rounded-full border border-[#E2D4CB]">
              Live Clicks
            </span>
          </div>

          <CategoryBarList items={analyticsData.pageVisits} maxHeight="280px" />
        </div>

        {/* Most Clicked & Read Articles Based on Clicks */}
        <div className="lg:col-span-6 bg-white border border-[#E2D4CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D4CB]">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#D4AF37]" />
              <div>
                <h3 className="font-headline-md text-base font-bold text-[#0C133D]">
                  Most Clicked Articles (Based on Clicks)
                </h3>
                <p className="text-[11px] text-[#5C525A]">Articles live users have opened and clicked most</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#0C133D] bg-[#F2E7E1] px-2.5 py-1 rounded-full border border-[#E2D4CB]">
              {analyticsData.articlesList.length} Total
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
            {analyticsData.articlesList.length === 0 ? (
              <p className="text-center py-8 text-xs text-[#5C525A]">No published articles yet.</p>
            ) : (
              analyticsData.articlesList.slice(0, 6).map((art, idx) => {
                const cat = Array.isArray(art.category) ? art.category[0] : art.category || "News";
                const readTime = art.approx_time_to_read || 4;

                return (
                  <div
                    key={art.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F2E7E1]/40 border border-[#E2D4CB]/60 hover:bg-[#F2E7E1] transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate pr-2">
                      <span className="w-5 h-5 rounded-full bg-[#0C133D] text-[#D4AF37] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-bold text-xs text-[#0C133D] truncate">{art.title || "Untitled"}</p>
                        <p className="text-[10px] text-[#5C525A] flex items-center gap-2 mt-0.5">
                          <span>{art.author || "Editorial Desk"}</span>
                          <span>•</span>
                          <span>{readTime} min read</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-white text-[#0C133D] text-[10px] font-bold uppercase tracking-wider border border-[#E2D4CB]">
                        {String(cat).replace(/_/g, " ")}
                      </span>
                      <span className="bg-[#0C133D] text-[#D4AF37] font-mono font-bold text-[11px] px-2 py-0.5 rounded">
                        {art.clicks || 0} clicks
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Full Article-Wise Analytics Directory Table with Search Filter */}
      <div className="bg-white border border-[#E2D4CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2D4CB]">
          <div>
            <h3 className="font-headline-md text-base font-bold text-[#0C133D]">
              Article-Wise Analytics Directory
            </h3>
            <p className="text-[11px] text-[#5C525A]">
              Detailed breakdown of all published articles ranked by user clicks, categories, and reading times
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#7F707A]">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={searchArticle}
              onChange={(e) => setSearchArticle(e.target.value)}
              placeholder="Search article or author..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F2E7E1]/50 border border-[#E2D4CB] focus:border-[#D4AF37] rounded-lg text-xs text-[#0C133D] outline-none font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0 max-h-[380px] overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_#E2D4CB]">
              <tr className="text-[11px] font-bold text-[#5C525A] uppercase tracking-wider">
                <th className="py-2.5 px-3 bg-white">Article Title</th>
                <th className="py-2.5 px-3 bg-white">Category</th>
                <th className="py-2.5 px-3 bg-white">Author</th>
                <th className="py-2.5 px-3 text-center bg-white">User Clicks</th>
                <th className="py-2.5 px-3 bg-white">Reading Duration</th>
                <th className="py-2.5 px-3 text-right bg-white">Published Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D4CB]/60 text-xs">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5C525A]">
                    {searchArticle ? `No articles matching "${searchArticle}".` : "No published articles available yet."}
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art, i) => {
                  const cat = Array.isArray(art.category)
                    ? art.category[0]
                    : art.category || "General";
                  const formattedCat = String(cat)
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());

                  return (
                    <tr key={art._id || art.id || i} className="hover:bg-[#F2E7E1]/30 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-[#0C133D] line-clamp-1">{art.title || "Untitled"}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#F2E7E1] text-[#0C133D] text-[10px] font-bold uppercase tracking-wider border border-[#E2D4CB]">
                          {formattedCat}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5C525A] font-medium">{art.author || "Editorial Desk"}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-[#0C133D] text-[#D4AF37] font-mono font-bold text-[11px] px-2 py-0.5 rounded">
                          {art.clicks || 0}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5C525A] font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} className="text-[#D4AF37]" />
                          {art.approx_time_to_read || 3} min read
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#5C525A] text-[11px]">
                        {(art.publish_date || art.createdAt || "Recent").split("T")[0]}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
