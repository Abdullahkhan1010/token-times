import React from "react";
import { BASE_URL, ROUTE_PATH_MAP } from "../data/seoData";

/**
 * Accessible Breadcrumbs Component with inline Google BreadcrumbList JSON-LD Schema
 */
export default function Breadcrumbs({ currentPage, category, itemTitle, onNavigate }) {
  const items = [
    { name: "Home", path: "/", key: "Home" },
  ];

  if (currentPage && currentPage !== "Home") {
    items.push({
      name: currentPage,
      path: ROUTE_PATH_MAP[currentPage] || "/",
      key: currentPage,
    });
  }

  if (category) {
    items.push({
      name: category,
      path: `${ROUTE_PATH_MAP[currentPage] || ""}?cat=${encodeURIComponent(category)}`,
      key: category,
    });
  }

  if (itemTitle) {
    items.push({
      name: itemTitle,
      path: "#",
      key: itemTitle,
    });
  }

  // Generate Google BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "#" ? undefined : `${BASE_URL}${item.path}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-col gap-2">
      {/* Inline Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-on-surface-variant font-data-tabular">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.key || index} className="flex items-center gap-1.5">
              {index > 0 && <span className="text-outline-variant select-none">/</span>}
              {isLast ? (
                <span className="font-bold text-[#0C133D] line-clamp-1" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate && onNavigate(item.key)}
                  className="hover:text-[#D4AF37] transition-colors focus:outline-none focus:underline"
                >
                  {item.name}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
