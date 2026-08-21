import React, { useState, useEffect } from "react";
import Reveal from "./Reveal";
import { getMagzines } from "../services/magzine.service";
import { ToHref, ToImageUrl } from "../services/file.service";

export default function MagazineIssue() {
  const [mag, setMag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getMagzines();
        if (!active) return;

        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];

          // Render text INSTANTLY
          setMag({
            cover: typeof latest.cover_img === "string" && (latest.cover_img.startsWith("http://") || latest.cover_img.startsWith("https://")) ? latest.cover_img : "",
            issue: latest.issue_name || "Latest Issue",
            title: latest.title || "Token Times Magazine",
            desc: latest.description || "New magazine content will appear here soon.",
            file: typeof latest.file === "string" && (latest.file.startsWith("http://") || latest.file.startsWith("https://")) ? latest.file : "",
          });
          setLoading(false);

          // Resolve cover and file in background
          const [link, imgLink] = await Promise.all([
            latest.file ? ToHref(latest.file, "magazine.pdf").catch(() => "") : Promise.resolve(""),
            latest.cover_img ? ToImageUrl(latest.cover_img).catch(() => "") : Promise.resolve(""),
          ]);

          if (active) {
            setMag({
              cover: imgLink || latest.cover_img || "",
              issue: latest.issue_name || "Latest Issue",
              title: latest.title || "Token Times Magazine",
              desc: latest.description || "New magazine content will appear here soon.",
              file: link || latest.file || "",
            });
          }
        } else {
          setMag(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load magazine issue", err);
        if (active) setMag(null);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const safeMag = mag || {};
  const hasContent = Boolean(safeMag.title || safeMag.desc || safeMag.cover || safeMag.file);

  return (
    <Reveal as="section" className="mb-8 bg-surface-container-lowest border border-outline-variant p-8 md:p-12">
      {loading ? (
        <div className="text-center text-sm text-on-surface-variant">Loading magazine issue...</div>
      ) : hasContent ? (
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/3 flex justify-center">
            <div
              className="w-48 md:w-64 border border-outline-variant relative bg-surface-variant hover-lift"
              style={{ aspectRatio: "3/4", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
            >
              <img
                src={safeMag.cover || ""}
                alt="Magazine Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-0 w-full text-center" style={{ mixBlendMode: "difference" }}>
                <h4 className="font-display-lg text-display-lg" style={{ color: "#fff", letterSpacing: "-0.03em" }}>
                  TOKEN TIMES
                </h4>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-label-caps text-label-caps text-[#D4AF37] mb-2">
              {safeMag.issue || "Latest Issue"}
            </span>
            <h2 className="font-display-lg text-display-lg text-[#0C133D] mb-4">
              {safeMag.title || "Token Times Magazine"}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 max-w-2xl">
              {safeMag.desc || "New magazine content will appear here soon."}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {safeMag.file ? (
                <a
                  href={safeMag.file}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/60 px-6 py-3 font-label-caps text-xs font-extrabold hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-sm rounded-lg"
                >
                  Read Online →
                </a>
              ) : (
                <button className="bg-[#0C133D] text-[#F7F0EB] border border-[#D4AF37]/60 px-6 py-3 font-label-caps text-xs font-extrabold hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-sm rounded-lg">
                  Read Online →
                </button>
              )}
              <button className="border-2 border-[#0C133D] bg-transparent text-[#0C133D] px-6 py-3 font-label-caps text-xs font-bold hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#0C133D] transition-all rounded-lg">
                Order Print Edition
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-6 text-center text-sm text-on-surface-variant">
          No magazine issue available yet.
        </div>
      )}
    </Reveal>
  );
}
