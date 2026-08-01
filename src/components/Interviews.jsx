import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { getInterviews } from "../services/interview.service";
import { ToHref } from "../services/file.service";


export default function Interviews() {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getInterviews();
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          for (const interview of data) {
            if (interview.interviewee_image) {
              const link = await ToHref(interview.interviewee_image, "interviewee.jpg");
              interview.interviewee_image = link;
            }
          }
          setInterviewList(data);
        } else {
          setInterviewList([]);
        }
      }
      catch (err) {
        console.error("Failed to fetch interviews", err);
        if (active) setInterviewList([]);
      }
      finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between border-b-2 border-[#0C133D] pb-2 mb-4">
        <h3 className="font-headline-md text-base font-bold text-[#0C133D] flex items-center gap-2 uppercase tracking-wider">
          <Mic size={18} className="text-[#D4AF37]" /> Opinion & Analysis
        </h3>
        <span className="px-2 py-0.5 rounded bg-[#0C133D] text-[#D4AF37] font-extrabold text-[10px] uppercase">
          Columnists
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-xs text-on-surface-variant">Loading columnists & interviews...</p>
        ) : interviewList.length > 0 ? (
          interviewList.map((iv) => (
            <article key={iv._id} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl flex gap-3.5 items-center hover:border-[#D4AF37] transition-all cursor-pointer group">
              {iv.interviewee_image ? (
                <div className="relative shrink-0">
                  <img
                    alt={iv.interviewee_name || "Columnist"}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-sm"
                    src={iv.interviewee_image}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-[#0C133D] text-[#D4AF37] text-[9px] font-extrabold px-1 rounded">
                    OP-ED
                  </span>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#0C133D] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0">
                  COLUMN
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-0.5">
                  {iv.interviewee_name || "Guest Columnist"}
                </span>
                <h4 className="font-headline-md text-xs font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2 italic">
                  "{iv.interview_title}"
                </h4>
              </div>
            </article>
          ))
        ) : (
          <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl flex gap-3.5 items-center">
            <div className="w-12 h-12 rounded-full bg-[#0C133D] text-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D4AF37]/50">
              TT
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                Editorial Board
              </span>
              <h4 className="font-headline-md text-xs font-bold text-[#0C133D] leading-snug italic">
                "Institutional custody and sovereign digital asset frameworks in emerging markets"
              </h4>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
