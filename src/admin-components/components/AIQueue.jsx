import React, { useState } from "react";
import { Filter } from "lucide-react";
import PageHeader from "./PageHeader";
import ArticleReviewCard from "./ArticleReviewCard";
import EditArticleModal from "./EditArticleModal";

/**
 * AI Queue Component - Review pending articles
 * Props:
 *  - queue: array of pending articles (id, title, summary, source, category, fetchedAt, content)
 *  - onApprove(id): called when an article is approved (navigates to published-news form)
 *  - onReject(id): called when an article is rejected
 *  - onEditSave(updatedArticle): called when edits are saved
 *  - onEdit(id): called when edit button is clicked (navigates to published-news form)
 */
export default function AIQueue({ queue, onApprove, onReject, onEditSave, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const editingArticle = queue.find((a) => a.id === editingId || a._id === editingId) || null;

  return (
    <>
      <PageHeader title="Pending Review" subtitle="AI-fetched articles requiring editorial approval.">
        <span className="font-data-tabular text-data-tabular text-on-surface-variant bg-surface-container-low px-3 py-1 border border-outline-variant">
          Queue: {queue.length}
        </span>
        <button className="flex items-center gap-2 font-label-caps text-label-caps text-primary hover:text-accent transition-colors">
          <Filter size={18} /> Filter
        </button>
      </PageHeader>

      {queue.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter">
          {queue.map((article, i) => (
            <ArticleReviewCard
              key={article.id || article._id}
              article={article}
              className={article.wide ? "lg:col-span-12" : "lg:col-span-6"}
              style={{ animationDelay: `${i * 60}ms` }}
              onEdit={() => onEdit?.(article.id || article._id)}
              onReject={onReject}
              onApprove={onApprove}
            />
          ))}
        </div>
      )}

      <EditArticleModal
        article={editingArticle}
        onClose={() => setEditingId(null)}
        onSave={(updated) => {
          onEditSave?.(updated);
          setEditingId(null);
        }}
      />
    </>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-outline-variant p-12 text-center">
      <p className="font-body-md text-body-md text-on-surface-variant">
        Queue is clear — the sourcing agent will drop new articles here as it finds them.
      </p>
    </div>
  );
}
