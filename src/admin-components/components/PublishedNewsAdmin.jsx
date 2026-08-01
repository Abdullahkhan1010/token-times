import React, { useState, useEffect, useRef } from "react";
import { Newspaper, Plus, Trash2, FileText, CheckCircle2, AlertCircle, Archive, X } from "lucide-react";
import { getPublishedNews, postPublishedNews, putPublishedNews, deletePublishedNews, archivePublishedNews } from "../../services/published-news.service";
import { uploadFileToS3 } from "../../services/file.service";
import { requestJson } from "../../services/api";

const DISPLAY_SECTIONS = [
    { value: "featured_spotlight", label: "Featured Spotlight" },
    { value: "main_story", label: "Main Story" },
    { value: "sub_stories", label: "Sub Stories" },
    { value: "editor_picks", label: "Editor's Picks" },
    { value: "latest_news", label: "Latest News" },
    { value: "Pakistan_Focus", label: "Pakistan Focus" },
    { value: "Global_Highlight", label: "Global Highlight" },
    { value: "featured_analysis", label: "Featured Analysis" },
];

export default function PublishedNewsAdmin({ draftData = null, onPublishComplete = null, onCancel = null }) {
    const imageInputRef = useRef(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [draftId, setDraftId] = useState(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [article, setArticle] = useState("");
    const [summary, setSummary] = useState("");
    const [author, setAuthor] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [approxTimeToRead, setApproxTimeToRead] = useState("");
    const [categoryStr, setCategoryStr] = useState("");
    const [tagsStr, setTagsStr] = useState("");
    const [headlinesStr, setHeadlinesStr] = useState("");
    const [displaySections, setDisplaySections] = useState([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getPublishedNews();
            setItems(data);
        } catch (err) {
            console.error("Failed to load published news", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Populate form with draft data when provided
        if (draftData) {
            setDraftId(draftData.id || draftData._id);
            setTitle(draftData.title || "");
            setArticle(draftData.article || "");
            setSummary(draftData.summary || "");

            // Parse category array
            if (Array.isArray(draftData.category)) {
                const categories = draftData.category.map(c => c.name || c).filter(Boolean);
                setCategoryStr(categories.join(", "));
            }

            // Parse tags array
            if (Array.isArray(draftData.tags)) {
                const tags = draftData.tags.map(t => t.name || t).filter(Boolean);
                setTagsStr(tags.join(", "));
            }

            // Parse headlines array
            if (Array.isArray(draftData.headlines)) {
                const headlines = draftData.headlines.map(h => h.headline || h).filter(Boolean);
                setHeadlinesStr(headlines.join(", "));
            }
        }
    }, [draftData]);

    const handleDisplaySectionChange = (section) => {
        setDisplaySections((prev) =>
            prev.includes(section)
                ? prev.filter((s) => s !== section)
                : [...prev, section]
        );
    };

    const resetForm = () => {
        setTitle("");
        setArticle("");
        setSummary("");
        setAuthor("");
        setImageFile(null);
        setApproxTimeToRead("");
        setCategoryStr("");
        setTagsStr("");
        setHeadlinesStr("");
        setDisplaySections([]);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !article || !summary || !author) {
            setMessage({ type: "error", text: "Please fill all required fields." });
            return;
        }
        setSubmitting(true);
        setMessage(null);

        if (!imageFile) {
            setMessage({ type: "error", text: "Please select an image." });
            setSubmitting(false);
            return;
        }

        try {
            const imageUpload = await uploadFileToS3(imageFile);

            const categoryArr = categoryStr.split(",").map((c) => c.trim()).filter(Boolean);
            const tagsArr = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
            const headlinesArr = headlinesStr.split(",").map((h) => h.trim()).filter(Boolean);

            await postPublishedNews({
                title,
                article,
                summary,
                author,
                image: imageUpload.fileKey,
                approx_time_to_read: parseInt(approxTimeToRead) || 0,
                category: categoryArr,
                tags: tagsArr,
                headlines: headlinesArr,
                display_section: displaySections,
            });

            // If this was from a draft, delete the draft
            if (draftId) {
                try {
                    await requestJson(`/news/drafts/${draftId}`, { method: 'DELETE' });
                } catch (draftErr) {
                    console.error('Failed to delete draft:', draftErr);
                }
            }

            setMessage({ type: "success", text: "Published news created successfully!" });
            resetForm();
            setDraftId(null);

            // If onPublishComplete callback is provided, call it (for draft workflow)
            if (onPublishComplete) {
                setTimeout(() => onPublishComplete(), 500);
            } else {
                await loadData();
            }
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Failed to create published news." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this published news?")) return;
        try {
            await deletePublishedNews(id);
            setItems((prev) => prev.filter((item) => (item.id || item._id) !== id));
            setMessage({ type: "success", text: "Published news deleted." });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to delete published news." });
        }
    };

    const handleArchive = async (id) => {
        if (!window.confirm("Are you sure you want to archive this published news?")) return;
        try {
            await archivePublishedNews(id);
            await loadData();
            setMessage({ type: "success", text: "Published news archived." });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to archive published news." });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                <div>
                    <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
                        <Newspaper size={24} className="text-accent" /> Published News Management
                    </h2>
                    <p className="text-xs text-on-surface-variant">Create and manage published news articles for the platform.</p>
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
                    <Plus size={18} className="text-accent" /> {draftId ? "Publish News from Draft" : "Add Published News"}
                </h3>
                {draftId && (
                    <p className="text-xs text-on-surface-variant bg-accent/10 border border-accent/20 rounded px-3 py-2">
                        Editing draft: Fill in the remaining fields and click "Publish News" to publish this article.
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. New Digital Asset Policy Announced"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Summary *</label>
                        <textarea
                            rows={2}
                            required
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Brief summary of the article..."
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Article */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Article *</label>
                        <textarea
                            rows={6}
                            required
                            value={article}
                            onChange={(e) => setArticle(e.target.value)}
                            placeholder="Full article content..."
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Author *</label>
                        <input
                            type="text"
                            required
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Approx Time to Read */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Approx. Time to Read (minutes)</label>
                        <input
                            type="number"
                            min="0"
                            value={approxTimeToRead}
                            onChange={(e) => setApproxTimeToRead(e.target.value)}
                            placeholder="e.g. 5"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Image *</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            ref={imageInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) {
                                    setImageFile(null);
                                    return;
                                }
                                setImageFile(file);
                            }}
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                        <p className="mt-1 text-[11px] text-on-surface-variant">
                            Selected image will be uploaded to S3 before saving.
                        </p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Category (comma-separated)</label>
                        <input
                            type="text"
                            value={categoryStr}
                            onChange={(e) => setCategoryStr(e.target.value)}
                            placeholder="e.g. Finance, Technology, Policy"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={tagsStr}
                            onChange={(e) => setTagsStr(e.target.value)}
                            placeholder="e.g. Bitcoin, Blockchain, Regulation"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Headlines */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Headlines (comma-separated)</label>
                        <input
                            type="text"
                            value={headlinesStr}
                            onChange={(e) => setHeadlinesStr(e.target.value)}
                            placeholder="e.g. Breaking News, Market Update"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* Display Sections - Checkboxes */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-2">Display Section</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {DISPLAY_SECTIONS.map((section) => (
                                <label
                                    key={section.value}
                                    className="flex items-center gap-2 cursor-pointer text-xs text-on-surface hover:text-accent transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={displaySections.includes(section.value)}
                                        onChange={() => handleDisplaySectionChange(section.value)}
                                        className="w-4 h-4 text-accent bg-surface-container-low border-outline-variant rounded focus:ring-accent focus:ring-2"
                                    />
                                    <span>{section.label}</span>
                                </label>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-on-surface-variant">
                            Select one or more sections where this news should be displayed.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    {draftId && onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="px-5 py-2.5 bg-surface-container-low text-on-surface border border-outline-variant font-label-caps text-xs font-bold rounded hover:bg-surface-container-high transition-opacity disabled:opacity-50 flex items-center gap-2"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : (draftId ? "Publish News" : "Create Published News")}
                    </button>
                </div>
            </form>

            {/* Published News List */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <FileText size={18} className="text-accent" /> Published News ({items.length})
                </h3>

                {loading ? (
                    <p className="text-xs text-on-surface-variant py-4">Loading published news...</p>
                ) : items.length === 0 ? (
                    <p className="text-xs text-on-surface-variant py-4">No published news added yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                                    <th className="py-2.5 px-3">Title</th>
                                    <th className="py-2.5 px-3">Author</th>
                                    <th className="py-2.5 px-3">Read Time</th>
                                    <th className="py-2.5 px-3">Views</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {items.map((item) => (
                                    <tr key={item._id} className="hover:bg-surface-container-low/50">
                                        <td className="py-3 px-3 font-semibold text-on-surface max-w-xs truncate">
                                            {item.title}
                                        </td>
                                        <td className="py-3 px-3 text-on-surface-variant">{item.author}</td>
                                        <td className="py-3 px-3 text-on-surface-variant font-data-tabular">
                                            {item.approx_time_to_read} min
                                        </td>
                                        <td className="py-3 px-3 text-on-surface-variant font-data-tabular">
                                            {item.view_count}
                                        </td>
                                        <td className="py-3 px-3">
                                            <span
                                                className={`px-2 py-1 rounded text-[10px] font-semibold ${item.status === "archived"
                                                    ? "bg-gray-500/10 text-gray-700"
                                                    : "bg-green-500/10 text-green-700"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.status !== "archived" && (
                                                    <button
                                                        onClick={() => handleArchive(item.id || item._id)}
                                                        className="text-orange-500 hover:text-orange-700 p-1 rounded"
                                                        title="Archive"
                                                    >
                                                        <Archive size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id || item._id)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
