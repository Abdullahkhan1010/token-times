import React from "react";
import { Mic } from "lucide-react";
import { interviews } from "../data/content";

export default function Interviews() {
  return (
    <section>
      <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-6 flex items-center gap-2">
        <Mic size={20} className="text-[#D4AF37]" /> Interviews
      </h3>
      <div className="space-y-4">
        {interviews.map((iv) => (
          <article key={iv.caption} className="flex gap-4 items-center">
            <img
              alt="Interviewee"
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


