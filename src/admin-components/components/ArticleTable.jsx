import React from "react";

/**
 * columns: [{ key, label, render?(row) }]
 * actions: [{ label, icon: LucideIcon, onClick(row), tone?: "accent" | "error" | "neutral" }]
 */
export default function ArticleTable({ rows, columns, actions = [], emptyLabel = "Nothing here yet." }) {
  if (!rows.length) {
    return (
      <div className="border border-dashed border-outline-variant p-12 text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant bg-surface-container-lowest overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant font-label-caps text-label-caps text-on-surface-variant">
            {columns.map((c) => (
              <th key={c.key} className="px-6 py-3 font-semibold uppercase">
                {c.label}
              </th>
            ))}
            {actions.length > 0 && <th className="px-6 py-3 font-semibold uppercase text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="font-body-md text-body-md text-on-surface">
          {rows.map((row, i) => (
            <tr
              key={row.id || row._id || row.title || i}
              className={`hover:bg-surface-container-low transition-colors animate-fade-up ${
                i < rows.length - 1 ? "border-b border-outline-variant" : ""
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-6 py-4">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {actions.map((a) => (
                      <button
                        key={a.label}
                        aria-label={a.label}
                        onClick={() => a.onClick(row)}
                        className={`p-2 border transition-colors flex items-center justify-center ${
                          a.tone === "error"
                            ? "border-outline-variant text-on-surface-variant hover:bg-error-container hover:text-error hover:border-error"
                            : a.tone === "accent"
                            ? "border-outline-variant text-on-surface-variant hover:bg-accent hover:text-on-accent hover:border-accent"
                            : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                      >
                        <a.icon size={16} />
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
