import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { interviews as staticInterviews } from "../data/content";
import { getInterviews } from "../services/interview.service";

export default function Interviews() {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getInterviews()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            img: item.interviewee_image || staticInterviews[0]?.img || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            quote: item.interview_title || (item.questions && item.questions[0]) || staticInterviews[0]?.quote,
            caption: item.interviewee_name || item.interviewer_name || staticInterviews[0]?.caption,
          }));
          setInterviewList(mapped);
        } else {
          setInterviewList(staticInterviews);
        }
      })
      .catch((err) => {
        console.warn("Using static fallback for interviews:", err.message);
        if (active) setInterviewList(staticInterviews);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const itemsToDisplay = interviewList.length > 0 ? interviewList : staticInterviews;

  return (
    <section>
      <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-6 flex items-center gap-2">
        <Mic size={20} className="text-[#D4AF37]" /> Interviews
      </h3>
      <div className="space-y-4">
        {itemsToDisplay.map((iv, i) => (
          <article key={iv.id || iv.quote || i} className="flex gap-4 items-center">
            <img
              alt={iv.caption || "Interviewee"}
              className="w-16 h-16 rounded-full object-cover border border-outline-variant"
              src={iv.img}
            />
            <div>
              <h4 className="font-body-md text-body-md font-semibold text-on-surface leading-tight mb-1">
                <a className="hover:text-[#D4AF37] hover:underline transition-colors" href="#">
                  {iv.quote}
                </a>
              </h4>
              <span className="font-label-caps text-label-caps text-on-surface-variant">{iv.caption}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
