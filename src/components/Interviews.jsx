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
      <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-6 flex items-center gap-2">
        <Mic size={20} className="text-[#D4AF37]" /> Interviews
      </h3>
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading interviews...</p>
        ) : interviewList.length > 0 ? (
          interviewList.map((iv, i) => (
            <article key={iv._id} className="flex gap-4 items-center">
              {iv.interviewee_image ? (
                <img
                  alt={iv.interviewee_name || "Interviewee"}
                  className="w-16 h-16 rounded-full object-cover border border-outline-variant"
                  src={iv.interviewee_image}
                />
              ) : null}
              <div>
                <h4 className="font-body-md text-body-md font-semibold text-on-surface leading-tight mb-1">
                  <a className="hover:text-[#D4AF37] hover:underline transition-colors" href="#">
                    {iv.interview_title}
                  </a>
                </h4>
                <span className="font-label-caps text-label-caps text-on-surface-variant">{iv.interviewee_name}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-on-surface-variant">failed to fetch interviews</p>
        )}
      </div>
    </section>
  );
}
