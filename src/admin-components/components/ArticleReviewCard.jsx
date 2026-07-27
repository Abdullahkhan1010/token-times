import React from "react";
import { Edit3, X, Check } from "lucide-react";
import StatusBadge from "./StatusBadge";

const ACCENT_BAR = {
  urgent: "bg-error",
  fresh: "bg-secondary",
  "fact-check": "bg-outline",
};

export default function ArticleReviewCard({ article, onEdit, onReject, onApprove, className = "", style }) {
  const { id, priority, confidence, title, summary, source, wide } = article;

  return (
    <article
      className={`hover-lift bg-surface-container-lowest border border-outline-variant hover:border-accent transition-colors p-stack-md flex flex-col h-full relative animate-fade-up ${
        wide ? "flex-col md:flex-row gap-gutter" : ""
      } ${className}`}
      style={style}
    >
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${ACCENT_BAR[priority] || "bg-outline"}`} />

      <div className={`flex-1 pl-2 flex flex-col ${wide ? "" : ""}`}>
        <div className="flex justify-between items-start mb-stack-sm">
          <StatusBadge status={priority} />
          <span className="font-data-tabular text-data-tabular text-on-surface-variant">Conf: {confidence}%</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-primary mb-stack-sm">{title}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md flex-1">{summary}</p>

        {!wide && (
          <div className="flex items-center justify-between mt-auto pt-stack-sm border-t border-surface-container-highest">
            <a className="font-data-tabular text-data-tabular text-accent hover:underline truncate max-w-[200px]" href="#">
              source: {source}
            </a>
            <Actions id={id} onEdit={onEdit} onReject={onReject} onApprove={onApprove} />
          </div>
        )}
      </div>

      {wide && (
        <div className="md:w-64 flex flex-col justify-end pt-stack-sm md:pt-0 md:border-l border-t md:border-t-0 border-surface-container-highest md:pl-stack-md">
          <a className="font-data-tabular text-data-tabular text-accent hover:underline truncate max-w-full mb-stack-sm block" href="#">
            source: {source}
          </a>
          <Actions id={id} onEdit={onEdit} onReject={onReject} onApprove={onApprove} full />
        </div>
      )}
    </article>
  );
}

function Actions({ id, onEdit, onReject, onApprove, full = false }) {
  return (
    <div className={`flex gap-2 ${full ? "w-full mt-auto" : ""}`}>
      <button
        aria-label="Edit"
        onClick={() => onEdit?.(id)}
        className={`p-2 border border-outline-variant hover:bg-surface-container-high transition-colors text-on-surface-variant flex justify-center items-center ${
          full ? "flex-1" : ""
        }`}
      >
        <Edit3 size={18} />
      </button>
      <button
        aria-label="Reject — sends this back to the sourcing agent"
        onClick={() => onReject?.(id)}
        className={`p-2 border border-outline-variant hover:bg-error-container hover:text-error hover:border-error transition-colors text-on-surface-variant flex justify-center items-center ${
          full ? "flex-1" : ""
        }`}
      >
        <X size={18} />
      </button>
      <button
        aria-label="Approve"
        onClick={() => onApprove?.(id)}
        className={`p-2 bg-accent text-on-accent hover:bg-accent-dark transition-colors flex justify-center items-center ${
          full ? "flex-1" : ""
        }`}
      >
        <Check size={18} />
      </button>
    </div>
  );
}
