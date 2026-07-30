import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";
import { eventsPageData } from "../data/pagesData";
import { getEvents } from "../services/event.service";

export default function EventsPage({ onNavigate }) {
  const { flagshipEvent: staticFlagship, upcoming: staticUpcoming } = eventsPageData;

  const [flagshipEvent, setFlagshipEvent] = useState(staticFlagship);
  const [upcoming, setUpcoming] = useState(staticUpcoming);

  useEffect(() => {
    let active = true;
    getEvents()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          setFlagshipEvent({
            title: first.event_title || staticFlagship.title,
            date: first.event_date || staticFlagship.date,
            location: first.event_venue || staticFlagship.location,
            desc: first.event_description || staticFlagship.desc,
            speakers: Array.isArray(first.event_guests) && first.event_guests.length > 0 ? first.event_guests : staticFlagship.speakers,
            agenda: first.event_agenda,
          });

          if (data.length > 1) {
            const mappedUpcoming = data.slice(1).map((ev) => ({
              id: ev.id,
              format: "Conference",
              title: ev.event_title,
              date: ev.event_date || "2026",
              status: "Open Registration",
            }));
            setUpcoming(mappedUpcoming);
          }
        }
      })
      .catch((err) => console.error("Failed to load events", err));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <SEOHead pageKey="Events" />

      <Breadcrumbs currentPage="Events" onNavigate={onNavigate} />

      {/* Page Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-bold tracking-widest uppercase block">
          GLOBAL & REGIONAL POLICY SUMMITS
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C133D]">
          Events & Conferences
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          Connect with central bank leaders, regulatory architects, founders, and investors at premier policy summits and technical hackathons.
        </p>
      </Reveal>

      {/* Flagship Event Feature Card */}
      <Reveal
        as="section"
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm border-l-8 border-l-[#D4AF37]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
          <span className="px-3 py-1 bg-[#D4AF37] text-[#0C133D] text-xs font-extrabold rounded-full uppercase tracking-wider shadow">
            FLAGSHIP ANNUAL SUMMIT
          </span>
          <span className="text-xs font-data-tabular text-[#D4AF37] font-bold flex items-center gap-1">
            <Ticket size={14} /> Passes Selling Fast
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0C133D] leading-tight">
            {flagshipEvent.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-data-tabular text-on-surface-variant">
            <span className="flex items-center gap-1.5 font-semibold text-[#D4AF37]">
              <Calendar size={16} /> {flagshipEvent.date}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-[#0C133D]">
              <MapPin size={16} /> {flagshipEvent.location}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {flagshipEvent.desc}
          </p>
        </div>

        {/* Featured Speakers Roster */}
        {flagshipEvent.speakers && flagshipEvent.speakers.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider font-bold block">Keynote Roster:</span>
            <div className="flex flex-wrap gap-2">
              {flagshipEvent.speakers.map((sp) => (
                <span key={sp} className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-semibold text-[#0C133D] flex items-center gap-1.5">
                  <Users size={12} className="text-[#D4AF37]" /> {sp}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/50 font-extrabold text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-sm">
            Register for Summit Pass
          </button>
          {flagshipEvent.agenda ? (
            <a
              href={flagshipEvent.agenda}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border-2 border-[#0C133D] bg-transparent text-[#0C133D] font-bold text-xs rounded-xl hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0C133D] transition-all"
            >
              View Summit Agenda
            </a>
          ) : (
            <button className="px-6 py-3 border-2 border-[#0C133D] bg-transparent text-[#0C133D] font-bold text-xs rounded-xl hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0C133D] transition-all">
              View Summit Agenda
            </button>
          )}
        </div>
      </Reveal>

      {/* Upcoming Webinars & Hackathons List */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-[#0C133D] border-b border-outline-variant pb-2">
          Upcoming Roundtables & Virtual Workshops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcoming.map((ev, i) => (
            <Reveal
              key={ev.id || ev.title + i}
              as="div"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4 shadow-sm hover:border-[#D4AF37]"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[10px] rounded-full uppercase tracking-wide">
                  {ev.format}
                </span>
                <h3 className="font-headline-md text-base font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {ev.title}
                </h3>
                <span className="text-xs font-data-tabular text-on-surface-variant block font-semibold">
                  Date: {ev.date}
                </span>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-data-tabular">{ev.status}</span>
                <button className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#0C133D] text-[#F7F0EB] font-extrabold text-xs group-hover:bg-[#D4AF37] group-hover:text-[#0C133D] transition-all shadow-sm">
                  Register →
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
