import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import AdminSideNav from "./AdminSideNav";
import AdminHome from "./AdminHome";
import AIQueue from "./AIQueue";
import Published from "./Published";
import Archived from "./Archived";
import Analytics from "./Analytics";
import RegulationsAdmin from "./RegulationsAdmin";
import ResearchAdmin from "./ResearchAdmin";
import MagazinesAdmin from "./MagazinesAdmin";
import KnowledgeHubAdmin from "./KnowledgeHubAdmin";
import InterviewsAdmin from "./InterviewsAdmin";
import EventsAdmin from "./EventsAdmin";
import { requestJson } from "../../services/api";
import {
  pendingQueue as initialQueue,
  publishedArticles as initialPublished,
  archivedArticles as initialArchived,
  analyticsSummary,
  articlesPerDay,
  categoryBreakdown,
} from "../data/adminContent";

/**
 * Drop <AdminShell /> in behind your auth-gated /admin route.
 *
 * State here is local/mock so the panel is fully clickable out of the box.
 * Each handler below is where a real backend call belongs — the comments
 * mark the spot. Swap the `useState` initial values for data fetched from
 * your API once it exists.
 */
export default function AdminShell() {
  const [page, setPage] = useState("queue");
  const [queue, setQueue] = useState([]);
  const [published, setPublished] = useState(initialPublished);
  const [archived, setArchived] = useState(initialArchived);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Load drafts from backend and use them as the review queue
    let cancelled = false;

    async function loadDrafts() {
      try {
        const json = await requestJson('/news/drafts');
        if (cancelled) return;

        // Server returns enriched drafts with `id`, `title`, `summary`, `source`, `category`, `fetchedAt`, `content`
        const mapped = (json || []).map((d) => ({
          id: d.id,
          title: d.title,
          summary: d.summary,
          source: d.source,
          category: d.category,
          fetchedAt: d.fetchedAt,
          content: d.content,
        }));

        setQueue(mapped);
      } catch (err) {
        console.error('Could not load drafts', err);
      }
    }

    loadDrafts();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = (id) => {
    // Call backend approve endpoint
    (async () => {
      try {
        const body = await requestJson('/news/approve', {
          method: 'POST',
          body: JSON.stringify({ id }),
        });

        const article = body.article || {};

        setPublished((prev) => [
          { id: article._id || article.id || id, title: article.title, category: article.category || 'Uncategorized', author: 'T.T. Editorial Board', publishedAt: article.publish_date ?? new Date().toISOString(), views: article.views ?? 0 },
          ...prev,
        ]);

        setQueue((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error('Approve failed', err);
      }
    })();
  };

  const handleReject = (id) => {
    (async () => {
      try {
        await requestJson(`/news/drafts/${id}`, { method: 'DELETE' });
        setQueue((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error('Reject failed', err);
      }
    })();
  };

  const handleEditSave = (updated) => {
    (async () => {
      try {
        const payload = {
          title: updated.title,
          summary: updated.summary,
          category: updated.category,
          source: updated.source,
          content: updated.content,
        };

        const updatedDraft = await requestJson(`/news/drafts/${updated.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });

        setQueue((prev) => prev.map((a) => (a.id === updated.id ? { ...a, title: updatedDraft.original_title ?? updated.title, summary: updatedDraft.summary ?? updated.summary, source: updated.source ?? a.source, category: updated.category ?? a.category, content: updatedDraft.article ?? updated.content } : a)));
      } catch (err) {
        console.error('Save failed', err);
      }
    })();
  };

  const handleArchive = (row) => {
    // TODO: POST /api/articles/:id/archive
    setPublished((prev) => prev.filter((a) => a.id !== row.id));
    setArchived((prev) => [{ ...row, archivedAt: new Date().toISOString(), reason: "Manually archived" }, ...prev]);
  };

  const handleRestore = (row) => {
    // TODO: POST /api/articles/:id/restore
    setArchived((prev) => prev.filter((a) => a.id !== row.id));
    setPublished((prev) => [{ ...row, publishedAt: new Date().toISOString(), views: row.views ?? 0 }, ...prev]);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col lg:flex-row relative isolate overflow-x-hidden">
      <AdminSideNav
        active={page}
        onNavigate={setPage}
        queueCount={queue.length}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <header className="sticky top-0 z-20 lg:hidden w-full border-b border-outline-variant bg-surface-bright/98 backdrop-blur px-margin-mobile py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Admin Panel</p>
            <h2 className="font-headline-md text-headline-md text-primary">Token Times</h2>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-container-high"
            aria-label="Open admin navigation"
          >
            <Menu size={18} />
            Menu
          </button>
        </div>
      </header>

      <main className="flex-1 w-full ml-0 lg:ml-64 p-margin-mobile lg:p-margin-desktop bg-surface-bright min-h-screen">
        {page === "home" && (
          <AdminHome
            queueCount={queue.length}
            publishedCount={published.length}
            archivedCount={archived.length}
            onNavigate={setPage}
          />
        )}

        {page === "queue" && (
          <AIQueue queue={queue} onApprove={handleApprove} onReject={handleReject} onEditSave={handleEditSave} />
        )}

        {page === "published" && <Published articles={published} onArchive={handleArchive} />}

        {page === "regulations" && <RegulationsAdmin />}

        {page === "research" && <ResearchAdmin />}

        {page === "magazines" && <MagazinesAdmin />}

        {page === "knowledge-hub" && <KnowledgeHubAdmin />}

        {page === "interviews" && <InterviewsAdmin />}

        {page === "events" && <EventsAdmin />}

        {page === "archived" && <Archived articles={archived} onRestore={handleRestore} />}

        {page === "analytics" && (
          <Analytics summary={analyticsSummary} trend={articlesPerDay} categories={categoryBreakdown} />
        )}
      </main>
    </div>
  );
}
