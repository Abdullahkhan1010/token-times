import React, { useState, useEffect } from "react";
import {
  Zap,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import PageHeader from "./PageHeader";
import {
  getTickerItems,
  saveTickerItems,
  resetTickerItems,
  DEFAULT_TICKER_ITEMS,
} from "../../services/ticker.service";

const PRESET_SUGGESTIONS = [
  "PVARA Issues Comprehensive Regulatory Guidance for Digital Asset Custody",
  "State Bank of Pakistan Extends Wholesale CBDC Pilot Trials",
  "SECP Unveils Tokenization Sandbox Cohort 3 for Real Estate & Equities",
  "FBR Finalizes Digital Asset Capital Gains Tax Reporting Directives",
  "GLOBAL: Bitcoin Institutional Treasury Adoption Crosses New Highs",
  "GLOBAL: MiCA Stablecoin Guidelines Take Effect Across European Union",
];

export default function TickerAdmin() {
  const [items, setItems] = useState(getTickerItems);
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setItems(getTickerItems());
  }, []);

  const handleAddItem = (e) => {
    e?.preventDefault?.();
    const trimmed = newText.trim();
    if (!trimmed) return;

    setItems((prev) => [trimmed, ...prev]);
    setNewText("");
    setMessage({
      type: "success",
      text: "Headline added to the ticker draft list. Click 'Save Changes' to apply live.",
    });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddPreset = (preset) => {
    if (!items.includes(preset)) {
      setItems((prev) => [preset, ...prev]);
      setMessage({
        type: "success",
        text: `Preset headline added! Click 'Save Changes' to update the live stream.`,
      });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleUpdateItem = (index, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleSave = () => {
    setSaving(true);
    try {
      const clean = items.filter((i) => typeof i === "string" && i.trim().length > 0);
      if (clean.length === 0) {
        setMessage({
          type: "error",
          text: "Cannot save an empty ticker. Please add at least one headline.",
        });
        setSaving(false);
        return;
      }

      saveTickerItems(clean);
      setItems(clean);
      setMessage({
        type: "success",
        text: "Breaking ticker updated successfully! Live website ticker is now synchronized.",
      });
      setTimeout(() => setMessage(null), 7000);
    } catch (err) {
      console.error("Failed to save ticker items", err);
      setMessage({
        type: "error",
        text: "Failed to save ticker updates.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Are you sure you want to restore the default editorial breaking ticker headlines?"
      )
    ) {
      return;
    }
    const fresh = resetTickerItems();
    setItems(fresh);
    setMessage({
      type: "success",
      text: "Breaking ticker headlines restored to factory defaults.",
    });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Real-Time Alert Stream"
        title="Breaking News Ticker"
        subtitle="Manage live policy alerts, macroeconomic flashes, and regulatory updates scrolling across the header of the website."
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
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0C133D] font-label-caps text-xs font-extrabold transition-all shadow-md disabled:opacity-50"
        >
          <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </PageHeader>

      {/* Live Preview Strip */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C133D] flex items-center gap-2">
            <Eye size={15} className="text-[#D4AF37]" /> Live Ticker Preview
          </h3>
          <span className="text-[11px] text-on-surface-variant font-data-tabular">
            {items.length} Active {items.length === 1 ? "Headline" : "Headlines"}
          </span>
        </div>

        <div className="rounded-lg overflow-hidden bg-[#0C133D] text-white border border-[#D4AF37]/30 flex items-center py-2 shadow-inner">
          <div className="px-4 font-label-caps text-xs whitespace-nowrap bg-[#0C133D] z-10 font-bold border-r border-white/10 pr-3 flex items-center gap-2 shrink-0">
            <span className="bg-[#D4AF37] text-[#0C133D] px-2 py-0.5 rounded-sm text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0C133D] animate-pulse" />
              BREAKING
            </span>
          </div>

          <div className="ticker-wrap h-5 flex-1 overflow-hidden">
            <div className="ticker animate-ticker font-data-tabular text-xs">
              <div className="ticker-group">
                {items.map((item, i) => (
                  <span
                    key={`prev-a-${i}`}
                    className="inline-flex items-center gap-3 text-[#D4AF37] font-semibold px-4"
                  >
                    <span>{item}</span>
                    <span className="text-[#D4AF37]/60 font-bold">•</span>
                  </span>
                ))}
              </div>
              <div className="ticker-group" aria-hidden="true">
                {items.map((item, i) => (
                  <span
                    key={`prev-b-${i}`}
                    className="inline-flex items-center gap-3 text-[#D4AF37] font-semibold px-4"
                  >
                    <span>{item}</span>
                    <span className="text-[#D4AF37]/60 font-bold">•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Headline Box */}
      <form
        onSubmit={handleAddItem}
        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm"
      >
        <h3 className="text-sm font-bold text-[#0C133D] flex items-center gap-2">
          <Plus size={16} className="text-[#D4AF37]" /> Add Breaking Headline
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Type breaking policy flash or market alert (e.g. SBP Announces Digital Rupee Guidelines...)"
            className="flex-grow bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-[#0C133D] focus:border-[#D4AF37] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newText.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0C133D] text-[#D4AF37] font-label-caps text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 shrink-0"
          >
            <Plus size={15} /> Add to Stream
          </button>
        </div>

        {/* Quick Suggestion Presets */}
        <div className="pt-2 border-t border-outline-variant/40 space-y-2">
          <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
            <Sparkles size={12} className="text-[#D4AF37]" /> Quick Preset Ideas:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_SUGGESTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="text-left text-[11px] px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant text-[#0C133D] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors truncate max-w-md"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Headlines List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant pb-2">
          <h3 className="text-sm font-bold text-[#0C133D]">
            Active Ticker Headlines ({items.length})
          </h3>
          <span className="text-xs text-on-surface-variant">
            Reorder headlines or edit text inline
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-8 text-center text-xs text-on-surface-variant">
            No active headlines in ticker stream. Add a headline above to get started.
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-[#D4AF37]/70 transition-all group"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto flex-grow">
                  <span className="font-data-tabular font-bold text-xs text-on-surface-variant/70 w-6 text-center shrink-0">
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateItem(index, e.target.value)}
                    className="w-full bg-surface-container-low border border-transparent group-hover:border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-[#0C133D] font-medium focus:border-[#D4AF37] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1.5 rounded text-on-surface-variant hover:text-[#0C133D] hover:bg-surface-container-high disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded text-on-surface-variant hover:text-[#0C133D] hover:bg-surface-container-high disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    title="Delete Headline"
                    className="p-1.5 rounded text-error/70 hover:text-error hover:bg-error-container/20 transition-colors ml-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0C133D] font-label-caps text-xs font-extrabold shadow-md transition-all disabled:opacity-50"
          >
            <Save size={15} /> {saving ? "Saving Changes..." : "Save Ticker Stream"}
          </button>
        </div>
      </div>
    </div>
  );
}
