import React from "react";

/**
 * Ultra-subtle, elegant skeleton for the Hero section.
 * Matches the exact 3-column desktop & mobile layout to prevent layout shift
 * and make the brief image preloading period feel instantaneous and natural.
 */
export default function HeroSkeleton() {
  return (
    <section aria-hidden="true" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch animate-pulse select-none">
      {/* Left Column: Top Story + 3 Sub-Stories */}
      <div className="lg:col-span-3 order-3 lg:order-1 flex flex-col gap-3 h-full justify-between">
        {/* Top Story Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5">
          <div className="h-6 w-28 bg-[#B22222]/20 rounded-full" />
        </div>

        {/* Top Story Card Placeholder */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 p-4 sm:p-5 rounded-xl flex flex-col justify-between flex-grow min-h-[220px]">
          <div className="space-y-3">
            <div className="h-5 w-20 bg-surface-container-high rounded" />
            <div className="h-6 w-11/12 bg-surface-container-high rounded" />
            <div className="h-6 w-3/4 bg-surface-container-high rounded" />
            <div className="space-y-1.5 pt-2">
              <div className="h-3 w-full bg-surface-container-high/60 rounded" />
              <div className="h-3 w-5/6 bg-surface-container-high/60 rounded" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40 mt-4">
            <div className="h-3 w-28 bg-surface-container-high/60 rounded" />
            <div className="h-3 w-16 bg-[#B22222]/30 rounded" />
          </div>
        </div>

        {/* Sub Stories Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1 pt-1">
          <div className="h-5 w-24 bg-surface-container-high rounded-full" />
        </div>

        {/* 3 Compact Sub Stories */}
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest border border-outline-variant/60 p-2.5 rounded-lg flex flex-col justify-between min-h-[64px]"
            >
              <div className="h-2.5 w-14 bg-surface-container-high mb-1.5 rounded" />
              <div className="h-3.5 w-full bg-surface-container-high rounded" />
              <div className="h-2 w-16 bg-surface-container-high/50 mt-2 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Center Column: Main Lead Story Media & Text */}
      <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col h-full max-w-full">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden flex flex-col h-full">
          {/* Main Media Placeholder */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[440px] bg-surface-container-high/70 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest/60" />
            <div className="absolute top-3 left-3 h-6 w-32 bg-[#D4AF37]/30 rounded-full" />
          </div>

          {/* Text Content */}
          <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-3">
            <div className="h-7 w-11/12 bg-surface-container-high rounded" />
            <div className="h-7 w-4/5 bg-surface-container-high rounded" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3.5 w-full bg-surface-container-high/60 rounded" />
              <div className="h-3.5 w-5/6 bg-surface-container-high/60 rounded" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40 mt-auto">
              <div className="h-3.5 w-36 bg-surface-container-high/60 rounded" />
              <div className="h-7 w-28 bg-[#0C133D]/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: 2 Featured Spotlight Cards */}
      <div className="lg:col-span-3 order-2 lg:order-3 flex flex-col gap-2.5 h-full">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5">
          <div className="h-6 w-32 bg-[#0C133D]/20 rounded-full" />
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 flex-grow">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest border border-outline-variant/60 flex-1 flex flex-col justify-between rounded-xl overflow-hidden"
            >
              {/* Picture Placeholder */}
              <div className="w-full h-40 sm:h-44 md:h-52 bg-surface-container-high/70 relative" />
              {/* Text Placeholder */}
              <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2">
                <div className="h-4 w-full bg-surface-container-high rounded" />
                <div className="h-4 w-3/4 bg-surface-container-high rounded" />
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30 mt-auto">
                  <div className="h-3 w-16 bg-surface-container-high/60 rounded" />
                  <div className="h-5 w-14 bg-surface-container-high rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
