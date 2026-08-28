import React, { useState, useEffect, useRef } from "react";
import { Mic, Plus, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getInterviews, postInterview, deleteInterview } from "../../services/interview.service";
import { uploadFileToS3 } from "../../services/file.service";
import PageHeader from "./PageHeader";

export default function InterviewsAdmin() {
  const imageInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [interviewTitle, setInterviewTitle] = useState("");
  const [intervieweeName, setIntervieweeName] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [intervieweeImage, setIntervieweeImage] = useState(null);
  const [publishDate, setPublishDate] = useState("");
  const [questionsStr, setQuestionsStr] = useState("");
  const [answersStr, setAnswersStr] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [categoryStr, setCategoryStr] = useState("");


  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInterviews();
      setItems(data);
    } catch (err) {
      console.error("Failed to load interviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewTitle || !intervieweeName || !intervieweeImage) return;
    setSubmitting(true);
    setMessage(null);

    const questionsArr = questionsStr.split("\n").map((q) => q.trim()).filter(Boolean);
    const answersArr = answersStr.split("\n").map((a) => a.trim()).filter(Boolean);
    const tagsArr = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    const categoryArr = categoryStr.split(",").map((c) => c.trim()).filter(Boolean);

    if (!intervieweeImage) {
      setMessage({ type: "error", text: "Please select an image for the interviewee." });
      setSubmitting(false);
      return;
    }

    try {

      const [intervieweeImageUpload] = await Promise.all([
        uploadFileToS3(intervieweeImage)]);

      await postInterview({
        interview_title: interviewTitle,
        interviewee_name: intervieweeName,
        interviewer_name: interviewerName,
        interviewee_image: intervieweeImageUpload.fileKey,
        publish_date: publishDate || new Date().toISOString().split("T")[0],
        questions: questionsArr,
        answers: answersArr,
        tags: tagsArr,
        category: categoryArr,
      });
      setMessage({ type: "success", text: "Interview added successfully!" });
      setInterviewTitle("");
      setIntervieweeName("");
      setInterviewerName("");
      setIntervieweeImage(null);
      setPublishDate("");
      setQuestionsStr("");
      setAnswersStr("");
      setTagsStr("");
      setCategoryStr("");
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create interview." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) return;
    try {
      await deleteInterview(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage({ type: "success", text: "Interview deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete interview." });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interviews Management"
        subtitle="Publish executive Q&A interviews with regulators, founders, and leaders."
        message={message}
        onDismissMessage={() => setMessage(null)}
      />

      {/* Add New Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Plus size={18} className="text-accent" /> Add Interview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Interview Title *</label>
            <input
              type="text"
              required
              value={interviewTitle}
              onChange={(e) => setInterviewTitle(e.target.value)}
              placeholder="e.g. Navigating Regulatory Sandbox Guidelines for Stablecoins"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Interviewee Name *</label>
            <input
              type="text"
              required
              value={intervieweeName}
              onChange={(e) => setIntervieweeName(e.target.value)}
              placeholder="e.g. Dr. Tariq Hassan (Former SECP Chairman)"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Interviewer Name</label>
            <input
              type="text"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              placeholder="e.g. Abdullah Khan"
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
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Questions (one per line)</label>
            <textarea
              rows={2}
              value={questionsStr}
              onChange={(e) => setQuestionsStr(e.target.value)}
              placeholder="Question 1&#10;Question 2"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Answers (one per line)</label>
            <textarea
              rows={2}
              value={answersStr}
              onChange={(e) => setAnswersStr(e.target.value)}
              placeholder="Answer 1&#10;Answer 2"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Upload Row */}
        <div className="pt-3 border-t border-outline-variant/60">
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Interviewee Portrait Image <span className="text-rose-500">*</span>
          </label>
          <div
            onClick={() => imageInputRef.current?.click()}
            className="border border-dashed border-outline-variant rounded-xl p-3 text-center bg-surface-bright hover:bg-surface-container-low hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              required
              onChange={(e) => setIntervieweeImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            {intervieweeImage ? (
              <div className="py-1 flex items-center justify-center gap-2 text-xs font-bold text-[#0C133D]">
                <FileText size={16} className="text-[#D4AF37]" />
                <span className="truncate max-w-[300px]">{intervieweeImage.name}</span>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Change</span>
              </div>
            ) : (
              <div className="py-2 flex items-center justify-center gap-2">
                <Mic size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#0C133D]">Upload Interviewee Portrait</span>
                <span className="text-[10px] text-on-surface-variant">(PNG, JPG, WebP up to 5MB)</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Categories (comma-separated)</label>
            <input
              type="text"
              value={categoryStr}
              onChange={(e) => setCategoryStr(e.target.value)}
              placeholder="Policy, Leadership, Banking"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="SBP, Regulation, FinTech"
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
            {submitting ? "Saving..." : "Create Interview"}
          </button>
        </div>
      </form>

      {/* Interviews List */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <FileText size={18} className="text-accent" /> Published Interviews ({items.length})
        </h3>

        {loading ? (
          <p className="text-xs text-on-surface-variant py-4">Loading interviews...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">No interviews added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Interviewee</th>
                  <th className="py-2.5 px-3">Interviewer</th>
                  <th className="py-2.5 px-3">Publish Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {items.map((item) => (
                  <tr key={item.id || item.interview_title} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3 font-semibold text-on-surface max-w-xs truncate">
                      {item.interview_title || item.quote}
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant font-semibold">
                      {item.interviewee_name || item.caption}
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.interviewer_name || "N/A"}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.publish_date || "N/A"}</td>
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
