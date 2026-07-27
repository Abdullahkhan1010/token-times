import React from "react";
import { Newspaper, BookOpen, Archive } from "lucide-react";
import PageHeader from "./PageHeader";

export default function AdminHome({ queueCount, publishedCount, archivedCount, onNavigate }) {
  const cards = [
    { key: "queue", label: "Pending Review", value: queueCount, icon: Newspaper, desc: "Articles waiting on an editorial decision." },
    { key: "published", label: "Published", value: publishedCount, icon: BookOpen, desc: "Live on the site right now." },
    { key: "archived", label: "Archived", value: archivedCount, icon: Archive, desc: "Retired articles kept for the record." },
  ];

  return (
    <>
      <PageHeader title="Overview" subtitle="A quick snapshot of the editorial pipeline." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        {cards.map((c, i) => (
          <button
            key={c.key}
            onClick={() => onNavigate?.(c.key)}
            className="hover-lift text-left bg-surface-container-lowest border border-outline-variant p-6 animate-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <c.icon size={24} className="text-accent mb-4" />
            <p className="font-headline-lg text-headline-lg text-primary mb-1">{c.value}</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{c.label}</p>
            <p className="font-body-md text-body-md text-on-surface-variant" style={{ fontSize: 14 }}>
              {c.desc}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}
