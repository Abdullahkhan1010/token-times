import React, { useState, useEffect, useRef } from "react";
import { Upload, Link2, Image as ImageIcon, FileText, X, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

/**
 * MediaUploadInput
 * Unified component for Admin panel supporting both Local PC uploads and direct URLs/links.
 *
 * @param {string} label - Input label text
 * @param {boolean} required - Whether the field is mandatory
 * @param {File|null} file - Selected local file
 * @param {Function} onFileChange - Callback when file changes (File | null)
 * @param {string} url - Direct media URL
 * @param {Function} onUrlChange - Callback when URL string changes
 * @param {string} accept - File accept string (e.g. "image/*", "application/pdf")
 * @param {string} mediaType - "image" | "file" (defaults to "image")
 * @param {string} placeholder - URL input placeholder
 * @param {string} helperText - Helper / subtitle text
 * @param {React.ComponentType} icon - Optional custom icon
 * @param {number} maxSizeBytes - Maximum allowed file size in bytes
 */
export default function MediaUploadInput({
  label = "Media Upload",
  required = false,
  file = null,
  onFileChange,
  url = "",
  onUrlChange,
  accept = "image/*",
  mediaType = "image",
  placeholder,
  helperText,
  icon: CustomIcon,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
}) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(url && !file ? "url" : "upload");
  const [filePreview, setFilePreview] = useState(null);
  const [urlImageError, setUrlImageError] = useState(false);
  const [urlImageLoading, setUrlImageLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState(null);

  const isImage = mediaType === "image" || (accept && accept.includes("image"));
  const defaultPlaceholder = isImage
    ? "https://images.unsplash.com/... or direct image URL"
    : "https://example.com/document.pdf or direct link";
  const defaultHelper = isImage
    ? "PNG, JPG, WebP up to 5MB or direct image link"
    : "PDF document up to 10MB or direct file URL";

  // Sync active tab if initial url or file changes externally
  useEffect(() => {
    if (url && !file && activeTab !== "url") {
      setActiveTab("url");
    }
  }, [url]);

  // Generate / cleanup object URL preview for local image files
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }

    if (isImage && file.type?.startsWith("image/")) {
      const objUrl = URL.createObjectURL(file);
      setFilePreview(objUrl);
      return () => {
        URL.revokeObjectURL(objUrl);
      };
    } else {
      setFilePreview(null);
    }
  }, [file, isImage]);

  // Validate URL whenever it changes
  useEffect(() => {
    setUrlImageError(false);
    if (url && isImage) {
      setUrlImageLoading(true);
    } else {
      setUrlImageLoading(false);
    }
  }, [url, isImage]);

  const handleFileSelect = (selectedFile) => {
    setSizeError(null);
    if (!selectedFile) {
      onFileChange?.(null);
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      setSizeError(`File size exceeds limit (${maxMb}MB). Please choose a smaller file.`);
      onFileChange?.(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    onFileChange?.(selectedFile);
    // Clear URL when local file is picked so there's no conflict
    if (url) {
      onUrlChange?.("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    onFileChange?.(null);
    onUrlChange?.("");
    setSizeError(null);
    setUrlImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const hasValue = Boolean(file || (url && url.trim()));

  return (
    <div className="space-y-2">
      {/* Header with Label and Source Mode Segmented Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-container-low border border-outline-variant text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeTab === "upload"
                ? "bg-[#0C133D] text-white shadow-sm font-bold"
                : "text-on-surface-variant hover:text-[#0C133D]"
            }`}
          >
            <Upload size={12} className={activeTab === "upload" ? "text-[#D4AF37]" : ""} />
            Upload from PC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeTab === "url"
                ? "bg-[#0C133D] text-white shadow-sm font-bold"
                : "text-on-surface-variant hover:text-[#0C133D]"
            }`}
          >
            <Link2 size={12} className={activeTab === "url" ? "text-[#D4AF37]" : ""} />
            {isImage ? "Image Link (URL)" : "Document Link (URL)"}
          </button>
        </div>
      </div>

      {/* Upload Mode Area */}
      {activeTab === "upload" && (
        <div className="space-y-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer group relative ${
              isDragging
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : file
                ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500"
                : "border-outline-variant bg-surface-bright hover:bg-surface-container-low hover:border-[#D4AF37]"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept={accept}
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Thumbnail preview"
                      className="w-12 h-12 object-cover rounded-lg border border-outline-variant shrink-0 bg-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-[#D4AF37] shrink-0 border border-outline-variant">
                      {CustomIcon ? <CustomIcon size={22} /> : <FileText size={22} />}
                    </div>
                  )}
                  <div className="text-left min-w-0">
                    <p className="font-bold text-[#0C133D] truncate max-w-[220px] sm:max-w-xs">{file.name}</p>
                    <p className="text-[11px] text-on-surface-variant font-data-tabular">
                      {formatFileSize(file.size)} • Ready to upload
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-[#D4AF37] text-[#0C133D] text-[11px] font-bold transition-colors"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="p-1 rounded text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2.5 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                  {CustomIcon ? <CustomIcon size={20} /> : isImage ? <ImageIcon size={20} /> : <Upload size={20} />}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#0C133D]">
                  <span>Click to browse</span>
                  <span className="font-normal text-on-surface-variant">or drag & drop</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">{helperText || defaultHelper}</p>
              </div>
            )}
          </div>

          {sizeError && (
            <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
              <AlertCircle size={14} /> {sizeError}
            </p>
          )}
        </div>
      )}

      {/* URL Mode Area */}
      {activeTab === "url" && (
        <div className="space-y-2.5">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-[#D4AF37] pointer-events-none">
              <Link2 size={16} />
            </div>
            <input
              type="url"
              value={url || ""}
              onChange={(e) => {
                onUrlChange?.(e.target.value);
                if (file) onFileChange?.(null);
              }}
              placeholder={placeholder || defaultPlaceholder}
              className="w-full pl-9 pr-20 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 px-2 py-1 text-[11px] font-semibold text-on-surface-variant hover:text-rose-500 flex items-center gap-1"
                title="Clear URL"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* URL Helper Text */}
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
            <span>{helperText || defaultHelper}</span>
            {url && isImage && (
              <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Direct Link Linked
              </span>
            )}
          </div>

          {/* Live Image Preview for URL */}
          {url && url.trim() && isImage && (
            <div className="border border-outline-variant rounded-xl p-3 bg-surface-bright/80 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low shrink-0 flex items-center justify-center">
                {urlImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <RefreshCw size={16} className="animate-spin text-[#D4AF37]" />
                  </div>
                )}
                <img
                  src={url}
                  alt="Live URL Preview"
                  className={`w-full h-full object-cover transition-opacity ${
                    urlImageLoading ? "opacity-30" : "opacity-100"
                  } ${urlImageError ? "hidden" : "block"}`}
                  onLoad={() => {
                    setUrlImageLoading(false);
                    setUrlImageError(false);
                  }}
                  onError={() => {
                    setUrlImageLoading(false);
                    setUrlImageError(true);
                  }}
                />
                {urlImageError && (
                  <div className="p-2 text-center text-[10px] text-rose-500 font-medium">
                    <AlertCircle size={18} className="mx-auto mb-1 text-rose-500" />
                    Preview unavailable
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#0C133D]">Image Link Preview</span>
                  {urlImageError ? (
                    <span className="text-[10px] bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded font-bold">
                      Failed to render
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant truncate max-w-sm mt-0.5 font-data-tabular">
                  {url}
                </p>
                {urlImageError ? (
                  <p className="text-[10px] text-rose-500 mt-1">
                    Direct image link could not be loaded. Please ensure the URL ends with .jpg, .png, .webp or is publicly accessible.
                  </p>
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D4AF37] hover:underline mt-1"
                  >
                    Open original image <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Live Document Link Badge for File Type */}
          {url && url.trim() && !isImage && (
            <div className="border border-outline-variant rounded-xl p-3 bg-surface-bright flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={18} className="text-[#D4AF37] shrink-0" />
                <span className="truncate font-data-tabular text-[#0C133D]">{url}</span>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:underline shrink-0"
              >
                Test Link <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Visual indicator when a file/link is set but user is looking at other tab */}
      {activeTab === "upload" && !file && url && (
        <div className="flex items-center justify-between text-[11px] bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 text-[#0C133D]">
          <span className="truncate">Currently using URL link: <span className="font-semibold font-data-tabular">{url}</span></span>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className="text-[10px] font-bold text-[#D4AF37] hover:underline shrink-0 ml-2"
          >
            View URL tab
          </button>
        </div>
      )}

      {activeTab === "url" && !url && file && (
        <div className="flex items-center justify-between text-[11px] bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-emerald-800">
          <span className="truncate">Currently using local file: <span className="font-semibold">{file.name}</span></span>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className="text-[10px] font-bold text-emerald-700 hover:underline shrink-0 ml-2"
          >
            View Upload tab
          </button>
        </div>
      )}
    </div>
  );
}
