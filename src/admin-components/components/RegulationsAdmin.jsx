import React, { useState, useEffect, useRef } from "react";
import { Gavel, Plus, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getRegulations, postRegulation, deleteRegulation } from "../../services/regulation.service";
import { uploadFileToS3, ToHref } from "../../services/file.service";
import PageHeader from "./PageHeader";
import MediaUploadInput from "./MediaUploadInput";

export default function RegulationsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [title, setTitle] = useState("");
  const [authority, setAuthority] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getRegulations();
      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          const link = await ToHref(item.file, "regulation.pdf");
          item.file = link;
        }
      }
      setItems(data);
    } catch (err) {
      console.error("Failed to load regulations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !authority) return;

    if (!file && (!fileUrl || !fileUrl.trim())) {
      setMessage({ type: "error", text: "Please select a file to upload or provide a document link." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      let finalFileKey = "";
      if (file) {
        const [fileUpload] = await Promise.all([uploadFileToS3(file)]);
        finalFileKey = fileUpload.fileKey;
      } else if (fileUrl && fileUrl.trim()) {
        finalFileKey = fileUrl.trim();
      }

      await postRegulation({
        title,
        authority,
        publish_date: publishDate || new Date().toISOString().split("T")[0],
        file: finalFileKey,
      });
      setMessage({ type: "success", text: "Regulation added successfully!" });
      setTitle("");
      setAuthority("");
      setPublishDate("");
      setFile(null);
      setFileUrl("");
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to add regulation." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this regulation?")) return;
    try {
      await deleteRegulation(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: "success", text: "Regulation deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete regulation." });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Regulations Management"
        subtitle="Add and manage compliance frameworks and directives."
        message={message}
        onDismissMessage={() => setMessage(null)}
      />

      {/* Add New Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Plus size={18} className="text-accent" /> Add New Regulation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SBP Virtual Asset Licensing Framework 2026"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Authority *</label>
            <input
              type="text"
              required
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              placeholder="e.g. SBP / SECP / PVARA / FBR"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Publish Date</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <MediaUploadInput
              label="Directive PDF Attachment"
              required
              file={file}
              onFileChange={setFile}
              url={fileUrl}
              onUrlChange={setFileUrl}
              accept="application/pdf,.pdf"
              mediaType="file"
              icon={FileText}
              placeholder="https://.../directive.pdf or direct PDF link"
              helperText="PDF Document up to 10MB or direct document URL"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Create Regulation"}
          </button>
        </div>
      </form>

      {/* Regulations List Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <FileText size={18} className="text-accent" /> Existing Regulations ({items.length})
        </h3>

        {loading ? (
          <p className="text-xs text-on-surface-variant py-4">Loading regulations...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">No regulations added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Authority</th>
                  <th className="py-2.5 px-3">Publish Date</th>
                  <th className="py-2.5 px-3">File</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3 font-semibold text-on-surface">{item.title}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.authority}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.publish_date || "N/A"}</td>
                    <td className="py-3 px-3 text-on-surface-variant truncate max-w-[150px]">
                      {item.file ? (
                        <a href={item.file} target="_blank" rel="noreferrer" className="text-accent underline">
                          View File
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
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
