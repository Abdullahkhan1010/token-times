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
              _id: ev._id,
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
    <section>
      <h3 className="font-headline-md text-headline-md text-[#0C133D] mb-6 flex items-center gap-2">
        <Calendar size={20} className="text-[#D4AF37]" /> Upcoming Events
      </h3>
      {statusMessage ? (
        <p className="text-sm text-on-surface-variant">{statusMessage}</p>
      ) : (
        <div className="space-y-4">
          {events.map((ev, i) => (
            <div key={ev._id || ev.title + i} className="hover-lift flex gap-4 bg-surface-container-low p-3 border border-outline-variant">
              <div
                className={`flex flex-col items-center justify-center p-2 ${ev.filled ? "bg-[#D4AF37] text-[#0C133D]" : "border border-[#D4AF37] text-[#D4AF37]"
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
      )}
    </section>
  );
}
