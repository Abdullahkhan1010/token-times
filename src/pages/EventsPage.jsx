import React from "react";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import Reveal from "../components/Reveal";
import { eventsPageData } from "../data/pagesData";

export default function EventsPage() {
  const { flagshipEvent, upcoming } = eventsPageData;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 space-y-2">
        <span className="font-label-caps text-xs text-accent font-bold tracking-widest uppercase block">
          GLOBAL & REGIONAL POLICY SUMMITS
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface">
          Events & Conferences
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          Connect with central bank leaders, regulatory architects, founders, and investors at premier policy summits and technical hackathons.
        </p>
      </Reveal>

      {/* Flagship Event Feature Card */}
      <Reveal
        as="section"
        className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm border-l-8 border-l-accent"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
          <span className="px-3 py-1 bg-accent text-on-accent text-xs font-bold rounded-full uppercase tracking-wider">
            FLAGSHIP ANNUAL SUMMIT
          </span>
          <span className="text-xs font-data-tabular text-accent font-bold flex items-center gap-1">
            <Ticket size={14} /> Passes Selling Fast
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
            {flagshipEvent.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-data-tabular text-on-surface-variant">
            <span className="flex items-center gap-1.5 font-semibold text-accent">
              <Calendar size={16} /> {flagshipEvent.date}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-on-surface">
              <MapPin size={16} /> {flagshipEvent.location}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {flagshipEvent.desc}
          </p>
        </div>

        {/* Featured Speakers Roster */}
        <div className="space-y-2">
          <span className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider font-bold block">Keynote Roster:</span>
          <div className="flex flex-wrap gap-2">
            {flagshipEvent.speakers.map((sp) => (
              <span key={sp} className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Users size={12} className="text-accent" /> {sp}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-accent text-on-accent font-bold text-xs rounded-xl hover:bg-accent-dark transition-colors shadow">
            Register for Summit Pass
          </button>
          <button className="px-6 py-3 border border-outline-variant text-on-surface font-bold text-xs rounded-xl hover:border-accent hover:text-accent transition-colors">
            View Summit Agenda
          </button>
        </div>
      </Reveal>

      {/* Upcoming Webinars & Hackathons List */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-primary border-b border-outline-variant pb-2">
          Upcoming Roundtables & Virtual Workshops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcoming.map((ev, i) => (
            <Reveal
              key={ev.title}
              as="div"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between cursor-pointer space-y-4"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-accent/10 text-accent font-bold text-[10px] rounded-full uppercase tracking-wide">
                  {ev.format}
                </span>
                <h3 className="font-headline-md text-base font-bold text-on-surface group-hover:text-accent transition-colors leading-snug">
                  {ev.title}
                </h3>
                <span className="text-xs font-data-tabular text-on-surface-variant block font-semibold">
                  Date: {ev.date}
                </span>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-data-tabular">{ev.status}</span>
                <span className="text-accent font-bold group-hover:translate-x-1 transition-transform">Register →</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
