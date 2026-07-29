import React from "react";
import { Archive, ExternalLink } from "lucide-react";
import PageHeader from "./PageHeader";
import ArticleTable from "./ArticleTable";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function Published({ articles, onArchive }) {
  const columns = [
    { key: "title", label: "Title", render: (r) => <span className="font-semibold">{r.title}</span> },
    { key: "category", label: "Category" },
    { key: "author", label: "Author" },
    { key: "publishedAt", label: "Published", render: (r) => <span className="font-data-tabular text-data-tabular">{fmtDate(r.publishedAt)}</span> },
    { key: "views", label: "Views", render: (r) => <span className="font-data-tabular text-data-tabular">{r.views.toLocaleString()}</span> },
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
          { label: "View on site", icon: ExternalLink, onClick: () => {}, tone: "accent" },
          { label: "Move to archive", icon: Archive, onClick: onArchive, tone: "error" },
        ]}
      />
    </>
  );
}
