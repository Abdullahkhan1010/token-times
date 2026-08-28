import React from "react";
import { Home, Newspaper, BookOpen, Archive, BarChart3, X, Gavel, FileText, HelpCircle, Mic, Calendar, FileEdit, LogOut, ExternalLink, Shield, UserCheck, Building2, Radio } from "lucide-react";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "queue", label: "AI Queue", icon: Newspaper },
  { key: "published", label: "Published", icon: BookOpen },
  { key: "published-news", label: "Published News", icon: FileEdit },
  { key: "reit", label: "REIT Management", icon: Building2 },
  { key: "regulations", label: "Regulations", icon: Gavel },
  { key: "research", label: "Research", icon: FileText },
  { key: "magazines", label: "Magazines", icon: BookOpen },
  { key: "knowledge-hub", label: "Knowledge Hub", icon: HelpCircle },
  { key: "interviews", label: "Interviews", icon: Mic },
  { key: "events", label: "Events", icon: Calendar },
  { key: "source", label: "Source", icon: Radio },
  { key: "archived", label: "Archived", icon: Archive },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSideNav({ active, onNavigate, queueCount = 0, mobileOpen = false, onClose, onLogout, currentUser }) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close admin navigation"
          onClick={onClose}
        />
      )}

      <nav
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-outline-variant bg-surface-container-lowest py-stack-lg transition-transform duration-300 ease-out lg:translate-x-0 lg:flex ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-start justify-between gap-3 px-gutter mb-stack-lg">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">Token Times</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Financial Intelligence</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface lg:hidden"
            aria-label="Close admin navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => {
                  onNavigate?.(key);
                  onClose?.();
                }}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded font-label-caps text-label-caps transition-all text-left ${isActive
                  ? "bg-primary-container text-on-primary-container font-bold border-l-4 border-accent"
                  : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
              >
                <Icon size={20} />
                {label}
                {key === "queue" && queueCount > 0 && (
                  <span className="ml-auto font-data-tabular text-data-tabular bg-accent text-on-accent px-1.5 rounded-full text-xs">
                    {queueCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-gutter mt-auto pt-3 border-t border-outline-variant/60 flex flex-col gap-2">
          {/* Subtle Bottom Manage Admins link */}
          <button
            type="button"
            onClick={() => {
              onNavigate?.("manage-admins");
              onClose?.();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-colors text-left ${active === "manage-admins"
              ? "bg-surface-container-high text-primary font-bold border-l-2 border-accent"
              : "text-on-surface-variant/80 hover:text-primary hover:bg-surface-container-low"
              }`}
          >
            <UserCheck size={14} className="text-on-surface-variant/70 shrink-0" />
            <span className="font-medium text-[11px] tracking-wide">Manage Admins</span>
          </button>

          {currentUser && (
            <div className="flex items-center gap-2 px-1 py-0.5 text-xs text-on-surface-variant/90">
              <Shield className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate font-medium text-[11px]">{currentUser.username || currentUser.email || "Admin"}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => window.location.assign("/")}
            className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-primary font-label-caps text-label-caps py-2.5 px-3 rounded hover:bg-surface-container-highest transition-colors border border-outline-variant"
          >
            <ExternalLink size={14} />
            View Live Site
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-error-container/40 text-error hover:bg-error hover:text-white font-label-caps text-label-caps py-2 px-3 rounded transition-colors text-xs"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
