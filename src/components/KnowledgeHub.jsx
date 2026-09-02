import React, { useState, useEffect } from "react";
import Reveal from "./Reveal";
import { getKnowlegeHubs } from "../services/knowlege-hub.service";
import { BookOpen, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function KnowledgeHub({ onNavigate }) {
  const [hubItems, setHubItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const { isUrdu, t } = useLanguage();

  useEffect(() => {
    let active = true;
    getKnowlegeHubs()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data]
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.publish_date || 0);
              const dateB = new Date(b.createdAt || b.publish_date || 0);
              return dateB - dateA;
            })
            .slice(0, 3);

          const mapped = sorted.map((item) => ({
            id: item.id,
            eyebrow: Array.isArray(item.category) && item.category.length > 0 ? item.category[0].toUpperCase() : "EXPLAINER",
            title: item.question,
            desc: item.answer,
          }));
          setHubItems(mapped);
          setStatusMessage("");
        } else {
          setHubItems([]);
          setStatusMessage("No knowledge hub explainers available.");
        }
      })
      .catch((err) => {
        console.error("Failed to load Knowledge Hub entries", err);
        if (!active) return;
        setHubItems([]);
        setStatusMessage("Failed to load knowledge hub.");
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOpenHub = (e) => {
    e?.preventDefault?.();
    if (onNavigate) {
      onNavigate("Knowledge Hub");
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between section-header-border pb-2 mb-4">
        <Reveal as="h2" className="text-xl sm:text-2xl font-extrabold text-[#0C133D] flex items-center gap-2 m-0 border-none pb-0">
          <BookOpen size={20} className="text-[#D4AF37]" />
          {t("home.knowledgeHub", "Knowledge Hub")}
        </Reveal>
        <button
          type="button"
          onClick={handleOpenHub}
          className="text-xs font-bold text-[#0C133D] hover:text-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer"
        >
          {t("home.viewAllGuides", "View All Guides →")}
        </button>
      </div>

      {statusMessage ? (
        <p className="text-sm text-on-surface-variant py-4">{statusMessage}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {hubItems.map((item, i) => (
            <Reveal key={item.id || item.title + i} delay={i * 70} as="div">
              <div
                role="button"
                tabIndex={0}
                onClick={handleOpenHub}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpenHub(e); }}
                className="group block hover-lift border border-outline-variant rounded-xl p-4 bg-surface-container-lowest cursor-pointer shadow-xs hover:border-[#D4AF37] transition-all"
              >
                <span className="font-label-caps text-[10px] font-extrabold text-[#D4AF37] block mb-1 uppercase tracking-wider">
                  {item.eyebrow}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-on-surface group-hover:text-[#D4AF37] transition-colors mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant font-normal line-clamp-3 leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-2.5 mt-2.5 border-t border-outline-variant/30 flex items-center justify-between text-[11px] font-semibold text-[#0C133D] group-hover:text-[#D4AF37]">
                  <span>{isUrdu ? "تعلیمی گائیڈ" : "Educational Explainer"}</span>
                  <span className="flex items-center gap-1">{t("home.readGuide", "Read Guide →")}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
