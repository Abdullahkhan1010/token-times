import { useEffect } from "react";
import { PATH_ROUTE_MAP, ROUTE_PATH_MAP } from "../data/seoData";

/**
 * Hook to synchronize active page state with browser URL history (pushState & popstate)
 */
export function useRouteSync(activePage, setActivePage) {
  // Sync state on back/forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const matchedPage = PATH_ROUTE_MAP[currentPath] || "Home";
      setActivePage(matchedPage);
    };

    // On initial mount, set page based on current URL path
    const initialPath = window.location.pathname;
    if (initialPath && PATH_ROUTE_MAP[initialPath]) {
      setActivePage(PATH_ROUTE_MAP[initialPath]);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setActivePage]);

  // Sync browser URL whenever activePage state changes
  const changePage = (newPage) => {
    setActivePage(newPage);
    const targetPath = ROUTE_PATH_MAP[newPage] || "/";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: newPage }, "", targetPath);
    }
    // Scroll smoothly to top on page switch
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return changePage;
}
