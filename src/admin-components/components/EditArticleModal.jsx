import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditArticleModal({ article, onClose, onSave }) {
  const [form, setForm] = useState(article);

  useEffect(() => setForm(article), [article]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!article || !form) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(25,28,30,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest border border-outline-variant w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-primary">Edit Article</h3>
          <button aria-label="Close" onClick={onClose} className="p-1 text-on-surface-variant hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <Field label="Title">
            <input
              className="w-full border border-outline-variant px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:border-accent transition-colors"
              value={form.title || ""}
              onChange={update("title")}
            />
          </Field>

          <Field label="Summary">
            <textarea
              rows={5}
              className="w-full border border-outline-variant px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:border-accent transition-colors resize-none"
              value={form.summary || ""}
              onChange={update("summary")}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <input
                className="w-full border border-outline-variant px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:border-accent transition-colors"
                value={form.category || ""}
                onChange={update("category")}
              />
            </Field>
            <Field label="Source">
              <input
                className="w-full border border-outline-variant px-3 py-2 font-body-md text-body-md bg-surface-container-lowest focus:border-accent transition-colors"
                value={form.source || ""}
                onChange={update("source")}
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-outline-variant">
          <button
            onClick={onClose}
            className="font-label-caps text-label-caps px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave?.(form)}
            className="font-label-caps text-label-caps px-4 py-2 bg-accent text-on-accent hover:bg-accent-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}
