import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Upload,
  Globe,
  Landmark,
  Calculator,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageHeader from "./PageHeader";
import MediaUploadInput from "./MediaUploadInput";
import {
  getReitContent,
  fetchReitContent,
  saveReitContent,
  resetReitContent,
  DEFAULT_REIT_CONTENT,
} from "../../services/reit.service";
import { uploadFileToS3 } from "../../services/file.service";

export default function ReitAdmin() {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [content, setContent] = useState(getReitContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Reload content on mount from backend
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const fresh = await fetchReitContent();
        if (active && fresh) setContent(fresh);
      } catch (err) {
        console.warn("Failed to fetch fresh REIT content in admin", err);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleHeroChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      heroLandmark: {
        ...prev.heroLandmark,
        [field]: value,
      },
    }));
  };

  const handleSimulatorChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      simulatorConfig: {
        ...prev.simulatorConfig,
        [field]: value,
      },
    }));
  };

  // Pakistan feature handlers
  const handleAddPakistanFeature = () => {
    const newFeature = {
      id: `feat-${Date.now()}`,
      title: "New REIT Initiative",
      tag: "ECOSYSTEM EXPANSION",
      desc: "Provide details on this REIT project or regulatory framework in Pakistan.",
      highlights: ["Key feature / metric 1", "Key feature / metric 2"],
    };
    setContent((prev) => ({
      ...prev,
      pakistanFeatures: [...prev.pakistanFeatures, newFeature],
    }));
  };

  const handleUpdatePakistanFeature = (index, field, value) => {
    setContent((prev) => {
      const updated = [...prev.pakistanFeatures];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pakistanFeatures: updated };
    });
  };

  const handleUpdateHighlight = (featIndex, hIndex, value) => {
    setContent((prev) => {
      const updated = [...prev.pakistanFeatures];
      const highlights = [...updated[featIndex].highlights];
      highlights[hIndex] = value;
      updated[featIndex] = { ...updated[featIndex], highlights };
      return { ...prev, pakistanFeatures: updated };
    });
  };

  const handleAddHighlight = (featIndex) => {
    setContent((prev) => {
      const updated = [...prev.pakistanFeatures];
      const highlights = [...updated[featIndex].highlights, "New point"];
      updated[featIndex] = { ...updated[featIndex], highlights };
      return { ...prev, pakistanFeatures: updated };
    });
  };

  const handleRemoveHighlight = (featIndex, hIndex) => {
    setContent((prev) => {
      const updated = [...prev.pakistanFeatures];
      const highlights = updated[featIndex].highlights.filter((_, i) => i !== hIndex);
      updated[featIndex] = { ...updated[featIndex], highlights };
      return { ...prev, pakistanFeatures: updated };
    });
  };

  const handleDeletePakistanFeature = (index) => {
    if (!window.confirm("Remove this Pakistan ecosystem feature?")) return;
    setContent((prev) => ({
      ...prev,
      pakistanFeatures: prev.pakistanFeatures.filter((_, i) => i !== index),
    }));
  };

  // Global application handlers
  const handleAddGlobalApp = () => {
    const newApp = {
      id: `global-${Date.now()}`,
      country: "NEW REGION",
      flag: "🌐",
      title: "Tokenized Property Framework",
      desc: "Description of the international digital real estate framework and market adoption.",
      metric: "10%+",
      metricLabel: "Benchmark Indicator",
      framework: "National Financial Authority",
    };
    setContent((prev) => ({
      ...prev,
      globalApplications: [...prev.globalApplications, newApp],
    }));
  };

  const handleUpdateGlobalApp = (index, field, value) => {
    setContent((prev) => {
      const updated = [...prev.globalApplications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, globalApplications: updated };
    });
  };

  const handleDeleteGlobalApp = (index) => {
    if (!window.confirm("Remove this global application card?")) return;
    setContent((prev) => ({
      ...prev,
      globalApplications: prev.globalApplications.filter((_, i) => i !== index),
    }));
  };

  // Image Upload handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save all changes
  const handleSave = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    setMessage(null);

    try {
      let finalContent = { ...content };

      if (imageFile) {
        try {
          const uploadRes = await uploadFileToS3(imageFile);
          const uploadedUrl = uploadRes.fileKey || uploadRes.url;
          if (uploadedUrl) {
            finalContent.heroLandmark.image = uploadedUrl;
          }
        } catch (uploadErr) {
          console.warn("Image upload to S3 failed, using local preview", uploadErr);
          if (imagePreview) {
            finalContent.heroLandmark.image = imagePreview;
          }
        }
      }

      const saved = await saveReitContent(finalContent);
      setContent(saved || finalContent);
      setImageFile(null);
      setImagePreview(null);

      setMessage({
        type: "success",
        text: "REIT page updated successfully! Live page has been synchronized.",
      });
      setTimeout(() => setMessage(null), 8000);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to save REIT configuration", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to save REIT page configuration.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset to original factory defaults
  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all REIT page content to original factory defaults?"
      )
    ) {
      return;
    }
    try {
      const fresh = await resetReitContent();
      setContent(fresh);
      setImageFile(null);
      setImagePreview(null);
      setMessage({
        type: "success",
        text: "REIT page configuration has been restored to factory defaults.",
      });
      setTimeout(() => setMessage(null), 6000);
    } catch (err) {
      console.error("Failed to reset REIT content", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to reset REIT content.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Property & PropTech Desk"
        title="REIT Page Management"
        subtitle="Configure the Landmark Hero showcase, Pakistan SECP ecosystem, global case studies, and yield simulator parameters."
        message={message}
        onDismissMessage={() => setMessage(null)}
      >
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface font-label-caps text-xs font-bold hover:bg-surface-container-high transition-colors shadow-sm"
        >
          <RotateCcw size={14} className="text-on-surface-variant" /> Reset Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0C133D] font-label-caps text-xs font-extrabold transition-all shadow-md disabled:opacity-50"
        >
          <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </PageHeader>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-label-caps uppercase transition-colors whitespace-nowrap ${
            activeTab === "hero"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "bg-surface-container-low text-on-surface-variant hover:text-[#0C133D]"
          }`}
        >
          <Building2 size={15} /> Landmark Hero Showcase
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pakistan")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-label-caps uppercase transition-colors whitespace-nowrap ${
            activeTab === "pakistan"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "bg-surface-container-low text-on-surface-variant hover:text-[#0C133D]"
          }`}
        >
          <Landmark size={15} /> Pakistan SECP Ecosystem
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("global")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-label-caps uppercase transition-colors whitespace-nowrap ${
            activeTab === "global"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "bg-surface-container-low text-on-surface-variant hover:text-[#0C133D]"
          }`}
        >
          <Globe size={15} /> Global Applications
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("simulator")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-label-caps uppercase transition-colors whitespace-nowrap ${
            activeTab === "simulator"
              ? "bg-[#0C133D] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
              : "bg-surface-container-low text-on-surface-variant hover:text-[#0C133D]"
          }`}
        >
          <Calculator size={15} /> Simulator Config
        </button>
      </div>

      {/* Tab 1: Landmark Hero Showcase */}
      {activeTab === "hero" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-5 shadow-sm">
            <h3 className="text-base font-bold text-[#0C133D] flex items-center gap-2 border-b border-outline-variant/60 pb-3">
              <Building2 size={18} className="text-[#D4AF37]" /> Landmark Spotlight Box (Dolmen City REIT)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.badge || ""}
                  onChange={(e) => handleHeroChange("badge", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. PAKISTAN LANDMARK REIT"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Landmark Title
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.title || ""}
                  onChange={(e) => handleHeroChange("title", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. Dolmen City REIT (DCR)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Location / Property Subtitle
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.location || ""}
                  onChange={(e) => handleHeroChange("location", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. Dolmen Mall Clifton & Harbour Front Corporate Tower, Karachi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Scheme Classification Tag
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.tag || ""}
                  onChange={(e) => handleHeroChange("tag", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. SECP LISTED RENTAL REIT SCHEME"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.heading || ""}
                  onChange={(e) => handleHeroChange("heading", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. Transforming Pakistan's Commercial Property via Tokenized Yields"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={content.heroLandmark?.description || ""}
                  onChange={(e) => handleHeroChange("description", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Comprehensive description of the REIT property scheme..."
                />
              </div>

              {/* Metrics Grid */}
              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Annual Yield Metric
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.annualYield || ""}
                  onChange={(e) => handleHeroChange("annualYield", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. 11.8% - 13.5%"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Mall Occupancy Metric
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.mallOccupancy || ""}
                  onChange={(e) => handleHeroChange("mallOccupancy", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. 98.4%"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Asset Area Metric
                </label>
                <input
                  type="text"
                  value={content.heroLandmark?.assetArea || ""}
                  onChange={(e) => handleHeroChange("assetArea", e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. 3.5M+ Sq. Ft"
                />
              </div>

              {/* Image URL & Upload */}
              <div className="md:col-span-2">
                <MediaUploadInput
                  label="Landmark Image"
                  file={imageFile}
                  onFileChange={setImageFile}
                  url={content.heroLandmark?.image || ""}
                  onUrlChange={(newUrl) => handleHeroChange("image", newUrl)}
                  accept="image/*"
                  mediaType="image"
                  icon={Building2}
                  placeholder="https://... or direct landmark image URL"
                  helperText="PNG, JPG, WebP up to 5MB or direct image link"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0C133D] font-label-caps text-xs font-extrabold shadow-md transition-all"
            >
              <Save size={15} /> {saving ? "Saving Changes..." : "Save Landmark Showcase"}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Pakistan SECP Ecosystem */}
      {activeTab === "pakistan" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0C133D]">
                Pakistan Ecosystem Feature Cards
              </h3>
              <p className="text-xs text-on-surface-variant">
                Manage SECP frameworks, case studies, and tokenization pathways for Pakistan.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPakistanFeature}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0C133D] text-[#D4AF37] text-xs font-bold hover:bg-black transition-colors"
            >
              <Plus size={15} /> Add Feature Card
            </button>
          </div>

          <div className="space-y-5">
            {content.pakistanFeatures?.map((feat, idx) => (
              <div
                key={feat.id || idx}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[11px] font-extrabold text-[#D4AF37] bg-[#0C133D] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Feature #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePakistanFeature(idx)}
                    className="text-error/70 hover:text-error transition-colors p-1 rounded hover:bg-error-container/20"
                    title="Delete card"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0C133D] mb-1">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={feat.title || ""}
                      onChange={(e) =>
                        handleUpdatePakistanFeature(idx, "title", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0C133D] mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={feat.tag || ""}
                      onChange={(e) =>
                        handleUpdatePakistanFeature(idx, "tag", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0C133D] mb-1">
                      Card Description
                    </label>
                    <textarea
                      rows={2}
                      value={feat.desc || ""}
                      onChange={(e) =>
                        handleUpdatePakistanFeature(idx, "desc", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0C133D]">
                      Bullet Points & Highlights
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddHighlight(idx)}
                      className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
                    >
                      <Plus size={13} /> Add Bullet Point
                    </button>
                  </div>

                  <div className="space-y-2">
                    {feat.highlights?.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#D4AF37] shrink-0" />
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) =>
                            handleUpdateHighlight(idx, hIdx, e.target.value)
                          }
                          className="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx, hIdx)}
                          className="text-error/60 hover:text-error p-1 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0C133D] font-label-caps text-xs font-extrabold shadow-md transition-all"
            >
              <Save size={15} /> {saving ? "Saving Changes..." : "Save Pakistan Ecosystem"}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Global Applications */}
      {activeTab === "global" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0C133D]">
                Global Real Estate Tokenization Models
              </h3>
              <p className="text-xs text-on-surface-variant">
                Manage country case studies (US, UAE, Singapore, EU, etc.).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddGlobalApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0C133D] text-[#D4AF37] text-xs font-bold hover:bg-black transition-colors"
            >
              <Plus size={15} /> Add Country Case
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.globalApplications?.map((app, idx) => (
              <div
                key={app.id || idx}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#D4AF37] bg-[#0C133D] px-2.5 py-0.5 rounded-full uppercase">
                      Country Case #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteGlobalApp(idx)}
                      className="text-error/70 hover:text-error transition-colors p-1 rounded hover:bg-error-container/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#0C133D] mb-0.5">
                        Flag Emoji
                      </label>
                      <input
                        type="text"
                        value={app.flag || ""}
                        onChange={(e) =>
                          handleUpdateGlobalApp(idx, "flag", e.target.value)
                        }
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-center focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-[#0C133D] mb-0.5">
                        Country Name
                      </label>
                      <input
                        type="text"
                        value={app.country || ""}
                        onChange={(e) =>
                          handleUpdateGlobalApp(idx, "country", e.target.value)
                        }
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#0C133D] mb-0.5">
                      Title
                    </label>
                    <input
                      type="text"
                      value={app.title || ""}
                      onChange={(e) =>
                        handleUpdateGlobalApp(idx, "title", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#0C133D] mb-0.5">
                      Regulatory Framework
                    </label>
                    <input
                      type="text"
                      value={app.framework || ""}
                      onChange={(e) =>
                        handleUpdateGlobalApp(idx, "framework", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#0C133D] mb-0.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={app.desc || ""}
                      onChange={(e) =>
                        handleUpdateGlobalApp(idx, "desc", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/40">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                      Metric Label
                    </label>
                    <input
                      type="text"
                      value={app.metricLabel || ""}
                      onChange={(e) =>
                        handleUpdateGlobalApp(idx, "metricLabel", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                      Metric Value
                    </label>
                    <input
                      type="text"
                      value={app.metric || ""}
                      onChange={(e) =>
                        handleUpdateGlobalApp(idx, "metric", e.target.value)
                      }
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0C133D] font-label-caps text-xs font-extrabold shadow-md transition-all"
            >
              <Save size={15} /> {saving ? "Saving Changes..." : "Save Global Applications"}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Simulator Config */}
      {activeTab === "simulator" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-5 shadow-sm max-w-xl">
            <h3 className="text-base font-bold text-[#0C133D] flex items-center gap-2 border-b border-outline-variant/60 pb-3">
              <Calculator size={18} className="text-[#D4AF37]" /> Interactive Yield Simulator Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Benchmark Annual APY Yield (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  value={content.simulatorConfig?.benchmarkYield || 11.8}
                  onChange={(e) =>
                    handleSimulatorChange("benchmarkYield", Number(e.target.value))
                  }
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none font-bold"
                />
                <span className="text-[11px] text-on-surface-variant">
                  E.g. 11.8% based on historical Dolmen City REIT dividend performance.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Fractional Token Price ($)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={content.simulatorConfig?.tokenPrice || 25}
                  onChange={(e) =>
                    handleSimulatorChange("tokenPrice", Number(e.target.value))
                  }
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C133D] mb-1">
                  Token Symbol
                </label>
                <input
                  type="text"
                  value={content.simulatorConfig?.tokenSymbol || "DCR"}
                  onChange={(e) =>
                    handleSimulatorChange("tokenSymbol", e.target.value)
                  }
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0C133D] font-label-caps text-xs font-extrabold shadow-md transition-all"
            >
              <Save size={15} /> {saving ? "Saving Changes..." : "Save Simulator Configuration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
