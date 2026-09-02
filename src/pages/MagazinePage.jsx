import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import Breadcrumbs from "../components/Breadcrumbs";
import Reveal from "../components/Reveal";

import { getMagzines } from "../services/magzine.service";
import { ToHref, ToImageUrl } from "../services/file.service";

export default function MagazinePage({ onNavigate }) {

  const [currentIssue, setcurrentIssue] = useState({
    number: "",
    title: "",
    subtitle: "",
    coverImg: "",
    description: "",
    file: "",
  });
  const [pastIssues, setPastIssues] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getMagzines();
        if (!active) return;

        if (Array.isArray(data) && data.length > 0) {

          const latest = data[0];
          const coverImgHref = await ToImageUrl(latest.cover_img);
          const fileHref = await ToHref(latest.file, "magazine.pdf");

          if (coverImgHref) {
            const img = new Image();
            img.src = coverImgHref;
            if (img.decode) img.decode().catch(() => {});
          }

          setcurrentIssue({
            number: latest.issue_name,
            title: latest.title,
            subtitle: latest.description,
            coverImg: coverImgHref,
            description: latest.description,
            file: fileHref,
          });

          if (data.length > 1) {
            const mappedPast = data.slice(1).map((m) => ({
              issue: m.issue_name,
              title: m.title,
              theme: m.description ? m.description.slice(0, 40) + "..." : "Quarterly Edition",
              file: ToHref(m.file, `magazine-${m.issue_name}.pdf`),
            }));
            setPastIssues(mappedPast);
          }
        }
      } catch (err) {
        console.error("Failed to load magazines", err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const hasMagazine = Boolean(currentIssue.title || currentIssue.coverImg);

  return (
    <div className="space-y-12">
      <SEOHead pageKey="Magazine" />

      <Breadcrumbs currentPage="Magazine" onNavigate={onNavigate} />

      {/* Magazine Edition Header */}
      <Reveal as="div" className="text-center max-w-3xl mx-auto space-y-3">
        <span className="font-label-caps text-xs text-[#D4AF37] font-bold tracking-widest uppercase block">
          TOKEN TIMES QUARTERLY PRINT &amp; DIGITAL EDITION
        </span>
        <h1 className="font-display-lg text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0C133D] tracking-tight">
          The Magazine
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
          Deep investigative essays, long-form policy analysis, and exclusive interviews with regulatory minds across emerging digital asset markets.
        </p>
      </Reveal>

      {/* Hero Showcase: Current Magazine Cover Issue */}
      {hasMagazine ? (
        <Reveal
          as="section"
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 md:p-10"
        >
          {/* Left 5 Columns: Cover Preview */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center">
            <div className="relative group w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-outline-variant">
              {currentIssue.coverImg && (
                <img
                  alt={currentIssue.title}
                  loading="eager"
                  src={currentIssue.coverImg}
                  decoding="async"
                  onError={(e) => {
                    console.log("Image failed:", e.currentTarget.src);
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase mb-1">
                  {currentIssue.number}
                </span>
                <h3 className="font-headline-lg text-2xl font-bold leading-tight">
                  {currentIssue.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Editorial Details */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="font-label-caps text-xs text-[#D4AF37] font-bold tracking-wider uppercase">
                {currentIssue.number}
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0C133D] leading-tight">
                {currentIssue.title}
              </h2>
              <h3 className="text-base sm:text-lg font-semibold text-on-surface-variant">
                {currentIssue.subtitle}
              </h3>
            </div>

            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              {currentIssue.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {currentIssue.file ? (
                <a
                  href={currentIssue.file}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/50 font-extrabold text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-md"
                >
                  Read Digital Edition (PDF)
                </a>
              ) : (
                <button className="px-6 py-3 bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/50 font-extrabold text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-md">
                  Read Digital Edition (PDF)
                </button>
              )}
              <button className="px-6 py-3 border-2 border-[#0C133D] bg-transparent text-[#0C133D] font-bold text-xs rounded-xl hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0C133D] transition-all">
                Subscribe to Print
              </button>
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center text-sm text-on-surface-variant">
          No magazine issue published yet. New quarterly editions will appear here soon.
        </div>
      )}

      {/* Featured Long Reads & Essays */}
      {/* <div className="space-y-6">
        <Reveal as="div" className="border-b border-outline-variant pb-3 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">IN THIS ISSUE</span>
            <h3 className="font-headline-lg text-2xl font-bold text-[#0C133D]">Featured Essays & Special Reports</h3>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <Reveal
              key={item.title + i}
              as="article"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer shadow-sm hover:border-[#D4AF37]"
            >
              <div>
                <div className="w-full h-48 overflow-hidden bg-surface-variant relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="img-fade img-scale w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-headline-md text-lg font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant font-data-tabular">
                <span>By {item.author}</span>
                <span className="text-[#D4AF37] font-semibold">{item.readTime}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div> */}

      {/* Past Editions Archive */}
      {/* <Reveal as="section" className="bg-surface-container-low border border-outline-variant rounded-xl p-6 space-y-4">
        <h3 className="font-headline-sm text-lg font-bold text-[#0C133D]">Archived Quarterly Editions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pastIssues.map((issue, i) => (
            <div key={issue.issue + i} className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant hover:border-[#D4AF37] transition-colors cursor-pointer space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">{issue.issue}</span>
              <h4 className="text-sm font-bold text-[#0C133D]">{issue.title}</h4>
              <span className="text-xs text-on-surface-variant font-data-tabular block">Theme: {issue.theme}</span>
            </div>
          ))}
        </div>
      </Reveal> */}
    </div>
  );
}
