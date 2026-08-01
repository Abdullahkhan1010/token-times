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
import PublishedNewsAdmin from "./PublishedNewsAdmin";
import { requestJson } from "../../services/api";
import { getPublishedNews } from "../../services/published-news.service";
/**
 * Admin Shell - Main admin panel container
 * All data is loaded from backend APIs
 */
export default function AdminShell() {
  const [page, setPage] = useState("queue");
  const [queue, setQueue] = useState([]);
  const [published, setPublished] = useState([]);
  const [archived, setArchived] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);

  // Analytics data placeholders
  const [analyticsSummary, setAnalyticsSummary] = useState([
    { label: "Published (30d)", value: "0", delta: "-" },
    { label: "Pending Review", value: "0", delta: "-" },
    { label: "Approval Rate", value: "0%", delta: "-" },
    { label: "Avg. Time to Publish", value: "0h", delta: "-" },
  ]);
  const [articlesPerDay, setArticlesPerDay] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);



  useEffect(() => {
    // Load published news
    let cancelled = false;

    async function loadDrafts() {
      try {
        const json = await requestJson('/news/drafts');
        if (cancelled) return;

        // Server returns enriched drafts with `id`, `title`, `summary`, `source`, `category`, `fetchedAt`, `content`
        const mapped = (json || []).map((d) => ({
          id: d._id,
          title: d.title,
          summary: d.summary,
          source: d.source,
          category: d.category,
          fetchedAt: d.fetchedAt,
          content: d.content,
          article: d.article,
          tags: d.tags,
          headlines: d.headlines,
        }));

        setQueue(mapped);
      } catch (err) {
        console.error('Could not load drafts', err);
      }
    }

    async function loadPublished() {
      const data = await getPublishedNews();
      const filtered = data.filter((item) => item.status === "published");
      setPublished(filtered);
    }

    async function loadArchived() {
      try {
        const json = await requestJson('/published-news');
        if (cancelled) return;

        const filtered = (json || []).filter(item => item.status === 'archived');
        setArchived(filtered);
      } catch (err) {
        console.error('Could not load archived news', err);
      }
    }
    loadDrafts();
    loadPublished();
    loadArchived();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEditDraft = (id) => {
    const draft = queue.find(d => d.id === id || d._id === id);
    if (draft) {
      setSelectedDraft(draft);
      setPage('published-news');
    }
  };

  const handleApprove = (id) => {
    // Navigate to published news form with draft data
    handleEditDraft(id);
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

  const handleArchive = async (row) => {
    try {
      await requestJson(`/published-news/archive/${row._id || row.id}`, {
        method: 'POST',
      });

      setPublished((prev) => prev.filter((a) => (a._id || a.id) !== (row._id || row.id)));

      // Reload archived items
      const json = await requestJson('/published-news');
      const filtered = (json || []).filter(item => item.status === 'archived');
      setArchived(filtered);
    } catch (err) {
      console.error('Archive failed', err);
    }
  };

  const handleRestore = async (row) => {
    try {
      await requestJson(`/published-news/${row._id || row.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'published' }),
      });

      setArchived((prev) => prev.filter((a) => (a._id || a.id) !== (row._id || row.id)));

      // Reload published items
      const json = await requestJson('/published-news');
      const filtered = (json || []).filter(item => item.status === 'published');
      setPublished(filtered);
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  const handlePublishComplete = async () => {
    // Reload published news and queue after publishing
    try {
      // Reload published news
      const publishedJson = await requestJson('/published-news');
      const filtered = (publishedJson || []).filter(item => item.status === 'published');
      setPublished(filtered);

      // Reload drafts/queue
      const draftsJson = await requestJson('/news/drafts');
      const mapped = (draftsJson || []).map((d) => ({
        id: d.id || d._id,
        title: d.title,
        summary: d.summary,
        source: d.source,
        category: d.category,
        fetchedAt: d.fetchedAt,
        content: d.content,
      }));
      setQueue(mapped);

      setSelectedDraft(null);
      setPage('published');
    } catch (err) {
      console.error('Failed to reload after publish', err);
    }
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
          <AIQueue
            queue={queue}
            onApprove={handleApprove}
            onReject={handleReject}
            onEditSave={handleEditSave}
            onEdit={handleEditDraft}
          />
        )}

        {page === "published" && <Published articles={published} onArchive={handleArchive} />}

        {page === "published-news" && (
          <PublishedNewsAdmin
            draftData={selectedDraft}
            onPublishComplete={handlePublishComplete}
            onCancel={() => {
              setSelectedDraft(null);
              setPage('queue');
            }}
          />
        )}

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
