import React from "react";
import { CheckSquare, Calculator, Code, FileText, ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { resourcesPageData } from "../data/pagesData";

export default function ResourcesPage() {
  const { vaspDirectory, tools } = resourcesPageData;

  const getIcon = (iconName) => {
    switch (iconName) {
      case "CheckSquare": return <CheckSquare className="text-[#D4AF37]" size={24} />;
      case "Calculator": return <Calculator className="text-[#D4AF37]" size={24} />;
      case "Code": return <Code className="text-[#D4AF37]" size={24} />;
      case "FileText": return <FileText className="text-[#D4AF37]" size={24} />;
      default: return <FileText className="text-[#D4AF37]" size={24} />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <Reveal as="div" className="border-b border-outline-variant pb-4 space-y-2">
        <span className="font-label-caps text-xs text-[#D4AF37] font-bold tracking-widest uppercase block">
          DEVELOPER & INSTITUTIONAL RESOURCES
        </span>
        <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0C133D]">
          Resources, Directory & Toolkits
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          Access verified VASP registry databases, regulatory compliance checklists, tax calculators, and open API SDKs.
        </p>
      </Reveal>

      {/* Compliance Tools & Interactive Portals */}
      <div className="space-y-4">
        <h2 className="font-headline-sm text-xl font-bold text-[#0C133D] border-b border-outline-variant pb-2">
          Compliance & Developer Toolkits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((t, i) => (
            <Reveal
              key={t.title}
              as="div"
              delay={i * 80}
              className="hover-lift group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex gap-4 cursor-pointer shadow-sm hover:border-[#D4AF37]"
            >
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant shrink-0">
                {getIcon(t.icon)}
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-[#0C133D] group-hover:text-[#D4AF37] transition-colors mb-1">
                    {t.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {t.desc}
                  </p>
                </div>
                <a href="#" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C133D] text-[#F7F0EB] font-extrabold text-xs hover:bg-[#D4AF37] hover:text-[#0C133D] transition-all shadow-sm w-fit mt-3">
                  Launch Tool <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* VASP & License Directory Table */}
      <Reveal as="section" className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden space-y-4 p-6 shadow-sm">
        <div className="border-b border-outline-variant pb-3">
          <h2 className="font-headline-sm text-xl font-bold text-[#0C133D]">
            Licensed VASP & Sandbox Entity Directory
          </h2>
          <p className="text-xs text-on-surface-variant">Public repository of virtual asset service providers operating within regulatory sandboxes.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Entity Name</th>
                <th className="py-3 px-4">License / Cohort Status</th>
                <th className="py-3 px-4">Operation Type</th>
                <th className="py-3 px-4">Registry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-data-tabular">
              {vaspDirectory.map((e) => (
                <tr key={e.name} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0C133D]">{e.name}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">{e.license}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">{e.type}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 uppercase shadow-sm">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>

  );
}
