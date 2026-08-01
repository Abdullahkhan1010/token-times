import React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function PageHeader({ badge = "Editorial Desk", title, subtitle, message, onDismissMessage, children }) {
  return (
    <div className="space-y-4 mb-8 border-b border-outline-variant pb-6">
      {/* Executive Top Banner Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm shadow-md animate-fade-in ${
            message.type === "success"
              ? "bg-[#0C133D] text-[#D4AF37] border-[#D4AF37]"
              : "bg-rose-950 text-rose-100 border-rose-500"
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? (
              <CheckCircle2 size={22} className="text-[#D4AF37] shrink-0" />
            ) : (
              <AlertCircle size={22} className="text-rose-400 shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-0.5 text-white">
                {message.type === "success" ? "Publication Successful" : "System Notification"}
              </h4>
              <p className="text-xs font-medium opacity-95">{message.text}</p>
            </div>
          </div>
          {onDismissMessage && (
            <button
              onClick={onDismissMessage}
              className="text-[#D4AF37]/80 hover:text-white transition-colors p-1"
              aria-label="Dismiss message"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C133D] text-[#D4AF37] border border-[#D4AF37]/40 font-extrabold text-[10px] uppercase tracking-wider inline-block mb-1">
              {badge}
            </span>
          )}
          <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#0C133D]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-3 flex-wrap">{children}</div>}
      </header>
    </div>
  );
}
