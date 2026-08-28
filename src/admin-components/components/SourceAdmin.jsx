import React, { useEffect, useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { deleteSource, getSources, postSource } from "../../services/source.service";
import PageHeader from "./PageHeader";

export default function SourceAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const [sourceUrl, setSourceUrl] = useState("");
    const [sourceName, setSourceName] = useState("");
    const [status, setStatus] = useState("active");
    const [publishDate, setPublishDate] = useState("");
    const [error, setError] = useState("");

    const loadData = async () => {
        setLoading(true);
        try {
            setItems(await getSources());
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Failed to load sources." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            await postSource({
                sourceUrl: sourceUrl.trim(),
                sourceName: sourceName.trim(),
                status: status.trim() || "active",
                publish_date: publishDate || new Date().toISOString(),
                error: error.trim() || null,
            });
            setSourceUrl("");
            setSourceName("");
            setStatus("active");
            setPublishDate("");
            setError("");
            setMessage({ type: "success", text: "Source added successfully." });
            await loadData();
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Failed to add source." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this source?")) return;

        try {
            await deleteSource(id);
            setItems((previous) => previous.filter((item) => item.id !== id));
            setMessage({ type: "success", text: "Source deleted." });
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Failed to delete source." });
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Source Management"
                subtitle="Manage the sources used by the news ingestion system."
                message={message}
                onDismissMessage={() => setMessage(null)}
            />

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <Plus size={18} className="text-accent" /> Add Source
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Source URL *</label>
                        <input
                            type="url"
                            required
                            value={sourceUrl}
                            onChange={(event) => setSourceUrl(event.target.value)}
                            placeholder="https://example.com/news"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Source Name *</label>
                        <input
                            type="text"
                            required
                            value={sourceName}
                            onChange={(event) => setSourceName(event.target.value)}
                            placeholder="Example News"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Status</label>
                        <input
                            type="text"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            placeholder="active"
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Publish Date</label>
                        <input
                            type="datetime-local"
                            value={publishDate}
                            onChange={(event) => setPublishDate(event.target.value)}
                            className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Error</label>
                        <textarea
                            rows={2}
                            value={error}
                            onChange={(event) => setError(event.target.value)}
                            placeholder="Optional ingestion error"
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
                        {submitting ? "Saving..." : "Add Source"}
                    </button>
                </div>
            </form>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <FileText size={18} className="text-accent" /> Sources ({items.length})
                </h3>

                {loading ? (
                    <p className="text-xs text-on-surface-variant py-4">Loading sources...</p>
                ) : items.length === 0 ? (
                    <p className="text-xs text-on-surface-variant py-4">No sources added yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                                    <th className="py-2.5 px-3">Name</th>
                                    <th className="py-2.5 px-3">URL</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3">Publish Date</th>
                                    <th className="py-2.5 px-3">Error</th>
                                    <th className="py-2.5 px-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-surface-container-low/50">
                                        <td className="py-3 px-3 font-semibold text-on-surface">{item.sourceName}</td>
                                        <td className="py-3 px-3 max-w-xs truncate">
                                            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                                                {item.sourceUrl}
                                            </a>
                                        </td>
                                        <td className="py-3 px-3 text-on-surface-variant">{item.status}</td>
                                        <td className="py-3 px-3 text-on-surface-variant">{item.publish_date || "N/A"}</td>
                                        <td className="py-3 px-3 text-error max-w-xs truncate">{item.error || "None"}</td>
                                        <td className="py-3 px-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded"
                                                title="Delete source"
                                                aria-label={`Delete ${item.sourceName}`}
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
