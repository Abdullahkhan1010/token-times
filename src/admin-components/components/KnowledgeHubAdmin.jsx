import React, { useState, useEffect } from "react";
import { HelpCircle, Plus, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getKnowlegeHubs, postKnowlegeHub, deleteKnowlegeHub } from "../../services/knowlege-hub.service";
import PageHeader from "./PageHeader";

export default function KnowledgeHubAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [categoryStr, setCategoryStr] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getKnowlegeHubs();
      setItems(data);
    } catch (err) {
      console.error("Failed to load Knowledge Hub entries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) return;
    setSubmitting(true);
    setMessage(null);

    const tagsArr = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    const categoryArr = categoryStr.split(",").map((c) => c.trim()).filter(Boolean);

    try {
      await postKnowlegeHub({
        question,
        answer,
        author,
        publish_date: publishDate || new Date().toISOString().split("T")[0],
        tags: tagsArr,
        category: categoryArr,
      });
      setMessage({ type: "success", text: "Knowledge Hub entry created successfully!" });
      setQuestion("");
      setAnswer("");
      setAuthor("");
      setPublishDate("");
      setTagsStr("");
      setCategoryStr("");
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create Knowledge Hub entry." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteKnowlegeHub(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: "success", text: "Entry deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete entry." });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Hub Management"
        subtitle="Create and manage educational Q&As, explainers, and curriculum guides."
        message={message}
        onDismissMessage={() => setMessage(null)}
      />

      {/* Add New Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Plus size={18} className="text-accent" /> Add Q&A / Explainer Entry
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Question / Title *</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is FATF Travel Rule Compliance in Crypto?"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Answer / Explainer Content *</label>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Detailed explanation of the concept or regulatory requirement..."
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Compliance Editorial Desk"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Publish Date</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Categories (comma-separated)</label>
            <input
              type="text"
              value={categoryStr}
              onChange={(e) => setCategoryStr(e.target.value)}
              placeholder="e.g. Legal & Compliance, Institutional, Beginner"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="e.g. FATF, Travel Rule, AML"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Create Knowledge Hub Entry"}
          </button>
        </div>
      </form>

      {/* Entries List */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <FileText size={18} className="text-accent" /> Knowledge Hub Entries ({items.length})
        </h3>

        {loading ? (
          <p className="text-xs text-on-surface-variant py-4">Loading entries...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">No entries added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                  <th className="py-2.5 px-3">Question</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Publish Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {items.map((item) => (
                  <tr key={item.id || item.question} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3 font-semibold text-on-surface max-w-xs truncate">{item.question}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.author || "N/A"}</td>
                    <td className="py-3 px-3 text-on-surface-variant">
                      {Array.isArray(item.category) ? item.category.join(", ") : item.category || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.publish_date || "N/A"}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
