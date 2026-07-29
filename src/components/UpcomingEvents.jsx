import React from "react";
import { Calendar } from "lucide-react";
import { upcomingEvents } from "../data/content";

export default function UpcomingEvents() {
  return (
    <section>
      <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-6 flex items-center gap-2">
        <Calendar size={20} className="text-[#D4AF37]" /> Upcoming Events
      </h3>
      <div className="space-y-4">
        {upcomingEvents.map((ev) => (
          <div key={ev.title} className="hover-lift flex gap-4 bg-surface-container-low p-3 border border-outline-variant">
            <div
              className={`flex flex-col items-center justify-center p-2 ${
                ev.filled ? "bg-[#D4AF37] text-[#0C133D]" : "border border-[#D4AF37] text-[#D4AF37]"
              }`}
              style={{ minWidth: 60 }}
            >
              <span className="font-label-caps text-xs">{ev.month}</span>
              <span className="font-headline-md text-headline-md">{ev.day}</span>
            </div>
            <div>
              <h4 className="font-body-md text-body-md font-semibold text-on-surface mb-1">{ev.title}</h4>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant text-sm block">{ev.meta}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


