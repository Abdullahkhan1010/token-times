import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { getEvents } from "../services/event.service";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let active = true;
    getEvents()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data]
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.event_date || 0);
              const dateB = new Date(b.createdAt || b.event_date || 0);
              return dateB - dateA;
            })
            .slice(0, 2);

          const mapped = sorted.map((ev) => {
            const dateObj = ev.event_date ? new Date(ev.event_date) : null;
            const month = dateObj && !isNaN(dateObj) ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase() : "2026";
            const day = dateObj && !isNaN(dateObj) ? dateObj.getDate() : "15";
            return {
              id: ev.id,
              month,
              day: String(day),
              title: ev.event_title || "Untitled Event",
              meta: `${ev.event_venue || "Islamabad"} • ${ev.event_date || "Upcoming"}`,
              filled: true,
            };
          });
          setEvents(mapped);
          setStatusMessage("");
        } else {
          setEvents([]);
          setStatusMessage("failed to fetch events");
        }
      })
      .catch((err) => {
        console.error("Failed to load events", err);
        if (!active) return;
        setEvents([]);
        setStatusMessage("failed to fetch events");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b-2 border-[#0C133D] pb-2.5 mb-5 min-h-[42px]">
        <h3 className="font-headline-md text-base font-bold text-[#0C133D] flex items-center gap-2 uppercase tracking-wider">
          <Calendar size={18} className="text-[#D4AF37]" /> Upcoming Events
        </h3>
        <span className="px-2.5 py-0.5 rounded-full bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
          CALENDAR
        </span>
      </div>

      {statusMessage ? (
        <p className="text-xs text-on-surface-variant">{statusMessage}</p>
      ) : (
        <div className="space-y-4">
          {events.map((ev, i) => (
            <div key={ev.id || ev.title + i} className="hover-lift flex gap-3 items-center bg-surface-container-lowest p-3 border border-outline-variant rounded-xl hover:border-[#D4AF37] transition-all cursor-pointer group h-[76px]">
              <div
                className={`w-11 h-11 flex flex-col items-center justify-center rounded-lg shrink-0 ${ev.filled ? "bg-[#D4AF37] text-[#0C133D]" : "border border-[#D4AF37] text-[#D4AF37]"
                  }`}
              >
                <span className="font-label-caps text-[9px] font-extrabold uppercase leading-none">{ev.month}</span>
                <span className="font-headline-md text-sm font-extrabold leading-none mt-0.5">{ev.day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-headline-md text-xs font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2 mb-0.5">{ev.title}</h4>
                <span className="font-data-tabular text-[10px] text-on-surface-variant block truncate">{ev.meta}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
