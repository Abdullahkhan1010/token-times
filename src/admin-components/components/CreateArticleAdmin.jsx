import React, { useState, useRef } from "react";
import {
  PenTool,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Tag,
  Clock,
  User,
  Calendar,
  Sparkles,
  RefreshCw,
  Send,
  FileText,
  Newspaper,
  Pin,
  Star,
  Zap,
  Building2,
  Globe,
  BookOpen
} from "lucide-react";
import { postPublishedNews } from "../../services/published-news.service";
import { uploadFileToS3 } from "../../services/file.service";
import PageHeader from "./PageHeader";

// 8 Editorial Categories acting as placement tags/destinations
const CATEGORIES = [
  { id: "main_story", label: "Main Story", desc: "Hero top headline banner on homepage", icon: Newspaper },
  { id: "featured_spotlight", label: "Featured Spotlight", desc: "Highlighted center spotlight story", icon: Sparkles },
  { id: "substories", label: "Substories", desc: "Supporting side stories grid", icon: Pin },
  { id: "editors_pick", label: "Editor's Pick", desc: "Curated executive editorial picks", icon: Star },
  { id: "latest_news", label: "Latest News", desc: "Real-time ticker and latest feed", icon: Zap },
  { id: "pakistan_focus", label: "Pakistan Focus", desc: "SBP, SECP & local regulatory intelligence", icon: Building2 },
  { id: "global_highlights", label: "Global Highlights", desc: "Macro Web3 & international market reports", icon: Globe },
  { id: "featured_analysis", label: "Featured Analysis", desc: "Deep-dive econometric research & whitepapers", icon: BookOpen },
];

