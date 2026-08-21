import React, { useState, useEffect } from "react";
import { Archive, ExternalLink } from "lucide-react";
import PageHeader from "./PageHeader";
import ArticleTable from "./ArticleTable";
import { getArticleClickStats } from "../../services/tracker.service";

const fmtDate = (iso) => {
  if (!iso) return "Recently";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "Recently"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function Published({ articles = [], onArchive }) {
  const [articleClicks, setArticleClicks] = useState({});

  useEffect(() => {
    setArticleClicks(getArticleClickStats());
    const handleStorage = () => setArticleClicks(getArticleClickStats());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("token_times_tracker_update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("token_times_tracker_update", handleStorage);
    };
  }, [articles]);

  const getViews = (r) => {
    const id = r._id || r.id;
    const titleKey = r.title ? `title_${r.title.trim().toLowerCase()}` : null;
    const clicksFromTracking =
      (id && articleClicks[id]?.clicks) ||
      (r.id && articleClicks[r.id]?.clicks) ||
      (r._id && articleClicks[r._id]?.clicks) ||
      (titleKey && articleClicks[titleKey]?.clicks) ||
      0;

    return Math.max(clicksFromTracking, r.view_count || r.views || r.clicks || 0);
  };

  const columns = [
    { key: "title", label: "Title", render: (r) => <span className="font-semibold">{r.title}</span> },
    {
      key: "category",
      label: "Category",
      render: (r) => {
        const cat = Array.isArray(r.category) ? r.category.join(", ") : (r.category || "News");
        return <span>{cat}</span>;
      }
    },
    { key: "author", label: "Author", render: (r) => <span>{r.author || "Editorial Desk"}</span> },
    {
      key: "publishedAt",
      label: "Published",
      render: (r) => (
        <span className="font-data-tabular text-data-tabular">
          {fmtDate(r.publishedAt || r.createdAt || r.publish_date || r.created_at)}
        </span>
      )
    },
    {
      key: "views",
      label: "Views",
      render: (r) => (
        <span className="font-data-tabular text-data-tabular">
          {getViews(r)}
        </span>
      )
    },
  ];

  return (
    <>
      <PageHeader title="Published" subtitle="Live articles currently on the site.">
        <span className="font-data-tabular text-data-tabular text-on-surface-variant bg-surface-container-low px-3 py-1 border border-outline-variant">
          {articles.length} live
        </span>
      </PageHeader>

      <ArticleTable
        rows={articles}
        columns={columns}
        emptyLabel="Nothing published yet — approved articles from the AI Queue will appear here."
        actions={[
          {
            label: "View on site",
            icon: ExternalLink,
            onClick: () => {
              if (window.location.hash) {
                window.location.hash = "";
              }
            },
            tone: "accent"
          },
          { label: "Move to archive", icon: Archive, onClick: onArchive, tone: "error" },
        ]}
      />
    </>
  );
}
