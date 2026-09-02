import React, { useState, useEffect, useRef } from "react";
import { Newspaper, Plus, Trash2, FileText, CheckCircle2, AlertCircle, Archive, X, Upload, Sparkles, Pin, Star, Zap, Building2, Globe, BookOpen } from "lucide-react";
import { getPublishedNews, postPublishedNews, putPublishedNews, deletePublishedNews, archivePublishedNews } from "../../services/published-news.service";
import { uploadFileToS3 } from "../../services/file.service";
import { requestJson } from "../../services/api";
import { getArticleClickStats } from "../../services/tracker.service";
import PageHeader from "./PageHeader";
import MediaUploadInput from "./MediaUploadInput";

const DISPLAY_SECTIONS = [
    { value: "main_story", label: "Main Story", desc: "Hero top headline banner on homepage", icon: Newspaper },
    { value: "top_story", label: "Top Story", desc: "Prominent Top Story card on homepage hero", icon: Star },
    { value: "featured_spotlight", label: "Featured Spotlight", desc: "Highlighted center spotlight story", icon: Sparkles },
    { value: "sub_stories", label: "Substories", desc: "Supporting side stories grid", icon: Pin },
    { value: "editor_picks", label: "Editor's Pick", desc: "Curated executive editorial picks", icon: Star },
    { value: "latest_news", label: "Latest News", desc: "Real-time ticker and latest feed", icon: Zap },
    { value: "Pakistan_Focus", label: "Pakistan Focus", desc: "SBP, SECP & local regulatory intelligence", icon: Building2 },
    { value: "Global_Highlight", label: "Global Highlights", desc: "Macro Web3 & international market reports", icon: Globe },
    { value: "featured_analysis", label: "Featured Analysis", desc: "Deep-dive econometric research & whitepapers", icon: BookOpen },
    { value: "top_stories", label: "Top Stories", desc: "Most viewed and trending stories", icon: Newspaper },
    { value: "reit", label: "REIT & PropTech", desc: "Real estate investment trusts & property tokenization stream", icon: Building2 },
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
    const [imageUrl, setImageUrl] = useState("");
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
            setDraftId(draftData.id);
            setTitle(draftData.title || "");
            setArticle(draftData.article || "");
            setSummary(draftData.summary || "");
            if (draftData.image) {
                setImageUrl(draftData.image);
            }

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
        setImageUrl("");
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

        if (!imageFile && (!imageUrl || !imageUrl.trim())) {
            setMessage({ type: "error", text: "Please upload an image or provide an image link." });
            setSubmitting(false);
            return;
        }

        try {
            let finalImageKey = "";
            if (imageFile) {
                const imageUpload = await uploadFileToS3(imageFile);
                finalImageKey = imageUpload.fileKey;
            } else if (imageUrl && imageUrl.trim()) {
                finalImageKey = imageUrl.trim();
            }

            const parsedCategories = categoryStr.split(",").map((c) => c.trim()).filter(Boolean);
            const tagsArr = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
            const headlinesArr = headlinesStr.split(",").map((h) => h.trim()).filter(Boolean);

            const isReitSelected = displaySections.includes("reit");
            const finalCategoryArr = isReitSelected && !parsedCategories.some(c => c.toLowerCase().includes("reit"))
                ? [...parsedCategories, "REIT & PropTech"]
                : (parsedCategories.length > 0 ? parsedCategories : (displaySections.length > 0 ? displaySections : ["General"]));

            const finalDisplaySections = isReitSelected
                ? Array.from(new Set([...displaySections, "reit_stream", "REIT"]))
                : displaySections;

            await postPublishedNews({
                title,
                article,
                summary,
                author,
                image: finalImageKey,
                approx_time_to_read: parseInt(approxTimeToRead) || 0,
                category: finalCategoryArr,
                tags: tagsArr,
                headlines: headlinesArr,
                display_section: finalDisplaySections,
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
            setItems((prev) => prev.filter((item) => item.id !== id));
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
            <PageHeader
                title="Published News Management"
                subtitle="Create and manage published news articles for the platform."
                message={message}
                onDismissMessage={() => setMessage(null)}
            >
            </PageHeader>

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

                    {/* Image Upload / Link */}
                    <div className="md:col-span-2">
                        <MediaUploadInput
                            label="Article Cover Image"
                            required
                            file={imageFile}
                            onFileChange={setImageFile}
                            url={imageUrl}
                            onUrlChange={setImageUrl}
                            accept="image/*"
                            mediaType="image"
                            placeholder="https://images.unsplash.com/... or paste direct article image URL"
                            helperText="PNG, JPG, WebP up to 5MB or direct HTTPS image link"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Category (comma-separated)</label>
                        <input
                            type="text"
                            value={categoryStr}
                            onChange={(e) => setCategoryStr(e.target.value)}
                            placeholder="e.g. REIT & PropTech, Finance, Technology, Policy"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                        {/* Category Quick Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] text-on-surface-variant/70 font-semibold">Quick Add:</span>
                            {["REIT & PropTech", "Markets", "Regulation", "Policy", "Web3", "Technology"].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                        const parts = categoryStr.split(",").map(c => c.trim()).filter(Boolean);
                                        if (!parts.includes(preset)) {
                                            setCategoryStr(parts.length ? `${categoryStr}, ${preset}` : preset);
                                        }
                                        if (preset === "REIT & PropTech" && !displaySections.includes("reit")) {
                                            setDisplaySections(prev => [...prev, "reit"]);
                                        }
                                    }}
                                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${categoryStr.toLowerCase().includes(preset.toLowerCase().slice(0, 4))
                                            ? "bg-[#D4AF37] text-[#0C133D] font-bold border-[#D4AF37]"
                                            : "bg-surface-container-high text-on-surface hover:bg-[#D4AF37]/20 border-outline-variant/60"
                                        }`}
                                >
                                    + {preset}
                                </button>
                            ))}
                        </div>
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

                    {/* Display Section Selection Grid - Matching Create Article Studio */}
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Section Tag Categories (Select Placement)
                            </label>
                            <span className="text-xs font-semibold text-[#D4AF37] bg-[#0C133D] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                                {displaySections.length} Selected
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                            {DISPLAY_SECTIONS.map((section) => {
                                const isSelected = displaySections.includes(section.value);
                                const SectionIcon = section.icon;
                                return (
                                    <button
                                        type="button"
                                        key={section.value}
                                        onClick={() => handleDisplaySectionChange(section.value)}
                                        className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${isSelected
                                            ? "bg-[#0C133D] text-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40"
                                            : "bg-surface-bright text-on-surface border-outline-variant hover:border-[#D4AF37]/60 hover:bg-surface-container-low"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <SectionIcon size={18} className={isSelected ? "text-[#D4AF37]" : "text-[#0C133D]"} />
                                            <span
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected
                                                    ? "bg-[#D4AF37] border-[#D4AF37] text-[#0C133D]"
                                                    : "border-outline-variant"
                                                    }`}
                                            >
                                                {isSelected && <CheckCircle2 size={12} strokeWidth={3} />}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className={`text-xs font-extrabold uppercase tracking-wider mb-1 ${isSelected ? "text-[#D4AF37]" : "text-[#0C133D]"}`}>
                                                {section.label}
                                            </h3>
                                            <p className={`text-[10px] leading-snug line-clamp-2 ${isSelected ? "text-slate-300" : "text-on-surface-variant"}`}>
                                                {section.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
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
                                    <tr key={item.id} className="hover:bg-surface-container-low/50">
                                        <td className="py-3 px-3 font-semibold text-on-surface max-w-xs truncate">
                                            {item.title}
                                        </td>
                                        <td className="py-3 px-3 text-on-surface-variant">{item.author}</td>
                                        <td className="py-3 px-3 text-on-surface-variant font-data-tabular">
                                            {item.approx_time_to_read} min
                                        </td>
                                        <td className="py-3 px-3 text-on-surface-variant font-data-tabular">
                                            {(() => {
                                                const id = item.id;
                                                const titleKey = item.title ? `title_${item.title.trim().toLowerCase()}` : null;
                                                const articleClicks = getArticleClickStats();
                                                const tracked =
                                                    (id && articleClicks[id]?.clicks) ||
                                                    (item.id && articleClicks[item.id]?.clicks) ||
                                                    (titleKey && articleClicks[titleKey]?.clicks) ||
                                                    0;
                                                return Math.max(tracked, item.view_count || 0);
                                            })()}
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
                                                        onClick={() => handleArchive(item.id)}
                                                        className="text-orange-500 hover:text-orange-700 p-1 rounded"
                                                        title="Archive"
                                                    >
                                                        <Archive size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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