export default function CreateArticleAdmin({ onArticleCreated }) {
  const fileInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState("Editorial Desk");
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
  const [readTime, setReadTime] = useState("5");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["latest_news"]);
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState(["Digital Assets", "Policy", "Web3"]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileObject, setImageFileObject] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState(null);

  // Toggle Category selection
  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  // Add custom tag
  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagsInput.trim()) {
      e.preventDefault();
      const newTag = tagsInput.trim().replace(/^#/, "");
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagsInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle local image file upload preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileObject(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageUrl("");
    }
  };

  // Calculate estimated read time automatically
  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    setReadTime(String(mins));
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setAuthor("Editorial Desk");
    setPublishDate(new Date().toISOString().split("T")[0]);
    setReadTime("5");
    setSummary("");
    setContent("");
    setSelectedCategories(["latest_news"]);
    setTags(["Digital Assets", "Policy", "Web3"]);
    setTagsInput("");
    setImageUrl("");
    setImageFileObject(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage({ type: "error", text: "Please enter an article title." });
      return;
    }

    if (!content.trim()) {
      setMessage({ type: "error", text: "Please provide full article body content." });
      return;
    }

    if (selectedCategories.length === 0) {
      setMessage({ type: "error", text: "Select at least 1 placement tag category." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      let imagePath = imageUrl;

      if (imageFileObject) {
        try {
          const uploadRes = await uploadFileToS3(imageFileObject);
          imagePath = uploadRes.fileKey || uploadRes.url || imagePath;
        } catch (uploadErr) {
          console.warn("File upload to S3 failed, using local preview data URL fallback", uploadErr);
          imagePath = imagePreview || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80";
        }
      }

      if (!imagePath) {
        imagePath = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80";
      }

      const minutes = parseInt(readTime) || Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

      const sectionMappings = {
        main_story: ["main_story"],
        featured_spotlight: ["featured_spotlight"],
        substories: ["substories", "sub_stories"],
        editors_pick: ["editors_pick", "editor_picks"],
        latest_news: ["latest_news"],
        pakistan_focus: ["pakistan_focus", "Pakistan_Focus"],
        global_highlights: ["global_highlights", "Global_Highlight"],
        featured_analysis: ["featured_analysis"]
      };

      const displaySections = Array.from(new Set(
        selectedCategories.flatMap(c => sectionMappings[c] || [c])
      ));

      const payload = {
        title: title.trim(),
        article: content.trim(),
        summary: summary.trim() || content.trim().slice(0, 150) + "...",
        author: author.trim() || "Editorial Desk",
        image: imagePath,
        approx_time_to_read: minutes,
        category: selectedCategories,
        tags: tags,
        headlines: subtitle.trim() ? [subtitle.trim()] : [],
        display_section: displaySections,
        status: "published"
      };

      await postPublishedNews(payload);

      resetForm();

      setMessage({
        type: "success",
        text: "Article published successfully to the live platform!"
      });
      setTimeout(() => setMessage(null), 10000);

      // Smooth scroll page to top so user immediately sees the success notification
      window.scrollTo({ top: 0, behavior: "smooth" });
      const mainEl = document.querySelector("main");
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: "smooth" });

      if (onArticleCreated) {
        onArticleCreated(payload);
      }
    } catch (err) {
      console.error("Failed to publish article:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to publish article. Please verify your connection and try again."
      });
      setTimeout(() => setMessage(null), 10000);

      window.scrollTo({ top: 0, behavior: "smooth" });
      const mainEl = document.querySelector("main");
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      <PageHeader
        badge="Editorial Board Studio"
        title="Create Editorial Article"
        subtitle="Compose and publish official articles across the 8 sections of Token Times."
        message={message}
        onDismissMessage={() => setMessage(null)}
      >
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface font-label-caps text-xs font-bold hover:bg-surface-container-high transition-colors shadow-sm"
        >
          <Eye size={16} className="text-[#D4AF37]" /> Preview Article
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setMessage(null);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-xs hover:bg-surface-container-low transition-colors"
          title="Reset Form"
        >
          <RefreshCw size={15} /> Reset
        </button>
      </PageHeader>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Placement Category Tags (The 8 requested categories) */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div>
              <h2 className="font-headline-md text-lg font-bold text-[#0C133D] flex items-center gap-2">
                <Tag size={18} className="text-[#D4AF37]" /> Section Tag Categories (Select Placement)
              </h2>
              <p className="text-xs text-on-surface-variant">
                Select one or multiple section tags to determine where this article will be stored and rendered.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#D4AF37] bg-[#0C133D] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
              {selectedCategories.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              const CatIcon = cat.icon;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#0C133D] text-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40"
                      : "bg-surface-bright text-on-surface border-outline-variant hover:border-[#D4AF37]/60 hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CatIcon size={20} className={isSelected ? "text-[#D4AF37]" : "text-[#0C133D]"} />
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#D4AF37] border-[#D4AF37] text-[#0C133D]"
                          : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={12} strokeWidth={3} />}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-xs font-extrabold uppercase tracking-wider mb-1 ${isSelected ? "text-[#D4AF37]" : "text-[#0C133D]"}`}>
                      {cat.label}
                    </h3>
                    <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? "text-slate-300" : "text-on-surface-variant"}`}>
                      {cat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Article Meta & Details */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-headline-md text-lg font-bold text-[#0C133D] border-b border-outline-variant pb-3 flex items-center gap-2">
            <FileText size={18} className="text-[#D4AF37]" /> Article Information & Metadata
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0C133D] mb-1.5">
                Article Headline / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., State Bank of Pakistan Issues Framework for Virtual Asset Sandbox 2026"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-base font-bold focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-inner"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Subtitle / Deck (Optional Lead-in)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g., New compliance standards mandate sovereign custody protocols and VASP licensing thresholds."
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Author */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                  <User size={14} className="text-[#D4AF37]" /> Author / Desk
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., Editorial Desk / Zaki Haider"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                  <Calendar size={14} className="text-[#D4AF37]" /> Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                  <Clock size={14} className="text-[#D4AF37]" /> Read Time (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Article Summary & Main Body */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-headline-md text-lg font-bold text-[#0C133D] border-b border-outline-variant pb-3 flex items-center gap-2">
            <PenTool size={18} className="text-[#D4AF37]" /> Article Content & Executive Summary
          </h2>

          <div className="space-y-5">
            {/* Executive Summary */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Executive Summary / Card Excerpt
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a concise 2-3 sentence overview that will appear on index cards and search engines..."
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-xs leading-relaxed focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Main Article Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0C133D]">
                  Full Article Body Text <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-on-surface-variant font-data-tabular">
                  {content.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={12}
                value={content}
                onChange={handleContentChange}
                placeholder="Compose full long-form article content here. You can include paragraphs, quotes, and structural section headers..."
                className="w-full px-4 py-3.5 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-sm font-sans leading-relaxed focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-inner"
                required
              />
            </div>
          </div>
        </section>

        {/* Section 4: Cover Media & Topic Tags */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-headline-md text-lg font-bold text-[#0C133D] border-b border-outline-variant pb-3 flex items-center gap-2">
            <Upload size={18} className="text-[#D4AF37]" /> Cover Media & Article Topic Tags
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image Upload / URL */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Cover Image Asset
              </label>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant rounded-xl p-4 text-center bg-surface-bright hover:bg-surface-container-low hover:border-[#D4AF37] transition-all cursor-pointer group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      Change Image
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center gap-2">
                    <Upload size={24} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-[#0C133D]">Click to upload cover image</span>
                    <span className="text-[11px] text-on-surface-variant">PNG, JPG, WebP up to 5MB</span>
                  </div>
                )}
              </div>

              {/* Image URL Alternative */}
              <div>
                <span className="text-[11px] text-on-surface-variant block mb-1">Or paste image URL directly:</span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value) setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Custom Keyword Tags */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Topic Keywords & Meta Tags
              </label>

              <div className="flex flex-wrap gap-2 p-3 bg-surface-bright border border-outline-variant rounded-xl min-h-[90px] items-start">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type keyword and press Enter or comma (e.g. SBP, CBDC, VASP)..."
                className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-bright text-on-surface text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <span className="text-[11px] text-on-surface-variant block">
                Press Enter or comma to add a keyword tag.
              </span>
            </div>
          </div>
        </section>

        {/* Form Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-label-caps text-xs font-bold hover:bg-surface-container-high transition-colors"
          >
            Clear Form
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl border border-[#0C133D] text-[#0C133D] font-label-caps text-xs font-bold hover:bg-[#0C133D] hover:text-[#D4AF37] transition-colors"
            >
              Live Preview
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/50 font-label-caps text-xs font-extrabold hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Publishing Article...
                </>
              ) : (
                <>
                  <Send size={16} /> Publish Article Live
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Live Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-bright border border-outline-variant rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant pb-4">
              <div className="flex items-center gap-2">
                <Eye className="text-[#D4AF37]" size={20} />
                <span className="font-label-caps text-xs font-bold text-[#0C133D] uppercase tracking-wider">
                  Live Article Card & Detail Preview
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="space-y-6">
              {/* Category Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((catId) => {
                  const catObj = CATEGORIES.find((c) => c.id === catId);
                  const IconComp = catObj?.icon;
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[11px] uppercase tracking-wide"
                    >
                      {IconComp && <IconComp size={14} className="text-[#D4AF37]" />}
                      <span>{catObj?.label || catId}</span>
                    </span>
                  );
                })}
              </div>

              {/* Headline */}
              <div>
                <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#0C133D] leading-tight mb-2">
                  {title || "Untitled Article Headline"}
                </h1>
                {subtitle && (
                  <p className="text-sm font-semibold text-on-surface-variant">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Byline */}
              <div className="flex items-center gap-3 text-xs text-on-surface-variant border-y border-outline-variant/60 py-2.5 font-data-tabular">
                <span>By <strong className="text-[#0C133D]">{author || "Editorial Desk"}</strong></span>
                <span>•</span>
                <span>{publishDate}</span>
                <span>•</span>
                <span>{readTime} min read</span>
              </div>

              {/* Image */}
              {(imagePreview || imageUrl) && (
                <div className="aspect-video rounded-xl overflow-hidden border border-outline-variant shadow-sm">
                  <img
                    src={imagePreview || imageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt */}
              {summary && (
                <div className="p-4 bg-surface-container-low border-l-4 border-[#D4AF37] rounded-r-xl text-xs leading-relaxed text-on-surface">
                  <strong className="block text-[#0C133D] font-bold uppercase mb-1">Executive Summary</strong>
                  {summary}
                </div>
              )}

              {/* Body */}
              <div className="text-xs md:text-sm leading-relaxed text-on-surface space-y-3 whitespace-pre-wrap font-sans">
                {content || "No main body content written yet."}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-4 border-t border-outline-variant flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="text-xs text-[#D4AF37] font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-outline-variant flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-6 py-2.5 rounded-xl bg-[#0C133D] text-[#D4AF37] font-label-caps text-xs font-bold hover:bg-[#D4AF37] hover:text-[#0C133D] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
