import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { getInterviews } from "../services/interview.service";
import { ToImageUrl } from "../services/file.service";
import LazyImage from "../components/LazyImage";
import { Mic, UserCheck } from "lucide-react";

const OPINION_CATS = ["All Columnists", "Central Bank Policy", "Founder Op-Eds", "Legal & Tax", "Macro Strategy"];

function formatTag(tag) {
  if (!tag) return "OP-ED";
  if (Array.isArray(tag)) {
    if (tag.length === 0) return "OP-ED";
    return tag.map((t) => formatTag(t)).join(" • ");
  }
  return String(tag)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OpinionPage({ onNavigate, onSelectArticle }) {
  const [selectedCat, setSelectedCat] = useState("All Columnists");
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getInterviews();
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          if (active) setInterviews(data);

          // Preload lead columnist image
          const first = data[0];
          if (first && first.interviewee_image && typeof first.interviewee_image === "string" && !first.interviewee_image.startsWith("http://") && !first.interviewee_image.startsWith("https://") && !first.interviewee_image.startsWith("data:")) {
            try {
              const url = await ToImageUrl(first.interviewee_image);
              if (url && active) {
                const img = new Image();
                img.src = url;
                if (img.decode) img.decode().catch(() => {});
              }
            } catch {}
          }
        }
      } catch (err) {
        console.error("Failed to load opinion columnists", err);
      }
    })();
    return () => { active = false; };
  }, []);

  const filteredInterviews = selectedCat === "All Columnists"
    ? interviews
    : interviews.filter((item) => {
        const title = (item.interview_title || "").toLowerCase();
        const name = (item.interviewee_name || "").toLowerCase();
        const target = selectedCat.toLowerCase();
        return title.includes(target) || name.includes(target);
      });

  const activeList = filteredInterviews.length > 0 ? filteredInterviews : interviews;

  const leadOpEd = activeList[0] ? {
    title: activeList[0].interview_title,
    author: activeList[0].interviewee_name || "Guest Columnist",
    image: activeList[0].interviewee_image || "",
    summary: activeList[0].summary || activeList[0].interview_title || "",
    tag: "EXECUTIVE OP-ED"
  } : null;

  const secondaryOpEds = activeList.slice(1, 5).map(item => ({
    title: item.interview_title,
    author: item.interviewee_name || "Guest Columnist",
    approx_time_to_read: 5
  }));

  return (
    <div className="space-y-8">
      <SEOHead pageKey="Opinion" customTitle="Executive Opinion & Industry Columnists | Token Times" />
      <Breadcrumbs currentPage="Opinion" onNavigate={onNavigate} />

      <Reveal as="div" className="border-b border-outline-variant pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block mb-1">
            EXECUTIVE PERSPECTIVES & OP-EDS
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-[#0C133D]">
            Opinion & Columnists
          </h1>
        </div>
        <p className="text-sm text-on-surface-variant max-w-md">
          Commentary, op-eds, and strategic analysis from regulators, central bank leaders, and Web3 founders.
        </p>
      </Reveal>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {OPINION_CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedCat === cat
                ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37] font-extrabold"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-[#D4AF37]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hero Section: Featured Op-Ed Lead */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {leadOpEd && (
          <Reveal
            as="article"
            onClick={() => onSelectArticle?.(leadOpEd)}
            className="lg:col-span-8 hover-lift group bg-surface-container-lowest border-2 border-[#0C133D] rounded-xl overflow-hidden cursor-pointer shadow-md hover:border-[#D4AF37] flex flex-col justify-between"
          >
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center border-b border-outline-variant/40 bg-surface-container-low">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-md shrink-0">
                <LazyImage
                  src={leadOpEd.image}
                  alt={leadOpEd.author}
                  eager={true}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="bg-[#0C133D] text-[#D4AF37] text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                  {leadOpEd.tag}
                </span>
                <h3 className="font-headline-lg text-lg sm:text-2xl font-bold text-[#0C133D]">
                  By {leadOpEd.author}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Named Columnist & Industry Leader</p>
              </div>
            </div>
            <div className="p-6">
              <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-tight mb-3 italic">
                "{leadOpEd.title}"
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                {leadOpEd.summary}
              </p>
              <span className="text-xs font-data-tabular text-on-surface-variant pt-3 border-t border-outline-variant/40 block">
                Opinion & Analysis Column • Token Times
              </span>
            </div>
          </Reveal>
        )}

        {/* Secondary Op-Eds Rail */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-start gap-4 shadow-sm">
          <h3 className="font-headline-sm text-sm font-bold text-[#0C133D] border-b border-outline-variant pb-3 uppercase tracking-wider flex items-center gap-2">
            <Mic size={16} className="text-[#D4AF37]" /> Columnist Wire
          </h3>
          <div className="space-y-4">
            {secondaryOpEds.map((item, i) => (
              <div key={i} onClick={() => onSelectArticle?.(item)} className="group cursor-pointer border-b border-outline-variant/40 pb-3 last:border-none">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase block mb-0.5">
                  BY {item.author || "GUEST COLUMNIST"}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors line-clamp-2 italic">
                  "{item.title}"
                </h4>
                <span className="text-[10px] text-on-surface-variant block mt-1">{item.approx_time_to_read || 5} mins read</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
