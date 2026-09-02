import React, { useState, useEffect, useRef } from "react";
import { Mic, Plus, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getInterviews, postInterview, deleteInterview } from "../../services/interview.service";
import { uploadFileToS3 } from "../../services/file.service";
import PageHeader from "./PageHeader";
import MediaUploadInput from "./MediaUploadInput";

export default function InterviewsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [interviewTitle, setInterviewTitle] = useState("");
  const [intervieweeName, setIntervieweeName] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [intervieweeImage, setIntervieweeImage] = useState(null);
  const [intervieweeImageUrl, setIntervieweeImageUrl] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [qaList, setQaList] = useState([{ question: "", answer: "" }]);
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

  const handleAddQuestion = () => {
    setQaList((prev) => [...prev, { question: "", answer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    if (qaList.length <= 1) {
      setQaList([{ question: "", answer: "" }]);
      return;
    }
    setQaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQaChange = (index, field, value) => {
    setQaList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewTitle || !intervieweeName) return;

    if (!intervieweeImage && (!intervieweeImageUrl || !intervieweeImageUrl.trim())) {
      setMessage({ type: "error", text: "Please select an image or provide an image link for the interviewee." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const validQaList = qaList.filter((qa) => qa.question.trim() || qa.answer.trim());
    const questionsArr = validQaList.map((qa) => qa.question.trim());
    const answersArr = validQaList.map((qa) => qa.answer.trim());
    const tagsArr = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    const categoryArr = categoryStr.split(",").map((c) => c.trim()).filter(Boolean);

    try {
      let finalImageKey = "";
      if (intervieweeImage) {
        const [intervieweeImageUpload] = await Promise.all([
          uploadFileToS3(intervieweeImage),
        ]);
        finalImageKey = intervieweeImageUpload.fileKey;
      } else if (intervieweeImageUrl && intervieweeImageUrl.trim()) {
        finalImageKey = intervieweeImageUrl.trim();
      }

      await postInterview({
        interview_title: interviewTitle,
        interviewee_name: intervieweeName,
        interviewer_name: interviewerName,
        interviewee_image: finalImageKey,
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
      setIntervieweeImageUrl("");
      setPublishDate("");
      setQaList([{ question: "", answer: "" }]);
      setTagsStr("");
      setCategoryStr("");
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
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Plus size={18} className="text-accent" /> Add Interview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>

        {/* Dynamic Questions & Answers Section */}
        <div className="pt-4 border-t border-outline-variant/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0C133D]">
                Interview Questions &amp; Answers ({qaList.length})
              </label>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Add each interview question and its corresponding answer below.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0C133D] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0C133D] border border-[#D4AF37]/50 text-xs font-extrabold rounded-lg shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} /> Add Question
            </button>
          </div>

          <div className="space-y-4">
            {qaList.map((qa, index) => (
              <div
                key={index}
                className="bg-surface-container-low/50 border border-outline-variant rounded-xl p-4 space-y-3 relative group transition-all hover:border-[#D4AF37]/60 shadow-2xs"
              >
                {/* Header of each Q&A item */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#0C133D] text-[#D4AF37] text-[10px] font-extrabold rounded-md uppercase tracking-wider shadow-xs">
                      Q&amp;A #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-[#0C133D]">
                      Question &amp; Response Pair
                    </span>
                  </div>
                  {qaList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Remove this question & answer"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>

                {/* Question Input */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Question {index + 1}
                  </label>
                  <input
                    type="text"
                    value={qa.question}
                    onChange={(e) => handleQaChange(index, "question", e.target.value)}
                    placeholder={`e.g. Question ${index + 1}: What was the primary motivation behind the licensing framework?`}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Answer Input */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Answer {index + 1}
                  </label>
                  <textarea
                    rows={3}
                    value={qa.answer}
                    onChange={(e) => handleQaChange(index, "answer", e.target.value)}
                    placeholder={`e.g. Answer ${index + 1}: Our primary goal is balancing fintech innovation with robust systemic risk management...`}
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface focus:outline-none focus:border-accent resize-y"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-low hover:bg-surface-bright text-[#0C133D] hover:text-[#D4AF37] border border-dashed border-outline-variant hover:border-[#D4AF37] text-xs font-bold rounded-lg transition-all cursor-pointer"
            >
              <Plus size={15} className="text-[#D4AF37]" /> Add Another Question &amp; Answer
            </button>
          </div>
        </div>

        {/* Upload Row */}
        <div className="pt-4 border-t border-outline-variant/60">
          <MediaUploadInput
            label="Interviewee Portrait Image"
            required
            file={intervieweeImage}
            onFileChange={setIntervieweeImage}
            url={intervieweeImageUrl}
            onUrlChange={setIntervieweeImageUrl}
            accept="image/*"
            mediaType="image"
            icon={Mic}
            placeholder="https://... or direct portrait image link"
            helperText="PNG, JPG, WebP up to 5MB or direct image link"
          />
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
