import React from "react";

const STYLES = {
  urgent: "text-error bg-error-container",
  fresh: "text-on-secondary-container bg-secondary-container",
  "fact-check": "text-on-surface-variant bg-surface-container-high border border-outline-variant",
  published: "text-on-accent bg-accent",
  archived: "text-on-surface-variant bg-surface-container-high border border-outline-variant",
};

const LABELS = {
  urgent: "URGENT",
  fresh: "FRESH",
  "fact-check": "REQUIRES FACT-CHECK",
  published: "PUBLISHED",
  archived: "ARCHIVED",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`font-label-caps text-label-caps px-2 py-0.5 inline-block ${STYLES[status] || STYLES.archived}`}>
      {LABELS[status] || status?.toUpperCase()}
    </span>
  );
}
