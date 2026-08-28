import React, { useState, useEffect } from "react";
import { Menu, LogOut } from "lucide-react";
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
import ReitAdmin from "./ReitAdmin";
import PublishedNewsAdmin from "./PublishedNewsAdmin";
import ManageAdminsAdmin from "./ManageAdminsAdmin";
import AdminLogin from "./AdminLogin";
import { deleteDraft } from "../../services/draft.service";
import { getDrafts } from "../../services/draft.service";
import {
  archivePublishedNews,
  getPublishedNews,
  putPublishedNews,
} from "../../services/published-news.service";
import { isAuthenticated, logout, getCurrentUser } from "../../services/auth.service";

const getInitialPage = () => {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (hash) return hash;
    const stored = localStorage.getItem("token_times_admin_active_page");
    if (stored) return stored;
  }
  return "queue";
};

/**
 * Admin Shell - Main admin panel container
 * All data is loaded from backend APIs
 */
export default function AdminShell() {
  const [isAuth, setIsAuth] = useState(isAuthenticated);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [page, setPageState] = useState(getInitialPage);

  const handleLoginSuccess = (user) => {
    setIsAuth(true);
    setCurrentUser(user || getCurrentUser());
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setCurrentUser(null);
  };

  const setPage = (newPage) => {
    setPageState(newPage);
    try {
      localStorage.setItem("token_times_admin_active_page", newPage);
      if (typeof window !== "undefined") {
        window.location.hash = newPage;
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash) {
        setPageState(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  const [queue, setQueue] = useState([]);
  const [published, setPublished] = useState([]);
  const [archived, setArchived] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isAuth) return;

    // Load published news
    let cancelled = false;

    async function loadDrafts() {
      try {
        const json = await getDrafts();
        if (cancelled) return;

        // Server returns enriched drafts with `id`, `title`, `summary`, `source`, `category`, `fetchedAt`, `content`
        const mapped = (json || []).map((d) => {
          const id = d.id || '';
          return {
            id,
            title: d.headlines[0] || 'Untitled Draft',
            summary: d.summary || '',
            source: d.source || 'AI Feed',
            category: d.category || [],
            fetchedAt: d.fetchedAt || d.createdAt || new Date().toISOString(),
            content: d.content || d.article || '',
            article: d.article || d.content || '',
            tags: d.tags || [],
            headlines: d.headlines || [],
          };
        });

        setQueue(mapped);
      } catch (err) {
        console.warn('Could not load drafts from backend:', err.message);
        setQueue([]);
      }
    }

    async function loadPublished() {
      try {
        const data = await getPublishedNews();
        if (cancelled) return;
        const filtered = data.filter((item) => item.status === "published");
        setPublished(filtered);
      } catch (err) {
        console.error('Could not load published news', err);
      }
    }

    async function loadArchived() {
      try {
        const json = await getPublishedNews();
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
  }, [isAuth]);

  const handleEditDraft = (id) => {
    const draft = queue.find(d => d.id === id);
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
        await deleteDraft(id);
        setQueue((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error('Reject failed', err);
      }
    })();
  };

  const handleArchive = async (row) => {
    try {
      await archivePublishedNews(row.id);

      setPublished((prev) => prev.filter((a) => a.id !== row.id));

      // Reload archived items
      const publishedNews = await getPublishedNews();
      const filtered = publishedNews.filter(item => item.status === 'archived');
      setArchived(filtered);
    } catch (err) {
      console.error('Archive failed', err);
    }
  };

  const handleRestore = async (row) => {
    try {
      await putPublishedNews(row.id, { status: 'published' });

      setArchived((prev) => prev.filter((a) => a.id !== row.id));

      // Reload published items
      const publishedNews = await getPublishedNews();
      const filtered = publishedNews.filter(item => item.status === 'published');
      setPublished(filtered);
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  const handlePublishComplete = async () => {
    // Reload published news and queue after publishing
    try {
      // Reload published news
      const publishedNews = await getPublishedNews();
      const filtered = publishedNews.filter(item => item.status === 'published');
      setPublished(filtered);

      // Reload drafts/queue
      const drafts = await getDrafts();
      const mapped = drafts.map((d) => ({
        id: d.id,
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

  if (!isAuth) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col lg:flex-row relative isolate overflow-x-hidden">
      <AdminSideNav
        active={page}
        onNavigate={setPage}
        queueCount={queue.length}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <header className="sticky top-0 z-20 lg:hidden w-full border-b border-outline-variant bg-surface-bright/98 backdrop-blur px-margin-mobile py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Admin Panel</p>
            <h2 className="font-headline-md text-headline-md text-primary">Token Times</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded border border-error/30 bg-error-container/20 px-2.5 py-2 font-label-caps text-label-caps text-error transition-colors hover:bg-error hover:text-white"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
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

        {page === "reit" && <ReitAdmin />}

        {page === "regulations" && <RegulationsAdmin />}

        {page === "research" && <ResearchAdmin />}

        {page === "magazines" && <MagazinesAdmin />}

        {page === "knowledge-hub" && <KnowledgeHubAdmin />}

        {page === "interviews" && <InterviewsAdmin />}

        {page === "events" && <EventsAdmin />}

        {page === "manage-admins" && <ManageAdminsAdmin />}

        {page === "archived" && <Archived articles={archived} onRestore={handleRestore} />}

        {page === "analytics" && (
          <Analytics published={published} queue={queue} archived={archived} />
        )}
      </main>
    </div>
  );
}
