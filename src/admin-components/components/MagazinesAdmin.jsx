import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Plus, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getMagzines, postMagzine, deleteMagzine } from "../../services/magzine.service";
import { uploadFileToS3, ToHref } from "../../services/file.service";

export default function MagazinesAdmin() {
  const coverImgInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [title, setTitle] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [issueName, setIssueName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [file, setFile] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMagzines();
      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          const link = await ToHref(item.file, "magazine.pdf");
          item.file = link;
        }
      }
      setItems(data);
    } catch (err) {
      console.error("Failed to load magazines", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !issueName) return;
    setSubmitting(true);
    setMessage(null);

    if (!coverImg) {
      setMessage({ type: "error", text: "Please select a cover image." });
      setSubmitting(false);
      return;
    }

    if (!file) {
      setMessage({ type: "error", text: "Please select a digital edition PDF file." });
      setSubmitting(false);
      return;
    }

    try {

      const [coverImgUpload, fileUpload] = await Promise.all([
        uploadFileToS3(coverImg),
        uploadFileToS3(file),
      ]);


      await postMagzine({
        title,
        cover_img: coverImgUpload.fileKey,
        description,
        price: Number(price) || 0,
        issue_name: issueName,
        publish_date: publishDate || new Date().toISOString().split("T")[0],
        file: fileUpload.fileKey,
      });
      setMessage({ type: "success", text: "Magazine issue added successfully!" });
      setTitle("");
      setCoverImg(null);
      setDescription("");
      setPrice(0);
      setIssueName("");
      setPublishDate("");
      setFile(null);
      if (coverImgInputRef.current) {
        coverImgInputRef.current.value = "";
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create magazine issue." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this magazine issue?")) return;
    try {
      await deleteMagzine(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setMessage({ type: "success", text: "Magazine issue deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete magazine issue." });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
            <BookOpen size={24} className="text-accent" /> Magazine Management
          </h2>
          <p className="text-xs text-on-surface-variant">Publish quarterly print and digital magazine issues.</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-xs font-semibold flex items-center gap-2 ${message.type === "success"
            ? "bg-green-500/10 text-green-700 border border-green-500/20"
            : "bg-red-500/10 text-red-700 border border-red-500/20"
            }`}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Add New Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Plus size={18} className="text-accent" /> Add Magazine Issue
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Dawn of CBDCs in South Asia"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Issue Name / Number *</label>
            <input
              type="text"
              required
              value={issueName}
              onChange={(e) => setIssueName(e.target.value)}
              placeholder="e.g. Issue #14 - Q4 2026 Edition"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Cover Image URL</label>
            <input
              type="file"
              accept="image/*"
              required
              ref={coverImgInputRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setCoverImg(null);
                  return;
                }

                try {
                  setCoverImg(file);
                } catch (error) {
                  console.error(error);
                  setCoverImg(null);
                  setMessage({ type: "error", text: "Failed to process the selected image." });
                }
              }}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Price ($ or PKR)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15.00"
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
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Digital Edition PDF File URL</label>
            <input
              type="file"
              accept="application/pdf"
              required
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setFile(null);
                  return;
                }
                setFile(file);
              }}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Description / Editorial Summary</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Executive summary of articles and featured interviews in this issue..."
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
            {submitting ? "Saving..." : "Create Magazine Issue"}
          </button>
        </div>
      </form>

      {/* Magazines List Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <FileText size={18} className="text-accent" /> Published Issues ({items.length})
        </h3>

        {loading ? (
          <p className="text-xs text-on-surface-variant py-4">Loading magazine issues...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">No magazine issues added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                  <th className="py-2.5 px-3">Issue</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Publish Date</th>
                  <th className="py-2.5 px-3">File</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3 font-semibold text-accent">{item.issue_name}</td>
                    <td className="py-3 px-3 font-semibold text-on-surface">{item.title}</td>
                    <td className="py-3 px-3 text-on-surface-variant font-data-tabular">${item.price}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.publish_date || "N/A"}</td>
                    <td className="py-3 px-3 text-on-surface-variant truncate max-w-[120px]">
                      {item.file ? (
                        <a href={item.file} target="_blank" rel="noreferrer" className="text-accent underline">
                          Magzine PDF
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
