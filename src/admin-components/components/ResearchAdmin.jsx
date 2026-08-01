import React, { useState, useEffect, useRef } from "react";
import { FileText, Plus, Trash2, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { getResearches, postResearch, deleteResearch } from "../../services/research.service";
import { uploadFileToS3, ToHref } from "../../services/file.service";

import PageHeader from "./PageHeader";

export default function ResearchAdmin() {
  const fileInputRef = React.useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [file, setFile] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getResearches();
      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          const link = await ToHref(item.file, "research-paper.pdf");
          item.file = link;
        }
      }
      console.log(data);
      setItems(data);
    } catch (err) {
      console.error("Failed to load research papers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) return;
    setSubmitting(true);
    setMessage(null);

    if (!file) {
      setMessage({ type: "error", text: "Please select a file to upload." });
      setSubmitting(false);
      return;
    }
    try {
      const [fileUpload] = await Promise.all([uploadFileToS3(file)]);

      await postResearch({
        title,
        author,
        publish_date: publishDate || new Date().toISOString().split("T")[0],
        file: fileUpload.fileKey,
      });
      setMessage({ type: "success", text: "Research paper added successfully!" });
      setTitle("");
      setAuthor("");
      setPublishDate("");
      setFile(null);
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create research paper." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this research paper?")) return;
    try {
      await deleteResearch(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setMessage({ type: "success", text: "Research paper deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete research paper." });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Research Management"
        subtitle="Publish technical whitepapers, research reports, and macro analytics."
        message={message}
        onDismissMessage={() => setMessage(null)}
      />

      {/* Add New Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Plus size={18} className="text-accent" /> Add Research Paper
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. South Asian Crypto Liquidity Report Q4"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Author *</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Dr. Arshad Khan"
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

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Research Report PDF Attachment <span className="text-rose-500">*</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-xl p-4 text-center bg-surface-bright hover:bg-surface-container-low hover:border-[#D4AF37] transition-all cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {file ? (
                <div className="py-2 flex items-center justify-center gap-3 text-xs font-bold text-[#0C133D]">
                  <BookOpen size={22} className="text-[#D4AF37]" />
                  <span>{file.name}</span>
                  <span className="text-[11px] font-normal text-on-surface-variant">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] ml-2">Change File</span>
                </div>
              ) : (
                <div className="py-3 flex flex-col items-center gap-1.5">
                  <BookOpen size={24} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#0C133D]">Click to upload Research Report PDF</span>
                  <span className="text-[11px] text-on-surface-variant">PDF Document up to 10MB</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Create Research Paper"}
          </button>
        </div>
      </form>

      {/* Research List Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <FileText size={18} className="text-accent" /> Published Papers ({items.length})
        </h3>

        {loading ? (
          <p className="text-xs text-on-surface-variant py-4">Loading research papers...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">No research papers added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3">Publish Date</th>
                  <th className="py-2.5 px-3">File</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {items.map((item) => (
                  <tr key={item._id || item.title} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3 font-semibold text-on-surface">{item.title}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.author}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.publish_date || "N/A"}</td>
                    <td className="py-3 px-3 text-on-surface-variant truncate max-w-[150px]">
                      {item.file ? (
                        <a href={item.file} target="_blank" rel="noreferrer" className="text-accent underline">
                          View PDF
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
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
