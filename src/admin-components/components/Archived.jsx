import React from "react";
import { RotateCcw } from "lucide-react";
import PageHeader from "./PageHeader";
import ArticleTable from "./ArticleTable";

const fmtDate = (iso) => {
  if (!iso) return "Recently";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "Recently"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function Archived({ articles = [], onRestore }) {
  const columns = [
    { key: "title", label: "Title", render: (r) => <span className="font-semibold">{r.title}</span> },
    { key: "category", label: "Category" },
    { key: "reason", label: "Reason", render: (r) => <span className="text-on-surface-variant">{r.reason || "—"}</span> },
    {
      key: "archivedAt",
      label: "Archived",
      render: (r) => (
        <span className="font-data-tabular text-data-tabular">
          {fmtDate(r.archivedAt || r.updatedAt || r.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Archived" subtitle="Retired articles, kept for the record.">
        <span className="font-data-tabular text-data-tabular text-on-surface-variant bg-surface-container-low px-3 py-1 border border-outline-variant">
          {articles.length} archived
        </span>
      </PageHeader>

      <ArticleTable
        rows={articles}
        columns={columns}
        emptyLabel="Nothing archived yet."
        actions={[{ label: "Restore to published", icon: RotateCcw, onClick: onRestore, tone: "accent" }]}
      />
    </>
  );
}
